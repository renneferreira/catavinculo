// CataVínculo - Módulo de Pegada Digital e Redes (Inspirado no OSINT Industries)

/**
 * Investigação de pegada digital de E-mail
 */
export async function investigateEmail(email) {
  if (!email) return null;
  const cleanEmail = String(email).toLowerCase().trim();
  const domain = cleanEmail.split('@')[1] || '';

  // Identificar tipo de e-mail (corporativo vs gratuito)
  const isGeneric = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'bol.com.br', 'uol.com.br'].includes(domain);

  let gravatarProfile = null;
  // Consulta Gravatar Profile via hash SHA-256 (API pública aberta)
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(cleanEmail);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const res = await fetch(`https://api.gravatar.com/v3/profiles/${hashHex}`);
    if (res.ok) {
      const gData = await res.json();
      gravatarProfile = {
        displayName: gData.display_name,
        profileUrl: gData.profile_url,
        avatarUrl: gData.avatar_url
      };
    }
  } catch (err) {
    console.warn('Gravatar notice:', err);
  }

  return {
    email: cleanEmail,
    domain,
    type: isGeneric ? 'Provedor Pessoal / Público' : 'E-mail Corporativo Próprio',
    gravatar: gravatarProfile,
    platforms: [
      { name: 'Google Workspace', status: domain.includes('gmail') || !isGeneric ? 'Detectado / Compatível' : 'Não verificado' },
      { name: 'Microsoft 365', status: domain.includes('outlook') || domain.includes('hotmail') ? 'Detectado' : 'Compatível' },
      { name: 'LinkedIn', searchUrl: `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(cleanEmail)}` },
      { name: 'GitHub', searchUrl: `https://github.com/search?q=${encodeURIComponent(cleanEmail)}&type=users` },
      { name: 'HaveIBeenPwned', checkUrl: `https://haveibeenpwned.com/account/${encodeURIComponent(cleanEmail)}` },
      { name: 'Hunter.io', checkUrl: `https://hunter.io/try/search/${domain}` }
    ]
  };
}

/**
 * Investigação de Telefone Brasileiro (Operadora, DDD, WhatsApp e Chave PIX)
 */
export function investigatePhone(phone) {
  if (!phone) return null;
  const digits = String(phone).replace(/\D/g, '');
  const ddd = digits.slice(0, 2);
  const firstDigit = digits.length === 11 ? digits.charAt(2) : digits.charAt(2);

  // Mapeamento básico de operadoras no Brasil por DDD/prefixo
  const dddMap = {
    '11': 'São Paulo (Capital e Região Metropolitana)',
    '19': 'Campinas e Interior de SP',
    '21': 'Rio de Janeiro (Capital e Grande Rio)',
    '31': 'Belo Horizonte e Região Metropolitana (MG)',
    '41': 'Curitiba e Região Metropolitana (PR)',
    '51': 'Porto Alegre e Região Metropolitana (RS)',
    '61': 'Brasília / Distrito Federal',
    '71': 'Salvador e Região Metropolitana (BA)',
    '81': 'Recife e Região Metropolitana (PE)',
    '85': 'Fortaleza e Região Metropolitana (CE)'
  };

  const regiao = dddMap[ddd] || `DDD ${ddd} (Brasil)`;
  const isMobile = digits.length === 11 && firstDigit === '9';
  const whatsappUrl = `https://wa.me/55${digits}`;

  return {
    raw: phone,
    digits,
    ddd,
    regiao,
    tipo: isMobile ? 'Celular (Móvel)' : 'Telefone Fixo / PABX',
    isPixCandidate: isMobile,
    whatsappUrl,
    lookupTools: [
      { name: 'WhatsApp Web Direto', url: whatsappUrl, icon: 'MessageCircle' },
      { name: 'Consulta Operadora (Qual Empresa Me Ligou)', url: 'https://qualempresameligou.com.br/', icon: 'PhoneCall' },
      { name: 'Truecaller Search', url: `https://www.truecaller.com/search/br/${digits}`, icon: 'Search' }
    ]
  };
}
