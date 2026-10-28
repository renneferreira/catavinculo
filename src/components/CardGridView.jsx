import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Users, 
  Scale, 
  Server, 
  Fingerprint, 
  Phone, 
  Mail, 
  Zap, 
  ExternalLink, 
  Copy, 
  Check, 
  Search, 
  ChevronRight, 
  Trash2, 
  GitFork, 
  CheckCircle2, 
  AlertTriangle,
  BadgeCheck,
  ShieldCheck,
  Maximize2
} from 'lucide-react';

export function CardGridView({ 
  nodes = [], 
  onOpenDetails, 
  onOpenTransforms, 
  onExpandPartners, 
  onExpandCompanies, 
  onExpandLawsuits, 
  onExpandInfra, 
  onExpandFootprint, 
  onDeleteNode 
}) {
  const [filterText, setFilterText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Separação dos nós por categorias cognitivas
  const categorized = useMemo(() => {
    const term = filterText.toLowerCase().trim();

    const matchesSearch = (item) => {
      if (!term) return true;
      const d = item.data || {};
      const searchString = `${d.razaoSocial || ''} ${d.nome || ''} ${d.cnpj || ''} ${d.cpfCnpj || ''} ${d.numero || ''} ${d.domain || ''} ${d.target || ''} ${d.value || ''} ${d.classe || ''}`.toLowerCase();
      return searchString.includes(term);
    };

    return {
      companies: nodes.filter(n => n.type === 'company' && matchesSearch(n)),
      partners: nodes.filter(n => n.type === 'person' && matchesSearch(n)),
      lawsuits: nodes.filter(n => n.type === 'lawsuit' && matchesSearch(n)),
      infra: nodes.filter(n => n.type === 'infrastructure' && matchesSearch(n)),
      identities: nodes.filter(n => n.type === 'identity' && matchesSearch(n)),
      contacts: nodes.filter(n => n.type === 'contact' && matchesSearch(n))
    };
  }, [nodes, filterText]);

  const totalFiltered = 
    categorized.companies.length + 
    categorized.partners.length + 
    categorized.lawsuits.length + 
    categorized.infra.length + 
    categorized.identities.length + 
    categorized.contacts.length;

  return (
    <div className="h-full w-full overflow-y-auto p-4 md:p-8 bg-[#070709] select-text">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Barra Superior da Visão em Cards (IHC / Acessibilidade Cognitiva) */}
        <div className="neuro-card p-4 md:p-6 border border-zinc-800 bg-[#121218]/90">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                  Visão Neuroacessível em Cards
                </span>
                <span className="text-xs text-zinc-400">
                  {nodes.length} entidade(s) mapeadas no total
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white mt-1 tracking-tight">
                Painel Estruturado de Inteligência
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                Disposição em cartões de alta legibilidade, otimizada para foco mental, previsibilidade e mínima sobrecarga cognitiva.
              </p>
            </div>

            {/* Busca Interna para Localização Rápida no TDAH */}
            <div className="relative min-w-[280px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Filtrar cartões por nome, documento..."
                className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
              />
              {filterText && (
                <button
                  onClick={() => setFilterText('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Abas de Navegação por Categoria */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-800/80 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`neuro-btn ${
                selectedCategory === 'all' 
                  ? 'bg-amber-400 text-black border-amber-400 font-bold' 
                  : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              <span>Todos os Cards ({totalFiltered})</span>
            </button>

            <button
              onClick={() => setSelectedCategory('companies')}
              className={`neuro-btn ${
                selectedCategory === 'companies' 
                  ? 'bg-blue-600 text-white border-blue-500 font-bold' 
                  : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              <Building2 className="h-3.5 w-3.5 text-blue-400" />
              <span>Empresas ({categorized.companies.length})</span>
            </button>

            <button
              onClick={() => setSelectedCategory('partners')}
              className={`neuro-btn ${
                selectedCategory === 'partners' 
                  ? 'bg-emerald-600 text-white border-emerald-500 font-bold' 
                  : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              <Users className="h-3.5 w-3.5 text-emerald-400" />
              <span>Sócios & Pessoas ({categorized.partners.length})</span>
            </button>

            <button
              onClick={() => setSelectedCategory('lawsuits')}
              className={`neuro-btn ${
                selectedCategory === 'lawsuits' 
                  ? 'bg-red-600 text-white border-red-500 font-bold' 
                  : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              <Scale className="h-3.5 w-3.5 text-red-400" />
              <span>Ações Judiciais ({categorized.lawsuits.length})</span>
            </button>

            <button
              onClick={() => setSelectedCategory('infra')}
              className={`neuro-btn ${
                selectedCategory === 'infra' 
                  ? 'bg-cyan-600 text-white border-cyan-500 font-bold' 
                  : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              <Server className="h-3.5 w-3.5 text-cyan-400" />
              <span>Shodan / Infra ({categorized.infra.length})</span>
            </button>

            <button
              onClick={() => setSelectedCategory('identities')}
              className={`neuro-btn ${
                selectedCategory === 'identities' 
                  ? 'bg-purple-600 text-white border-purple-500 font-bold' 
                  : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              <Fingerprint className="h-3.5 w-3.5 text-purple-400" />
              <span>OSINT Pegadas ({categorized.identities.length})</span>
            </button>
          </div>
        </div>

        {/* 1. SEÇÃO: EMPRESAS */}
        {(selectedCategory === 'all' || selectedCategory === 'companies') && categorized.companies.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-400" />
              <h3 className="text-base font-bold text-zinc-100">Empresas Mapeadas ({categorized.companies.length})</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorized.companies.map((c) => {
                const d = c.data;
                const isAtiva = String(d.situacao).toUpperCase() === 'ATIVA';
                return (
                  <div 
                    key={c.id} 
                    className="neuro-card p-5 border border-zinc-700/80 flex flex-col justify-between hover:border-blue-400 transition-all"
                  >
                    <div>
                      {/* Top Header do Card */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-zinc-300 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                            {d.cnpj}
                          </span>
                          <button
                            onClick={() => handleCopy(c.id, d.cnpj)}
                            className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
                            title="Copiar CNPJ"
                          >
                            {copiedId === c.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>

                        {isAtiva ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <BadgeCheck className="h-3.5 w-3.5" />
                            Ativa
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                            {d.situacao || 'Inativa'}
                          </span>
                        )}
                      </div>

                      {/* Razão Social & Nome Fantasia */}
                      <h4 className="text-sm font-bold text-white mt-3 line-clamp-2 leading-snug">
                        {d.razaoSocial}
                      </h4>
                      {d.nomeFantasia && (
                        <p className="text-xs text-zinc-400 italic mt-0.5">"{d.nomeFantasia}"</p>
                      )}

                      {/* Mini-Cards de Informação com alto contraste */}
                      <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                          <span className="text-zinc-500 block text-[9px] uppercase font-bold">Capital Social</span>
                          <span className="font-mono font-bold text-zinc-200 text-xs">{d.capitalSocialFormatado || 'R$ 0,00'}</span>
                        </div>
                        <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                          <span className="text-zinc-500 block text-[9px] uppercase font-bold">Sócios Mapeados</span>
                          <span className="font-bold text-emerald-400 text-xs">{d.partners?.length || d.partnersCount || 0} membros</span>
                        </div>
                      </div>

                      {d.cnae && (
                        <div className="mt-2.5 p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs">
                          <span className="text-zinc-500 block text-[9px] uppercase font-bold">CNAE Principal</span>
                          <p className="text-zinc-300 font-medium text-[11px] mt-0.5 line-clamp-1">{d.cnae.descricao}</p>
                        </div>
                      )}
                    </div>

                    {/* Barra de Botões Adaptados e Acessíveis */}
                    <div className="mt-4 pt-3 border-t border-zinc-800/80 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onOpenDetails?.(d)}
                        className="neuro-btn bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 border-zinc-700"
                        title="Abrir Ficha Completa Cadastral e Jurídica"
                      >
                        <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
                        <span>Ver Ficha</span>
                      </button>

                      <button
                        onClick={() => onOpenTransforms?.(c)}
                        className="neuro-btn bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/30"
                        title="Abrir Menu de Transformações de Inteligência"
                      >
                        <Zap className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Transforms</span>
                      </button>

                      <button
                        onClick={() => onExpandInfra?.(d)}
                        className="neuro-btn bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                        title="Mapear Infraestrutura Digital (Shodan / DNS)"
                      >
                        <Server className="h-3.5 w-3.5" />
                        <span>Shodan</span>
                      </button>

                      <button
                        onClick={() => onExpandLawsuits?.(d)}
                        className="neuro-btn bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30"
                        title="Mapear Ações Judiciais (DataJud / CNJ)"
                      >
                        <Scale className="h-3.5 w-3.5" />
                        <span>Processos</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 2. SEÇÃO: SÓCIOS & PESSOAS FÍSICAS */}
        {(selectedCategory === 'all' || selectedCategory === 'partners') && categorized.partners.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-400" />
              <h3 className="text-base font-bold text-zinc-100">Sócios & Administradores ({categorized.partners.length})</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorized.partners.map((p) => {
                const d = p.data;
                return (
                  <div 
                    key={p.id} 
                    className="neuro-card p-5 border border-zinc-700/80 flex flex-col justify-between hover:border-emerald-400 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-zinc-300 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                          {d.cpfCnpj || 'CPF Protegido'}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase">
                          Sócio / QSA
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white mt-3 line-clamp-2 leading-snug">
                        {d.nome}
                      </h4>
                      <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                        {d.qualificacao || 'Sócio Administrador'}
                      </p>

                      <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                          <span className="text-zinc-500 block text-[9px] uppercase font-bold">Faixa Etária</span>
                          <span className="text-zinc-200 font-semibold text-xs">{d.faixaEtaria || 'Não informada'}</span>
                        </div>
                        <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                          <span className="text-zinc-500 block text-[9px] uppercase font-bold">Entrada na Empresa</span>
                          <span className="font-mono text-zinc-200 text-xs">{d.dataEntrada || 'Registrada'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center gap-2">
                      <button
                        onClick={() => onExpandCompanies?.(d)}
                        className="flex-1 neuro-btn bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/30"
                        title="Buscar outras empresas onde esta pessoa é sócia"
                      >
                        <GitFork className="h-3.5 w-3.5" />
                        <span>Rastrear Coligadas</span>
                      </button>

                      <button
                        onClick={() => onOpenTransforms?.(p)}
                        className="neuro-btn bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/30"
                        title="Transformações de Inteligência"
                      >
                        <Zap className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Transforms</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 3. SEÇÃO: PROCESSOS JUDICIAIS (DATAJUD / CNJ) */}
        {(selectedCategory === 'all' || selectedCategory === 'lawsuits') && categorized.lawsuits.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-red-400" />
              <h3 className="text-base font-bold text-zinc-100">Processos Judiciais (DataJud / CNJ) ({categorized.lawsuits.length})</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorized.lawsuits.map((l) => {
                const d = l.data;
                const isHighRisk = d.risco === 'ALTO';
                return (
                  <div 
                    key={l.id} 
                    className="neuro-card p-5 border border-zinc-700/80 flex flex-col justify-between hover:border-red-400 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-zinc-200 bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-800 select-all">
                          {d.numero}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                          isHighRisk 
                            ? 'bg-red-500/15 text-red-400 border-red-500/30' 
                            : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        }`}>
                          {isHighRisk ? 'Alto Risco' : 'Ação Ativa'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white mt-3 line-clamp-1">
                        {d.classe || 'Ação Judicial'}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">{d.orgao} ({d.tribunal})</p>

                      <div className="mt-3 p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-zinc-500 text-[10px] uppercase font-bold">Polo / Posição:</span>
                          <span className="text-zinc-300 font-semibold">{d.polo}</span>
                        </div>
                        {d.dataAjuizamento && (
                          <div className="flex justify-between">
                            <span className="text-zinc-500 text-[10px] uppercase font-bold">Distribuição:</span>
                            <span className="font-mono text-zinc-300">{d.dataAjuizamento}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                      {d.linkJusbrasil && (
                        <a
                          href={d.linkJusbrasil}
                          target="_blank"
                          rel="noreferrer"
                          className="neuro-btn bg-red-500/15 hover:bg-red-500/25 text-red-300 border-red-500/30 w-full"
                        >
                          <span>Consultar Autos no Jusbrasil</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 4. SEÇÃO: SHODAN & INFRAESTRUTURA DIGITAL */}
        {(selectedCategory === 'all' || selectedCategory === 'infra') && categorized.infra.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-cyan-400" />
              <h3 className="text-base font-bold text-zinc-100">Infraestrutura Digital (Shodan & DNS) ({categorized.infra.length})</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorized.infra.map((inf) => {
                const d = inf.data;
                return (
                  <div 
                    key={inf.id} 
                    className="neuro-card p-5 border border-zinc-700/80 flex flex-col justify-between hover:border-cyan-400 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-cyan-300 bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-800 select-all">
                          {d.domain}
                        </span>
                        <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/15 px-2 py-0.5 rounded-full border border-cyan-500/30 uppercase">
                          Shodan Host
                        </span>
                      </div>

                      <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                          <span className="text-zinc-500 block text-[9px] uppercase font-bold">Endereço IP</span>
                          <span className="font-mono text-cyan-300 font-bold text-xs truncate block">{d.ip}</span>
                        </div>
                        <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                          <span className="text-zinc-500 block text-[9px] uppercase font-bold">Provedor / ASN</span>
                          <span className="text-zinc-200 font-semibold text-xs truncate block">{d.geo?.org || d.geo?.asn || 'Cloud'}</span>
                        </div>
                      </div>

                      {d.mailProvider && (
                        <div className="mt-2.5 p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs">
                          <span className="text-zinc-500 block text-[9px] uppercase font-bold">E-mail Corporativo</span>
                          <span className="text-zinc-200 font-medium text-xs mt-0.5 block">{d.mailProvider}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center gap-2">
                      {d.shodanUrl && (
                        <a
                          href={d.shodanUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 neuro-btn bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border-cyan-500/30"
                        >
                          <span>Explorar no Shodan</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 5. SEÇÃO: OSINT INDUSTRIES & IDENTIDADES */}
        {(selectedCategory === 'all' || selectedCategory === 'identities') && categorized.identities.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-purple-400" />
              <h3 className="text-base font-bold text-zinc-100">Pegada Digital (OSINT Industries) ({categorized.identities.length})</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorized.identities.map((idNode) => {
                const d = idNode.data;
                const isEmail = d.type === 'email';
                return (
                  <div 
                    key={idNode.id} 
                    className="neuro-card p-5 border border-zinc-700/80 flex flex-col justify-between hover:border-purple-400 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-purple-300 bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-800 select-all truncate max-w-[200px]">
                          {d.target}
                        </span>
                        <span className="text-[10px] font-bold text-purple-400 bg-purple-500/15 px-2 py-0.5 rounded-full border border-purple-500/30 uppercase">
                          Footprint
                        </span>
                      </div>

                      <div className="mt-3.5 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-zinc-500 text-[10px] uppercase font-bold">Tipo:</span>
                          <span className="text-zinc-200 font-semibold">{d.footprint?.type || d.footprint?.regiao || 'Cadastrado'}</span>
                        </div>
                        {!isEmail && (
                          <div className="flex justify-between">
                            <span className="text-zinc-500 text-[10px] uppercase font-bold">Chave PIX Celular:</span>
                            <span className="text-emerald-400 font-bold">Compatível</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800/80">
                      <a
                        href={isEmail ? `https://haveibeenpwned.com/account/${encodeURIComponent(d.target)}` : `https://wa.me/55${d.target.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="neuro-btn bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border-purple-500/30 w-full"
                      >
                        <span>{isEmail ? 'Checar Vazamentos' : 'WhatsApp Direto'}</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 6. SEÇÃO: BENS, ATIVOS (RAB/VEÍCULOS) & CONTATOS */}
        {(selectedCategory === 'all' || selectedCategory === 'contacts') && categorized.contacts.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">✈️</span>
              <h3 className="text-base font-bold text-zinc-100">Bens Patrimoniais &amp; Contatos ({categorized.contacts.length})</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorized.contacts.map((cNode) => {
                const d = cNode.data;
                const isAircraft = d.type === 'aircraft';
                const isVehicle = d.type === 'vehicle';
                return (
                  <div 
                    key={cNode.id} 
                    className="neuro-card p-5 border border-white/10 flex flex-col justify-between hover:border-amber-400 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-amber-300 bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-800 select-all truncate max-w-[200px]">
                          {d.label || d.value}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                          isAircraft 
                            ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' 
                            : isVehicle 
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                        }`}>
                          {isAircraft ? 'RAB ANAC' : isVehicle ? 'RENAVAM' : 'Contato'}
                        </span>
                      </div>

                      <div className="mt-3.5 p-3 rounded-xl bg-zinc-900/80 border border-white/5 text-xs space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-zinc-500 text-[10px] uppercase font-bold">Identificação:</span>
                          <span className="text-zinc-200 font-semibold">{d.value}</span>
                        </div>
                        {d.proprietario && (
                          <div className="flex justify-between">
                            <span className="text-zinc-500 text-[10px] uppercase font-bold">Proprietário:</span>
                            <span className="text-amber-300 font-bold truncate max-w-[150px]">{d.proprietario}</span>
                          </div>
                        )}
                        {(d.valorEstimado || d.valorFipe) && (
                          <div className="flex justify-between">
                            <span className="text-zinc-500 text-[10px] uppercase font-bold">Valor Estimado:</span>
                            <span className="text-emerald-400 font-bold font-mono">{d.valorEstimado || d.valorFipe}</span>
                          </div>
                        )}
                        {(d.gravame || d.restricoes) && (
                          <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold">
                            Restrição: {d.gravame || d.restricoes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
