import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Check, 
  CreditCard, 
  X, 
  Zap, 
  Lock, 
  HelpCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';

export function SubscriptionModal({ isOpen, onClose, tokenBalance = 150, onAddTokens }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [selectedTokenPack, setSelectedTokenPack] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulateCheckout = (planName) => {
    setCheckoutLoading(true);
    setTimeout(() => {
      setCheckoutLoading(false);
      setCheckoutSuccess(true);
      if (onAddTokens) {
        onAddTokens(150);
      }
      setTimeout(() => {
        setCheckoutSuccess(false);
        onClose();
      }, 1800);
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="subscription-modal-title"
    >
      <div className="relative w-full max-w-2xl rounded-3xl darkglass-panel border border-white/10 p-6 md:p-8 text-white shadow-2xl overflow-hidden my-auto">
        {/* Glow de fundo neon */}
        <div className="absolute -top-32 -right-32 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header do Modal */}
        <div className="flex items-start justify-between pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                CataVínculo Intelligence Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[11px] font-bold text-emerald-300">
                5 Dias Grátis
              </span>
            </div>
            <h2 id="subscription-modal-title" className="text-2xl font-extrabold tracking-tight text-white mt-2 font-display">
              Planos &amp; Tokens de Investigação
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Desbloqueie dossiês completos para petições judiciais, busca de aeronaves, veículos e conexões ocultas.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
            aria-label="Fechar modal de planos"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Saldo Atual de Tokens */}
        <div className="mt-5 p-4 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs text-zinc-400 font-medium block">Seu Saldo Disponível</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold font-mono text-white tabular-nums">{tokenBalance}</span>
                <span className="text-xs text-emerald-300 font-semibold font-mono">Tokens Avançados</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-zinc-400 block font-mono">Renovação Mensal</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center justify-end gap-1 font-mono">
              <Clock className="h-3 w-3" /> Ativo
            </span>
          </div>
        </div>

        {/* Card do Plano Starter CataVínculo */}
        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-zinc-900/90 to-zinc-900/90 border-2 border-emerald-500/40 shadow-xl relative">
          <div className="absolute -top-3 right-6 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black text-[11px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md font-mono">
            Mais Escolhido
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block font-mono">
                Plano Starter
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5 font-display tracking-tight">
                Para Advogados de Execução &amp; Analistas de Compliance
              </h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-md">
                Encontre empresas laranja, bens em nome de familiares e holdings em segundos.
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-xs text-zinc-400">R$</span>
                <span className="text-3xl font-black font-mono text-white tabular-nums">247</span>
                <span className="text-xs text-zinc-400">/mês</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium block mt-0.5">
                5 dias grátis para testar
              </span>
            </div>
          </div>

          {/* Benefícios inclusos */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              <span><strong>Investigações ilimitadas</strong> no grafo visual</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              <span><strong>150 tokens avançados</strong> inclusos por mês</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              <span><strong>Mapa visual</strong> de conexões ocultas</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              <span><strong>Relatórios prontos</strong> para petição judicial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              <span><strong>Rastreamento RAB</strong> de aeronaves e bens</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              <span><strong>Suporte prioritário</strong> via chat seguro</span>
            </div>
          </div>

          {/* Ação de Assinar com Stripe */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => handleSimulateCheckout('Plano Starter')}
              disabled={checkoutLoading || checkoutSuccess}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-black text-sm font-bold shadow-lg shadow-amber-400/20 transition-all disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              {checkoutLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Conectando ao Stripe Checkout…</span>
                </>
              ) : checkoutSuccess ? (
                <>
                  <Check className="h-4 w-4 text-black" />
                  <span>Assinatura Ativada com Sucesso!</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  <span>Começar Teste Grátis de 5 Dias</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Rodapé de Segurança e Pagamento */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-zinc-500" />
            <span>Pagamento 100% criptografado e seguro via <strong>Stripe</strong></span>
          </div>
          <div className="flex items-center gap-4 text-zinc-500">
            <span>Cancele quando quiser</span>
            <span>&bull;</span>
            <span>Sem carência nem multa</span>
            <span>&bull;</span>
            <span>Conforme LGPD</span>
          </div>
        </div>
      </div>
    </div>
  );
}
