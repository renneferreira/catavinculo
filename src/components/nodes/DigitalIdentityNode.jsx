import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Fingerprint, ExternalLink, Trash2, ShieldCheck, ShieldAlert, Check, Globe } from 'lucide-react';

export const DigitalIdentityNode = memo(({ data, selected }) => {
  const {
    target,
    type,
    footprint,
    onDelete
  } = data;

  const isEmail = type === 'email';

  return (
    <div 
      className={`relative w-[320px] rounded-2xl bg-[#141019]/95 p-4 text-white shadow-2xl backdrop-blur-xl transition-all duration-200 border ${
        selected 
          ? 'border-purple-400 ring-2 ring-purple-400/40 shadow-purple-500/20' 
          : 'border-purple-500/40 hover:border-purple-400/70'
      }`}
      style={{
        boxShadow: selected 
          ? '0 0 30px rgba(139, 92, 246, 0.25)' 
          : '0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.7)'
      }}
    >
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-purple-500 !border-2 !border-[#121217]" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-purple-400 !border-2 !border-[#121217]" />
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-purple-500 !border-2 !border-[#121217]" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-purple-400 !border-2 !border-[#121217]" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
            <Fingerprint className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-purple-500/15 text-purple-400 border border-purple-500/30">
                OSINT Industries / Footprint
              </span>
            </div>
            <p className="font-mono text-xs font-bold text-zinc-100 mt-0.5 select-all truncate max-w-[200px]">
              {target}
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(data.id);
          }}
          className="p-1 rounded-lg text-zinc-500 hover:text-red-400 transition-colors"
          title="Remover pegada digital do grafo"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Conteúdo Específico */}
      <div className="mt-3 pt-2.5 border-t border-zinc-800/80 space-y-2 text-xs">
        {isEmail ? (
          <>
            <div className="flex items-center justify-between text-[11px] bg-zinc-900/60 p-2 rounded-lg border border-zinc-800">
              <span className="text-zinc-400">Tipo de Provedor:</span>
              <span className="font-semibold text-purple-300">{footprint?.type || 'Corporativo'}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase font-semibold block">
                Presença e Contas Vinculadas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {footprint?.platforms?.map((plat, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium">
                    {plat.name}
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between text-[11px] bg-zinc-900/60 p-2 rounded-lg border border-zinc-800">
              <span className="text-zinc-400">Região e DDD:</span>
              <span className="font-semibold text-purple-300">{footprint?.regiao || 'Brasil'}</span>
            </div>

            <div className="flex items-center justify-between text-[11px] bg-zinc-900/60 p-2 rounded-lg border border-zinc-800">
              <span className="text-zinc-400">Chave PIX Ativa:</span>
              <span className="font-semibold text-emerald-400">Compatível (Móvel)</span>
            </div>
          </>
        )}
      </div>

      {/* Links de Auditoria Adaptados */}
      <div className="mt-3.5 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between gap-2 text-[11px]">
        <span className="text-zinc-400 text-[10px]">
          Verificação OSINT
        </span>

        <a
          href={isEmail ? `https://haveibeenpwned.com/account/${encodeURIComponent(target)}` : `https://wa.me/55${target.replace(/\D/g, '')}`}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="neuro-btn bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border-purple-500/30 text-xs"
        >
          <span>{isEmail ? 'Checar Vazamentos' : 'WhatsApp Direto'}</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
});

DigitalIdentityNode.displayName = 'DigitalIdentityNode';
