import React, { useState } from 'react';
import { X, Plus, Building2, User, Phone, Mail, FileText } from 'lucide-react';
import { formatCNPJ, formatCPF, formatPhone } from '../utils/formatters';

export function AddNodeModal({ isOpen, onClose, onAddNode }) {
  const [nodeType, setNodeType] = useState('person');
  const [nome, setNome] = useState('');
  const [identificador, setIdentificador] = useState('');
  const [qualificacao, setQualificacao] = useState('');
  const [observacao, setObservacao] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const id = `manual-${Date.now()}`;
    let newNode = null;

    if (nodeType === 'person') {
      newNode = {
        id,
        type: 'person',
        position: { x: 500 + Math.random() * 100, y: 300 + Math.random() * 100 },
        data: {
          id,
          nome: nome.trim(),
          cpfCnpj: identificador ? formatCPF(identificador) : 'CPF Não Informado',
          qualificacao: qualificacao || 'Sócio / Suspeito Mapeado',
          faixaEtaria: 'Investigação Manual'
        }
      };
    } else if (nodeType === 'phone') {
      newNode = {
        id,
        type: 'contact',
        position: { x: 500 + Math.random() * 100, y: 300 + Math.random() * 100 },
        data: {
          id,
          type: 'phone',
          value: formatPhone(identificador || nome),
          label: qualificacao || 'Telefone Suspeito'
        }
      };
    } else if (nodeType === 'email') {
      newNode = {
        id,
        type: 'contact',
        position: { x: 500 + Math.random() * 100, y: 300 + Math.random() * 100 },
        data: {
          id,
          type: 'email',
          value: (identificador || nome).toLowerCase(),
          label: qualificacao || 'E-mail Suspeito'
        }
      };
    } else if (nodeType === 'note') {
      newNode = {
        id,
        type: 'note',
        position: { x: 500 + Math.random() * 100, y: 300 + Math.random() * 100 },
        data: {
          id,
          title: nome.trim(),
          content: observacao || identificador,
          author: 'Investigador',
          date: 'Agora'
        }
      };
    }

    if (newNode) {
      onAddNode(newNode);
      onClose();
      setNome('');
      setIdentificador('');
      setQualificacao('');
      setObservacao('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-[#141419] border border-zinc-800 p-6 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100">Adicionar Pista Manual</h3>
            <p className="text-xs text-zinc-400">Inclua uma pessoa, contato ou nota ao grafo</p>
          </div>
        </div>

        {/* Seletor de Tipo de Nó */}
        <div className="grid grid-cols-4 gap-2 mt-5">
          <button
            type="button"
            onClick={() => setNodeType('person')}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs transition-colors ${
              nodeType === 'person' 
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Pessoa</span>
          </button>

          <button
            type="button"
            onClick={() => setNodeType('phone')}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs transition-colors ${
              nodeType === 'phone' 
                ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Phone className="h-4 w-4" />
            <span>Telefone</span>
          </button>

          <button
            type="button"
            onClick={() => setNodeType('email')}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs transition-colors ${
              nodeType === 'email' 
                ? 'bg-pink-500/20 border-pink-500 text-pink-300 font-bold' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Mail className="h-4 w-4" />
            <span>E-mail</span>
          </button>

          <button
            type="button"
            onClick={() => setNodeType('note')}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs transition-colors ${
              nodeType === 'note' 
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Nota</span>
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-zinc-400 block mb-1 uppercase tracking-wider">
              {nodeType === 'person' ? 'Nome Completo da Pessoa' : nodeType === 'note' ? 'Título da Anotação' : 'Identificação / Nome'}
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder={nodeType === 'person' ? 'Ex: Carlos Eduardo de Oliveira' : 'Título'}
              required
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {nodeType === 'person' && (
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1 uppercase tracking-wider">
                CPF ou Documento
              </label>
              <input
                type="text"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          )}

          {(nodeType === 'phone' || nodeType === 'email') && (
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1 uppercase tracking-wider">
                {nodeType === 'phone' ? 'Número do Telefone com DDD' : 'Endereço de E-mail'}
              </label>
              <input
                type="text"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                placeholder={nodeType === 'phone' ? '(11) 98765-4321' : 'contato@empresa.com'}
                required
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          )}

          {nodeType === 'note' && (
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1 uppercase tracking-wider">
                Conteúdo da Pista / Anotação
              </label>
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Descreva as suspeitas, evidências ou cruzamentos observados..."
                rows={3}
                required
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          )}

          {nodeType === 'person' && (
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1 uppercase tracking-wider">
                Qualificação ou Papel
              </label>
              <input
                type="text"
                value={qualificacao}
                onChange={(e) => setQualificacao(e.target.value)}
                placeholder="Ex: Sócio Oculto, Administrador, Procurador"
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-colors"
            >
              Inserir no Grafo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
