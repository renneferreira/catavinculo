import React from 'react';

/**
 * CataVínculo - Logo Oficial Vetorial de Investigação & Inteligência em Fontes Abertas
 * Símbolo de nó relacional com mira central forense e conexões de rede em gradiente esmeralda/ciano.
 */
export function CataVinculoLogo({ size = 'default', showText = false, subtitle = '' }) {
  const sizeMap = {
    sm: { box: 'h-9 w-9', icon: 'h-5 w-5', text: 'text-base', sub: 'text-[10px]' },
    default: { box: 'h-12 w-12', icon: 'h-7 w-7', text: 'text-xl', sub: 'text-xs' },
    lg: { box: 'h-20 w-20', icon: 'h-11 w-11', text: 'text-4xl md:text-5xl', sub: 'text-xs md:text-sm' }
  };

  const current = sizeMap[size] || sizeMap.default;

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Emblema Vetorial */}
      <div className={`relative flex items-center justify-center shrink-0 ${current.box}`}>
        {/* Glow de Fundo */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#00FF9D]/30 via-[#00F0FF]/20 to-transparent blur-md pointer-events-none" />
        
        {/* Container do Ícone com Borda Fina de Vidro */}
        <div className="relative h-full w-full rounded-2xl bg-[#06080d] border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,157,0.15)]">
          <svg 
            viewBox="0 0 48 48" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`${current.icon} text-emerald-400`}
          >
            <defs>
              <linearGradient id="cvGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FF9D" />
                <stop offset="0.5" stopColor="#00F0FF" />
                <stop offset="1" stopColor="#38BDF8" />
              </linearGradient>
            </defs>

            {/* Linhas de Conexão Relacionais (Teia) */}
            <path 
              d="M12 14L24 24M24 24L36 14M24 24L24 38M12 34L24 24M36 34L24 24" 
              stroke="url(#cvGrad)" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeDasharray="2 3"
              opacity="0.6"
            />

            {/* Nós Periféricos */}
            <circle cx="12" cy="14" r="3.5" fill="#06080d" stroke="#00FF9D" strokeWidth="2" />
            <circle cx="36" cy="14" r="3.5" fill="#06080d" stroke="#00F0FF" strokeWidth="2" />
            <circle cx="12" cy="34" r="3" fill="#06080d" stroke="#38BDF8" strokeWidth="1.75" />
            <circle cx="36" cy="34" r="3" fill="#06080d" stroke="#00FF9D" strokeWidth="1.75" />
            <circle cx="24" cy="38" r="3" fill="#06080d" stroke="#00F0FF" strokeWidth="1.75" />

            {/* Nó Central (Mira / Núcleo Forense) */}
            <circle cx="24" cy="24" r="6.5" fill="#06080d" stroke="url(#cvGrad)" strokeWidth="2.5" />
            <circle cx="24" cy="24" r="2.5" fill="#00FF9D" />

            {/* Retículos da Mira */}
            <path d="M24 13V15.5M24 32.5V35M13 24H15.5M32.5 24H35" stroke="#00FF9D" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Tipografia da Marca Curada (Anti-Default: Syne Display) */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1">
            <span className={`${current.text} font-black tracking-tight text-white font-display uppercase`}>
              Cata
            </span>
            <span className={`${current.text} font-black tracking-tight text-emerald-400 font-display uppercase drop-shadow-[0_0_16px_rgba(0,255,135,0.45)]`}>
              Vínculo
            </span>
          </div>
          {subtitle && (
            <p className={`${current.sub} text-zinc-400 font-mono tracking-wider uppercase text-[9px] opacity-80`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
