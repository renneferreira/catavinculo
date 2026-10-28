import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileText, Trash2, Pin } from 'lucide-react';

export const NoteNode = memo(({ data, selected }) => {
  const { title, content, author, date, onDelete } = data;

  return (
    <div 
      className={`relative w-[280px] rounded-xl bg-[#1e1e24]/95 p-3.5 text-white shadow-xl backdrop-blur-xl transition-all duration-200 border ${
        selected ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-zinc-800 hover:border-zinc-700'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!w-2.5 !h-2.5 !bg-amber-500 !border-2 !border-[#121217]" />
      <Handle type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-amber-400 !border-2 !border-[#121217]" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Pin className="h-3.5 w-3.5" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
            Pista do Investigador
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(data.id);
          }}
          className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
          title="Remover Nota"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>

      <div className="mt-2.5">
        <h5 className="text-xs font-bold text-zinc-100">{title || 'Nota da Investigação'}</h5>
        <p className="text-xs text-zinc-300 mt-1 leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>

      <div className="mt-2 pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500">
        <span>{author || 'Investigador'}</span>
        <span>{date || 'Hoje'}</span>
      </div>
    </div>
  );
});

NoteNode.displayName = 'NoteNode';
