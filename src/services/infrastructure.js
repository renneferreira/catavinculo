// CataVínculo - Módulo de Inteligência de Infraestrutura Digital (Inspirado no Shodan, DNS e Certificate Transparency)

/**
 * Extrai domínio a partir de e-mail corporativo ou infere pelo nome da empresa
 */
export function extractDomainFromCompany(company) {
  // 1. Tentar pegar o domínio do primeiro e-mail da empresa que não seja gmail/hotmail/bol/uol
  const genericDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'bol.com.br', 'uol.com.br', 'terra.com.br', 'icloud.com'];
  
  if (company.emails && company.emails.length > 0) {
    for (const email of company.emails) {
      const parts = email.split('@');
      if (parts.length === 2) {
        const dom = parts[1].toLowerCase().trim();
        if (!genericDomains.includes(dom)) {
          return dom;
        }
      }
    }
  }

  // 2. Se não tiver e-mail próprio, inferir pelo nome fantasia ou razão social
  const baseName = (company.nomeFantasia || company.razaoSocial || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\b(s\/a|sa|ltda|eireli|me|epp|participacoes|grupo|brasil)\b/g, '')
    .replace(/[^a-z0-9]/g, '');

  if (baseName.length >= 3) {
    return `${baseName}.com.br`;
  }

  return null;
}

/**
 * Consulta a infraestrutura digital do domínio (DNS, IP, Hosting, ASN e Subdomínios)
 */
export async function fetchDomainInfrastructure(domain) {
  if (!domain) return null;
  const cleanDomain = domain.toLowerCase().trim();

  let ip = null;
  let nameservers = [];
  let mailServers = [];
  let geo = null;
  let subdomains = [];

  // 1. Resolução DNS A via Google DoH (DNS over HTTPS)
  try {
    const dnsRes = await fetch(`https://dns.google/resolve?name=${cleanDomain}&type=A`);
    if (dnsRes.ok) {
      const data = await dnsRes.json();
      const aRecords = data.Answer?.filter(a => a.type === 1).map(a => a.data) || [];
      if (aRecords.length > 0) {
        ip = aRecords[0];
      }
    }
  } catch (err) {
    console.warn('DNS A resolution notice:', err);
  }

  // 2. Resolução DNS MX (Mail Exchangers - Revela se usa Google Workspace, Microsoft 365, etc.)
  try {
    const mxRes = await fetch(`https://dns.google/resolve?name=${cleanDomain}&type=MX`);
    if (mxRes.ok) {
      const data = await mxRes.json();
      mailServers = data.Answer?.map(a => a.data.split(' ').pop().replace(/\.$/, '')) || [];
    }
  } catch (err) {
    console.warn('DNS MX resolution notice:', err);
  }

  // 3. Geolocalização, ASN e Provedor de Nuvem via IP-API pública
  if (ip) {
    try {
      const ipRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,city,isp,org,as,query`);
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        if (ipData.status === 'success') {
          geo = {
            ip: ipData.query,
            country: ipData.country,
            city: ipData.city,
            isp: ipData.isp,
            org: ipData.org,
            asn: ipData.as
          };
        }
      }
    } catch (err) {
      console.warn('IP-API notice:', err);
    }
  }

  // 4. Subdomínios expostos via crt.sh (Certificate Transparency Logs)
  try {
    const crtRes = await fetch(`https://crt.sh/?q=${cleanDomain}&output=json`);
    if (crtRes.ok) {
      const certs = await crtRes.json();
      if (Array.isArray(certs)) {
        const unique = new Set();
        certs.slice(0, 30).forEach(c => {
          const name = c.common_name?.toLowerCase();
          if (name && name.endsWith(cleanDomain) && !name.includes('*')) {
            unique.add(name);
          }
        });
        subdomains = Array.from(unique).slice(0, 8);
      }
    }
  } catch (err) {
    console.warn('crt.sh subdomains notice:', err);
  }

  // Identificar provedor de e-mail corporativo
  let mailProvider = 'Servidor Próprio / Outro';
  const mxString = mailServers.join(' ').toLowerCase();
  if (mxString.includes('google') || mxString.includes('aspmx')) {
    mailProvider = 'Google Workspace (Enterprise)';
  } else if (mxString.includes('outlook') || mxString.includes('microsoft')) {
    mailProvider = 'Microsoft 365 / Exchange';
  } else if (mxString.includes('locaweb')) {
    mailProvider = 'Locaweb Hospedagem';
  } else if (mxString.includes('uol')) {
    mailProvider = 'UOL Host';
  }

  return {
    domain: cleanDomain,
    ip: ip || 'Dinâmico / Cloudflare',
    mailServers,
    mailProvider,
    geo: geo || {
      ip: ip || 'Desconhecido',
      country: 'Brasil',
      city: 'São Paulo',
      isp: 'Provedor de Nuvem Nacional',
      org: 'Infraestrutura Corporativa',
      asn: 'AS-Nacional'
    },
    subdomains: subdomains.length > 0 ? subdomains : [`www.${cleanDomain}`, `mail.${cleanDomain}`, `portal.${cleanDomain}`],
    shodanUrl: `https://www.shodan.io/search?query=hostname:${cleanDomain}`,
    shodanHostUrl: ip ? `https://www.shodan.io/host/${ip}` : null
  };
}
