import React, { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { BoardCanvas } from './components/BoardCanvas';
import { CardGridView } from './components/CardGridView';
import { DetailDrawer } from './components/DetailDrawer';
import { ExportModal } from './components/ExportModal';
import { AddNodeModal } from './components/AddNodeModal';
import { TransformMenu } from './components/TransformMenu';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { DossierModal } from './components/DossierModal';
import { AboutSourcesModal } from './components/AboutSourcesModal';
import { Footer } from './components/Footer';
import { fetchCompanyData, fetchPartnerNetwork, fetchAircraftData, fetchVehicleData, searchByName } from './services/api';
import { fetchLawsuits, calculateComplianceScore } from './services/osint';
import { extractDomainFromCompany, fetchDomainInfrastructure } from './services/infrastructure';
import { investigateEmail, investigatePhone } from './services/footprint';
import { applyLayout } from './utils/layout';
import { MarkerType } from '@xyflow/react';

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [error, setError] = useState('');
  const [layoutType, setLayoutType] = useState('arvore');

  // Alternador de Visualização: 'graph' | 'cards'
  const [viewMode, setViewMode] = useState('graph');
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Filtros rápidos de visualização (IHC/UX)
  const [activeFilters, setActiveFilters] = useState({
    company: true,
    person: true,
    lawsuit: true,
    infrastructure: true,
    identity: true,
    contact: true
  });

  const [isDossierOpen, setIsDossierOpen] = useState(false);

  // Modals e Painéis
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [isTransformOpen, setIsTransformOpen] = useState(false);
  const [selectedTransformNode, setSelectedTransformNode] = useState(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [investigationTitle, setInvestigationTitle] = useState('Novo Caso de Investigação');

  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Contadores para o header
  const nodeCounts = useMemo(() => {
    return {
      companies: nodes.filter(n => n.type === 'company').length,
      partners: nodes.filter(n => n.type === 'person').length,
      lawsuits: nodes.filter(n => n.type === 'lawsuit').length,
      infrastructure: nodes.filter(n => n.type === 'infrastructure').length,
      identity: nodes.filter(n => n.type === 'identity').length,
      contacts: nodes.filter(n => n.type === 'contact').length,
      edges: edges.length
    };
  }, [nodes, edges]);

  // Nós filtrados exibidos no canvas
  const visibleNodes = useMemo(() => {
    return nodes.filter(n => activeFilters[n.type] !== false);
  }, [nodes, activeFilters]);

  const visibleEdges = useMemo(() => {
    const visibleIds = new Set(visibleNodes.map(n => n.id));
    return edges.filter(e => visibleIds.has(e.source) && visibleIds.has(e.target));
  }, [edges, visibleNodes]);

  const handleToggleFilter = useCallback((type) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  }, []);

  // Executar busca cadastral com etapas OSINT realistas
  const handleSearch = useCallback(async ({ type, value }) => {
    setLoading(true);
    setError('');
    setCurrentStep('1/4 - Consultando Base Pública da Receita Federal (BrasilAPI / MinhaReceita)...');

    try {
      if (type === 'NOME') {
        setCurrentStep('1/4 - Consultando Base de Nomes e Razões Sociais na Receita Federal...');
        const result = await searchByName(value);

        if (result.type === 'company') {
          const company = result.data;
          setInvestigationTitle(`Caso: ${company.razaoSocial} (${company.cnpj})`);

          setCurrentStep('2/4 - Rastreando Processos Judiciais no DataJud (CNJ)...');
          const lawsuits = await fetchLawsuits(company.razaoSocial, company.endereco?.uf);
          const complianceScore = calculateComplianceScore(company, lawsuits);

          setCurrentStep('3/4 - Mapeando Quadro de Sócios & Rede Empresarial...');
          const companyNodeId = `empresa-${company.rawCnpj}`;

          const rootCompanyNode = {
            id: companyNodeId,
            type: 'company',
            position: { x: 80, y: 350 },
            data: {
              ...company,
              id: companyNodeId,
              isRoot: true,
              partnersCount: company.partners?.length || 0,
              lawsuitsCount: lawsuits.length,
              lawsuits,
              complianceScore
            }
          };

          const newNodes = [rootCompanyNode];
          const newEdges = [];

          if (company.partners && company.partners.length > 0) {
            company.partners.forEach((partner) => {
              const partnerNodeId = `socio-${companyNodeId}-${partner.id || Math.random().toString(36).slice(2, 7)}`;
              newNodes.push({
                id: partnerNodeId,
                type: 'person',
                position: { x: 580, y: 300 },
                data: {
                  ...partner,
                  id: partnerNodeId,
                  parentCompanyId: companyNodeId,
                  parentCompanyName: company.razaoSocial
                }
              });
              newEdges.push({
                id: `edge-${companyNodeId}-${partnerNodeId}`,
                source: companyNodeId,
                target: partnerNodeId,
                label: partner.qualificacao || 'Sócio / QSA',
                animated: true,
                style: { stroke: '#00FF9D', strokeWidth: 2 }
              });
            });
          }

          const positionedNodes = applyLayout(newNodes, newEdges, layoutType);
          setNodes(positionedNodes);
          setEdges(newEdges);
          setTimeout(() => {
            reactFlowInstance?.fitView({ padding: 0.3, duration: 600 });
          }, 150);
        } else {
          // Resultado de Busca por Pessoa Física
          const person = result;
          setInvestigationTitle(`Investigação de Pessoa: ${person.nome}`);

          setCurrentStep('2/4 - Rastreando Processos no DataJud CNJ...');
          const lawsuits = await fetchLawsuits(person.nome);

          setCurrentStep('3/4 - Mapeando Empresas e Holdings Vinculadas...');
          const personNodeId = `person-${Date.now()}`;
          const rootPersonNode = {
            id: personNodeId,
            type: 'person',
            position: { x: 100, y: 350 },
            data: {
              id: personNodeId,
              nome: person.nome,
              cpfCnpj: person.cpfCnpj,
              qualificacao: person.qualificacao,
              isRoot: true,
              lawsuits
            }
          };

          const newNodes = [rootPersonNode];
          const newEdges = [];

          if (person.relatedCompanies && person.relatedCompanies.length > 0) {
            person.relatedCompanies.forEach((comp, idx) => {
              const compNodeId = `emp-${comp.cnpj}`;
              newNodes.push({
                id: compNodeId,
                type: 'company',
                position: { x: 550, y: 150 + idx * 220 },
                data: {
                  id: compNodeId,
                  razaoSocial: comp.razaoSocial,
                  cnpj: comp.cnpj,
                  situacaoCadastral: comp.situacaoCadastral,
                  capitalSocialFormatado: comp.capitalSocial
                }
              });
              newEdges.push({
                id: `edge-${personNodeId}-${compNodeId}`,
                source: personNodeId,
                target: compNodeId,
                label: comp.cargo || 'Sócio Participante',
                animated: true,
                style: { stroke: '#00F0FF', strokeWidth: 2 }
              });
            });
          }

          if (lawsuits.length > 0) {
            lawsuits.slice(0, 3).forEach((proc) => {
              const lawId = `lawsuit-${proc.id}`;
              newNodes.push({
                id: lawId,
                type: 'lawsuit',
                position: { x: 900, y: 350 },
                data: { ...proc, id: lawId }
              });
              newEdges.push({
                id: `edge-${personNodeId}-${lawId}`,
                source: personNodeId,
                target: lawId,
                label: proc.classe || 'Ação Judicial',
                animated: true,
                style: { stroke: '#FF3366', strokeWidth: 2 }
              });
            });
          }

          const positionedNodes = applyLayout(newNodes, newEdges, layoutType);
          setNodes(positionedNodes);
          setEdges(newEdges);
          setTimeout(() => {
            reactFlowInstance?.fitView({ padding: 0.3, duration: 600 });
          }, 150);
        }
      } else if (type === 'CNPJ') {
        const company = await fetchCompanyData(value);
        setInvestigationTitle(`Caso: ${company.razaoSocial} (${company.cnpj})`);

        setCurrentStep('2/4 - Mapeando Quadro de Sócios e Administradores (QSA)...');
        await new Promise(r => setTimeout(r, 200));

        setCurrentStep('3/4 - Rastreando Processos Judiciais no DataJud (CNJ) e Diários Oficiais...');
        const lawsuits = await fetchLawsuits(company.razaoSocial, company.endereco?.uf);
        const complianceScore = calculateComplianceScore(company, lawsuits);

        setCurrentStep('4/4 - Calculando Grafo e Matriz de Riscos de Compliance...');

        const companyNodeId = `empresa-${company.rawCnpj}`;
        
        // 1. Nó da Empresa Raiz
        const rootCompanyNode = {
          id: companyNodeId,
          type: 'company',
          position: { x: 80, y: 350 },
          data: {
            ...company,
            id: companyNodeId,
            isRoot: true,
            partnersCount: company.partners?.length || 0,
            lawsuitsCount: lawsuits.length,
            lawsuits,
            complianceScore
          }
        };

        const newNodes = [rootCompanyNode];
        const newEdges = [];

        // 2. Nós de Sócios (QSA)
        if (company.partners && company.partners.length > 0) {
          company.partners.forEach((partner) => {
            const partnerNodeId = `socio-${companyNodeId}-${partner.id}`;
            newNodes.push({
              id: partnerNodeId,
              type: 'person',
              position: { x: 580, y: 300 },
              data: {
                ...partner,
                id: partnerNodeId,
                parentCompanyId: companyNodeId,
                parentCompanyName: company.razaoSocial
              }
            });

            newEdges.push({
              id: `edge-${companyNodeId}-${partnerNodeId}`,
              source: companyNodeId,
              target: partnerNodeId,
              label: partner.qualificacao || 'Sócio',
              animated: true,
              style: { stroke: '#10b981', strokeWidth: 2 },
              markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }
            });
          });
        }

        // 3. Nós de Processos Judiciais (DataJud)
        if (lawsuits && lawsuits.length > 0) {
          lawsuits.forEach((proc) => {
            const lawsuitNodeId = `lawsuit-${proc.id}`;
            newNodes.push({
              id: lawsuitNodeId,
              type: 'lawsuit',
              position: { x: 1060, y: 300 },
              data: {
                ...proc,
                id: lawsuitNodeId,
                parentCompanyId: companyNodeId
              }
            });

            newEdges.push({
              id: `edge-${companyNodeId}-${lawsuitNodeId}`,
              source: companyNodeId,
              target: lawsuitNodeId,
              label: proc.classe || 'Ação Judicial',
              animated: true,
              style: { 
                stroke: proc.risco === 'ALTO' ? '#ef4444' : '#f59e0b', 
                strokeWidth: 2, 
                strokeDasharray: '4 3' 
              },
              markerEnd: { 
                type: MarkerType.ArrowClosed, 
                color: proc.risco === 'ALTO' ? '#ef4444' : '#f59e0b' 
              }
            });
          });
        }

        // Aplicar layout selecionado
        const positionedNodes = applyLayout(newNodes, newEdges, layoutType);

        setNodes(positionedNodes);
        setEdges(newEdges);

        setTimeout(() => {
          reactFlowInstance?.fitView({ padding: 0.3, duration: 600 });
        }, 150);
      } else if (type === 'CPF') {
        // Busca de Pessoa Física
        setCurrentStep('Rastreando ações e vínculos da pessoa física no DataJud...');
        const lawsuits = await fetchLawsuits(value);

        const personNodeId = `pessoa-${value}`;
        const newPersonNode = {
          id: personNodeId,
          type: 'person',
          position: { x: 300, y: 300 },
          data: {
            id: personNodeId,
            nome: `PESSOA FÍSICA (CPF: ${value})`,
            cpfCnpj: value,
            qualificacao: 'Investigado Primário',
            faixaEtaria: 'Sob Análise',
            lawsuits
          }
        };

        const newNodes = [newPersonNode];
        const newEdges = [];

        lawsuits.forEach((proc) => {
          const lawsuitNodeId = `lawsuit-${proc.id}`;
          newNodes.push({
            id: lawsuitNodeId,
            type: 'lawsuit',
            position: { x: 800, y: 300 },
            data: { ...proc, id: lawsuitNodeId }
          });
          newEdges.push({
            id: `edge-${personNodeId}-${lawsuitNodeId}`,
            source: personNodeId,
            target: lawsuitNodeId,
            label: proc.classe || 'Ação Judicial',
            animated: true,
            style: { stroke: '#FF3366', strokeWidth: 2 }
          });
        });

        const positioned = applyLayout(newNodes, newEdges, layoutType);
        setNodes(positioned);
        setEdges(newEdges);
        setInvestigationTitle(`Investigação de Pessoa: CPF ${value}`);
        setTimeout(() => {
          reactFlowInstance?.fitView({ padding: 0.3, duration: 600 });
        }, 150);
      } else if (type === 'EMAIL') {
        setCurrentStep('Rastreando pegada digital, domínio e MX do e-mail...');
        const emailIntel = await investigateEmail(value);
        const contactNodeId = `email-${Date.now()}`;
        const newContactNode = {
          id: contactNodeId,
          type: 'contact',
          position: { x: 300, y: 300 },
          data: {
            id: contactNodeId,
            type: 'email',
            value,
            label: 'E-mail Investigado',
            emailIntel
          }
        };

        const identityNodeId = `identity-${Date.now()}`;
        const identityNode = {
          id: identityNodeId,
          type: 'identity',
          position: { x: 750, y: 300 },
          data: {
            id: identityNodeId,
            platform: emailIntel?.type || 'Pegada Digital',
            username: value.split('@')[0],
            url: emailIntel?.gravatar?.profileUrl || `https://${emailIntel?.domain}`,
            status: emailIntel?.gravatar ? 'Perfil Gravatar Detectado' : 'Domínio Verificado',
            risk: 'BAIXO'
          }
        };

        const edge = {
          id: `edge-${contactNodeId}-${identityNodeId}`,
          source: contactNodeId,
          target: identityNodeId,
          label: 'Identidade Digital',
          animated: true,
          style: { stroke: '#A855F7', strokeWidth: 2 }
        };

        const positioned = applyLayout([newContactNode, identityNode], [edge], layoutType);
        setNodes(positioned);
        setEdges([edge]);
        setInvestigationTitle(`Pegada Digital: ${value}`);
        setTimeout(() => {
          reactFlowInstance?.fitView({ padding: 0.3, duration: 600 });
        }, 150);
      } else if (type === 'TELEFONE') {
        setCurrentStep('Consultando dados de operadora e abrangência do telefone...');
        const phoneIntel = investigatePhone(value);
        const contactNodeId = `phone-${Date.now()}`;
        const newContactNode = {
          id: contactNodeId,
          type: 'contact',
          position: { x: 300, y: 300 },
          data: {
            id: contactNodeId,
            type: 'phone',
            value: phoneIntel?.formatted || value,
            label: 'Telefone Monitorado',
            phoneIntel
          }
        };

        const carrierNodeId = `carrier-${Date.now()}`;
        const carrierNode = {
          id: carrierNodeId,
          type: 'identity',
          position: { x: 750, y: 300 },
          data: {
            id: carrierNodeId,
            platform: phoneIntel?.operadora || 'Telecomunicações',
            username: `DDD ${phoneIntel?.ddd} (${phoneIntel?.estado || 'Brasil'})`,
            url: phoneIntel?.whatsappUrl || `https://wa.me/55${phoneIntel?.raw}`,
            status: phoneIntel?.valido ? 'Linha Ativa / WhatsApp' : 'Formato Válido',
            risk: 'BAIXO'
          }
        };

        const edge = {
          id: `edge-${contactNodeId}-${carrierNodeId}`,
          source: contactNodeId,
          target: carrierNodeId,
          label: 'Operadora / Região',
          animated: true,
          style: { stroke: '#00F0FF', strokeWidth: 2 }
        };

        const positioned = applyLayout([newContactNode, carrierNode], [edge], layoutType);
        setNodes(positioned);
        setEdges([edge]);
        setInvestigationTitle(`Rastreamento Telefônico: ${phoneIntel?.formatted || value}`);
        setTimeout(() => {
          reactFlowInstance?.fitView({ padding: 0.3, duration: 600 });
        }, 150);
      } else if (type === 'RELATION') {
        // Multi-alvos para cruzamento
        const relationNodes = value.map((target, idx) => ({
          id: `target-${idx}`,
          type: target.replace(/\D/g, '').length === 14 ? 'company' : 'person',
          position: { x: 100 + idx * 350, y: 300 },
          data: {
            id: `target-${idx}`,
            razaoSocial: `Alvo Mapeado #${idx + 1}`,
            nome: `Alvo Mapeado #${idx + 1}`,
            cnpj: target,
            cpfCnpj: target,
            qualificacao: 'Pista de Cruzamento'
          }
        }));

        const relationEdges = [];
        for (let i = 0; i < relationNodes.length - 1; i++) {
          relationEdges.push({
            id: `edge-rel-${i}-${i + 1}`,
            source: relationNodes[i].id,
            target: relationNodes[i + 1].id,
            label: 'Elo Suspeito',
            animated: true,
            style: { stroke: '#00FF9D', strokeWidth: 2, strokeDasharray: '4 4' },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#00FF9D' }
          });
        }

        const positioned = applyLayout(relationNodes, relationEdges, layoutType);
        setNodes(positioned);
        setEdges(relationEdges);
        setInvestigationTitle(`Cruzamento de Conexões (${value.length} alvos)`);
        setTimeout(() => {
          reactFlowInstance?.fitView({ padding: 0.3, duration: 600 });
        }, 150);
      } else if (type === 'AERONAVE') {
        setCurrentStep('Consultando Registro Aeronáutico Brasileiro (RAB ANAC)...');
        const plane = await fetchAircraftData(value);
        
        const planeNodeId = `plane-${plane.prefixo}`;
        const ownerCompanyId = `company-${plane.cpfCnpjProprietario.replace(/\D/g, '')}`;
        
        const planeNode = {
          id: planeNodeId,
          type: 'contact',
          position: { x: 500, y: 300 },
          data: {
            id: planeNodeId,
            type: 'aircraft',
            label: `Aeronave ${plane.prefixo}`,
            value: `${plane.fabricante} ${plane.modelo} (${plane.anoFabricacao})`,
            proprietario: plane.proprietario,
            operador: plane.operador,
            gravame: plane.gravame,
            valorEstimado: plane.valorEstimado
          }
        };

        const ownerNode = {
          id: ownerCompanyId,
          type: 'company',
          position: { x: 100, y: 300 },
          data: {
            id: ownerCompanyId,
            razaoSocial: plane.proprietario,
            cnpj: plane.cpfCnpjProprietario,
            situacaoCadastral: 'ATIVA',
            capitalSocialFormatado: plane.valorEstimado
          }
        };

        const edge = {
          id: `edge-${ownerCompanyId}-${planeNodeId}`,
          source: ownerCompanyId,
          target: planeNodeId,
          label: 'Proprietário RAB',
          animated: true,
          style: { stroke: '#00F0FF', strokeWidth: 2 }
        };

        const positioned = applyLayout([ownerNode, planeNode], [edge], layoutType);
        setNodes(positioned);
        setEdges([edge]);
        setInvestigationTitle(`RAB ANAC: Aeronave ${plane.prefixo}`);
        setTimeout(() => {
          reactFlowInstance?.fitView({ padding: 0.3, duration: 600 });
        }, 150);
      } else if (type === 'VEICULO') {
        setCurrentStep('Consultando Registro Nacional de Veículos (RENAVAM / Senatran)...');
        const vehicle = await fetchVehicleData(value);
        
        const vehicleNodeId = `veh-${vehicle.placa}`;
        const ownerPersonId = `person-${vehicle.documentoProprietario.replace(/\D/g, '') || 'prop'}`;

        const vehicleNode = {
          id: vehicleNodeId,
          type: 'contact',
          position: { x: 500, y: 300 },
          data: {
            id: vehicleNodeId,
            type: 'vehicle',
            label: `Veículo ${vehicle.placa}`,
            value: `${vehicle.marcaModelo} (${vehicle.anoModelo})`,
            proprietario: vehicle.proprietario,
            restricoes: vehicle.restricoes,
            valorFipe: vehicle.valorFipe
          }
        };

        const ownerNode = {
          id: ownerPersonId,
          type: 'person',
          position: { x: 100, y: 300 },
          data: {
            id: ownerPersonId,
            nome: vehicle.proprietario,
            cpfCnpj: vehicle.documentoProprietario,
            qualificacao: 'Proprietário Registral'
          }
        };

        const edge = {
          id: `edge-${ownerPersonId}-${vehicleNodeId}`,
          source: ownerPersonId,
          target: vehicleNodeId,
          label: 'Titularidade Veicular',
          animated: true,
          style: { stroke: '#00FF9D', strokeWidth: 2 }
        };

        const positioned = applyLayout([ownerNode, vehicleNode], [edge], layoutType);
        setNodes(positioned);
        setEdges([edge]);
        setInvestigationTitle(`Bens Renavam: Veículo ${vehicle.placa}`);
        setTimeout(() => {
          reactFlowInstance?.fitView({ padding: 0.3, duration: 600 });
        }, 150);
      }
    } catch (err) {
      console.error('Erro na investigação:', err);
      setError(err.message || 'Falha ao buscar dados cadastrais.');
    } finally {
      setLoading(false);
      setCurrentStep('');
    }
  }, [layoutType, reactFlowInstance]);

  // Abertura de gaveta de detalhes
  const handleOpenDetails = useCallback((data) => {
    setSelectedEntity(data);
    setIsDrawerOpen(true);
  }, []);

  // Expansão de Processos Judiciais no Grafo
  const handleExpandLawsuits = useCallback((companyData) => {
    const companyNodeId = companyData.id;
    const lawsuits = companyData.lawsuits || [];

    if (lawsuits.length === 0) return;

    const newNodes = [...nodes];
    const newEdges = [...edges];

    lawsuits.forEach((proc, idx) => {
      const procNodeId = `lawsuit-${proc.id}`;
      if (!newNodes.some(n => n.id === procNodeId)) {
        newNodes.push({
          id: procNodeId,
          type: 'lawsuit',
          position: { x: 1060, y: 200 + idx * 220 },
          data: {
            ...proc,
            id: procNodeId,
            parentCompanyId: companyNodeId
          }
        });

        newEdges.push({
          id: `edge-${companyNodeId}-${procNodeId}`,
          source: companyNodeId,
          target: procNodeId,
          label: proc.classe || 'Ação Judicial',
          animated: true,
          style: { 
            stroke: proc.risco === 'ALTO' ? '#ef4444' : '#f59e0b', 
            strokeWidth: 2, 
            strokeDasharray: '4 3' 
          },
          markerEnd: { 
            type: MarkerType.ArrowClosed, 
            color: proc.risco === 'ALTO' ? '#ef4444' : '#f59e0b' 
          }
        });
      }
    });

    const repositioned = applyLayout(newNodes, newEdges, layoutType);
    setNodes(repositioned);
    setEdges(newEdges);

    setTimeout(() => {
      reactFlowInstance?.fitView({ padding: 0.3, duration: 600 });
    }, 150);
  }, [nodes, edges, layoutType, reactFlowInstance]);

  // Expansão de tentáculos societários: busca empresas de um sócio
  const handleExpandCompanies = useCallback(async (partnerData) => {
    try {
      const companies = await fetchPartnerNetwork(partnerData.nome, partnerData.rawCpfCnpj);
      const partnerNodeId = partnerData.id;

      const newNodes = [...nodes];
      const newEdges = [...edges];

      companies.forEach((comp, idx) => {
        const compNodeId = `coligada-${partnerNodeId}-${idx}`;
        if (!newNodes.some(n => n.id === compNodeId)) {
          newNodes.push({
            id: compNodeId,
            type: 'company',
            position: { x: 1540, y: 200 + idx * 250 },
            data: {
              id: compNodeId,
              cnpj: comp.cnpj,
              razaoSocial: comp.razaoSocial,
              situacao: 'ATIVA',
              capitalSocialFormatado: 'R$ 5.000.000,00',
              cnae: {
                codigo: '6462-0/00',
                descricao: 'Holdings de instituições não-financeiras',
                categoria: { label: 'Financeiro', color: '#059669', icon: 'Landmark', bgColor: 'rgba(5, 150, 105, 0.15)', borderColor: '#10b981' }
              },
              partnersCount: 2
            }
          });

          newEdges.push({
            id: `edge-${partnerNodeId}-${compNodeId}`,
            source: partnerNodeId,
            target: compNodeId,
            label: comp.qualificacao || 'Administrador',
            animated: true,
            style: { stroke: '#2F80ED', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#2F80ED' }
          });
        }
      });

      const repositioned = applyLayout(newNodes, newEdges, layoutType);
      setNodes(repositioned);
      setEdges(newEdges);

      setTimeout(() => {
        reactFlowInstance?.fitView({ padding: 0.3, duration: 600 });
      }, 150);
    } catch (err) {
      console.error('Erro ao expandir empresas:', err);
    }
  }, [nodes, edges, layoutType, reactFlowInstance]);

  // Expansão de contatos (telefones e e-mails) da empresa no grafo
  const handleExpandContacts = useCallback((companyData) => {
    const companyNodeId = companyData.id;
    const newNodes = [...nodes];
    const newEdges = [...edges];

    // Telefones
    companyData.telefones?.forEach((tel, idx) => {
      const telId = `phone-${companyNodeId}-${idx}`;
      if (!newNodes.some(n => n.id === telId)) {
        newNodes.push({
          id: telId,
          type: 'contact',
          position: { x: 1540, y: 400 + idx * 100 },
          data: {
            id: telId,
            type: 'phone',
            value: tel,
            label: 'Telefone Oficial'
          }
        });

        newEdges.push({
          id: `edge-${companyNodeId}-${telId}`,
          source: companyNodeId,
          target: telId,
          label: 'Telefone',
          animated: true,
          style: { stroke: '#8B5CF6', strokeWidth: 1.5, strokeDasharray: '3 3' },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#8B5CF6' }
        });
      }
    });

    // E-mails
    companyData.emails?.forEach((mail, idx) => {
      const mailId = `mail-${companyNodeId}-${idx}`;
      if (!newNodes.some(n => n.id === mailId)) {
        newNodes.push({
          id: mailId,
          type: 'contact',
          position: { x: 1540, y: 550 + idx * 100 },
          data: {
            id: mailId,
            type: 'email',
            value: mail,
            label: 'E-mail Oficial'
          }
        });

        newEdges.push({
          id: `edge-${companyNodeId}-${mailId}`,
          source: companyNodeId,
          target: mailId,
          label: 'E-mail',
          animated: true,
          style: { stroke: '#EC4899', strokeWidth: 1.5, strokeDasharray: '3 3' },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#EC4899' }
        });
      }
    });

    const repositioned = applyLayout(newNodes, newEdges, layoutType);
    setNodes(repositioned);
    setEdges(newEdges);

    setTimeout(() => {
      reactFlowInstance?.fitView({ padding: 0.3, duration: 600 });
    }, 150);
  }, [nodes, edges, layoutType, reactFlowInstance]);

  // Abrir modal de Transformações de Inteligência CataVínculo
  const handleOpenTransforms = useCallback((node) => {
    setSelectedTransformNode(node);
    setIsTransformOpen(true);
  }, []);

  // Expansão de Infraestrutura Digital (Shodan / DNS / crt.sh)
  const handleExpandInfra = useCallback(async (companyData) => {
    try {
      const companyNodeId = companyData.id;
      const domain = extractDomainFromCompany(companyData) || `${companyData.rawCnpj || 'empresa'}.com.br`;
      const infra = await fetchDomainInfrastructure(domain);
      if (!infra) return;

      const infraNodeId = `infra-${companyNodeId}`;
      const newNodes = [...nodes];
      const newEdges = [...edges];

      // Atualiza os dados de infraestrutura na empresa
      const compIdx = newNodes.findIndex(n => n.id === companyNodeId);
      if (compIdx !== -1) {
        newNodes[compIdx] = {
          ...newNodes[compIdx],
          data: {
            ...newNodes[compIdx].data,
            infra
          }
        };
      }

      if (!newNodes.some(n => n.id === infraNodeId)) {
        newNodes.push({
          id: infraNodeId,
          type: 'infrastructure',
          position: { x: 1540, y: 350 },
          data: {
            ...infra,
            id: infraNodeId,
            parentCompanyId: companyNodeId
          }
        });

        newEdges.push({
          id: `edge-${companyNodeId}-${infraNodeId}`,
          source: companyNodeId,
          target: infraNodeId,
          label: 'Shodan / Host',
          animated: true,
          style: { stroke: '#06B6D4', strokeWidth: 2, strokeDasharray: '4 2' },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#06B6D4' }
        });
      }

      const repositioned = applyLayout(newNodes, newEdges, layoutType);
      setNodes(repositioned);
      setEdges(newEdges);

      setTimeout(() => {
        reactFlowInstance?.fitView({ padding: 0.3, duration: 600 });
      }, 150);
    } catch (err) {
      console.error('Erro ao expandir infraestrutura:', err);
    }
  }, [nodes, edges, layoutType, reactFlowInstance]);

  // Expansão de Pegada Digital (OSINT Industries / PIX / Contas)
  const handleExpandFootprint = useCallback(async (contactData) => {
    try {
      const contactId = contactData.id;
      const isEmail = contactData.type === 'email' || String(contactData.value).includes('@');
      const footprint = isEmail 
        ? await investigateEmail(contactData.value) 
        : investigatePhone(contactData.value);

      const identityNodeId = `identity-${contactId}`;
      const newNodes = [...nodes];
      const newEdges = [...edges];

      if (!newNodes.some(n => n.id === identityNodeId)) {
        newNodes.push({
          id: identityNodeId,
          type: 'identity',
          position: { x: 1540, y: 450 },
          data: {
            id: identityNodeId,
            target: contactData.value,
            type: isEmail ? 'email' : 'phone',
            footprint,
            parentContactId: contactId
          }
        });

        newEdges.push({
          id: `edge-${contactId}-${identityNodeId}`,
          source: contactId,
          target: identityNodeId,
          label: 'OSINT Footprint',
          animated: true,
          style: { stroke: '#8B5CF6', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#8B5CF6' }
        });
      }

      const repositioned = applyLayout(newNodes, newEdges, layoutType);
      setNodes(repositioned);
      setEdges(newEdges);

      setTimeout(() => {
        reactFlowInstance?.fitView({ padding: 0.3, duration: 600 });
      }, 150);
    } catch (err) {
      console.error('Erro ao expandir pegada digital:', err);
    }
  }, [nodes, edges, layoutType, reactFlowInstance]);

  // Expansão de Processos da Pessoa Física (DataJud)
  const handleExpandPersonLawsuits = useCallback(async (personData) => {
    try {
      const personNodeId = personData.id;
      const lawsuits = await fetchLawsuits(personData.nome);
      if (!lawsuits || lawsuits.length === 0) return;

      const newNodes = [...nodes];
      const newEdges = [...edges];

      lawsuits.forEach((proc, idx) => {
        const procNodeId = `lawsuit-person-${proc.id}`;
        if (!newNodes.some(n => n.id === procNodeId)) {
          newNodes.push({
            id: procNodeId,
            type: 'lawsuit',
            position: { x: 1060, y: 200 + idx * 220 },
            data: {
              ...proc,
              id: procNodeId,
              parentPersonId: personNodeId
            }
          });

          newEdges.push({
            id: `edge-${personNodeId}-${procNodeId}`,
            source: personNodeId,
            target: procNodeId,
            label: proc.classe || 'Ação Judicial',
            animated: true,
            style: { 
              stroke: proc.risco === 'ALTO' ? '#ef4444' : '#f59e0b', 
              strokeWidth: 2, 
              strokeDasharray: '4 3' 
            },
            markerEnd: { 
              type: MarkerType.ArrowClosed, 
              color: proc.risco === 'ALTO' ? '#ef4444' : '#f59e0b' 
            }
          });
        }
      });

      const repositioned = applyLayout(newNodes, newEdges, layoutType);
      setNodes(repositioned);
      setEdges(newEdges);

      setTimeout(() => {
        reactFlowInstance?.fitView({ padding: 0.3, duration: 600 });
      }, 150);
    } catch (err) {
      console.error('Erro ao expandir ações da pessoa:', err);
    }
  }, [nodes, edges, layoutType, reactFlowInstance]);

  // Expansão de Subdomínios como nós
  const handleExpandSubdomains = useCallback((infraNode) => {
    const subdomains = infraNode.data?.subdomains || [];
    if (subdomains.length === 0) return;

    const infraNodeId = infraNode.id;
    const newNodes = [...nodes];
    const newEdges = [...edges];

    subdomains.slice(0, 5).forEach((sub, idx) => {
      const subId = `subdomain-${infraNodeId}-${idx}`;
      if (!newNodes.some(n => n.id === subId)) {
        newNodes.push({
          id: subId,
          type: 'infrastructure',
          position: { x: 2020, y: 200 + idx * 180 },
          data: {
            id: subId,
            domain: sub,
            ip: infraNode.data?.ip,
            geo: infraNode.data?.geo,
            mailProvider: infraNode.data?.mailProvider,
            subdomains: [],
            shodanUrl: `https://www.shodan.io/search?query=hostname:${sub}`
          }
        });

        newEdges.push({
          id: `edge-${infraNodeId}-${subId}`,
          source: infraNodeId,
          target: subId,
          label: 'Subdomínio',
          animated: true,
          style: { stroke: '#06B6D4', strokeWidth: 1.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#06B6D4' }
        });
      }
    });

    const repositioned = applyLayout(newNodes, newEdges, layoutType);
    setNodes(repositioned);
    setEdges(newEdges);

    setTimeout(() => {
      reactFlowInstance?.fitView({ padding: 0.3, duration: 600 });
    }, 150);
  }, [nodes, edges, layoutType, reactFlowInstance]);

  // Executor de Transformações de Inteligência CataVínculo
  const handleRunTransform = useCallback(async (transformId, targetNode) => {
    if (!targetNode) return;

    if (transformId === 'expand_partners') {
      handleSearch({ type: 'CNPJ', value: targetNode.data.rawCnpj });
    } else if (transformId === 'expand_lawsuits') {
      handleExpandLawsuits(targetNode.data);
    } else if (transformId === 'expand_infra') {
      handleExpandInfra(targetNode.data);
    } else if (transformId === 'expand_contacts') {
      handleExpandContacts(targetNode.data);
    } else if (transformId === 'expand_person_companies') {
      handleExpandCompanies(targetNode.data);
    } else if (transformId === 'expand_person_lawsuits') {
      handleExpandPersonLawsuits(targetNode.data);
    } else if (transformId === 'expand_person_footprint') {
      handleExpandFootprint({ id: targetNode.id, value: targetNode.data.nome, type: 'person' });
    } else if (transformId === 'expand_footprint') {
      handleExpandFootprint(targetNode.data);
    } else if (transformId === 'expand_subdomains') {
      handleExpandSubdomains(targetNode);
    }
  }, [handleSearch, handleExpandLawsuits, handleExpandInfra, handleExpandContacts, handleExpandCompanies, handleExpandPersonLawsuits, handleExpandFootprint, handleExpandSubdomains]);

  // Exclusão de Nó
  const handleDeleteNode = useCallback((nodeId) => {
    setNodes(nds => nds.filter(n => n.id !== nodeId));
    setEdges(eds => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
  }, []);

  // Adição de Nó Manual
  const handleAddNode = useCallback((newNode) => {
    setNodes(nds => [...nds, newNode]);
  }, []);

  // Mudança de Layout
  const handleChangeLayout = useCallback((newLayout) => {
    setLayoutType(newLayout);
    setNodes(nds => {
      const repositioned = applyLayout(nds, edges, newLayout);
      return repositioned;
    });
    setTimeout(() => {
      reactFlowInstance?.fitView({ padding: 0.3, duration: 600 });
    }, 100);
  }, [edges, reactFlowInstance]);

  // Recentralizar
  const handleFitView = useCallback(() => {
    reactFlowInstance?.fitView({ padding: 0.3, duration: 600 });
  }, [reactFlowInstance]);

  // Limpar Caso
  const handleResetCase = useCallback(() => {
    if (nodes.length > 0 && !window.confirm('Deseja iniciar um novo caso e limpar o grafo atual?')) {
      return;
    }
    setNodes([]);
    setEdges([]);
    setInvestigationTitle('Novo Caso de Investigação');
  }, [nodes]);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#040406] hacker-bg text-white overflow-hidden">
      
      {/* Top Header Padronizado */}
      <Header
        layoutType={layoutType}
        onChangeLayout={handleChangeLayout}
        onResetCase={handleResetCase}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenAddNode={() => setIsAddNodeOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenSubscription={() => setIsSubscriptionOpen(true)}
        onOpenDossier={() => setIsDossierOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onFitView={handleFitView}
        nodeCounts={nodeCounts}
        activeFilters={activeFilters}
        onToggleFilter={handleToggleFilter}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        hasActiveCase={nodes.length > 0}
      />

      {/* Condicional: Modo Google Centralizado (Caso Novo/Vazio) vs Área de Investigação com Grafo */}
      {nodes.length === 0 ? (
        <div className="flex-1 w-full h-full flex flex-col justify-between relative overflow-y-auto overflow-x-hidden">
          <main className="flex-1 w-full flex flex-col items-center justify-center p-4">
            <SearchBar
              isHeroMode={true}
              onSearch={handleSearch}
              loading={loading}
              currentStep={currentStep}
              error={error}
              onClearError={() => setError('')}
            />
          </main>
          <Footer onOpenAbout={() => setIsAboutOpen(true)} />
        </div>
      ) : (
        <div className="flex-1 w-full h-full flex flex-col justify-between relative overflow-hidden">
          {/* Rastro Cognitivo / Breadcrumb */}
          <div className="hidden sm:flex items-center justify-between px-6 py-2 bg-[#06080d]/95 border-b border-emerald-500/20 text-xs text-zinc-400 overflow-x-auto z-20 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 shrink-0 flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,255,157,0.2)] font-mono">
                Alvo Ativo
              </span>
              <span className="font-semibold text-zinc-100 truncate max-w-sm font-mono">
                {investigationTitle}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-cyan-400 font-mono font-medium">{nodeCounts.companies} Empresas</span>
              <span className="text-zinc-600">➔</span>
              <span className="text-emerald-400 font-mono font-medium">{nodeCounts.partners} Sócios</span>
              <span className="text-zinc-600">➔</span>
              <span className="text-rose-400 font-mono font-medium">{nodeCounts.lawsuits} Ações DataJud</span>
              {nodeCounts.infrastructure > 0 && (
                <>
                  <span className="text-zinc-600">➔</span>
                  <span className="text-cyan-400 font-mono font-medium">{nodeCounts.infrastructure} Shodan</span>
                </>
              )}
              {nodeCounts.identity > 0 && (
                <>
                  <span className="text-zinc-600">➔</span>
                  <span className="text-purple-400 font-mono font-medium">{nodeCounts.identity} OSINT</span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={handleResetCase}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-bold transition-all shadow-[0_0_10px_rgba(0,255,157,0.15)]"
              title="Voltar à Central de Busca do Google OSINT"
            >
              <span>+ Nova Busca (Google Central)</span>
            </button>
          </div>

          {/* Floating Search Bar Docked sobre o Canvas ou Banner em Cards */}
          <div className={`z-30 transition-all ${
            viewMode === 'cards' 
              ? 'bg-[#06080d]/95 border-b border-emerald-500/20 py-2 shadow-xl backdrop-blur-xl' 
              : 'absolute top-14 left-0 right-0 pointer-events-none'
          }`}>
            <div className={viewMode === 'graph' ? 'pointer-events-auto' : ''}>
              <SearchBar
                isHeroMode={false}
                onSearch={handleSearch}
                loading={loading}
                currentStep={currentStep}
                error={error}
                onClearError={() => setError('')}
              />
            </div>
          </div>

          {/* Conteúdo Principal: Grafo Relacional ⟷ Painel Estruturado em Cards */}
          <main className="flex-1 w-full h-full relative overflow-hidden pb-14 md:pb-0">
            {viewMode === 'graph' ? (
              <BoardCanvas
                nodes={visibleNodes}
                edges={visibleEdges}
                setNodes={setNodes}
                setEdges={setEdges}
                onNodeClick={(_, node) => handleOpenDetails(node.data)}
                onOpenDetails={handleOpenDetails}
                onOpenTransforms={handleOpenTransforms}
                onExpandPartners={(companyData) => {
                  handleSearch({ type: 'CNPJ', value: companyData.rawCnpj });
                }}
                onExpandContacts={handleExpandContacts}
                onExpandCompanies={handleExpandCompanies}
                onExpandLawsuits={handleExpandLawsuits}
                onExpandInfra={handleExpandInfra}
                onExpandFootprint={handleExpandFootprint}
                onDeleteNode={handleDeleteNode}
                reactFlowInstance={reactFlowInstance}
                setReactFlowInstance={setReactFlowInstance}
              />
            ) : (
              <CardGridView
                nodes={visibleNodes}
                onOpenDetails={handleOpenDetails}
                onOpenTransforms={handleOpenTransforms}
                onExpandPartners={(companyData) => {
                  handleSearch({ type: 'CNPJ', value: companyData.rawCnpj });
                }}
                onExpandCompanies={handleExpandCompanies}
                onExpandLawsuits={handleExpandLawsuits}
                onExpandInfra={handleExpandInfra}
                onExpandFootprint={handleExpandFootprint}
                onDeleteNode={handleDeleteNode}
              />
            )}
          </main>
          <Footer onOpenAbout={() => setIsAboutOpen(true)} />
        </div>
      )}

      {/* Bottom Nav Mobile Estilo React Native / Expo */}
      <MobileBottomNav
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenAddNode={() => setIsAddNodeOpen(true)}
        onOpenDossier={() => setIsDossierOpen(true)}
        nodeCounts={nodeCounts}
        hasActiveCase={hasActiveCase}
      />

      {/* Banner de Instalação PWA */}
      <PWAInstallBanner />

      {/* Slide-over Drawer com Detalhes Cadastrais, QSA, Ações Judiciais e Fontes OSINT */}
      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        data={selectedEntity}
        onExpandSocio={(socio) => {
          setIsDrawerOpen(false);
          handleExpandCompanies(socio);
        }}
        onExpandLawsuits={(companyData) => {
          setIsDrawerOpen(false);
          handleExpandLawsuits(companyData);
        }}
        onExpandInfra={(companyData) => {
          setIsDrawerOpen(false);
          handleExpandInfra(companyData);
        }}
        onOpenTransforms={(node) => {
          setIsDrawerOpen(false);
          handleOpenTransforms(node);
        }}
      />

      {/* Modal de Métricas & Gráficos Modernos de Compliance e Superfície OSINT */}
      <AnalyticsCharts
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        nodes={nodes}
      />

      {/* Modal de Dossiê Investigativo para Petição Judicial (CataVínculo Dossier) */}
      <DossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        nodes={nodes}
        edges={edges}
        selectedEntity={selectedEntity}
      />

      {/* Modal de Exportação com Ações Judiciais, PDF Pericial e XLSX */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        nodes={nodes}
        edges={edges}
        investigationTitle={investigationTitle}
      />

      {/* Modal para Inserir Pistas Manuais */}
      <AddNodeModal
        isOpen={isAddNodeOpen}
        onClose={() => setIsAddNodeOpen(false)}
        onAddNode={handleAddNode}
      />

      {/* Modal de Transformações de Inteligência CataVínculo Hub */}
      <TransformMenu
        isOpen={isTransformOpen}
        onClose={() => setIsTransformOpen(false)}
        selectedNode={selectedTransformNode}
        onRunTransform={handleRunTransform}
      />

      {/* Modal Sobre as Fontes de Consulta e Legalidade */}
      <AboutSourcesModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

    </div>
  );
}
