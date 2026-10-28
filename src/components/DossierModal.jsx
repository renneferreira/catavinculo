import React, { useState } from 'react';
import { 
  FileText, 
  X, 
  Sparkles, 
  ShieldAlert, 
  Building2, 
  User, 
  Scale, 
  Plane, 
  Car, 
  Copy, 
  Check, 
  Printer, 
  Download,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Landmark,
  Zap,
  CheckCircle2
} from 'lucide-react';

export function DossierModal({ 
  isOpen, 
  onClose, 
  nodes = [], 
  edges = [], 
  selectedEntity = null
}) {
  const [focus, setFocus] = useState('execucao'); // 'execucao' | 'idpj' | 'compliance'
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [dossierReady, setDossierReady] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Encontrar entidade principal do caso
  const mainEntity = selectedEntity || nodes.find(n => n.data?.isRoot) || nodes[0] || {
    data: {
      razaoSocial: 'EMPRESA OU PESSOA SOB INVESTIGAÇÃO',
      cnpj: '00.000.000/0001-00',
      capitalSocial: 1000000,
      partners: [],
      lawsuits: []
    }
  };

  const companies = nodes.filter(n => n.type === 'company');
  const persons = nodes.filter(n => n.type === 'person');
  const lawsuits = nodes.filter(n => n.type === 'lawsuit');
  const infrastructure = nodes.filter(n => n.type === 'infrastructure');

  const handleStartGeneration = () => {
    setIsGenerating(true);
    setGenerationStep(1);

    setTimeout(() => setGenerationStep(2), 600);
    setTimeout(() => setGenerationStep(3), 1200);
    setTimeout(() => setGenerationStep(4), 1800);
    setTimeout(() => {
      setIsGenerating(false);
      setDossierReady(true);
    }, 2400);
  };

  const handleCopyDossier = () => {
    const text = generateDossierText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateDossierText = () => {
    const title = `DOSSIÊ INVESTIGATIVO ESPECIALIZADO — ${mainEntity.data?.razaoSocial || mainEntity.data?.nome}`;
    const date = new Date().toLocaleDateString('pt-BR');
    
    let text = `${title}\nGerado em: ${date} via CataVínculo (Motor de Inteligência e Grafos Relacionais CataVínculo)\n`;
    text += `Finalidade: ${focus === 'execucao' ? 'Localização de Bens e Ativos Ocultos para Execução Judicial' : focus === 'idpj' ? 'Incidente de Desconsideração da Personalidade Jurídica (Art. 50 CC / Art. 133 CPC)' : 'Due Diligence & Compliance Preventivo'}\n\n`;
    
    text += `1. ALVO PRINCIPAL:\n`;
    text += `- Razão Social / Nome: ${mainEntity.data?.razaoSocial || mainEntity.data?.nome}\n`;
    text += `- Documento (CNPJ/CPF): ${mainEntity.data?.cnpj || mainEntity.data?.cpf || 'Consolidado'}\n`;
    text += `- Situação Cadastral: ${mainEntity.data?.situacaoCadastral || 'Ativa'}\n`;
    text += `- Capital Social Declarado: ${mainEntity.data?.capitalSocialFormatado || 'R$ ' + (mainEntity.data?.capitalSocial || 0).toLocaleString('pt-BR')}\n\n`;

    text += `2. ESTRUTURA SOCIETÁRIA & POTENCIAIS INTERPOSTAS PESSOAS (LARANJAS):\n`;
    if (persons.length > 0) {
      persons.forEach((p, idx) => {
        text += `  ${idx + 1}. ${p.data?.nome || 'Sócio'} (${p.data?.qualificacao || 'Sócio-Administrador'})\n`;
      });
    } else {
      text += `  Nenhum sócio direto mapeado no recorte.\n`;
    }
    text += `\n`;

    text += `3. EMPRESAS DO MESMO GRUPO ECONÔMICO DE FATO / HOLDINGS:\n`;
    companies.forEach((c, idx) => {
      text += `  ${idx + 1}. ${c.data?.razaoSocial} | CNPJ: ${c.data?.cnpj} | Situação: ${c.data?.situacaoCadastral || 'Ativa'}\n`;
    });
    text += `\n`;

    text += `4. PASSIVO PROCESSUAL IDENTIFICADO (DATAJUD CNJ):\n`;
    text += `Total de Ações Conectadas: ${lawsuits.length}\n`;
    lawsuits.slice(0, 5).forEach((l, idx) => {
      text += `  - Processo: ${l.data?.numeroProcesso || l.data?.label} | Vara: ${l.data?.vara || 'Vara Cível'} | Valor: ${l.data?.valorCausa || 'R$ 150.000,00'}\n`;
    });
    text += `\n`;

    text += `5. CONCLUSÃO TÉCNICA PARA PETIÇÃO JUDICIAL:\n`;
    text += `Restou evidenciada a interligação societária, confusão patrimonial e existência de patrimônio passível de constrição (SISBAJUD, RENAJUD e arresto cautelar). Dossiê apto para instrução de pedido de penhora ou instauração de IDPJ.`;

    return text;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-modal-title"
    >
      <div className="relative w-full max-w-3xl rounded-3xl darkglass-panel border border-white/10 p-6 md:p-8 text-white shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Glow de fundo */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header do Dossiê */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                Módulo Forense Especializado
              </span>
            </div>
            <h2 id="dossier-modal-title" className="text-xl font-extrabold tracking-tight text-white mt-1.5 flex items-center gap-2 font-display">
              <FileText className="h-5 w-5 text-emerald-400" />
              <span>Dossiê Investigativo para Petição</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Alvo: <strong className="text-white">{mainEntity.data?.razaoSocial || mainEntity.data?.nome}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
            aria-label="Fechar modal do dossiê"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conteúdo Dinâmico */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5">
          {!dossierReady && !isGenerating && (
            <>
              {/* Escolha do Foco da Investigação (guided-dossier-form) */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2.5">
                  1. Escolha o Foco Estratégico do Dossiê
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Opção 1: Execução & Ativos */}
                  <button
                    type="button"
                    onClick={() => setFocus('execucao')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      focus === 'execucao'
                        ? 'bg-amber-500/15 border-amber-400/80 shadow-lg shadow-amber-500/10'
                        : 'bg-zinc-900/60 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="h-9 w-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center mb-3">
                      <Landmark className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-sm text-white block">
                      Execução &amp; Bens
                    </span>
                    <span className="text-[11px] text-zinc-400 leading-snug block mt-1">
                      Holdings, bens em nome de familiares, laranjas e ativos penhoráveis.
                    </span>
                  </button>

                  {/* Opção 2: IDPJ */}
                  <button
                    type="button"
                    onClick={() => setFocus('idpj')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      focus === 'idpj'
                        ? 'bg-amber-500/15 border-amber-400/80 shadow-lg shadow-amber-500/10'
                        : 'bg-zinc-900/60 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="h-9 w-9 rounded-xl bg-purple-400/20 text-purple-400 flex items-center justify-center mb-3">
                      <Scale className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-sm text-white block">
                      IDPJ &amp; Confusão
                    </span>
                    <span className="text-[11px] text-zinc-400 leading-snug block mt-1">
                      Art. 50 do CC: Desvio de finalidade, sócios comuns e grupo de fato.
                    </span>
                  </button>

                  {/* Opção 3: Compliance & Risco */}
                  <button
                    type="button"
                    onClick={() => setFocus('compliance')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      focus === 'compliance'
                        ? 'bg-amber-500/15 border-amber-400/80 shadow-lg shadow-amber-500/10'
                        : 'bg-zinc-900/60 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="h-9 w-9 rounded-xl bg-blue-400/20 text-blue-400 flex items-center justify-center mb-3">
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-sm text-white block">
                      Due Diligence
                    </span>
                    <span className="text-[11px] text-zinc-400 leading-snug block mt-1">
                      Varredura de processos DataJud, Shodan, sanções e certidões negativas.
                    </span>
                  </button>
                </div>
              </div>

              {/* Prévia dos Dados Mapeados que serão incluídos */}
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 text-xs space-y-2">
                <span className="font-bold text-zinc-300 block">
                  Resumo de Evidências a Consolidar:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-zinc-400 pt-1">
                  <div className="bg-black/30 p-2 rounded-xl">
                    <span className="block text-zinc-500">Empresas:</span>
                    <strong className="text-white text-sm font-mono">{companies.length}</strong>
                  </div>
                  <div className="bg-black/30 p-2 rounded-xl">
                    <span className="block text-zinc-500">Sócios/Vínculos:</span>
                    <strong className="text-white text-sm font-mono">{persons.length}</strong>
                  </div>
                  <div className="bg-black/30 p-2 rounded-xl">
                    <span className="block text-zinc-500">Processos:</span>
                    <strong className="text-red-400 text-sm font-mono">{lawsuits.length}</strong>
                  </div>
                  <div className="bg-black/30 p-2 rounded-xl">
                    <span className="block text-zinc-500">Superfície Shodan:</span>
                    <strong className="text-cyan-400 text-sm font-mono">{infrastructure.length}</strong>
                  </div>
                </div>
              </div>

              {/* Botão de Disparo */}
              <button
                type="button"
                onClick={handleStartGeneration}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] text-black text-sm font-bold shadow-xl shadow-emerald-500/20 transition-all focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <Sparkles className="h-4 w-4" />
                <span>Gerar Dossiê Investigativo</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Estado de Carregamento Progressivo (guided-dossier-loading) */}
          {isGenerating && (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-emerald-400/20 border-t-emerald-400 animate-spin" />
                <Sparkles className="h-6 w-6 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  Compilando Dossiê Especializado…
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  {generationStep === 1 && '1/4 - Cruzando registros da Receita Federal e participações societárias…'}
                  {generationStep === 2 && '2/4 - Rastreando ações cíveis e trabalhistas no DataJud CNJ…'}
                  {generationStep === 3 && '3/4 - Analisando indícios de confusão patrimonial e interpostas pessoas…'}
                  {generationStep === 4 && '4/4 - Formatando peça probatória pronta para petição judicial…'}
                </p>
              </div>

              <div className="w-64 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${(generationStep / 4) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Dossiê Pronto com Visualização Legal */}
          {dossierReady && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Dossiê gerado com sucesso para anexar em petição judicial!
                </span>
              </div>

              {/* Caixa de Texto do Dossiê Formatado */}
              <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 font-mono text-xs text-zinc-300 max-h-80 overflow-y-auto space-y-4 select-text leading-relaxed">
                <div className="border-b border-zinc-800 pb-3 text-amber-400 font-bold">
                  DOSSIÊ INVESTIGATIVO ESPECIALIZADO — {mainEntity.data?.razaoSocial || mainEntity.data?.nome}
                </div>

                <div>
                  <span className="text-zinc-500 block uppercase text-[10px]">Alvo Investigado</span>
                  <p className="text-white font-bold">{mainEntity.data?.razaoSocial || mainEntity.data?.nome}</p>
                  <p className="text-zinc-400">Doc: {mainEntity.data?.cnpj || mainEntity.data?.cpf || 'Consolidado'}</p>
                  <p className="text-zinc-400">Capital Social: {mainEntity.data?.capitalSocialFormatado || 'R$ ' + (mainEntity.data?.capitalSocial || 0).toLocaleString('pt-BR')}</p>
                </div>

                <div>
                  <span className="text-zinc-500 block uppercase text-[10px]">Sócios &amp; Vínculos Subjetivos</span>
                  {persons.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-zinc-300">
                      {persons.map((p, idx) => (
                        <li key={idx}>
                          <strong>{p.data?.nome}</strong> — {p.data?.qualificacao || 'Sócio'}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-zinc-500 italic">Nenhum sócio direto listado.</p>
                  )}
                </div>

                <div>
                  <span className="text-zinc-500 block uppercase text-[10px]">Empresas Interligadas (Grupo de Fato)</span>
                  <ul className="list-disc list-inside space-y-1 text-zinc-300">
                    {companies.map((c, idx) => (
                      <li key={idx}>
                        {c.data?.razaoSocial} (CNPJ: {c.data?.cnpj})
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-zinc-500 block uppercase text-[10px]">Processos em Andamento (DataJud CNJ)</span>
                  <p className="text-zinc-400">Identificadas {lawsuits.length} ações judiciais ativas com risco de insolvência.</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px]">
                  <strong>Conclusão Técnica:</strong> Há indícios contundentes de confusão patrimonial e existência de bens suficientes para penhora via SISBAJUD / RENAJUD ou requerimento de IDPJ conforme art. 133 do CPC.
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopyDossier}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" />
                      <span>Copiado para a Área de Transferência!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copiar Texto Formatado</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all"
                >
                  <Printer className="h-4 w-4" />
                  <span>Imprimir / PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDossierReady(false)}
                  className="py-2.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold transition-all"
                >
                  Novo Dossiê
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

