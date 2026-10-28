// Categorização inteligente de CNAEs para classificação visual de empresas

export const CNAE_CATEGORIES = {
  TECNOLOGIA: {
    id: 'tecnologia',
    label: 'Tecnologia & Software',
    color: '#2563EB',
    bgColor: 'rgba(37, 99, 235, 0.15)',
    borderColor: '#3b82f6',
    icon: 'Cpu',
    codes: ['62', '63', '58']
  },
  FINANCEIRO: {
    id: 'financeiro',
    label: 'Serviços Financeiros',
    color: '#059669',
    bgColor: 'rgba(5, 150, 105, 0.15)',
    borderColor: '#10b981',
    icon: 'Landmark',
    codes: ['64', '65', '66']
  },
  SAUDE: {
    id: 'saude',
    label: 'Saúde & Cuidados',
    color: '#EC4899',
    bgColor: 'rgba(236, 72, 153, 0.15)',
    borderColor: '#f472b6',
    icon: 'HeartPulse',
    codes: ['86', '87', '88']
  },
  INDUSTRIA: {
    id: 'industria',
    label: 'Indústria & Manufatura',
    color: '#7C3AED',
    bgColor: 'rgba(124, 58, 237, 0.15)',
    borderColor: '#8b5cf6',
    icon: 'Factory',
    codes: ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33']
  },
  COMERCIO: {
    id: 'comercio',
    label: 'Comércio & Varejo',
    color: '#0891B2',
    bgColor: 'rgba(8, 145, 178, 0.15)',
    borderColor: '#06b6d4',
    icon: 'ShoppingBag',
    codes: ['45', '46', '47']
  },
  CONSTRUCAO: {
    id: 'construcao',
    label: 'Construção & Engenharia',
    color: '#D97706',
    bgColor: 'rgba(217, 119, 6, 0.15)',
    borderColor: '#f59e0b',
    icon: 'HardHat',
    codes: ['41', '42', '43', '71']
  },
  TRANSPORTE: {
    id: 'transporte',
    label: 'Transporte & Logística',
    color: '#EAB308',
    bgColor: 'rgba(234, 179, 8, 0.15)',
    borderColor: '#facc15',
    icon: 'Truck',
    codes: ['49', '50', '51', '52', '53']
  },
  AGRONEGOCIO: {
    id: 'agronegocio',
    label: 'Agronomia & Pecuária',
    color: '#16A34A',
    bgColor: 'rgba(22, 163, 74, 0.15)',
    borderColor: '#22c55e',
    icon: 'Sprout',
    codes: ['01', '02', '03']
  },
  ENERGIA: {
    id: 'energia',
    label: 'Energia & Utilities',
    color: '#CA8A04',
    bgColor: 'rgba(202, 138, 4, 0.15)',
    borderColor: '#eab308',
    icon: 'Zap',
    codes: ['35', '36', '37', '38', '39']
  },
  EDUCACAO: {
    id: 'educacao',
    label: 'Educação & Ensino',
    color: '#DC2626',
    bgColor: 'rgba(220, 38, 38, 0.15)',
    borderColor: '#ef4444',
    icon: 'GraduationCap',
    codes: ['85']
  },
  SERVICOS: {
    id: 'servicos',
    label: 'Serviços Profissionais',
    color: '#0D9488',
    bgColor: 'rgba(13, 148, 136, 0.15)',
    borderColor: '#14b8a6',
    icon: 'Briefcase',
    codes: ['69', '70', '73', '74', '77', '78', '80', '81', '82']
  },
  ALIMENTACAO: {
    id: 'alimentacao',
    label: 'Alimentação & Hospedagem',
    color: '#EA580C',
    bgColor: 'rgba(234, 88, 12, 0.15)',
    borderColor: '#f97316',
    icon: 'Utensils',
    codes: ['55', '56']
  },
  OUTROS: {
    id: 'outros',
    label: 'Atividades Diversas',
    color: '#2870d2',
    bgColor: 'rgba(40, 112, 210, 0.15)',
    borderColor: '#60a5fa',
    icon: 'Building2',
    codes: []
  }
};

export function getCnaeCategory(cnaeCode) {
  if (!cnaeCode) return CNAE_CATEGORIES.OUTROS;
  const cleanCode = String(cnaeCode).replace(/\D/g, '');
  const prefix2 = cleanCode.slice(0, 2);

  for (const key of Object.keys(CNAE_CATEGORIES)) {
    const cat = CNAE_CATEGORIES[key];
    if (cat.codes.includes(prefix2)) {
      return cat;
    }
  }
  return CNAE_CATEGORIES.OUTROS;
}
