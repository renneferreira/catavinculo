// Serviço de dados de CNPJ com integração com BrasilAPI, Minha Receita e fallback inteligente

import { formatCNPJ, formatCPF, formatPhone, formatCEP, formatCurrency, formatDate } from '../utils/formatters';
import { getCnaeCategory } from '../utils/cnae';

// Base de demonstração pré-carregada para casos rápidos ou offline
export const QUICK_DEMO_CASES = [
  {
    label: 'Petrobras',
    cnpj: '33.000.167/0001-01',
    description: 'Petróleo Brasileiro S.A.'
  },
  {
    label: 'Magazine Luiza',
    cnpj: '47.960.950/0001-21',
    description: 'Magazine Luiza S.A.'
  },
  {
    label: 'Banco do Brasil',
    cnpj: '00.000.000/0001-91',
    description: 'Banco do Brasil S.A.'
  },
  {
    label: 'Nubank',
    cnpj: '18.236.120/0001-58',
    description: 'Nu Pagamentos S.A.'
  },
  {
    label: 'Embraer',
    cnpj: '07.689.002/0001-89',
    description: 'Embraer S.A.'
  }
];

export async function fetchCompanyData(cnpjInput) {
  const cnpjClean = String(cnpjInput).replace(/\D/g, '');
  if (cnpjClean.length !== 14) {
    throw new Error('O CNPJ deve conter exatamente 14 dígitos numéricos.');
  }

  let rawData = null;
  let source = '';

  // 1. Tentar BrasilAPI
  try {
    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjClean}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      rawData = await res.json();
      source = 'BrasilAPI / Receita Federal';
    }
  } catch (err) {
    console.warn('BrasilAPI request error:', err);
  }

  // 2. Fallback para Minha Receita caso BrasilAPI falhe
  if (!rawData) {
    try {
      const res = await fetch(`https://minhareceita.org/${cnpjClean}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        rawData = await res.json();
        source = 'Minha Receita / Receita Federal';
      }
    } catch (err) {
      console.warn('Minha Receita request error:', err);
    }
  }

  // Se nenhuma API respondeu (ex: bloqueio de CORS na rede local ou rate limit), usar fallback inteligente
  if (!rawData) {
    rawData = generateMockCompany(cnpjClean);
    source = 'Dados Simulados da Base de Demonstração';
  }

  return normalizeCompanyData(rawData, source);
}

function normalizeCompanyData(data, source) {
  const cnpj = data.cnpj ? formatCNPJ(data.cnpj) : '';
  const razaoSocial = data.razao_social || data.nome || 'Razão Social Não Informada';
  const nomeFantasia = data.nome_fantasia || data.fantasia || '';
  const situacao = data.descricao_situacao_cadastral || data.situacao_cadastral || data.situacao || 'ATIVA';
  const dataSituacao = formatDate(data.data_situacao_cadastral || data.data_situacao);
  const dataInicio = formatDate(data.data_inicio_atividade || data.abertura);
  const capitalSocial = data.capital_social || 0;
  const naturezaJuridica = data.natureza_juridica || data.codigo_natureza_juridica || 'Não informada';
  const porte = data.porte || data.descricao_porte || 'DEMAIS';

  // CNAE
  const cnaeCodigo = String(data.cnae_fiscal || data.atividade_principal?.[0]?.code || '').replace(/\D/g, '');
  const cnaeDescricao = data.cnae_fiscal_descricao || data.atividade_principal?.[0]?.text || 'Atividade não especificada';
  const cnaeCategory = getCnaeCategory(cnaeCodigo);

  // CNAEs Secundários
  const cnaesSecundarios = (data.cnaes_secundarios || data.atividades_secundarias || []).map(item => ({
    codigo: String(item.codigo || item.code || ''),
    descricao: item.descricao || item.text || ''
  }));

  // Endereço
  const endereco = {
    logradouro: [data.descricao_tipo_de_logradouro, data.logradouro].filter(Boolean).join(' ') || data.logradouro || '',
    numero: data.numero || 'S/N',
    complemento: data.complemento || '',
    bairro: data.bairro || '',
    municipio: data.municipio || '',
    uf: data.uf || '',
    cep: data.cep ? formatCEP(data.cep) : '',
    completo: `${data.logradouro || ''}, ${data.numero || 'S/N'}${data.complemento ? ' - ' + data.complemento : ''} - ${data.bairro || ''}, ${data.municipio || ''} - ${data.uf || ''}, ${data.cep ? formatCEP(data.cep) : ''}`
  };

  // Contatos
  const telefones = [];
  if (data.ddd_telefone_1) telefones.push(formatPhone(data.ddd_telefone_1));
  if (data.ddd_telefone_2) telefones.push(formatPhone(data.ddd_telefone_2));
  if (data.telefone) telefones.push(formatPhone(data.telefone));

  const emails = [];
  if (data.email) emails.push(String(data.email).toLowerCase());

  // QSA (Quadro de Sócios e Administradores)
  const qsaRaw = data.qsa || [];
  const partners = qsaRaw.map((p, idx) => {
    const nome = p.nome_socio || p.nome || `Sócio ${idx + 1}`;
    const rawCpf = p.cnpj_cpf_do_socio || p.cpf_cnpj_socio || p.cpf || '';
    const cpfFormatado = rawCpf.length === 11 ? formatCPF(rawCpf) : rawCpf.length === 14 ? formatCNPJ(rawCpf) : rawCpf;
    const qualificacao = p.qualificacao_socio || p.qualificacao_do_responsavel || p.qual || 'Sócio';
    const faixaEtaria = p.faixa_etaria || 'Não informada';
    const dataEntrada = formatDate(p.data_entrada_sociedade || p.data_entrada);
    const pais = p.pais || 'Brasil';
    const representante = p.representante_legal || p.nome_representante || '';

    return {
      id: `partner-${idx}-${nome.replace(/\s+/g, '-').toLowerCase()}`,
      nome,
      cpfCnpj: cpfFormatado,
      rawCpfCnpj: rawCpf,
      qualificacao,
      faixaEtaria,
      dataEntrada,
      pais,
      representante
    };
  });

  // Simples Nacional / MEI
  const simples = {
    optante: !!(data.opcao_pelo_simples ?? data.simples?.optante),
    dataOpcao: formatDate(data.data_opcao_pelo_simples),
    mei: !!(data.opcao_pelo_mei ?? data.simples?.mei)
  };

  return {
    source,
    cnpj,
    rawCnpj: data.cnpj,
    razaoSocial,
    nomeFantasia,
    situacao,
    dataSituacao,
    dataInicio,
    capitalSocial,
    capitalSocialFormatado: formatCurrency(capitalSocial),
    naturezaJuridica,
    porte,
    cnae: {
      codigo: cnaeCodigo,
      descricao: cnaeDescricao,
      categoria: cnaeCategory
    },
    cnaesSecundarios,
    endereco,
    telefones: Array.from(new Set(telefones.filter(Boolean))),
    emails: Array.from(new Set(emails.filter(Boolean))),
    partners,
    simples
  };
}

// Expansão de tentáculos: encontra outras empresas do mesmo grupo/sócio
export async function fetchPartnerNetwork(partnerName, partnerCpf, currentCnpj) {
  // Simula busca reversa por sócio (cruzamento de rede de coligadas)
  const cleanName = partnerName.trim().toUpperCase();
  const variations = [
    {
      razaoSocial: `${cleanName} HOLDING PARTICIPAÇÕES S.A.`,
      cnpj: '12.345.678/0001-90',
      qualificacao: 'Diretor Presidente',
      relacao: 'Controladora / Holding'
    },
    {
      razaoSocial: `EMPREENDIMENTOS ${cleanName.split(' ')[0]} LTDA`,
      cnpj: '98.765.432/0001-10',
      qualificacao: 'Sócio-Administrador',
      relacao: 'Coligada'
    }
  ];
  return variations;
}

function generateMockCompany(cnpjClean) {
  return {
    cnpj: cnpjClean,
    razao_social: `GRUPO EMPRESARIAL ${cnpjClean.slice(0, 4)} PARTICIPACOES S.A.`,
    nome_fantasia: `INVES-TECH ${cnpjClean.slice(0, 3)}`,
    descricao_situacao_cadastral: 'ATIVA',
    data_situacao_cadastral: '2018-05-14',
    data_inicio_atividade: '2015-03-20',
    capital_social: 12500000,
    natureza_juridica: '205-4 - Sociedade Anônima Fechada',
    porte: 'DEMAIS',
    cnae_fiscal: '6201-5/01',
    cnae_fiscal_descricao: 'Desenvolvimento de programas de computador sob encomenda',
    descricao_tipo_de_logradouro: 'AVENIDA',
    logradouro: 'DAS NAÇÕES UNIDAS',
    numero: '14261',
    complemento: 'ANDAR 22 SALA 2201',
    bairro: 'VILA GERTRUDES',
    municipio: 'SAO PAULO',
    uf: 'SP',
    cep: '04795100',
    ddd_telefone_1: '1130001234',
    ddd_telefone_2: '11987654321',
    email: 'compliance@grupocata.com.br',
    qsa: [
      {
        nome_socio: 'MARCELO DE ALBUQUERQUE CARDOSO',
        cnpj_cpf_do_socio: '***.482.198-**',
        qualificacao_socio: 'Presidente',
        faixa_etaria: 'Entre 41 e 50 anos',
        data_entrada_sociedade: '2015-03-20'
      },
      {
        nome_socio: 'HELENA CAVALCANTI MENDONÇA',
        cnpj_cpf_do_socio: '***.159.832-**',
        qualificacao_socio: 'Diretor',
        faixa_etaria: 'Entre 31 e 40 anos',
        data_entrada_sociedade: '2017-08-11'
      },
      {
        nome_socio: 'VANGUARD INVESTMENT HOLDINGS LTDA',
        cnpj_cpf_do_socio: '09.876.543/0001-21',
        qualificacao_socio: 'Sócio Pessoa Jurídica Domiciliado no Brasil',
        faixa_etaria: 'Não se aplica',
        data_entrada_sociedade: '2019-11-05'
      }
    ],
    opcao_pelo_simples: false,
    opcao_pelo_mei: false
  };
}

// CataVínculo Asset Engine: Registro Aeronáutico Brasileiro (RAB ANAC)
export async function fetchAircraftData(prefixInput) {
  const prefix = String(prefixInput).trim().toUpperCase();
  await new Promise(r => setTimeout(r, 400));

  return {
    prefixo: prefix,
    fabricante: 'EMBRAER',
    modelo: 'EMB-505 Phenom 300',
    anoFabricacao: 2021,
    proprietario: 'HOLDING PATRIMONIAL VIP S.A.',
    cpfCnpjProprietario: '12.345.678/0001-90',
    operador: 'AERO TAXI EXECUTIVO LTDA',
    situacaoAeronavegabilidade: 'NORMAL / VÁLIDA',
    gravame: 'ALIENAÇÃO FIDUCIÁRIA / PENHORA ATIVA',
    categoriaRegistro: 'Privada - Serviços Aéreos Especializados',
    valorEstimado: 'R$ 48.500.000,00'
  };
}

// CataVínculo Asset Engine: Veículos Automotores & Renavam
export async function fetchVehicleData(queryInput) {
  const query = String(queryInput).trim().toUpperCase();
  await new Promise(r => setTimeout(r, 400));

  return {
    placa: query.length === 7 ? query : 'BRA2E19',
    renavam: query.length > 7 ? query : '01123456789',
    marcaModelo: 'PORSCHE 911 CARRERA S',
    anoFabricacao: 2023,
    anoModelo: 2024,
    cor: 'PRETA',
    proprietario: 'MARCELO DE ALBUQUERQUE CARDOSO',
    documentoProprietario: '***.482.198-**',
    situacaoVeiculo: 'CIRCULAÇÃO REGULAR',
    restricoes: 'RENAJUD - BLOQUEIO DE TRANSFERÊNCIA',
    valorFipe: 'R$ 1.150.000,00'
  };
}

// CataVínculo Intelligence: Busca Mestre por Nome (Pessoa Física ou Razão Social)
export async function searchByName(nameInput) {
  const cleanName = String(nameInput || '').trim();
  if (cleanName.length < 3) {
    throw new Error('Informe ao menos 3 caracteres para a busca por nome.');
  }

  const upper = cleanName.toUpperCase();

  // 1. Checar se coincide com casos conhecidos
  if (upper.includes('PETROBRAS') || upper.includes('PETROLEO BRASILEIRO')) {
    return { type: 'company', cnpj: '33000167000101', data: await fetchCompanyData('33000167000101') };
  }
  if (upper.includes('MAGAZINE') || upper.includes('LUIZA') || upper.includes('MAGALU')) {
    return { type: 'company', cnpj: '47960950000121', data: await fetchCompanyData('47960950000121') };
  }
  if (upper.includes('BANCO DO BRASIL')) {
    return { type: 'company', cnpj: '00000000000191', data: await fetchCompanyData('00000000000191') };
  }
  if (upper.includes('NUBANK') || upper.includes('NU PAGAMENTOS')) {
    return { type: 'company', cnpj: '18236120000158', data: await fetchCompanyData('18236120000158') };
  }
  if (upper.includes('EMBRAER')) {
    return { type: 'company', cnpj: '07689002000189', data: await fetchCompanyData('07689002000189') };
  }

  // 2. Verificar se é Pessoa Jurídica (Empresa)
  const isCorporate = /LTDA|S\.?A\.?|HOLDING|PARTICIPA|GRUPO|COMERCIO|SERVICOS|ENGENHARIA|INVEST|CONSULTORIA|TECH|SOLUCOES|CORP/i.test(upper);

  await new Promise(r => setTimeout(r, 450));

  if (isCorporate) {
    // Gerar registro cadastral empresarial baseado no nome
    const mockCnpj = `${Math.floor(10000000 + Math.random() * 89999999)}0001${Math.floor(10 + Math.random() * 89)}`;
    const compData = {
      cnpj: formatCNPJ(mockCnpj),
      rawCnpj: mockCnpj,
      razaoSocial: upper,
      nomeFantasia: cleanName,
      situacaoCadastral: 'ATIVA',
      dataAbertura: '15/03/2016',
      capitalSocial: 4500000,
      capitalSocialFormatado: 'R$ 4.500.000,00',
      naturezaJuridica: '206-2 - Sociedade Empresária Limitada',
      porte: 'DEMAIS',
      cnaePrincipal: { codigo: '6462-0/00', descricao: 'Holdings de instituições não-financeiras' },
      cnaesSecundarios: [],
      endereco: {
        completo: 'Av. Brigadeiro Faria Lima, 3477 - Itaim Bibi, São Paulo - SP',
        municipio: 'SAO PAULO',
        uf: 'SP'
      },
      partners: [
        {
          nome: `${cleanName.split(' ')[0]} GESTÃO PATRIMONIAL LTDA`,
          cpfCnpj: '***.729.110-**',
          qualificacao: 'Sócio Pessoa Jurídica',
          faixaEtaria: 'Não se aplica'
        },
        {
          nome: 'ROBERTO CARLOS CAVALCANTI',
          cpfCnpj: '***.382.910-**',
          qualificacao: 'Sócio-Administrador',
          faixaEtaria: 'Entre 41 e 50 anos'
        }
      ],
      telefones: ['(11) 3280-4400'],
      emails: [`contato@${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.br`]
    };

    return { type: 'company', cnpj: mockCnpj, data: compData };
  }

  // 3. Caso seja Pessoa Física (Sócio / Investigado)
  const personDoc = `***.${Math.floor(100 + Math.random() * 899)}.${Math.floor(100 + Math.random() * 899)}-**`;
  const relatedCompanies = [
    {
      razaoSocial: `${upper} PARTICIPAÇÕES & HOLDING LTDA`,
      cnpj: `${Math.floor(10000000 + Math.random() * 89999999)}000112`,
      situacaoCadastral: 'ATIVA',
      capitalSocial: 'R$ 3.200.000,00',
      participacao: '90% das quotas',
      cargo: 'Sócio-Administrador'
    },
    {
      razaoSocial: `ALPHA INOVAÇÃO & CONSULTORIA EMPRESARIAL S.A.`,
      cnpj: `${Math.floor(10000000 + Math.random() * 89999999)}000145`,
      situacaoCadastral: 'ATIVA',
      capitalSocial: 'R$ 8.500.000,00',
      participacao: 'Diretor Presidente',
      cargo: 'Presidente'
    }
  ];

  return {
    type: 'person',
    nome: upper,
    cpfCnpj: personDoc,
    qualificacao: 'Alvo sob Investigação Cadastral',
    relatedCompanies
  };
}
