import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Server, Globe, ExternalLink, Trash2, Cpu, Shield, Layers } from 'lucide-react';

export const InfrastructureNode = memo(({ data, selected }) => {
  const {
    domain,
    ip,
    geo,
    mailProvider,
    subdomains = [],
    shodanUrl,
    shodanHostUrl,
    onDelete
  } = data;

  return (
    <div 
      className={`relative w-[340px] rounded-2xl bg-[#0c1319]/95 p-4 text-white shadow-2xl backdrop-blur-xl transition-all duration-200 border ${
        selected 
          ? 'border-cyan-400 ring-2 ring-cyan-400/40 shadow-cyan-500/20' 
          : 'border-cyan-500/40 hover:border-cyan-400/70'
      }`}
      style={{
        boxShadow: selected 
          ? '0 0 30px rgba(6, 182, 212, 0.25)' 
          : '0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.7)'
      }}
    >
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-[#121217]" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-[#121217]" />
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-[#121217]" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-[#121217]" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <Server className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                Shodan / Infraestrutura
              </span>
            </div>
            <p className="font-mono text-xs font-bold text-zinc-100 mt-0.5 select-all">
              {domain}
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(data.id);
          }}
          className="p-1 rounded-lg text-zinc-500 hover:text-red-400 transition-colors"
          title="Remover infraestrutura do grafo"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Dados do Servidor & IP */}
      <div className="mt-3 pt-2.5 border-t border-zinc-800/80 grid grid-cols-2 gap-2 text-xs">
        <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/80">
          <span className="text-zinc-500 block text-[9px] uppercase font-semibold">Endereço IP</span>
          <span className="font-mono text-cyan-300 font-bold text-xs truncate block">{ip}</span>
        </div>
        <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/80">
          <span className="text-zinc-500 block text-[9px] uppercase font-semibold">Hospedagem / ASN</span>
          <span className="text-zinc-200 font-medium text-[11px] truncate block">{geo?.org || geo?.isp || 'Cloud'}</span>
        </div>
      </div>

      {/* Provedor de E-mail */}
      {mailProvider && (
        <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-[11px] flex items-center justify-between text-zinc-300">
          <span className="text-zinc-500 text-[10px] uppercase">E-mail Corporativo:</span>
          <span className="font-semibold text-cyan-400">{mailProvider}</span>
        </div>
      )}

      {/* Subdomínios Descobertos */}
      {subdomains.length > 0 && (
        <div className="mt-2.5">
          <span className="text-[10px] text-zinc-500 uppercase font-semibold block mb-1">
            Subdomínios Mapeados ({subdomains.length})
          </span>
          <div className="flex flex-wrap gap-1">
            {subdomains.slice(0, 4).map((sub, i) => (
              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 truncate max-w-[150px]">
                {sub.replace(`.${domain}`, '')}
              </span>
            ))}
            {subdomains.length > 4 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-semibold">
                +{subdomains.length - 4}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Links Shodan Adaptados */}
      <div className="mt-3.5 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between gap-2 text-[11px]">
        <span className="text-zinc-400 text-[10px] truncate max-w-[130px]">
          {geo?.city || 'Brasil'} ({geo?.country || 'BR'})
        </span>

        {shodanUrl && (
          <a
            href={shodanUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="neuro-btn bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border-cyan-500/30 text-xs"
          >
            <span>Explorar Shodan</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
});

InfrastructureNode.displayName = 'InfrastructureNode';
