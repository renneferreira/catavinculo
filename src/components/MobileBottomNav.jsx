import React from 'react';
import { 
  Network, 
  LayoutGrid, 
  BarChart3, 
  Plus,
  FileText
} from 'lucide-react';

/**
 * Barra de Navegação Inferior para Dispositivos Móveis
 * Ergonomia de toque (IHC), feedback tátil e estética darkglass alinhada ao CataVínculo.
 */
export function MobileBottomNav({
  viewMode = 'graph',
  onChangeViewMode,
  onOpenAnalytics,
  onOpenAddNode,
  onOpenDossier,
  nodeCounts = { companies: 0, partners: 0, lawsuits: 0, edges: 0 },
  hasActiveCase = false
}) {
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && window.navigator && typeof window.navigator.vibrate === 'function') {
      window.navigator.vibrate(12);
    }
  };

  const totalEntities = (nodeCounts?.companies || 0) + (nodeCounts?.partners || 0);

  return (
    <nav 
      aria-label="Navegação Principal Mobile" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#04060a]/95 border-t border-emerald-500/20 backdrop-blur-2xl px-2 py-1.5 flex items-center justify-around pb-[calc(env(safe-area-inset-bottom)+0.6rem)] shadow-[0_-10px_30px_rgba(0,0,0,0.85)]"
    >
      
      {/* Botão Grafo Relacional */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic();
          onChangeViewMode?.('graph');
        }}
        className={`relative flex flex-col items-center justify-center min-w-[58px] py-1 px-2 rounded-xl transition-all active:scale-95 touch-manipulation focus-visible:ring-1 focus-visible:ring-emerald-400 ${
          viewMode === 'graph' 
            ? 'text-emerald-300 font-bold' 
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
        aria-current={viewMode === 'graph' ? 'page' : undefined}
      >
        <div className={`p-1 rounded-lg transition-colors ${viewMode === 'graph' ? 'bg-emerald-500/15 text-emerald-400 shadow-[0_0_10px_rgba(0,255,157,0.3)]' : ''}`}>
          <Network className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-mono tracking-tight mt-0.5">Grafo</span>
        {viewMode === 'graph' && (
          <span className="absolute -bottom-0.5 h-1 w-5 rounded-full bg-emerald-400 shadow-[0_0_8px_#00FF9D]" />
        )}
      </button>

      {/* Botão Cards Estruturados */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic();
          onChangeViewMode?.('cards');
        }}
        className={`relative flex flex-col items-center justify-center min-w-[58px] py-1 px-2 rounded-xl transition-all active:scale-95 touch-manipulation focus-visible:ring-1 focus-visible:ring-emerald-400 ${
          viewMode === 'cards' 
            ? 'text-emerald-300 font-bold' 
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
        aria-current={viewMode === 'cards' ? 'page' : undefined}
      >
        <div className={`p-1 rounded-lg transition-colors ${viewMode === 'cards' ? 'bg-emerald-500/15 text-emerald-400 shadow-[0_0_10px_rgba(0,255,157,0.3)]' : ''}`}>
          <LayoutGrid className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-mono tracking-tight mt-0.5">Cards</span>
        {viewMode === 'cards' && (
          <span className="absolute -bottom-0.5 h-1 w-5 rounded-full bg-emerald-400 shadow-[0_0_8px_#00FF9D]" />
        )}
      </button>

      {/* Botão Central de Ação Elevada (FAB): + Inserir Pista Manual */}
      <div className="relative -mt-5 flex items-center justify-center">
        <button
          type="button"
          onClick={() => {
            triggerHaptic();
            onOpenAddNode?.();
          }}
          className="relative flex items-center justify-center h-13 w-13 rounded-2xl bg-gradient-to-tr from-emerald-500 via-emerald-400 to-cyan-400 text-black shadow-[0_0_20px_rgba(0,255,157,0.4)] active:scale-90 transition-transform border-2 border-[#04060a] focus-visible:ring-2 focus-visible:ring-emerald-400 touch-manipulation group"
          title="Adicionar Nova Pista de Investigação"
          aria-label="Adicionar Nova Pista de Investigação"
        >
          <Plus className="h-6 w-6 stroke-[3] text-black group-hover:rotate-90 transition-transform duration-200" />
          <span className="sr-only">Inserir Pista</span>
        </button>
      </div>

      {/* Botão Dossiê Judicial & Compliance */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic();
          onOpenDossier?.();
        }}
        className="relative flex flex-col items-center justify-center min-w-[58px] py-1 px-2 rounded-xl text-zinc-400 hover:text-emerald-300 transition-all active:scale-95 touch-manipulation focus-visible:ring-1 focus-visible:ring-emerald-400"
      >
        <div className="p-1 rounded-lg text-emerald-400">
          <FileText className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-mono tracking-tight mt-0.5">Dossiê</span>
        {totalEntities > 0 && hasActiveCase && (
          <span className="absolute top-0.5 right-2 min-w-[16px] h-4 px-1 rounded-full bg-emerald-400 text-black font-bold font-mono text-[9px] flex items-center justify-center shadow-[0_0_8px_rgba(0,255,157,0.5)]">
            {totalEntities}
          </span>
        )}
      </button>

      {/* Botão Métricas & Telemetria OSINT */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic();
          onOpenAnalytics?.();
        }}
        className="relative flex flex-col items-center justify-center min-w-[58px] py-1 px-2 rounded-xl text-zinc-400 hover:text-cyan-300 transition-all active:scale-95 touch-manipulation focus-visible:ring-1 focus-visible:ring-cyan-400"
      >
        <div className="p-1 rounded-lg text-cyan-400">
          <BarChart3 className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-mono tracking-tight mt-0.5">Métricas</span>
      </button>

    </nav>
  );
}
