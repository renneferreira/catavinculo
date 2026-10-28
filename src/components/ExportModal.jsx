import React, { useState } from 'react';
import { X, FileText, FileSpreadsheet, Download, CheckCircle2, Loader2, Scale } from 'lucide-react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

export function ExportModal({ isOpen, onClose, nodes = [], edges = [], investigationTitle = 'Investigação Cadastral' }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const companies = nodes.filter(n => n.type === 'company');
  const partners = nodes.filter(n => n.type === 'person');
  const lawsuits = nodes.filter(n => n.type === 'lawsuit');
  const contacts = nodes.filter(n => n.type === 'contact');
  const infraNodes = nodes.filter(n => n.type === 'infrastructure');
  const identityNodes = nodes.filter(n => n.type === 'identity');

  // Exportar XLSX com SheetJS
  const handleExportXLSX = () => {
    try {
      setLoading(true);

      const wb = XLSX.utils.book_new();

      // Aba 1: Empresas
      const companyRows = companies.map(c => ({
        'CNPJ': c.data.cnpj || '',
        'Razão Social': c.data.razaoSocial || '',
        'Nome Fantasia': c.data.nomeFantasia || '',
        'Situação Cadastral': c.data.situacao || '',
        'Capital Social': c.data.capitalSocialFormatado || '',
        'Score de Compliance': c.data.complianceScore ? `${c.data.complianceScore.score}/100 (${c.data.complianceScore.label})` : 'N/D',
        'CNAE Principal': c.data.cnae?.codigo || '',
        'Descrição CNAE': c.data.cnae?.descricao || '',
        'Categoria': c.data.cnae?.categoria?.label || '',
        'Município/UF': c.data.endereco?.municipio ? `${c.data.endereco.municipio}/${c.data.endereco.uf}` : '',
        'Endereço Completo': c.data.endereco?.completo || '',
        'Qtd Sócios Mapeados': c.data.partners?.length || 0,
        'Processos Mapeados': c.data.lawsuits?.length || 0
      }));
      const wsCompanies = XLSX.utils.json_to_sheet(companyRows);
      XLSX.utils.book_append_sheet(wb, wsCompanies, 'Empresas');

      // Aba 2: Sócios
      const partnerRows = partners.map(p => ({
        'Nome do Sócio': p.data.nome || '',
        'CPF/CNPJ': p.data.cpfCnpj || '',
        'Qualificação': p.data.qualificacao || '',
        'Faixa Etária': p.data.faixaEtaria || '',
        'Data de Entrada no QSA': p.data.dataEntrada || '',
        'País': p.data.pais || 'Brasil'
      }));
      const wsPartners = XLSX.utils.json_to_sheet(partnerRows);
      XLSX.utils.book_append_sheet(wb, wsPartners, 'Sócios e Administradores');

      // Aba 3: Processos Judiciais (DataJud / Tribunais)
      const allLawsuits = [...lawsuits.map(l => l.data), ...companies.flatMap(c => c.data.lawsuits || [])];
      const uniqueLawsuits = Array.from(new Map(allLawsuits.map(l => [l.numero, l])).values());
      
      if (uniqueLawsuits.length > 0) {
        const lawsuitRows = uniqueLawsuits.map(l => ({
          'Número do Processo (CNJ)': l.numero || '',
          'Tribunal': l.tribunal || '',
          'Classe Processual': l.classe || '',
          'Órgão Julgador': l.orgao || '',
          'Polo / Posição': l.polo || '',
          'Assuntos': (l.assuntos || []).join('; '),
          'Data de Distribuição': l.dataAjuizamento || '',
          'Grau de Risco': l.risco || 'MODERADO',
          'Link Consulta': l.linkJusbrasil || ''
        }));
        const wsLawsuits = XLSX.utils.json_to_sheet(lawsuitRows);
        XLSX.utils.book_append_sheet(wb, wsLawsuits, 'Processos Judiciais');
      }

      // Aba 4: Infraestrutura Digital (Shodan / DNS)
      if (infraNodes.length > 0) {
        const infraRows = infraNodes.map(inf => ({
          'Domínio': inf.data.domain || '',
          'Endereço IP': inf.data.ip || '',
          'Provedor / ASN': inf.data.geo?.org || inf.data.geo?.asn || '',
          'País / Cidade': `${inf.data.geo?.city || ''} (${inf.data.geo?.country || 'BR'})`,
          'Servidor de E-mail': inf.data.mailProvider || '',
          'Subdomínios Descobertos': (inf.data.subdomains || []).join('; '),
          'URL Shodan': inf.data.shodanUrl || ''
        }));
        const wsInfra = XLSX.utils.json_to_sheet(infraRows);
        XLSX.utils.book_append_sheet(wb, wsInfra, 'Infraestrutura Shodan');
      }

      // Aba 5: Identidades OSINT (OSINT Industries / Footprint)
      if (identityNodes.length > 0) {
        const identityRows = identityNodes.map(ident => ({
          'Alvo': ident.data.target || '',
          'Tipo': ident.data.type || '',
          'Provedor / Região': ident.data.footprint?.type || ident.data.footprint?.regiao || '',
          'Candidato a Chave PIX': ident.data.footprint?.isPixCandidate ? 'Sim' : 'Não',
          'Plataformas Detectadas': (ident.data.footprint?.platforms || []).map(p => p.name).join('; ')
        }));
        const wsIdentity = XLSX.utils.json_to_sheet(identityRows);
        XLSX.utils.book_append_sheet(wb, wsIdentity, 'Identidades OSINT');
      }

      // Aba 6: Contatos
      const contactRows = contacts.map(ct => ({
        'Tipo': ct.data.type === 'phone' ? 'Telefone' : 'E-mail',
        'Dado Cadastrado': ct.data.value || '',
        'Rótulo': ct.data.label || ''
      }));
      if (contactRows.length > 0) {
        const wsContacts = XLSX.utils.json_to_sheet(contactRows);
        XLSX.utils.book_append_sheet(wb, wsContacts, 'Contatos');
      }

      const filename = `catavinculo-dossie-osint-${Date.now()}.xlsx`;
      XLSX.writeFile(wb, filename);

      setSuccess('Planilha Excel gerada com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Erro ao gerar XLSX:', err);
      alert('Falha ao exportar planilha Excel.');
    } finally {
      setLoading(false);
    }
  };

  // Exportar Relatório em PDF com jsPDF
  const handleExportPDF = () => {
    try {
      setLoading(true);

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Header do Dossiê
      doc.setFillColor(18, 18, 23);
      doc.rect(0, 0, 210, 35, 'F');

      doc.setTextColor(240, 161, 33);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('CATAVÍNCULO — RELATÓRIO FORENSE OSINT', 14, 18);

      doc.setTextColor(200, 200, 210);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Dossiê de Vínculos Societários & Pesquisa Processual (DataJud / Receita Federal)', 14, 25);

      const dateStr = new Date().toLocaleString('pt-BR');
      doc.setFontSize(9);
      doc.text(`Emissão: ${dateStr}`, 140, 18);
      doc.text(`Identificador: #${Date.now().toString().slice(-6)}`, 140, 25);

      let y = 48;

      // Resumo Executivo
      doc.setTextColor(20, 20, 25);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('1. Resumo Executivo & Compliance', 14, y);
      y += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Título do Caso: ${investigationTitle}`, 14, y);
      y += 6;
      doc.text(`Total de Empresas Mapeadas: ${companies.length}`, 14, y);
      y += 6;
      doc.text(`Total de Sócios e Administradores: ${partners.length}`, 14, y);
      y += 6;
      doc.text(`Total de Ações Judiciais Identificadas: ${lawsuits.length}`, 14, y);
      y += 6;
      doc.text(`Total de Conexões e Arestas: ${edges.length}`, 14, y);
      y += 12;

      // Seção Empresas
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('2. Empresas Identificadas na Rede', 14, y);
      y += 8;

      companies.forEach((comp, idx) => {
        if (y > 255) {
          doc.addPage();
          y = 20;
        }

        doc.setFillColor(245, 245, 248);
        doc.roundedRect(14, y, 182, 28, 2, 2, 'F');

        doc.setTextColor(30, 41, 59);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${idx + 1}. ${comp.data.razaoSocial}`, 18, y + 6);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`CNPJ: ${comp.data.cnpj} | Situação: ${comp.data.situacao} | Capital: ${comp.data.capitalSocialFormatado}`, 18, y + 12);
        doc.text(`CNAE: ${comp.data.cnae?.codigo} - ${comp.data.cnae?.descricao?.slice(0, 65)}...`, 18, y + 18);
        
        const scoreText = comp.data.complianceScore ? `Score: ${comp.data.complianceScore.score}/100 (${comp.data.complianceScore.label})` : 'Score: Regular';
        doc.text(`Localização: ${comp.data.endereco?.municipio}/${comp.data.endereco?.uf} | ${scoreText}`, 18, y + 24);

        y += 32;
      });

      y += 6;

      // Seção Sócios
      if (y > 240) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('3. Quadro de Sócios e Administradores (QSA)', 14, y);
      y += 8;

      partners.forEach((p, idx) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(`• ${p.data.nome}`, 16, y);

        doc.setFont('helvetica', 'normal');
        doc.text(`CPF/CNPJ: ${p.data.cpfCnpj || '***'} | Qualificação: ${p.data.qualificacao} | Entrada: ${p.data.dataEntrada || 'N/D'}`, 20, y + 4.5);

        y += 10;
      });

      y += 6;

      // Seção Processos Judiciais (DataJud)
      const allLawsuits = [...lawsuits.map(l => l.data), ...companies.flatMap(c => c.data.lawsuits || [])];
      const uniqueLawsuits = Array.from(new Map(allLawsuits.map(l => [l.numero, l])).values());

      if (uniqueLawsuits.length > 0) {
        if (y > 240) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('4. Processos Judiciais Identificados (DataJud / CNJ)', 14, y);
        y += 8;

        uniqueLawsuits.forEach((proc, idx) => {
          if (y > 265) {
            doc.addPage();
            y = 20;
          }

          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.text(`⚖ Processo: ${proc.numero} (${proc.tribunal}) - ${proc.classe}`, 16, y);

          doc.setFont('helvetica', 'normal');
          doc.text(`Órgão: ${proc.orgao} | Polo: ${proc.polo} | Risco: ${proc.risco}`, 20, y + 4.5);
          doc.text(`Assunto: ${(proc.assuntos || []).join(', ')} | Distribuído em: ${proc.dataAjuizamento}`, 20, y + 9);

          y += 14;
        });
      }

      // Seção Infraestrutura Shodan
      if (infraNodes.length > 0) {
        if (y > 240) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('5. Infraestrutura Digital & Ativos de Rede (Shodan / DNS)', 14, y);
        y += 8;

        infraNodes.forEach((inf) => {
          if (y > 265) {
            doc.addPage();
            y = 20;
          }

          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.text(`[INFRA] Dominio: ${inf.data.domain} (IP: ${inf.data.ip})`, 16, y);

          doc.setFont('helvetica', 'normal');
          doc.text(`Provedor/ASN: ${inf.data.geo?.org || inf.data.geo?.asn} | E-mail: ${inf.data.mailProvider}`, 20, y + 4.5);
          if (inf.data.subdomains?.length > 0) {
            doc.text(`Subdomínios: ${inf.data.subdomains.slice(0, 4).join(', ')}`, 20, y + 9);
            y += 14;
          } else {
            y += 10;
          }
        });
      }

      // Seção Identidades OSINT
      if (identityNodes.length > 0) {
        if (y > 240) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('6. Pegada Digital & Identidades (OSINT)', 14, y);
        y += 8;

        identityNodes.forEach((ident) => {
          if (y > 265) {
            doc.addPage();
            y = 20;
          }

          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.text(`[OSINT] Alvo: ${ident.data.target} (${ident.data.type})`, 16, y);

          doc.setFont('helvetica', 'normal');
          doc.text(`Região/Provedor: ${ident.data.footprint?.type || ident.data.footprint?.regiao} | PIX: ${ident.data.footprint?.isPixCandidate ? 'Compatível' : 'N/D'}`, 20, y + 4.5);
          y += 10;
        });
      }

      // Rodapé
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 160);
        doc.text(`CataVínculo — Dossiê de Inteligência Forense OSINT — Página ${i} de ${pageCount}`, 14, 290);
      }

      doc.save(`catavinculo-dossie-${Date.now()}.pdf`);
      setSuccess('Dossiê em PDF gerado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      alert('Falha ao exportar documento PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-[#141419] border border-zinc-800 p-6 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Download className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100">Exportar Dossiê Forense</h3>
            <p className="text-xs text-zinc-400">Gere relatórios completos de vínculos e processos</p>
          </div>
        </div>

        {/* Resumo dos dados a exportar */}
        <div className="mt-5 p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 grid grid-cols-4 gap-2 text-center text-xs">
          <div>
            <span className="text-zinc-500 text-[10px] uppercase font-semibold block">Empresas</span>
            <span className="text-sm font-bold text-blue-400 font-mono">{companies.length}</span>
          </div>
          <div>
            <span className="text-zinc-500 text-[10px] uppercase font-semibold block">Sócios</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">{partners.length}</span>
          </div>
          <div>
            <span className="text-zinc-500 text-[10px] uppercase font-semibold block">Ações</span>
            <span className="text-sm font-bold text-red-400 font-mono">{lawsuits.length}</span>
          </div>
          <div>
            <span className="text-zinc-500 text-[10px] uppercase font-semibold block">Vínculos</span>
            <span className="text-sm font-bold text-amber-400 font-mono">{edges.length}</span>
          </div>
        </div>

        {success && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2 text-emerald-300 text-xs font-medium">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="mt-5 space-y-3">
          <button
            onClick={handleExportPDF}
            disabled={loading}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/10 hover:from-amber-500/30 hover:to-amber-600/20 border border-amber-500/40 text-amber-300 font-semibold text-xs transition-all group disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <FileText className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="block text-zinc-100 font-bold">Dossiê Pericial em PDF</span>
                <span className="text-[11px] text-zinc-400 font-normal">Relatório consolidado com empresas, sócios e processos</span>
              </div>
            </div>
            {loading ? <Loader2 className="h-4 w-4 animate-spin text-amber-400" /> : <Download className="h-4 w-4 text-amber-400 group-hover:translate-y-0.5 transition-transform" />}
          </button>

          <button
            onClick={handleExportXLSX}
            disabled={loading}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-700/80 text-zinc-200 font-semibold text-xs transition-all group disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <FileSpreadsheet className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="block text-zinc-100 font-bold">Planilha Excel Completa (XLSX)</span>
                <span className="text-[11px] text-zinc-400 font-normal">Abas separadas para Empresas, Sócios e Processos</span>
              </div>
            </div>
            {loading ? <Loader2 className="h-4 w-4 animate-spin text-zinc-400" /> : <Download className="h-4 w-4 text-zinc-400 group-hover:translate-y-0.5 transition-transform" />}
          </button>
        </div>

        <div className="mt-5 pt-4 border-t border-zinc-800 text-center">
          <p className="text-[11px] text-zinc-500">
            Documentos emitidos com base em fontes abertas oficiais (Receita Federal do Brasil & DataJud/CNJ).
          </p>
        </div>
      </div>
    </div>
  );
}
