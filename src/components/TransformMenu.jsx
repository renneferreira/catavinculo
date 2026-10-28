import React from 'react';
import { 
  Zap, 
  Users, 
  Scale, 
  Server, 
  GitFork, 
  Phone, 
  Mail, 
  Fingerprint, 
  ShieldAlert, 
  ExternalLink,
  X
} from 'lucide-react';

export function TransformMenu({ isOpen, onClose, selectedNode, onRunTransform }) {
  if (!isOpen || !selectedNode) return null;

  const nodeType = selectedNode.type;
  const nodeData = selectedNode.data;

  const getAvailableTransforms = () => {
    if (nodeType === 'company') {
      return [
        {
          id: 'transform-socios',
          title: 'Mapear Quadro Societário (QSA)',
          source: 'Receita Federal do Brasil',
          icon: Users,
          color: '#10B981',
          description: 'Descobre todos os sócios, administradores e percentual societário.',
          action: () => onRunTransform('expand_partners', selectedNode)
        },
        {
          id: 'transform-lawsuits',
          title: 'Rastrear Ações no DataJud (CNJ)',
          source: 'Poder Judiciário / CNJ',
          icon: Scale,
          color: '#EF4444',
          description: 'Busca execuções fiscais, ações cíveis, trabalhistas e pedidos de falência.',
          action: () => onRunTransform('expand_lawsuits', selectedNode)
        },
        {
          id: 'transform-infra',
          title: 'Mapear Infraestrutura Digital (Shodan)',
          source: 'Shodan / DNS / crt.sh',
          icon: Server,
          color: '#06B6D4',
          description: 'Resolve domínios, IP, provedor de hospedagem, ASN e subdomínios.',
          action: () => onRunTransform('expand_infra', selectedNode)
        },
        {
          id: 'transform-contacts',
          title: 'Extrair Contatos Oficiais',
          source: 'Receita Federal / Cadastro',
          icon: Phone,
          color: '#8B5CF6',
          description: 'Conecta telefones e e-mails oficiais cadastrados.',
          action: () => onRunTransform('expand_contacts', selectedNode)
        }
      ];
    }

    if (nodeType === 'person') {
      return [
        {
          id: 'transform-person-companies',
          title: 'Rastrear Coligadas & Holdings',
          source: 'Rede Societária RFB',
          icon: GitFork,
          color: '#2F80ED',
          description: 'Descobre outras empresas onde esta pessoa física é sócia ou administradora.',
          action: () => onRunTransform('expand_person_companies', selectedNode)
        },
        {
          id: 'transform-person-lawsuits',
          title: 'Buscar Ações Judiciais da Pessoa',
          source: 'DataJud / Jusbrasil',
          icon: Scale,
          color: '#EF4444',
          description: 'Identifica processos judiciais vinculados ao CPF / Nome da pessoa.',
          action: () => onRunTransform('expand_person_lawsuits', selectedNode)
        },
        {
          id: 'transform-person-footprint',
          title: 'Investigar Presença Digital (OSINT)',
          source: 'OSINT Industries / Google Dorking',
          icon: Fingerprint,
          color: '#8B5CF6',
          description: 'Rastreia perfis públicos, menções judiciais e diários oficiais em nome desta pessoa.',
          action: () => onRunTransform('expand_person_footprint', selectedNode)
        }
      ];
    }

    if (nodeType === 'contact') {
      return [
        {
          id: 'transform-footprint',
          title: 'Investigar Pegada Digital (OSINT Industries)',
          source: 'OSINT Industries / Gravatar / PIX',
          icon: Fingerprint,
          color: '#8B5CF6',
          description: 'Mapeia presença digital, operadora de telefone, chave PIX e contas associadas.',
          action: () => onRunTransform('expand_footprint', selectedNode)
        }
      ];
    }

    if (nodeType === 'infrastructure') {
      return [
        {
          id: 'transform-subdomains-expand',
          title: 'Expandir Subdomínios como Nós',
          source: 'Shodan / Certificate Transparency',
          icon: Server,
          color: '#06B6D4',
          description: 'Gera nós individuais para cada subdomínio corporativo identificado.',
          action: () => onRunTransform('expand_subdomains', selectedNode)
        }
      ];
    }

    return [];
  };

  const transforms = getAvailableTransforms();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[#121217] border border-zinc-700/80 p-6 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Transforms */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <Zap className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-zinc-100">Transformações de Inteligência</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                CataVínculo Hub
              </span>
            </div>
            <p className="text-xs text-zinc-400 truncate max-w-sm">
              Alvo selecionado: <strong className="text-zinc-200">{nodeData.razaoSocial || nodeData.nome || nodeData.value || 'Entidade'}</strong>
            </p>
          </div>
        </div>

        {/* Lista de Transformações Disponíveis */}
        <div className="mt-5 space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
          {transforms.length === 0 ? (
            <div className="p-6 text-center text-zinc-500 text-xs">
              Nenhuma transformação aplicável diretamente para este tipo de entidade.
            </div>
          ) : (
            transforms.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    t.action();
                    onClose();
                  }}
                  className="w-full p-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 text-left transition-all flex items-start gap-3.5 group"
                >
                  <div 
                    className="p-2.5 rounded-xl shrink-0 mt-0.5 border"
                    style={{ 
                      backgroundColor: `${t.color}15`, 
                      borderColor: `${t.color}35`,
                      color: t.color 
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                        {t.title}
                      </span>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                        {t.source}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                      {t.description}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Motor de Transformações e Expansão Relacional CataVínculo</span>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
