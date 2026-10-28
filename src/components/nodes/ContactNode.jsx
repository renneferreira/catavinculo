import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Phone, Mail, Copy, Check, Trash2, Search } from 'lucide-react';

export const ContactNode = memo(({ data, selected }) => {
  const { 
    type, 
    value, 
    label,
    onSearchCompaniesWithContact,
    onExpandFootprint,
    onOpenTransforms,
    onDelete 
  } = data;

  const [copied, setCopied] = useState(false);
  const isPhone = type === 'phone';

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={`relative w-[280px] rounded-2xl bg-[#121217]/95 p-3.5 text-white shadow-xl backdrop-blur-xl transition-all duration-200 border ${
        selected ? 'border-purple-400 ring-2 ring-purple-400/40' : 'border-zinc-800 hover:border-zinc-700'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!w-2.5 !h-2.5 !bg-purple-500 !border-2 !border-[#121217]" />
      <Handle type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-purple-400 !border-2 !border-[#121217]" />
      <Handle type="target" position={Position.Top} className="!w-2.5 !h-2.5 !bg-purple-500 !border-2 !border-[#121217]" />
      <Handle type="source" position={Position.Bottom} className="!w-2.5 !h-2.5 !bg-purple-400 !border-2 !border-[#121217]" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
            isPhone 
              ? 'bg-purple-500/15 border-purple-500/30 text-purple-400' 
              : 'bg-pink-500/15 border-pink-500/30 text-pink-400'
          }`}>
            {isPhone ? <Phone className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
          </div>

          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
              {label || (isPhone ? 'Telefone Cadastrado' : 'E-mail Cadastrado')}
            </span>
            <p className="font-mono text-xs font-semibold text-zinc-100 mt-0.5 line-clamp-1 select-all">
              {value}
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="p-1 rounded text-zinc-500 hover:text-zinc-200 transition-colors"
          title="Copiar contato"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>

      <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-1 text-[11px]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExpandFootprint?.(data);
          }}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 font-semibold text-xs transition-colors"
          title="Investigar Pegada Digital (OSINT Industries)"
        >
          <span>OSINT</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenTransforms?.(data);
          }}
          className="p-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs transition-colors"
          title="Transformações de Inteligência"
        >
          <Search className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(data.id);
          }}
          className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
          title="Remover"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
});

ContactNode.displayName = 'ContactNode';
