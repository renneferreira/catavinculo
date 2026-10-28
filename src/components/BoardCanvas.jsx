import React, { useMemo, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  applyNodeChanges, 
  applyEdgeChanges,
  addEdge,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { CompanyNode } from './nodes/CompanyNode';
import { PersonNode } from './nodes/PersonNode';
import { ContactNode } from './nodes/ContactNode';
import { NoteNode } from './nodes/NoteNode';
import { LawsuitNode } from './nodes/LawsuitNode';
import { InfrastructureNode } from './nodes/InfrastructureNode';
import { DigitalIdentityNode } from './nodes/DigitalIdentityNode';
import { Network, Sparkles, Building2, ShieldAlert, Scale, Globe, Database, Server, Fingerprint, Zap } from 'lucide-react';

export function BoardCanvas({
  nodes,
  edges,
  setNodes,
  setEdges,
  onNodeClick,
  onOpenDetails,
  onOpenTransforms,
  onExpandPartners,
  onExpandContacts,
  onExpandCompanies,
  onExpandLawsuits,
  onExpandInfra,
  onExpandFootprint,
  onDeleteNode,
  reactFlowInstance,
  setReactFlowInstance
}) {
  // Registrar tipos customizados de nós
  const nodeTypes = useMemo(() => ({
    company: CompanyNode,
    person: PersonNode,
    contact: ContactNode,
    note: NoteNode,
    lawsuit: LawsuitNode,
    infrastructure: InfrastructureNode,
    identity: DigitalIdentityNode
  }), []);

  // Handlers do React Flow
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge({
      ...connection,
      animated: true,
      style: { stroke: '#F0A121', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#F0A121' }
    }, eds)),
    [setEdges]
  );

  // Injetar callbacks nas propriedades de cada nó
  const augmentedNodes = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onOpenDetails: (d) => onOpenDetails?.(d),
        onOpenTransforms: (d) => onOpenTransforms?.(node),
        onExpandPartners: (d) => onExpandPartners?.(d),
        onExpandContacts: (d) => onExpandContacts?.(d),
        onExpandCompanies: (d) => onExpandCompanies?.(d),
        onExpandLawsuits: (d) => onExpandLawsuits?.(d),
        onExpandInfra: (d) => onExpandInfra?.(d),
        onExpandFootprint: (d) => onExpandFootprint?.(d),
        onDelete: (id) => onDeleteNode?.(id)
      }
    }));
  }, [nodes, onOpenDetails, onOpenTransforms, onExpandPartners, onExpandContacts, onExpandCompanies, onExpandLawsuits, onExpandInfra, onExpandFootprint, onDeleteNode]);

  // Se o board estiver vazio, exibir tela introdutória elegante com IHC/UX
  if (nodes.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center select-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-[#0b0b10] to-[#070709]">
        <div className="relative mb-6">
          <div className="h-24 w-24 rounded-3xl darkglass-panel flex items-center justify-center shadow-2xl shadow-amber-500/10 border border-zinc-700/60">
            <Network className="h-12 w-12 text-amber-400 animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center shadow-lg">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          </div>
        </div>

        <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-tight">
          CataVínculo — Inteligência & Investigação Digital
        </h2>
        <p className="text-xs md:text-sm text-zinc-400 max-w-xl mt-2.5 leading-relaxed">
          Plataforma nacional de investigação avançada integrando <strong>Receita Federal (QSA)</strong>, <strong>Processos Judiciais (DataJud/CNJ)</strong>, <strong>Infraestrutura Digital (Shodan)</strong> e <strong>Pegada Digital (OSINT Industries)</strong>.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl text-left">
          <div className="p-4 rounded-2xl darkglass-card">
            <div className="flex items-center gap-2 mb-1.5">
              <Database className="h-4 w-4 text-amber-400" />
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">
                1. Receita Federal
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Mapeamento de sócios (QSA), filiais, CNAEs e dados cadastrais autênticos.
            </p>
          </div>

          <div className="p-4 rounded-2xl darkglass-card">
            <div className="flex items-center gap-2 mb-1.5">
              <Scale className="h-4 w-4 text-red-400" />
              <span className="text-red-400 font-bold text-xs uppercase tracking-wider">
                2. DataJud (CNJ)
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Ações judiciais, execuções fiscais e processos em tribunais estaduais e federais.
            </p>
          </div>

          <div className="p-4 rounded-2xl darkglass-card">
            <div className="flex items-center gap-2 mb-1.5">
              <Server className="h-4 w-4 text-cyan-400" />
              <span className="text-cyan-400 font-bold text-xs uppercase tracking-wider">
                3. Shodan & DNS
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Descoberta de domínios, IPs, servidores de e-mail, ASN e subdomínios expostos.
            </p>
          </div>

          <div className="p-4 rounded-2xl darkglass-card">
            <div className="flex items-center gap-2 mb-1.5">
              <Fingerprint className="h-4 w-4 text-purple-400" />
              <span className="text-purple-400 font-bold text-xs uppercase tracking-wider">
                4. OSINT Industries
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Presença digital, contas em redes, validação de chaves PIX e vazamentos.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative bg-[#070709]">
      <ReactFlow
        nodes={augmentedNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        onInit={setReactFlowInstance}
        fitView
        fitViewOptions={{ padding: 0.25, duration: 600 }}
        minZoom={0.15}
        maxZoom={2.5}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#475569', strokeWidth: 2 }
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1f1f28" gap={24} size={1.2} />
        <Controls 
          className="!bg-[#141419]/90 !border !border-zinc-800 !rounded-xl !overflow-hidden !shadow-2xl [&>button]:!bg-[#141419]/90 [&>button]:!border-zinc-800 [&>button]:!text-zinc-300 [&>button:hover]:!bg-zinc-800" 
        />
        <MiniMap 
          nodeColor={(node) => {
            if (node.type === 'company') return '#2563EB';
            if (node.type === 'person') return '#10B981';
            if (node.type === 'lawsuit') return '#EF4444';
            if (node.type === 'infrastructure') return '#06B6D4';
            if (node.type === 'identity') return '#8B5CF6';
            if (node.type === 'contact') return '#8B5CF6';
            return '#F59E0B';
          }}
          maskColor="rgba(7, 7, 9, 0.8)"
          className="!bg-[#101015]/90 !border !border-zinc-800/80 !rounded-xl !overflow-hidden shadow-2xl"
        />
      </ReactFlow>
    </div>
  );
}
