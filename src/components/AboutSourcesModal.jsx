import React from 'react';
import { 
  X, 
  Database, 
  Scale, 
  Building2, 
  Plane, 
  Car, 
  Server, 
  ShieldCheck, 
  ExternalLink,
  Cpu,
  Lock,
  Globe2
} from 'lucide-react';
import { CataVinculoLogo } from './CataVinculoLogo';

export function AboutSourcesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const sources = [
    {
      title: 'Receita Federal do Brasil (RFB)',
      badge: 'Dados Cadastrais & QSA',
      icon: Building2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      description: 'Consulta da base pública nacional do CNPJ, dados cadastrais de matriz e filiais, endereço, capital social, atividade econômica (CNAE) e Quadro de Sócios e Administradores (QSA).'
    },
    {
      title: 'DataJud — Conselho Nacional de Justiça (CNJ)',
      badge: 'Processos & Litígios',
      icon: Scale,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
      description: 'Varredura pública de ações cíveis, criminais, execuções fiscais e trabalhistas distribuídas nos 91 tribunais brasileiros, mapeando passivos judiciais e litígios associados a pessoas e empresas.'
    },
    {
      title: 'ANAC — Registro Aeronáutico Brasileiro (RAB)',
      badge: 'Ativos Aéreos',
      icon: Plane,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      description: 'Identificação de propriedade de aeronaves civis registradas no Brasil, incluindo matrícula (prefixo), fabricante, operador aeronáutico, situação de aeronavegabilidade e gravames fiduciários.'
    },
    {
      title: 'Senatran / RENAVAM',
      badge: 'Ativos Veiculares',
      icon: Car,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      description: 'Rastreamento de bens automotores, marca/modelo, ano de fabricação, restrições judiciais (Renajud), alienações fiduciárias e cotação oficial na Tabela FIPE.'
    },
    {
      title: 'Shodan & Inteligência de Rede',
      badge: 'Infraestrutura Digital',
      icon: Server,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      description: 'Mapeamento de servidores, domínios, zonas de DNS, provedores de correio eletrônico (MX), portas abertas e vulnerabilidades associadas à infraestrutura corporativa do alvo investigado.'
    },
    {
      title: 'Gravatar, Telecom & Pegada Digital',
      badge: 'OSINT de Contato',
      icon: Globe2,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      description: 'Verificação criptográfica de e-mails em bases públicas via hash SHA-256 (Gravatar), checagem de operadoras de telefonia e validação de canais de mensageria.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-[#080a10] border border-emerald-500/20 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#090c14]/90">
          <div className="flex items-center gap-3">
            <CataVinculoLogo size="sm" />
            <div>
              <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <span>Fontes de Consulta &amp; Legalidade</span>
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Investigação e Inteligência em Fontes Abertas (OSINT)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-zinc-300">
          
          {/* Card de Propósito e Metodologia */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-2">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              <span>Metodologia OSINT Relacional</span>
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              O <strong>CataVínculo</strong> é uma plataforma de inteligência que compila, correlaciona e visualiza graficamente dados obtidos exclusivamente de bases governamentais e fontes públicas acessíveis via internet, sem invasão de privacidade ou interceptação de dados sigilosos.
            </p>
          </div>

          {/* Grid de Fontes */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-400">
              Fontes Públicas Integradas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sources.map((src, idx) => {
                const IconComponent = src.icon;
                return (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-[#0c0f18] border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-xl ${src.bgColor} border ${src.borderColor}`}>
                            <IconComponent className={`h-4 w-4 ${src.color}`} />
                          </div>
                          <span className="font-semibold text-xs text-zinc-100 font-sans">
                            {src.title}
                          </span>
                        </div>
                      </div>

                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white/5 text-zinc-400 border border-white/5 mb-2">
                        {src.badge}
                      </span>

                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                        {src.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seção LGPD & Conformidade */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Conformidade Legal &amp; LGPD (Lei 13.709/2018)</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              As operações de consulta realizadas pelo CataVínculo amparam-se no <strong>Artigo 7º, § 4º da LGPD</strong>, que autoriza o tratamento de dados tornados manifestamente públicos pelo titular ou por força de lei (como os registros da Junta Comercial, Receita Federal e decisões públicas dos Tribunais de Justiça), sendo destinados a fins legítimos de conformidade, due diligence e apoio à tutela jurisdicional.
            </p>
          </div>

        </div>

        {/* Rodapé do Modal */}
        <div className="flex items-center justify-between p-4 border-t border-white/10 bg-[#090c14] text-xs font-mono text-zinc-400">
          <span>CataVínculo // Inteligência Forense</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
