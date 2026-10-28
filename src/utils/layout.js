// Cálculo determinístico e animado de posições de layout para o grafo relacional do CataVínculo

export function applyLayout(nodes, edges, layoutType = 'arvore') {
  if (!nodes || nodes.length === 0) return [];

  const rootNode = nodes.find(n => n.type === 'company' && n.data?.isRoot) || nodes[0];
  const otherNodes = nodes.filter(n => n.id !== rootNode?.id);

  if (layoutType === 'arvore') {
    // Layout Árvore Hierárquica: Root -> Sócios -> Ações -> Infraestrutura/Identidades -> Coligadas
    const rootPos = { x: 80, y: 350 };
    const partners = otherNodes.filter(n => n.type === 'person');
    const lawsuits = otherNodes.filter(n => n.type === 'lawsuit');
    const infraAndIdentity = otherNodes.filter(n => n.type === 'infrastructure' || n.type === 'identity');
    const thirdColumn = otherNodes.filter(n => n.type === 'company' || n.type === 'contact' || n.type === 'note');

    const positioned = [];

    // Root
    positioned.push({
      ...rootNode,
      position: rootPos
    });

    // Coluna 1: Sócios (x: 580)
    const partnerSpacingY = 190;
    const startYPartners = rootPos.y - ((partners.length - 1) * partnerSpacingY) / 2;
    partners.forEach((p, idx) => {
      positioned.push({
        ...p,
        position: {
          x: 580,
          y: startYPartners + idx * partnerSpacingY
        }
      });
    });

    // Coluna 2: Processos Judiciais (x: 1060)
    const lawsuitSpacingY = 210;
    const startYLawsuits = rootPos.y - ((lawsuits.length - 1) * lawsuitSpacingY) / 2;
    lawsuits.forEach((l, idx) => {
      positioned.push({
        ...l,
        position: {
          x: 1060,
          y: startYLawsuits + idx * lawsuitSpacingY
        }
      });
    });

    // Coluna 3: Infraestrutura Shodan & Identidades OSINT (x: 1540)
    const infraSpacingY = 220;
    const startYInfra = rootPos.y - ((infraAndIdentity.length - 1) * infraSpacingY) / 2;
    infraAndIdentity.forEach((item, idx) => {
      positioned.push({
        ...item,
        position: {
          x: 1540,
          y: startYInfra + idx * infraSpacingY
        }
      });
    });

    // Coluna 4: Coligadas, Contatos e Notas (x: 2020)
    const thirdSpacingY = 200;
    const startYThird = rootPos.y - ((thirdColumn.length - 1) * thirdSpacingY) / 2;
    thirdColumn.forEach((item, idx) => {
      positioned.push({
        ...item,
        position: {
          x: 2020,
          y: startYThird + idx * thirdSpacingY
        }
      });
    });

    return positioned;
  }

  if (layoutType === 'organico') {
    // Layout Radial / Orgânico: Círculo orbital ao redor do nó raiz
    const centerX = 800;
    const centerY = 550;
    const radius = Math.max(450, otherNodes.length * 55);

    const positioned = [
      {
        ...rootNode,
        position: { x: centerX, y: centerY }
      }
    ];

    otherNodes.forEach((node, idx) => {
      const angle = (2 * Math.PI * idx) / otherNodes.length;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      positioned.push({
        ...node,
        position: { x: Math.round(x), y: Math.round(y) }
      });
    });

    return positioned;
  }

  if (layoutType === 'estruturado') {
    // Layout em Grade / Estruturado: Organizado por categorias em blocos verticais
    const companies = nodes.filter(n => n.type === 'company');
    const partners = nodes.filter(n => n.type === 'person');
    const lawsuits = nodes.filter(n => n.type === 'lawsuit');
    const infra = nodes.filter(n => n.type === 'infrastructure' || n.type === 'identity');
    const others = nodes.filter(n => n.type !== 'company' && n.type !== 'person' && n.type !== 'lawsuit' && n.type !== 'infrastructure' && n.type !== 'identity');

    const positioned = [];

    companies.forEach((n, idx) => {
      positioned.push({ ...n, position: { x: 100 + idx * 480, y: 80 } });
    });

    partners.forEach((n, idx) => {
      positioned.push({ ...n, position: { x: 100 + idx * 400, y: 380 } });
    });

    lawsuits.forEach((n, idx) => {
      positioned.push({ ...n, position: { x: 100 + idx * 420, y: 680 } });
    });

    infra.forEach((n, idx) => {
      positioned.push({ ...n, position: { x: 100 + idx * 420, y: 980 } });
    });

    others.forEach((n, idx) => {
      positioned.push({ ...n, position: { x: 100 + idx * 360, y: 1280 } });
    });

    return positioned;
  }

  return nodes;
}
