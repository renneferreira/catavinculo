import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { UserCheck, GitFork, Trash2, Calendar, ShieldCheck, ChevronRight, Zap } from 'lucide-react';

export const PersonNode = memo(({ data, selected }) => {
  const { 
    nome, 
    cpfCnpj, 
    qualificacao, 
    faixaEtaria, 
    dataEntrada,
    onExpandCompanies,
    onOpenDetails,
    onOpenTransforms,
    onDelete 
  } = data;

  return (
    <div 
      className={`relative w-[310px] rounded-2xl bg-[#121218]/90 p-4 text-white shadow-2xl backdrop-blur-2xl transition-all duration-200 border ${
        selected ? 'border-emerald-400 ring-2 ring-emerald-400/40 shadow-emerald-500/20' : 'border-white/10 hover:border-white/20'
      }`}
      style={{
        boxShadow: selected 
          ? '0 0 30px rgba(16, 185, 129, 0.25)' 
          : '0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.7)'
      }}
    >
      {/* Handles */}
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-[#121218]" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-[#121218]" />
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-[#121217]" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-[#121217]" />

      {/* Top Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-inner">
          <UserCheck className="h-5 w-5" />
        </div>

        <div className="overflow-hidden">
          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Sócio / Administrador
          </span>
          <p className="font-mono text-xs text-zinc-400 mt-0.5">{cpfCnpj || 'CPF Mascarado'}</p>
        </div>
      </div>

      {/* Nome */}
      <div className="mt-3">
        <h4 className="text-sm font-bold text-zinc-100 line-clamp-2 leading-snug tracking-tight font-display">
          {nome}
        </h4>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-300 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
          <span className="line-clamp-1">{qualificacao || 'Sócio'}</span>
        </div>
      </div>

      {/* Metadados: Faixa Etária e Entrada */}
      <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
        <div>
          <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">Faixa Etária</span>
          <span className="text-zinc-300">{faixaEtaria || 'Não informada'}</span>
        </div>

        {dataEntrada && (
          <div className="text-right">
            <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">Entrada no QSA</span>
            <span className="font-mono text-zinc-300">{dataEntrada}</span>
          </div>
        )}
      </div>

      {/* Ações Rápidas Adaptadas com Rótulos Textuais Explícitos */}
      <div className="mt-3.5 pt-2.5 border-t border-zinc-800/80 grid grid-cols-2 gap-1.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExpandCompanies?.(data);
          }}
          className="neuro-btn bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/30 text-xs"
          title="Rastrear outras empresas coligadas ligadas a este sócio"
        >
          <GitFork className="h-3.5 w-3.5" />
          <span>Coligadas</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenTransforms?.(data);
          }}
          className="neuro-btn bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/30 text-xs"
          title="Abrir Transformações de Inteligência para esta pessoa"
        >
          <Zap className="h-3.5 w-3.5 text-emerald-400" />
          <span>Transforms</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails?.(data);
          }}
          className="neuro-btn bg-zinc-800/80 hover:bg-zinc-700 text-xs text-zinc-200 border-zinc-700"
          title="Ver Ficha Detalhada do Sócio"
        >
          <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
          <span>Ficha</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(data.id);
          }}
          className="neuro-btn text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border-transparent hover:border-red-500/30 text-xs"
          title="Remover Nó"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Remover</span>
        </button>
      </div>
    </div>
  );
});

PersonNode.displayName = 'PersonNode';
