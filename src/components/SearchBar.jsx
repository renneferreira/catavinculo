import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  GitFork, 
  AlertCircle, 
  Loader2, 
  Plane, 
  Car, 
  Radar,
  Network,
  Plus,
  Trash2
} from 'lucide-react';
import { formatCNPJ, formatCPF, formatPhone, validateCNPJ, validateCPF, validateEmail } from '../utils/formatters';
import { CataVinculoLogo } from './CataVinculoLogo';

const SEARCH_TABS = [
  { 
    id: 'NOME', 
    label: 'Nome / Razão', 
    subtitle: 'PF ou PJ na Receita e Web', 
    icon: Search, 
    badge: 'Universal',
    placeholder: 'Digite o nome da pessoa física ou razão social da empresa…' 
  },
  { 
    id: 'CNPJ', 
    label: 'CNPJ', 
    subtitle: 'Quadro Societário & Receita', 
    icon: Building2, 
    badge: 'Empresas',
    placeholder: 'Digite o CNPJ da empresa (ex: 33.000.167/0001-01)…' 
  },
  { 
    id: 'CPF', 
    label: 'CPF', 
    subtitle: 'Sócios & Participações', 
    icon: User, 
    badge: 'Pessoas',
    placeholder: 'Digite o CPF do investigado (ex: 000.000.000-00)…' 
  },
  { 
    id: 'RELATION', 
    label: 'Cruzamento Multi-Alvo', 
    subtitle: 'Teia Societária & Laranjas', 
    icon: GitFork, 
    badge: 'Grafo',
    placeholder: 'Cruzamento relacional de múltiplos alvos…' 
  },
  { 
    id: 'EMAIL', 
    label: 'E-mail OSINT', 
    subtitle: 'Pegada Digital & Domínios', 
    icon: Mail, 
    badge: 'Digital',
    placeholder: 'Digite o e-mail corporativo ou pessoal do investigado…' 
  },
  { 
    id: 'TELEFONE', 
    label: 'Telefone', 
    subtitle: 'Operadora, DDD & WhatsApp', 
    icon: Phone, 
    badge: 'Telecom',
    placeholder: 'Digite o número de telefone com DDD…' 
  },
  { 
    id: 'AERONAVE', 
    label: 'Aeronave RAB', 
    subtitle: 'Matrícula ANAC & Donos', 
    icon: Plane, 
    badge: 'Ativos VIP',
    placeholder: 'Matrícula da aeronave no RAB ANAC (ex: PP-XYZ, PR-ABC)…' 
  },
  { 
    id: 'VEICULO', 
    label: 'Veículo / Renavam', 
    subtitle: 'Placa, Chassi & FIPE', 
    icon: Car, 
    badge: 'Frotas',
    placeholder: 'Digite o RENAVAM ou placa do veículo automotor…' 
  }
];

