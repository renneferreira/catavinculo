import React from 'react';
import { 
  Network, 
  Download, 
  Plus, 
  RotateCcw, 
  LayoutGrid, 
  BarChart3, 
  FileText, 
  Info
} from 'lucide-react';
import { CataVinculoLogo } from './CataVinculoLogo';

export function Header({
  layoutType,
  onChangeLayout,
  onResetCase,
  onOpenExport,
  onOpenAddNode,
  onOpenAnalytics,
  onOpenDossier,
  onOpenAbout,
  onFitView,
  nodeCounts = { companies: 0, partners: 0, lawsuits: 0, infrastructure: 0, identity: 0, edges: 0 },
  activeFilters,
  onToggleFilter,
  viewMode = 'graph',
  onChangeViewMode,
  hasActiveCase = false
}) {
  return (
    <header className="w-full bg-[#04060a]/95 border-b border-white/10 backdrop-blur-2xl z-40 select-none shadow-[0_4px_30px_rgba(0,0,0,0.8)] shrink-0">
      
      {/* LINHA 1: Brand Oficial & Telemetria do Caso */}
      <div className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-white/5">
        
        {/* Brand & Logo Padronizado do CataVínculo */}
        <div className="flex items-center gap-3">
          <CataVinculoLogo 
            size="sm" 
            showText={true} 
            subtitle="Investigação e Inteligência em Fontes Abertas" 
          />
        </div>

        {/* Telemetria Compacta do Caso no Mobile */}
        {hasActiveCase && (
          <div className="flex md:hidden items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-mono text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#00FF9D]" />
            <span>{(nodeCounts.companies || 0) + (nodeCounts.partners || 0)} Alvos</span>
          </div>
        )}

        {/* Telemetria do Caso Ativo (Visível e Alargado no Centro em Desktop) */}
        {hasActiveCase && (
          <div className="hidden md:flex items-center gap-3 bg-[#080b12] px-4 py-2 rounded-2xl border border-white/10 text-xs shadow-inner">
            <button
              type="button"
              onClick={() => onToggleFilter?.('company')}
              className={`flex items-center gap-2 px-2.5 py-1 rounded-xl transition-all ${
                activeFilters?.company === false ? 'opacity-35 hover:opacity-70' : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/25'
              } focus-visible:ring-1 focus-visible:ring-cyan-400`}
              title="Filtrar visibilidade de empresas"
            >
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00F0FF]" />
              <span className="font-mono text-zinc-300">Empresas:</span>
              <span className="font-mono font-bold text-cyan-300 tabular-nums">{nodeCounts.companies}</span>
            </button>

            <div className="h-4 w-px bg-white/10" />

            <button
              type="button"
              onClick={() => onToggleFilter?.('person')}
              className={`flex items-center gap-2 px-2.5 py-1 rounded-xl transition-all ${
                activeFilters?.person === false ? 'opacity-35 hover:opacity-70' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25'
              } focus-visible:ring-1 focus-visible:ring-emerald-400`}
              title="Filtrar visibilidade de sócios"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#00FF9D]" />
              <span className="font-mono text-zinc-300">Sócios:</span>
              <span className="font-mono font-bold text-emerald-300 tabular-nums">{nodeCounts.partners}</span>
            </button>

            <div className="h-4 w-px bg-white/10" />

            <button
              type="button"
              onClick={() => onToggleFilter?.('lawsuit')}
              className={`flex items-center gap-2 px-2.5 py-1 rounded-xl transition-all ${
                activeFilters?.lawsuit === false ? 'opacity-35 hover:opacity-70' : 'bg-rose-500/10 text-rose-300 border border-rose-500/25'
              } focus-visible:ring-1 focus-visible:ring-rose-400`}
              title="Filtrar visibilidade de ações no DataJud"
            >
              <span className="h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_8px_#FF3366]" />
              <span className="font-mono text-zinc-300">DataJud:</span>
              <span className="font-mono font-bold text-rose-400 tabular-nums">{nodeCounts.lawsuits || 0}</span>
            </button>

            <div className="h-4 w-px bg-white/10" />

            <div className="flex items-center gap-2 px-2.5 py-1 text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="font-mono text-zinc-400">Vínculos:</span>
              <span className="font-mono font-bold text-zinc-100 tabular-nums">{nodeCounts.edges}</span>
            </div>
          </div>
        )}

        {/* Controles Globais à Direita */}
        <div className="flex items-center gap-2.5">
          {hasActiveCase ? (
            <>
              {/* Botão Nova Busca Alargado */}
              <button
                type="button"
                onClick={onResetCase}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/35 text-xs font-mono font-bold transition-all shadow-[0_0_12px_rgba(0,255,157,0.15)] focus-visible:ring-2 focus-visible:ring-emerald-400"
                title="Voltar à Central de Busca do CataVínculo"
              >
                <RotateCcw className="h-4 w-4" />
                <span>+ Nova Investigação</span>
              </button>

              {/* Botão Limpar */}
              <button
                type="button"
                onClick={onResetCase}
                className="p-2.5 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 transition-all focus-visible:ring-2 focus-visible:ring-rose-400"
                title="Limpar Caso e Resetar Grafo"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              {/* Botão Sobre as Fontes Alargado na Tela Inicial */}
              <button
                type="button"
                onClick={onOpenAbout}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 text-zinc-200 hover:text-white text-xs font-mono font-semibold transition-all focus-visible:ring-2 focus-visible:ring-emerald-400"
                title="Informações sobre as fontes públicas e legalidade"
              >
                <div className="h-6 w-6 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400">
                  <Info className="h-3.5 w-3.5" />
                </div>
                <span>Bases de Dados &amp; LGPD</span>
              </button>

              {/* Botão Adicionar Pista Manual Alargado na Tela Inicial */}
              <button
                type="button"
                onClick={onOpenAddNode}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-300 text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(0,255,157,0.15)] focus-visible:ring-2 focus-visible:ring-emerald-400"
                title="Adicionar nova entidade manualmente"
              >
                <div className="h-6 w-6 rounded-lg bg-emerald-400 text-black flex items-center justify-center font-bold">
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                </div>
                <span>+ Inserir Pista</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* LINHA 2: Barra de Ações & Ferramentas Forenses (Exibida quando há caso ativo) */}
      {hasActiveCase && (
        <div className="h-14 px-4 md:px-6 bg-[#070910]/95 border-b border-white/10 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          
          {/* Card 1: Alternador de Visualização Alargado (Grafo ⟷ Cards) */}
          <div className="flex items-center bg-[#0d1017] p-1 rounded-2xl border border-white/10 text-xs shadow-md shrink-0">
            <button
              type="button"
              onClick={() => onChangeViewMode?.('graph')}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                viewMode === 'graph' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20' 
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Visualização em Grafo Relacional (Rede de Vínculos)"
            >
              <Network className="h-4 w-4" />
              <span>Grafo Relacional</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeViewMode?.('cards')}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                viewMode === 'cards' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20' 
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Visualização em Cards Estruturados"
            >
              <LayoutGrid className="h-4 w-4" />
              <span>Cards Estruturados</span>
            </button>
          </div>

          {/* Card 2: Ferramentas Forenses e Analíticas Alargadas */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Dossiê Forense */}
            <button
              type="button"
              onClick={onOpenDossier}
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 text-zinc-200 hover:text-white text-xs font-mono font-medium transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-400"
              title="Gerar Dossiê Investigativo Judicial"
            >
              <div className="h-6 w-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FileText className="h-3.5 w-3.5" />
              </div>
              <span className="font-semibold">Dossiê Judicial</span>
            </button>

            {/* Métricas e Estatísticas */}
            <button
              type="button"
              onClick={onOpenAnalytics}
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 text-zinc-200 hover:text-white text-xs font-mono font-medium transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-400"
              title="Ver Métricas de Compliance e Gráficos"
            >
              <div className="h-6 w-6 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <BarChart3 className="h-3.5 w-3.5" />
              </div>
              <span className="font-semibold">Métricas OSINT</span>
            </button>

            {/* Sobre as Fontes */}
            <button
              type="button"
              onClick={onOpenAbout}
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 text-zinc-200 hover:text-white text-xs font-mono font-medium transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-400"
              title="Informações sobre as fontes públicas e legalidade"
            >
              <div className="h-6 w-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
                <Info className="h-3.5 w-3.5" />
              </div>
              <span className="font-semibold">Fontes &amp; LGPD</span>
            </button>
          </div>

          {/* Card 3: Inserção & Exportação Primária */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Adicionar Pista Manual */}
            <button
              type="button"
              onClick={onOpenAddNode}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 text-zinc-200 hover:text-white text-xs font-mono font-medium transition-all focus-visible:ring-2 focus-visible:ring-emerald-400"
              title="Adicionar nova entidade manualmente"
            >
              <Plus className="h-4 w-4 text-emerald-400" />
              <span>+ Nova Pista</span>
            </button>

            {/* Botão Primário: Exportar Dossiê */}
            <button
              type="button"
              onClick={onOpenExport}
              className="flex items-center gap-2.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-300 hover:from-emerald-300 hover:to-emerald-200 text-black text-xs font-mono font-black transition-all shadow-[0_0_20px_rgba(0,255,157,0.25)] focus-visible:ring-2 focus-visible:ring-emerald-400"
              title="Exportar Dossiê em PDF e Planilha Excel"
            >
              <Download className="h-4 w-4 text-black stroke-[2.5]" />
              <span>Exportar Dossiê</span>
            </button>
          </div>
        </div>
      )}

    </header>
  );
}
