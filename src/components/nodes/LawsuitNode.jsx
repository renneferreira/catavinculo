import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Scale, ExternalLink, AlertTriangle, Trash2, ShieldAlert, FileText } from 'lucide-react';

export const LawsuitNode = memo(({ data, selected }) => {
  const {
    numero,
    tribunal,
    classe,
    orgao,
    dataAjuizamento,
    polo,
    assuntos = [],
    risco = 'MODERADO',
    linkJusbrasil,
    onDelete
  } = data;

  const isHighRisk = risco === 'ALTO';

  return (
    <div 
      className={`relative w-[320px] rounded-2xl bg-[#141215]/95 p-4 text-white shadow-2xl backdrop-blur-xl transition-all duration-200 border ${
        selected 
          ? 'border-red-400 ring-2 ring-red-400/40 shadow-red-500/20' 
          : isHighRisk 
          ? 'border-red-500/40 hover:border-red-500/70' 
          : 'border-amber-500/40 hover:border-amber-500/70'
      }`}
      style={{
        boxShadow: selected 
          ? '0 0 30px rgba(239, 68, 68, 0.25)' 
          : '0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.7)'
      }}
    >
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-red-500 !border-2 !border-[#121217]" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-red-400 !border-2 !border-[#121217]" />
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-red-500 !border-2 !border-[#121217]" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-red-400 !border-2 !border-[#121217]" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
            isHighRisk 
              ? 'bg-red-500/15 border-red-500/30 text-red-400' 
              : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
          }`}>
            <Scale className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase border ${
                isHighRisk 
                  ? 'bg-red-500/15 text-red-400 border-red-500/30' 
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              }`}>
                {tribunal || 'Poder Judiciário'}
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">
                {polo}
              </span>
            </div>
            <p className="font-mono text-xs font-semibold text-zinc-200 mt-0.5 select-all">
              {numero}
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(data.id);
          }}
          className="p-1 rounded-lg text-zinc-500 hover:text-red-400 transition-colors"
          title="Remover processo do grafo"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Classe da Ação */}
      <div className="mt-3">
        <h4 className="text-xs font-bold text-zinc-100 line-clamp-1">
          {classe}
        </h4>
        <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
          {orgao}
        </p>
      </div>

      {/* Assuntos */}
      {assuntos.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {assuntos.slice(0, 2).map((assunto, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 font-medium truncate max-w-[280px]">
              {assunto}
            </span>
          ))}
        </div>
      )}

      {/* Footer com link e data */}
      <div className="mt-3.5 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between gap-2 text-[11px]">
        <span className="text-zinc-400 font-mono text-[10px] truncate max-w-[120px]">
          {dataAjuizamento ? `Distr: ${dataAjuizamento}` : 'Em tramitação'}
        </span>

        <div className="flex items-center gap-1.5">
          {linkJusbrasil && (
            <a
              href={linkJusbrasil}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="neuro-btn bg-red-500/15 hover:bg-red-500/25 text-red-300 border-red-500/30 text-xs"
            >
              <span>Ver Autos</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(data.id);
            }}
            className="neuro-btn p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border-transparent hover:border-red-500/30"
            title="Remover Processo do Grafo"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
});

LawsuitNode.displayName = 'LawsuitNode';
