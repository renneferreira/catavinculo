import React from 'react';
import { Info, Shield } from 'lucide-react';

/**
 * Ícone Oficial do Instagram estilizado em SVG sem emojis
 */
function InstagramIcon({ className = 'h-4 w-4' }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function Footer({ onOpenAbout }) {
  return (
    <footer className="w-full border-t border-white/5 bg-[#04060a]/90 backdrop-blur-xl px-4 py-3 pb-24 md:pb-3 select-none z-20">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Identificação do Desenvolvedor e Bio do Instagram */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 font-mono text-[11px]">Desenvolvido por</span>
            <span className="text-zinc-200 font-bold font-mono">Rennê Santos</span>
          </div>

          <span className="hidden sm:inline text-zinc-700">•</span>

          <span className="text-[11px] text-zinc-400 font-mono">
            Cibersegurança, Inteligência Digital &amp; Privacidade
          </span>
        </div>

        {/* Link do Perfil Instagram + Botão Sobre as Fontes */}
        <div className="flex items-center gap-4">
          {/* Link Instagram @oxe.renne */}
          <a
            href="https://www.instagram.com/oxe.renne/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-emerald-400 font-mono text-xs transition-colors group px-2 py-1 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
            title="Acessar perfil de Rennê Santos no Instagram"
          >
            <InstagramIcon className="h-3.5 w-3.5 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
            <span className="font-semibold">@oxe.renne</span>
          </a>

          {/* Botão Sobre as Fontes */}
          {onOpenAbout && (
            <button
              type="button"
              onClick={onOpenAbout}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 font-mono text-xs transition-colors px-2 py-1 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
              title="Ver detalhes das fontes de consulta e legalidade"
            >
              <Info className="h-3.5 w-3.5" />
              <span>Sobre as Fontes</span>
            </button>
          )}
        </div>

      </div>
    </footer>
  );
}
