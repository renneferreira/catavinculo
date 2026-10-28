import React, { useState } from 'react';
import { 
  BarChart3, 
  ShieldCheck, 
  ShieldAlert, 
  Scale, 
  Server, 
  Users, 
  Building2, 
  TrendingUp, 
  X,
  ExternalLink,
  PieChart,
  Activity,
  Zap,
  Landmark,
  Layers,
  Compass,
  Globe2
} from 'lucide-react';

export function AnalyticsCharts({ isOpen, onClose, nodes = [] }) {
  const [activeTab, setActiveTab] = useState('radar'); // 'radar' | 'patrimonio' | 'judicial'

  if (!isOpen) return null;

  const companies = nodes.filter(n => n.type === 'company');
  const partners = nodes.filter(n => n.type === 'person');
  const lawsuits = nodes.filter(n => n.type === 'lawsuit');
  const infraNodes = nodes.filter(n => n.type === 'infrastructure');
  const identityNodes = nodes.filter(n => n.type === 'identity');

  // Cálculo de pontuação média de compliance
  const scores = companies.map(c => c.data?.complianceScore?.score).filter(s => typeof s === 'number');
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 78;

  // Dimensões do Radar Multidimensional (0 a 100)
  const radarMetrics = [
    { label: 'Confusão Patrimonial', value: companies.length > 1 ? 65 : 20, icon: Building2 },
    { label: 'Risco Jurídico (CNJ)', value: Math.min(100, lawsuits.length * 25 + 15), icon: Scale },
    { label: 'Densidade Societária', value: Math.min(100, partners.length * 20 + 20), icon: Users },
    { label: 'Superfície Digital (Shodan)', value: Math.min(100, infraNodes.length * 30 + 10), icon: Server },
    { label: 'Pegada OSINT (E-mail/Tel)', value: Math.min(100, identityNodes.length * 25 + 15), icon: Globe2 },
    { label: 'Solvência Cadastral', value: avgScore, icon: ShieldCheck }
  ];

  // Radar SVG Math
  const radarCenter = 120;
  const radarRadius = 85;
  const numAxes = radarMetrics.length;
  const angleStep = (2 * Math.PI) / numAxes;

  // Radar Polygon Points
  const radarPoints = radarMetrics.map((m, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (m.value / 100) * radarRadius;
    const x = radarCenter + r * Math.cos(angle);
    const y = radarCenter + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  // Gauge SVG parameters
  const gaugeRadius = 56;
  const circumference = 2 * Math.PI * gaugeRadius;
  const strokeDashoffset = circumference - (avgScore / 100) * circumference;
  const scoreColor = avgScore >= 70 ? '#10B981' : avgScore >= 45 ? '#F59E0B' : '#EF4444';

  // Capital Social Total Mapeado
  const totalCapital = companies.reduce((acc, c) => acc + (c.data?.capitalSocial || 0), 0);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="analytics-modal-title"
    >
      <div className="w-full max-w-4xl rounded-3xl darkglass-panel border border-white/10 p-6 md:p-8 text-white shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Ambient Glows */}
        <div className="absolute -top-32 -left-32 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-teal-500/20 border border-white/15 flex items-center justify-center text-emerald-400 shadow-lg">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="analytics-modal-title" className="text-xl font-black text-white tracking-tight">
                  Painel de Inteligência &amp; Riscos OSINT
                </h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  CataVínculo Intelligence Suite
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Métricas multivariadas de confusão patrimonial, solvência e passivo processual
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
            aria-label="Fechar painel de métricas"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Abas Superiores de Gráficos */}
        <div className="mt-5 flex items-center gap-2 border-b border-white/10 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('radar')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'radar'
                ? 'bg-emerald-400 text-black shadow-md shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Radar Multidimensional</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('patrimonio')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'patrimonio'
                ? 'bg-emerald-400 text-black shadow-md shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Landmark className="h-3.5 w-3.5" />
            <span>Patrimônio &amp; Holdings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('judicial')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'judicial'
                ? 'bg-emerald-400 text-black shadow-md shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            <span>Passivo DataJud</span>
          </button>
        </div>

        {/* Aba 1: Radar Multidimensional & Termômetro Neon */}
        {activeTab === 'radar' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Gráfico 1: Radar Spider Chart SVG */}
            <div className="neuro-card p-6 border border-white/10 bg-zinc-900/60 flex flex-col items-center justify-between">
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Matriz de Vetores de Risco
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">6 Eixos de Análise</span>
              </div>

              {/* Spider Chart SVG */}
              <div className="relative my-2">
                <svg width="240" height="240" className="overflow-visible">
                  {/* Círculos concêntricos de referência */}
                  {[0.25, 0.5, 0.75, 1].map((scale, idx) => (
                    <circle
                      key={idx}
                      cx={radarCenter}
                      cy={radarCenter}
                      r={radarRadius * scale}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeDasharray={scale < 1 ? '3 3' : 'none'}
                    />
                  ))}

                  {/* Eixos radiais */}
                  {radarMetrics.map((_, i) => {
                    const angle = i * angleStep - Math.PI / 2;
                    const x = radarCenter + radarRadius * Math.cos(angle);
                    const y = radarCenter + radarRadius * Math.sin(angle);
                    return (
                      <line
                        key={i}
                        x1={radarCenter}
                        y1={radarCenter}
                        x2={x}
                        y2={y}
                        stroke="rgba(255, 255, 255, 0.12)"
                      />
                    );
                  })}

                  {/* Área preenchida do polígono de risco */}
                  <polygon
                    points={radarPoints}
                    fill="rgba(16, 185, 129, 0.22)"
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    className="transition-all duration-700 ease-out drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                  />

                  {/* Vértices destacados */}
                  {radarMetrics.map((m, i) => {
                    const angle = i * angleStep - Math.PI / 2;
                    const r = (m.value / 100) * radarRadius;
                    const x = radarCenter + r * Math.cos(angle);
                    const y = radarCenter + r * Math.sin(angle);
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#10B981"
                        stroke="#070709"
                        strokeWidth="2"
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Legendas dos 6 Eixos */}
              <div className="w-full grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-white/10">
                {radarMetrics.map((m, idx) => {
                  const IconComp = m.icon;
                  return (
                    <div key={idx} className="flex items-center justify-between text-zinc-300">
                      <span className="truncate pr-1 flex items-center gap-1.5">
                        <IconComp className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>{m.label}:</span>
                      </span>
                      <strong className="font-mono text-emerald-300 tabular-nums">{m.value}%</strong>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gráfico 2: Gauge Circular Neon de Integridade */}
            <div className="neuro-card p-6 border border-white/10 bg-zinc-900/60 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                    Termômetro de Solvência
                  </span>
                  <h3 className="text-sm font-bold text-white mt-0.5">Índice Geral de Integridade</h3>
                </div>
                <span 
                  className="text-xs font-bold px-2.5 py-1 rounded-full border"
                  style={{ 
                    backgroundColor: `${scoreColor}15`, 
                    borderColor: `${scoreColor}30`, 
                    color: scoreColor 
                  }}
                >
                  {avgScore >= 70 ? 'Baixo Risco' : avgScore >= 45 ? 'Atenção / Médio' : 'Alto Risco'}
                </span>
              </div>

              <div className="my-6 flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                  <svg width="160" height="160" className="-rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r={gaugeRadius}
                      fill="transparent"
                      stroke="#1e1e24"
                      strokeWidth="12"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r={gaugeRadius}
                      fill="transparent"
                      stroke={scoreColor}
                      strokeWidth="12"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black text-white font-mono tabular-nums">{avgScore}</span>
                    <span className="text-[10px] uppercase font-bold text-zinc-400">Score OSINT</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-white/10 pt-3">
                <div className="flex justify-between text-zinc-300">
                  <span>Conexões Societárias Ativas:</span>
                  <span className="font-bold text-emerald-400 font-mono">{companies.length} entidades</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Ações Cíveis / Trabalhistas:</span>
                  <span className="font-bold text-red-400 font-mono">{lawsuits.length} em tramitação</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Superfície Perimetral:</span>
                  <span className="font-bold text-cyan-400 font-mono">{infraNodes.length} IPs/Portas</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Aba 2: Patrimônio & Holdings */}
        {activeTab === 'patrimonio' && (
          <div className="mt-6 space-y-4">
            <div className="neuro-card p-6 border border-white/10 bg-zinc-900/60">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                    Capital Social Total Mapeado
                  </span>
                  <div className="text-2xl font-black font-mono text-white mt-1 tabular-nums">
                    R$ {totalCapital.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                  {companies.length} Holdings / Empresas
                </span>
              </div>

              {/* Lista em barras do Capital Social de cada Empresa */}
              <div className="mt-4 space-y-3">
                {companies.map((c, idx) => {
                  const cap = c.data?.capitalSocial || 0;
                  const pct = totalCapital > 0 ? (cap / totalCapital) * 100 : 0;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-zinc-200 truncate pr-2">
                          {c.data?.razaoSocial || 'Empresa'}
                        </span>
                        <span className="font-mono text-emerald-400 shrink-0 tabular-nums">
                          R$ {cap.toLocaleString('pt-BR')} ({pct.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(5, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Aba 3: Passivo DataJud */}
        {activeTab === 'judicial' && (
          <div className="mt-6 space-y-4">
            <div className="neuro-card p-6 border border-white/10 bg-zinc-900/60">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">
                    Passivo Litigioso em Aberto
                  </span>
                  <div className="text-2xl font-black font-mono text-white mt-1 tabular-nums">
                    {lawsuits.length} Processos Judiciais
                  </div>
                </div>
                <span className="px-3 py-1 rounded-xl bg-red-400/10 border border-red-400/30 text-red-300 text-xs font-bold">
                  DataJud CNJ
                </span>
              </div>

              {lawsuits.length > 0 ? (
                <div className="mt-4 divide-y divide-white/5 space-y-2">
                  {lawsuits.map((l, idx) => (
                    <div key={idx} className="pt-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-zinc-200 block">
                          {l.data?.numeroProcesso || l.data?.label}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          {l.data?.tribunal || 'TJSP'} &middot; {l.data?.vara || 'Vara Cível'}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-lg bg-red-500/10 text-red-400 text-[11px] font-bold border border-red-500/20">
                        {l.data?.risco || 'ALTO RISCO'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-zinc-400">
                  Nenhum processo restritivo encontrado nesta amostragem.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rodapé */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
          <span>Dados compilados das bases oficiais CNJ, Receita Federal e Shodan.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold transition-all focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
