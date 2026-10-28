import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  Building2, 
  Users, 
  Phone, 
  Trash2, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Scale,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Server,
  Zap,
  Cpu,
  Landmark,
  HeartPulse,
  Factory,
  ShoppingBag,
  HardHat,
  Truck,
  Sprout,
  GraduationCap,
  Briefcase,
  Utensils
} from 'lucide-react';

const ICON_MAP = {
  Cpu,
  Landmark,
  HeartPulse,
  Factory,
  ShoppingBag,
  HardHat,
  Truck,
  Sprout,
  Zap,
  GraduationCap,
  Briefcase,
  Utensils,
  Building2
};

export const CompanyNode = memo(({ data, selected }) => {
  const { 
    cnpj, 
    razaoSocial, 
    nomeFantasia, 
    situacao, 
    capitalSocialFormatado, 
    cnae, 
    partnersCount = 0,
    lawsuitsCount = 0,
    complianceScore,
    isRoot,
    onOpenDetails,
    onOpenTransforms,
    onExpandPartners,
    onExpandContacts,
    onExpandLawsuits,
    onExpandInfra,
    onDelete
  } = data;

  const category = cnae?.categoria || {
    label: 'Empresa',
    color: '#2563EB',
    bgColor: 'rgba(37, 99, 235, 0.15)',
    borderColor: '#3b82f6',
    icon: 'Building2'
  };

  const IconComponent = ICON_MAP[category.icon] || Building2;
  const isAtiva = String(situacao).toUpperCase() === 'ATIVA';

  return (
    <div 
      className={`relative w-[360px] rounded-2xl bg-[#121218]/90 p-4 text-white shadow-2xl backdrop-blur-2xl transition-all duration-200 border ${
        selected ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-amber-500/20' : 'border-white/10 hover:border-white/20'
      }`}
      style={{
        boxShadow: selected 
          ? '0 0 30px rgba(240, 161, 33, 0.25)' 
          : '0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.7)'
      }}
    >
      {/* Handles nos 4 lados */}
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-blue-500 !border-2 !border-[#121218]" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-amber-400 !border-2 !border-[#121218]" />
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-blue-500 !border-2 !border-[#121218]" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-amber-400 !border-2 !border-[#121218]" />

      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div 
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-inner"
            style={{ 
              backgroundColor: category.bgColor, 
              borderColor: category.borderColor,
              color: category.color 
            }}
          >
            <IconComponent className="h-5 w-5" />
          </div>

          <div className="overflow-hidden">
            <span 
              className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase"
              style={{ backgroundColor: category.bgColor, color: category.color }}
            >
              {category.label}
            </span>
            <p className="font-mono text-xs text-zinc-400 mt-0.5">{cnpj}</p>
          </div>
        </div>

        {/* Status Badge & Compliance Score */}
        <div className="flex flex-col items-end gap-1">
          {isAtiva ? (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3" />
              Ativa
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-400 border border-rose-500/20">
              <XCircle className="h-3 w-3" />
              {situacao || 'Inativa'}
            </span>
          )}

          {complianceScore && (
            <span 
              className="text-[9px] font-bold px-1.5 py-0.2 rounded border"
              style={{ 
                backgroundColor: `${complianceScore.color}15`, 
                borderColor: `${complianceScore.color}35`, 
                color: complianceScore.color 
              }}
            >
              Score {complianceScore.score}/100
            </span>
          )}
        </div>
      </div>

      {/* Razão Social & Nome Fantasia */}
      <div className="mt-3">
        <h4 className="text-sm font-bold text-zinc-100 line-clamp-2 leading-snug tracking-tight font-display">
          {razaoSocial}
        </h4>
        {nomeFantasia && (
          <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1 italic">
            "{nomeFantasia}"
          </p>
        )}
      </div>

      {/* Metadados Rápidos: Capital Social & Contadores */}
      <div className="mt-3.5 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
        <div>
          <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">Capital Social</span>
          <span className="font-mono font-semibold text-zinc-200">{capitalSocialFormatado}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">Sócios</span>
            <span className="font-semibold text-emerald-400">{partnersCount}</span>
          </div>
          <div className="h-5 w-px bg-zinc-800" />
          <div className="text-right">
            <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">Ações</span>
            <span className={`font-semibold ${lawsuitsCount > 0 ? 'text-red-400' : 'text-zinc-500'}`}>
              {lawsuitsCount}
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Ações Rápidas do Nó (Adaptada para Neuroacessibilidade com Rótulos Explícitos) */}
      <div className="mt-3.5 pt-2.5 border-t border-zinc-800/80 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails?.(data);
            }}
            className="flex-1 neuro-btn bg-zinc-800/80 hover:bg-zinc-700 text-zinc-100 border-zinc-700 text-xs"
            title="Ver Ficha Cadastral e Jurídica Completa"
          >
            <span>Ver Ficha</span>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenTransforms?.(data);
            }}
            className="flex-1 neuro-btn bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/30 text-xs"
            title="Abrir Transformações de Inteligência"
          >
            <Zap className="h-3.5 w-3.5 text-emerald-400" />
            <span>Transforms</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExpandInfra?.(data);
            }}
            className="flex-1 neuro-btn bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-[11px]"
            title="Mapear Infraestrutura Digital (Shodan / DNS)"
          >
            <Server className="h-3 w-3" />
            <span>Shodan</span>
          </button>

          {partnersCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onExpandPartners?.(data);
              }}
              className="flex-1 neuro-btn bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[11px]"
              title="Expandir Sócios no Grafo"
            >
              <Users className="h-3 w-3" />
              <span>Sócios ({partnersCount})</span>
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onExpandLawsuits?.(data);
            }}
            className="flex-1 neuro-btn bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30 text-[11px]"
            title="Expandir Ações Judiciais no Grafo"
          >
            <Scale className="h-3 w-3" />
            <span>Ações ({lawsuitsCount})</span>
          </button>

          {!isRoot && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(data.id);
              }}
              className="neuro-btn p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border-transparent hover:border-red-500/30"
              title="Remover Nó do Grafo"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

CompanyNode.displayName = 'CompanyNode';
