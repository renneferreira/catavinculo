import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  UserCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  ShieldAlert, 
  Copy, 
  Check, 
  ExternalLink, 
  ChevronRight, 
  GitFork, 
  FileText, 
  BadgeCheck, 
  Scale, 
  Globe, 
  Server, 
  Zap, 
  AlertTriangle 
} from 'lucide-react';
import { generateOSINTLinks } from '../services/osint';

export function DetailDrawer({ isOpen, onClose, data, onExpandSocio, onExpandLawsuits, onExpandInfra, onOpenTransforms }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('geral');

  if (!isOpen || !data) return null;

  const isCompany = data.type === 'company' || !!data.cnpj;
  const isPerson = data.type === 'person' || (!isCompany && !!data.nome);
  const lawsuits = data.lawsuits || [];
  const complianceScore = data.complianceScore;
  const infra = data.infra;

  const osintLinks = generateOSINTLinks(
    data.cnpj || data.cpfCnpj,
    data.razaoSocial || data.nome,
    isCompany ? 'company' : 'person'
  );

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-[#121217] border-l border-white/10 text-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-zinc-800/80 bg-[#16161c]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl border ${
                  isCompany 
                    ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' 
                    : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                }`}>
                  {isCompany ? <Building2 className="h-6 w-6" /> : <UserCheck className="h-6 w-6" />}
                </div>

                <div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border ${
                    isCompany 
                      ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' 
                      : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {isCompany ? 'Ficha Empresarial' : 'Ficha do Sócio'}
                  </span>
                  <h3 className="text-lg font-bold text-zinc-100 mt-1 leading-snug font-display tracking-tight">
                    {data.razaoSocial || data.nome}
                  </h3>
                  {data.nomeFantasia && (
                    <p className="text-xs text-zinc-400 italic">"{data.nomeFantasia}"</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => onOpenTransforms?.({ type: isCompany ? 'company' : 'person', data })}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Abrir Transformações de Inteligência"
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Transforms</span>
                </button>

                <button 
                  onClick={onClose}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Identificador rápido & Situação */}
            <div className="mt-4 flex flex-wrap items-center gap-3 pt-3 border-t border-zinc-800/60 text-xs">
              <div className="flex items-center gap-2 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 uppercase text-[10px] font-semibold">
                  {isCompany ? 'CNPJ' : 'CPF'}
                </span>
                <span className="font-mono text-zinc-200">
                  {data.cnpj || data.cpfCnpj || 'Não informado'}
                </span>
                <button
                  onClick={() => handleCopy(data.cnpj || data.cpfCnpj || '')}
                  className="text-zinc-500 hover:text-white ml-1"
                  title="Copiar"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>

              {data.situacao && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
                  <BadgeCheck className="h-4 w-4" />
                  <span>Situação: {data.situacao}</span>
                </div>
              )}

              {complianceScore && (
                <div 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold"
                  style={{
                    backgroundColor: `${complianceScore.color}15`,
                    borderColor: `${complianceScore.color}35`,
                    color: complianceScore.color
                  }}
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{complianceScore.label} ({complianceScore.score}/100)</span>
                </div>
              )}
            </div>

            {/* Tabs de navegação */}
            <div className="flex items-center gap-2 mt-5 border-b border-zinc-800 -mb-6 pb-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('geral')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  activeTab === 'geral' 
                    ? 'bg-amber-400 text-black font-semibold' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                Visão Geral
              </button>

              {isCompany && (
                <button
                  onClick={() => setActiveTab('socios')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
                    activeTab === 'socios' 
                      ? 'bg-amber-400 text-black font-semibold' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <span>Sócios (QSA)</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    activeTab === 'socios' ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-300'
                  }`}>
                    {data.partners?.length || 0}
                  </span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('processos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'processos' 
                    ? 'bg-amber-400 text-black font-semibold' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <span>Ações Judiciais</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  lawsuits.length > 0 ? 'bg-red-500/20 text-red-400 font-bold' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {lawsuits.length}
                </span>
              </button>

              {isCompany && (
                <button
                  onClick={() => setActiveTab('infra')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
                    activeTab === 'infra' 
                      ? 'bg-amber-400 text-black font-semibold' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Server className="h-3 w-3" />
                  <span>Infraestrutura (Shodan)</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('osint')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'osint' 
                    ? 'bg-amber-400 text-black font-semibold' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Globe className="h-3 w-3" />
                <span>Fontes OSINT</span>
              </button>

              {isCompany && (
                <button
                  onClick={() => setActiveTab('endereco')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                    activeTab === 'endereco' 
                      ? 'bg-amber-400 text-black font-semibold' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  Localização
                </button>
              )}
            </div>
          </div>

          {/* Body Conteúdo */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* TAB GERAL */}
            {activeTab === 'geral' && (
              <div className="space-y-6">
                {isCompany ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80">
                        <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Capital Social</span>
                        <span className="text-sm font-bold text-amber-400 font-mono mt-0.5 block">
                          {data.capitalSocialFormatado || 'R$ 0,00'}
                        </span>
                      </div>

                      <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80">
                        <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Abertura</span>
                        <span className="text-sm font-medium text-zinc-200 mt-0.5 block">
                          {data.dataInicio || 'Não informada'}
                        </span>
                      </div>

                      <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80">
                        <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Porte</span>
                        <span className="text-sm font-medium text-zinc-200 mt-0.5 block">
                          {data.porte || 'DEMAIS'}
                        </span>
                      </div>

                      <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80 sm:col-span-2">
                        <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Natureza Jurídica</span>
                        <span className="text-xs font-medium text-zinc-200 mt-0.5 block line-clamp-1">
                          {data.naturezaJuridica || 'Não informada'}
                        </span>
                      </div>

                      <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80">
                        <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Simples Nacional</span>
                        <span className="text-xs font-medium text-zinc-200 mt-0.5 block">
                          {data.simples?.optante ? 'Optante' : 'Não Optante'}
                        </span>
                      </div>
                    </div>

                    {/* Atividade Principal */}
                    {data.cnae && (
                      <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80">
                        <span className="text-[10px] uppercase font-semibold text-zinc-500 block">
                          Atividade Econômica Principal (CNAE)
                        </span>
                        <p className="text-xs font-mono text-amber-400 mt-1 font-semibold">
                          {data.cnae.codigo}
                        </p>
                        <p className="text-sm text-zinc-200 mt-0.5">
                          {data.cnae.descricao}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  /* Pessoa Física Geral */
                  <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 space-y-3">
                    <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Dados do Sócio</span>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-zinc-500 block text-[10px] uppercase">Qualificação</span>
                        <span className="text-emerald-300 font-semibold">{data.qualificacao || 'Sócio'}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px] uppercase">Faixa Etária</span>
                        <span className="text-zinc-200">{data.faixaEtaria || 'Não informada'}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px] uppercase">Entrada na Sociedade</span>
                        <span className="text-zinc-200">{data.dataEntrada || 'Não informada'}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px] uppercase">País</span>
                        <span className="text-zinc-200">{data.pais || 'Brasil'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Score de Compliance */}
                {complianceScore && (
                  <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Diagnóstico de Compliance & Risco
                      </span>
                      <span 
                        className="text-xs font-bold px-2 py-0.5 rounded border"
                        style={{
                          backgroundColor: `${complianceScore.color}15`,
                          borderColor: `${complianceScore.color}35`,
                          color: complianceScore.color
                        }}
                      >
                        {complianceScore.label}
                      </span>
                    </div>

                    <ul className="space-y-1.5 mt-2">
                      {complianceScore.reasons.map((r, i) => (
                        <li key={i} className="text-xs text-zinc-300 flex items-start gap-2">
                          <span className="text-amber-400 mt-0.5">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* TAB SÓCIOS */}
            {isCompany && activeTab === 'socios' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-medium">
                    {data.partners?.length || 0} membro(s) registrados no QSA da Receita Federal
                  </span>
                </div>

                {data.partners?.map((socio, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                          <UserCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-zinc-100">{socio.nome}</h4>
                          <p className="text-xs text-emerald-400 font-medium mt-0.5">{socio.qualificacao}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => onExpandSocio?.(socio)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-medium border border-emerald-500/30 transition-colors"
                        title="Rastrear outras empresas e vínculos deste sócio"
                      >
                        <GitFork className="h-3.5 w-3.5" />
                        <span>Investigar</span>
                      </button>
                    </div>

                    <div className="mt-3 pt-3 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-zinc-400">
                      <div>
                        <span className="text-zinc-500 block text-[9px] uppercase">CPF / CNPJ</span>
                        <span className="font-mono text-zinc-300">{socio.cpfCnpj || '***'}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[9px] uppercase">Faixa Etária</span>
                        <span className="text-zinc-300">{socio.faixaEtaria}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[9px] uppercase">Data de Entrada</span>
                        <span className="text-zinc-300">{socio.dataEntrada}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB PROCESSOS & AÇÕES JUDICIAIS */}
            {activeTab === 'processos' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-medium">
                    Ações judiciais identificadas no Poder Judiciário (DataJud / Tribunais)
                  </span>
                  {lawsuits.length > 0 && onExpandLawsuits && (
                    <button
                      onClick={() => onExpandLawsuits(data)}
                      className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold border border-red-500/40 transition-colors flex items-center gap-1.5"
                    >
                      <Scale className="h-3.5 w-3.5" />
                      <span>Inserir no Grafo</span>
                    </button>
                  )}
                </div>

                {lawsuits.length === 0 ? (
                  <div className="p-8 text-center bg-zinc-900/40 rounded-xl border border-zinc-800/60">
                    <Scale className="h-8 w-8 text-zinc-500 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-semibold text-zinc-300">Nenhum processo crítico encontrado</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Não foram identificadas execuções fiscais ou pedidos de falência ativos para este documento nos tribunais consultados.
                    </p>
                  </div>
                ) : (
                  lawsuits.map((proc, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-lg border ${
                            proc.risco === 'ALTO' 
                              ? 'bg-red-500/15 border-red-500/30 text-red-400' 
                              : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                          }`}>
                            <Scale className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-zinc-200 select-all">
                                {proc.numero}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-semibold uppercase">
                                {proc.tribunal}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-300 font-medium mt-0.5">{proc.classe}</p>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          proc.risco === 'ALTO'
                            ? 'bg-red-500/15 text-red-400 border-red-500/30'
                            : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        }`}>
                          {proc.risco === 'ALTO' ? 'Alto Risco' : 'Ação Ativa'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-zinc-800 text-zinc-400">
                        <div>
                          <span className="text-zinc-500 block text-[9px] uppercase">Vara / Órgão</span>
                          <span className="text-zinc-300">{proc.orgao}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[9px] uppercase">Posição / Polo</span>
                          <span className="text-zinc-300">{proc.polo}</span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[11px] text-zinc-500">
                          Distribuído em {proc.dataAjuizamento}
                        </span>
                        {proc.linkJusbrasil && (
                          <a
                            href={proc.linkJusbrasil}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-red-400 hover:text-red-300 font-semibold text-xs"
                          >
                            <span>Consultar Autos no Jusbrasil</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB INFRAESTRUTURA (SHODAN) */}
            {isCompany && activeTab === 'infra' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-medium">
                    Infraestrutura Digital & Ativos de Rede (Shodan / DNS)
                  </span>
                  {onExpandInfra && (
                    <button
                      onClick={() => onExpandInfra(data)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold border border-cyan-500/40 transition-colors flex items-center gap-1.5"
                    >
                      <Server className="h-3.5 w-3.5" />
                      <span>Inserir no Grafo</span>
                    </button>
                  )}
                </div>

                {infra ? (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Domínio Principal</span>
                          <h4 className="text-sm font-mono font-bold text-cyan-400">{infra.domain}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Endereço IP</span>
                          <span className="font-mono text-xs font-bold text-zinc-200">{infra.ip}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-zinc-800 text-zinc-400">
                        <div>
                          <span className="text-zinc-500 block text-[9px] uppercase">Provedor / ASN</span>
                          <span className="text-zinc-200 font-medium">{infra.geo?.org || infra.geo?.asn}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[9px] uppercase">E-mail Corporativo</span>
                          <span className="text-cyan-300 font-medium">{infra.mailProvider}</span>
                        </div>
                      </div>
                    </div>

                    {/* Subdomínios expostos */}
                    {infra.subdomains?.length > 0 && (
                      <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                        <span className="text-xs font-bold text-zinc-300 block uppercase tracking-wider">
                          Subdomínios Identificados ({infra.subdomains.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {infra.subdomains.map((sub, i) => (
                            <span key={i} className="text-xs font-mono px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700">
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <a
                      href={infra.shodanUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-colors"
                    >
                      <span>Abrir Análise de Portas e Vulnerabilidades no Shodan</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ) : (
                  <div className="p-6 text-center bg-zinc-900/40 rounded-xl border border-zinc-800/60">
                    <Server className="h-8 w-8 text-cyan-500 mx-auto mb-2 opacity-50" />
                    <p className="text-xs text-zinc-400">
                      Clique no botão "Inserir no Grafo" ou rode o transform correspondente para resolver a infraestrutura digital desta empresa.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB FONTES OSINT */}
            {activeTab === 'osint' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Bases de Consulta e Ferramentas OSINT
                  </h4>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Acesse diretamente as bases oficiais e tribunais sem intermediações:
                  </p>
                </div>

                <div className="space-y-2.5">
                  {osintLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 flex items-center justify-between transition-all group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-100 group-hover:text-amber-400 transition-colors">
                            {link.label}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 uppercase font-semibold">
                            {link.category}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">{link.description}</p>
                      </div>

                      <ExternalLink className="h-4 w-4 text-zinc-500 group-hover:text-amber-400 shrink-0 ml-3 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* TAB LOCALIZAÇÃO */}
            {isCompany && activeTab === 'endereco' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <MapPin className="h-5 w-5 text-amber-400 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100">Endereço Cadastrado</h4>
                      <p className="text-xs text-zinc-400">{data.endereco?.completo}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-800 text-xs">
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase">Município / UF</span>
                      <span className="text-zinc-200 font-medium">{data.endereco?.municipio} - {data.endereco?.uf}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase">CEP</span>
                      <span className="font-mono text-zinc-200">{data.endereco?.cep}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase">Bairro</span>
                      <span className="text-zinc-200">{data.endereco?.bairro}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase">Logradouro</span>
                      <span className="text-zinc-200">{data.endereco?.logradouro}, {data.endereco?.numero}</span>
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.endereco?.completo || '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 text-black font-semibold text-xs hover:bg-amber-300 transition-colors w-full justify-center"
                  >
                    <span>Abrir no Google Maps & Street View</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-800 bg-[#16161c] flex items-center justify-between">
            <span className="text-xs text-zinc-500">
              CataVínculo — Inteligência Societária, Shodan & OSINT
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
            >
              Fechar Painel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