export function SearchBar({ 
  onSearch, 
  loading, 
  currentStep, 
  error, 
  onClearError,
  isHeroMode = false
}) {
  const [searchType, setSearchType] = useState('NOME');
  const [inputValue, setInputValue] = useState('');
  const [relationInputs, setRelationInputs] = useState(['', '']);
  const [validationError, setValidationError] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('catavinculo_history');
      if (stored) setSearchHistory(JSON.parse(stored).slice(0, 4));
    } catch {}
  }, []);

  const saveToHistory = (item) => {
    try {
      const updated = [item, ...searchHistory.filter(h => h.value !== item.value)].slice(0, 4);
      setSearchHistory(updated);
      localStorage.setItem('catavinculo_history', JSON.stringify(updated));
    } catch {}
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    onClearError?.();
    setValidationError('');

    if (searchType === 'CNPJ') {
      setInputValue(formatCNPJ(val));
    } else if (searchType === 'CPF') {
      setInputValue(formatCPF(val));
    } else if (searchType === 'TELEFONE') {
      setInputValue(formatPhone(val));
    } else if (searchType === 'AERONAVE') {
      setInputValue(val.toUpperCase());
    } else {
      setInputValue(val);
    }
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    setValidationError('');

    if (searchType === 'NOME') {
      const clean = inputValue.trim();
      if (clean.length < 3) {
        setValidationError('Digite ao menos 3 letras para pesquisar por nome ou razão social.');
        return;
      }
      saveToHistory({ label: clean, value: clean, type: 'NOME' });
      onSearch({ type: 'NOME', value: clean });
    } else if (searchType === 'CNPJ') {
      const clean = inputValue.replace(/\D/g, '');
      if (clean.length !== 14) {
        setValidationError('Digite um CNPJ completo com 14 dígitos numéricos.');
        return;
      }
      if (!validateCNPJ(clean)) {
        setValidationError('CNPJ inválido (dígitos verificadores incorretos).');
        return;
      }
      saveToHistory({ label: inputValue, value: clean, type: 'CNPJ' });
      onSearch({ type: 'CNPJ', value: clean });
    } else if (searchType === 'CPF') {
      const clean = inputValue.replace(/\D/g, '');
      if (clean.length !== 11) {
        setValidationError('Digite um CPF completo com 11 dígitos.');
        return;
      }
      saveToHistory({ label: inputValue, value: clean, type: 'CPF' });
      onSearch({ type: 'CPF', value: clean });
    } else if (searchType === 'EMAIL') {
      if (!validateEmail(inputValue)) {
        setValidationError('Digite um endereço de e-mail válido (ex: contato@empresa.com.br).');
        return;
      }
      saveToHistory({ label: inputValue, value: inputValue, type: 'EMAIL' });
      onSearch({ type: 'EMAIL', value: inputValue });
    } else if (searchType === 'TELEFONE') {
      const clean = inputValue.replace(/\D/g, '');
      if (clean.length < 10) {
        setValidationError('Digite um número de telefone com DDD (10 ou 11 dígitos).');
        return;
      }
      saveToHistory({ label: inputValue, value: clean, type: 'TELEFONE' });
      onSearch({ type: 'TELEFONE', value: clean });
    } else if (searchType === 'AERONAVE') {
      const clean = inputValue.trim().toUpperCase();
      if (clean.length < 4) {
        setValidationError('Informe uma matrícula válida do RAB ANAC (ex: PP-XYZ, PR-ABC).');
        return;
      }
      saveToHistory({ label: clean, value: clean, type: 'AERONAVE' });
      onSearch({ type: 'AERONAVE', value: clean });
    } else if (searchType === 'VEICULO') {
      const clean = inputValue.trim().toUpperCase();
      if (clean.length < 5) {
        setValidationError('Informe o RENAVAM ou placa do veículo automotor.');
        return;
      }
      saveToHistory({ label: clean, value: clean, type: 'VEICULO' });
      onSearch({ type: 'VEICULO', value: clean });
    } else if (searchType === 'RELATION') {
      const validOnes = relationInputs.map(r => r.trim()).filter(Boolean);
      if (validOnes.length < 2) {
        setValidationError('Preencha ao menos dois alvos para cruzar conexões societárias.');
        return;
      }
      onSearch({ type: 'RELATION', value: validOnes });
    }
  };

  const currentTab = SEARCH_TABS.find(t => t.id === searchType) || SEARCH_TABS[0];

  // =========================================================================
  // MODO HERO CENTRALIZADO (Estilo Google - Centralizado e Padronizado)
  // =========================================================================
  if (isHeroMode) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 flex flex-col items-center justify-center min-h-[72vh] text-center select-none py-8">
        
        {/* Glow de Fundo Sutil */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Logo & Subtítulo Oficial Padronizado */}
        <div className="relative z-10 mb-7 flex flex-col items-center justify-center space-y-3">
          <CataVinculoLogo size="lg" />
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white flex items-center justify-center gap-2 font-mono">
            <span>Cata</span>
            <span className="text-emerald-400 drop-shadow-[0_0_20px_rgba(0,255,157,0.35)]">Vínculo</span>
          </h1>

          <p className="text-xs md:text-sm text-zinc-400 font-mono tracking-wide">
            Investigação e Inteligência em Fontes Abertas
          </p>
        </div>

        {/* Card de Filtros de Busca em 2 Linhas Horizontais (IHC / Ergonomia de Toque) */}
        <div className="relative z-10 w-full max-w-4xl mb-5">
          <div className="rounded-3xl darkglass-panel border border-white/10 p-3 md:p-4 shadow-2xl">
            <div className="flex items-center justify-between px-2 pb-2.5 mb-3 border-b border-white/5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#00FF9D]" />
                Vetores de Investigação &amp; Identificação de Alvo
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                8 Categorias Periciais
              </span>
            </div>

            {/* Grid 2 Linhas Horizontais x 4 Colunas (Botões Alargados e Descritivos) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-3">
              {SEARCH_TABS.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = searchType === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => { 
                      setSearchType(tab.id); 
                      setInputValue(''); 
                      setValidationError(''); 
                      onClearError?.();
                    }}
                    className={`flex items-center gap-3 p-3 md:p-3.5 rounded-2xl transition-all text-left relative overflow-hidden group focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                      isActive 
                        ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 border-2 border-emerald-400 text-white shadow-[0_0_20px_rgba(0,255,157,0.2)]' 
                        : 'bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-emerald-500/30 text-zinc-300 hover:text-white'
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      isActive 
                        ? 'bg-emerald-400 text-black shadow-md shadow-emerald-400/40' 
                        : 'bg-zinc-900 border border-white/10 text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10'
                    }`}>
                      <IconComponent className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs md:text-sm font-bold font-mono tracking-tight truncate ${isActive ? 'text-emerald-300' : 'text-zinc-200'}`}>
                          {tab.label}
                        </span>
                        {isActive && (
                          <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_#00FF9D]" />
                        )}
                      </div>
                      <span className="text-[10px] md:text-[11px] text-zinc-400 block truncate font-sans mt-0.5">
                        {tab.subtitle}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Input Estilo Google Centralizado com Botão Investigar Alargado */}
        <div className="relative z-10 w-full max-w-4xl">
          <form onSubmit={handleSearchSubmit}>
            {searchType !== 'RELATION' ? (
              <div className="relative flex items-center rounded-2xl bg-[#080b12]/95 border-2 border-white/15 p-2 shadow-2xl focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-500/20 transition-all">
                <div className="pl-4 text-emerald-400">
                  <Search className="h-5 w-5" />
                </div>

                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  disabled={loading}
                  autoFocus
                  placeholder={currentTab.placeholder}
                  className="w-full bg-transparent px-4 py-3.5 text-sm md:text-base font-medium text-white placeholder-zinc-500 focus:outline-none font-mono tabular-nums"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="shrink-0 flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-300 hover:from-emerald-300 hover:to-emerald-200 text-black font-mono font-black text-sm tracking-wide shadow-[0_0_20px_rgba(0,255,157,0.35)] transition-all disabled:opacity-50 active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-400"
                  title="Executar varredura investigativa"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-black" />
                      <span>Varrendo…</span>
                    </>
                  ) : (
                    <>
                      <Radar className="h-4 w-4 text-black animate-pulse" />
                      <span>Investigar</span>
                      <kbd className="hidden sm:inline-block text-[10px] bg-black/20 px-1.5 py-0.5 rounded font-mono border border-black/20">↵ Enter</kbd>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="rounded-2xl bg-[#090c14]/95 border border-white/15 p-5 space-y-3 shadow-2xl text-left">
                <div className="flex items-center justify-between text-xs text-zinc-300 font-mono">
                  <span>Informe 2 ou mais identificadores (CNPJs, CPFs ou Nomes) para cruzar conexões:</span>
                  <button
                    type="button"
                    onClick={() => setRelationInputs([...relationInputs, ''])}
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Adicionar Pista</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {relationInputs.map((val, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-mono text-emerald-400 w-8">#{idx + 1}</span>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => {
                          const arr = [...relationInputs];
                          arr[idx] = e.target.value;
                          setRelationInputs(arr);
                        }}
                        placeholder="CNPJ, CPF ou Nome para o cruzamento relacional"
                        className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/50"
                      />
                      {relationInputs.length > 2 && (
                        <button
                          type="button"
                          onClick={() => setRelationInputs(relationInputs.filter((_, i) => i !== idx))}
                          className="p-2 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,255,157,0.25)] transition-all"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-black" />
                  ) : (
                    <Radar className="h-4 w-4 text-black animate-pulse" />
                  )}
                  <span>Cruzar Teia Societária</span>
                </button>
              </div>
            )}
          </form>

          {/* Stepped Progress Indicator (Sem emojis, padronizado) */}
          {loading && currentStep && (
            <div className="mt-4 p-3 rounded-xl bg-zinc-950 border border-emerald-500/30 flex items-center justify-center gap-3 text-emerald-300 text-xs font-mono font-medium animate-pulse shadow-[0_0_15px_rgba(0,255,157,0.1)]">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-400 shrink-0" />
              <span>{currentStep.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim()}</span>
            </div>
          )}

          {/* Mensagem de Erro / Validação */}
          {(validationError || error) && (
            <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-center gap-2.5 text-rose-300 text-xs font-mono">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{validationError || error}</span>
            </div>
          )}
        </div>

      </div>
    );
  }

  // =========================================================================
  // MODO COMPACTO DOCKED (Quando o Grafo ou Cards estão ativos)
  // =========================================================================
  return (
    <div className="w-full max-w-4xl mx-auto px-4 select-none">
      
      {/* Card de Filtros em 2 Linhas Horizontais no Topo */}
      <div className="rounded-2xl darkglass-panel border border-white/10 p-2.5 backdrop-blur-2xl mb-2.5 shadow-2xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SEARCH_TABS.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = searchType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => { 
                  setSearchType(tab.id); 
                  setInputValue(''); 
                  setValidationError(''); 
                  onClearError?.();
                }}
                className={`flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-mono transition-all text-left group focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  isActive 
                    ? 'bg-emerald-500/20 border-2 border-emerald-400 text-white shadow-[0_0_12px_rgba(0,255,157,0.2)] font-bold' 
                    : 'bg-white/[0.03] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/[0.07] hover:border-emerald-500/20'
                }`}
              >
                <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isActive 
                    ? 'bg-emerald-400 text-black shadow-sm' 
                    : 'bg-zinc-900 border border-white/10 text-zinc-400 group-hover:text-emerald-400'
                }`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`block truncate text-xs ${isActive ? 'text-emerald-300 font-bold' : 'text-zinc-300'}`}>
                    {tab.label}
                  </span>
                  <span className="block truncate text-[9px] text-zinc-400 font-sans">
                    {tab.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Compacto com Botão Alargado */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative flex items-center rounded-2xl bg-[#080b12]/95 border-2 border-white/15 p-2 shadow-2xl focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-500/15 transition-all">
          <div className="pl-3.5 text-emerald-400">
            <Search className="h-5 w-5" />
          </div>

          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            disabled={loading}
            placeholder={currentTab.placeholder}
            className="w-full bg-transparent px-3.5 py-2.5 text-xs md:text-sm font-mono text-white placeholder-zinc-500 focus:outline-none tabular-nums"
          />

          <button
            type="submit"
            disabled={loading}
            className="shrink-0 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-300 hover:from-emerald-300 hover:to-emerald-200 text-black font-mono font-black text-xs shadow-md shadow-emerald-400/25 transition-all disabled:opacity-50 active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-400"
            title="Executar varredura investigativa"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-black" />
                <span>Varrendo…</span>
              </>
            ) : (
              <>
                <Radar className="h-4 w-4 text-black animate-pulse" />
                <span>Investigar</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Progress & Error */}
      {loading && currentStep && (
        <div className="mt-2 p-2 rounded-xl bg-zinc-950 border border-emerald-500/30 flex items-center justify-center gap-2 text-emerald-300 text-xs font-mono animate-pulse">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>{currentStep.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim()}</span>
        </div>
      )}

      {(validationError || error) && (
        <div className="mt-2 p-2 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-center gap-2 text-rose-300 text-xs font-mono">
          <AlertCircle className="h-3 w-3 text-rose-400 shrink-0" />
          <span>{validationError || error}</span>
        </div>
      )}
    </div>
  );
}
