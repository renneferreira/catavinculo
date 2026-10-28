import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, Check, Share2, PlusSquare, ArrowUpRight } from 'lucide-react';

/**
 * Banner e Assistente de Instalação do CataVínculo PWA
 * Suporte completo a Android, Chrome/Edge Desktop e iOS Safari (com guia visual passo-a-passo).
 * Estética Darkglass Forense (Esmeralda/Ciano Neon) alinhada à identidade visual.
 */
export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // 1. Verificar se o app já está rodando em modo standalone (PWA instalado)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. Detecção precisa de iOS (iPhone/iPad/iPod ou iPadOS com pointer touch)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = 
      /iphone|ipad|ipod/.test(userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    setIsIOS(isIosDevice);

    // 3. Checar preferência de dispensa no localStorage
    const dismissed = localStorage.getItem('catavinculo_pwa_dismissed');

    // Se for iOS Safari, antes do evento (que não existe no WebKit), exibimos o banner
    if (isIosDevice && !dismissed) {
      // Delay suave de 1.5s para não poluir a entrada imediata
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }

    // 4. Captura do evento padrão de PWA no Chrome / Edge / Opera / Android
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 5. Notificação de instalação concluída
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIOSGuide(false);
    localStorage.setItem('catavinculo_pwa_dismissed', 'true');
  };

  if (isInstalled || (!showBanner && !showIOSGuide)) return null;

  return (
    <>
      {/* Banner Flutuante Darkglass de Instalação PWA (Posicionado com folga para a MobileBottomNav) */}
      {showBanner && (
        <aside 
          aria-label="Instalar CataVínculo como Aplicativo"
          className="fixed bottom-[80px] md:bottom-6 left-3 right-3 md:left-auto md:right-6 md:w-[410px] z-50 animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="p-4 rounded-2xl bg-[#060810]/95 border border-emerald-500/35 shadow-[0_12px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl flex items-start gap-3.5">
            {/* Ícone com Mira e Gradiente Forense */}
            <div className="relative h-11 w-11 rounded-xl bg-gradient-to-tr from-emerald-500 via-cyan-400 to-emerald-400 p-[1.5px] shrink-0 shadow-[0_0_15px_rgba(0,255,157,0.25)]">
              <div className="h-full w-full rounded-[10px] bg-[#07090f] flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-emerald-400" />
              </div>
            </div>

            {/* Conteúdo Informativo */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold font-mono text-white tracking-tight">
                  Instalar CataVínculo App
                </h4>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {isIOS ? 'iOS / Safari' : 'PWA Nativo'}
                </span>
              </div>
              
              <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                {isIOS 
                  ? 'Adicione à tela de início para acesso rápido, tela cheia e sem barras de navegação.' 
                  : 'Acesse instantaneamente do seu celular ou PC com suporte offline e sem barra do navegador.'
                }
              </p>

              {/* Botões de Ação */}
              <div className="mt-3 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-black text-xs font-mono font-bold shadow-[0_0_15px_rgba(0,255,157,0.3)] transition-all active:scale-95 touch-manipulation focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  {isIOS ? (
                    <>
                      <Share2 className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>Ver Como Instalar</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>Instalar Agora</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDismiss}
                  className="text-xs font-mono text-zinc-400 hover:text-white px-2 py-1 transition-colors"
                >
                  Agora não
                </button>
              </div>
            </div>

            {/* Botão Fechar */}
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Fechar aviso de instalação"
              className="text-zinc-500 hover:text-white p-1 rounded-lg transition-colors -mr-1 -mt-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </aside>
      )}

      {/* Guia Modal Interativo Passo-a-Passo para iPhone e iPad (Safari) */}
      {showIOSGuide && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-sm rounded-3xl bg-[#0a0d17] border border-emerald-500/30 p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono text-white">Instalar no iPhone / iPad</h3>
                  <p className="text-[10px] font-mono text-zinc-400">Safari iOS Web Clip</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowIOSGuide(false)} 
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-xs space-y-3">
              <p className="text-zinc-300">
                Siga os 3 passos abaixo no <strong className="text-emerald-400">Safari</strong>:
              </p>

              <div className="space-y-2.5 bg-black/40 p-3 rounded-2xl border border-white/5">
                <div className="flex items-start gap-2.5">
                  <div className="h-6 w-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="text-zinc-300">
                    Toque no botão <strong className="text-white inline-flex items-center gap-1 font-semibold">Compartilhar <Share2 className="h-3 w-3 text-cyan-400 inline" /></strong> na barra inferior do Safari.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="h-6 w-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div className="text-zinc-300">
                    Role a folha de opções e selecione <strong className="text-white inline-flex items-center gap-1 font-semibold">Adicionar à Tela de Início <PlusSquare className="h-3.5 w-3.5 text-emerald-400 inline" /></strong>.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="h-6 w-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div className="text-zinc-300">
                    Confirme tocando em <strong className="text-emerald-400 font-bold">Adicionar</strong> no canto superior direito.
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-zinc-400 italic">
                O ícone do CataVínculo aparecerá na sua tela inicial como um app nativo de alta performance!
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 text-black font-mono font-bold text-xs shadow-[0_0_15px_rgba(0,255,157,0.3)] transition-all active:scale-95"
            >
              Entendi, vou instalar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
