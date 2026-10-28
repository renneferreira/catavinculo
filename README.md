# 🔍 CataVínculo — Investigação e Inteligência em Fontes Abertas

Plataforma avançada de inteligência pericial e investigação em fontes abertas (OSINT), projetada para mapeamento visual de teias societárias, detecção de interpostas pessoas ("laranjas"), cruzamento de vínculos patrimoniais e geração de relatórios probatórios.

Desenvolvido por **Rennê Santos** ([@oxe.renne](https://www.instagram.com/oxe.renne/)) — Cibersegurança, Inteligência Digital & Privacidade.

---

## ⚡ Vetores Periciais de Investigação

O CataVínculo integra múltiplos vetores de busca com validação cadastral e enriquecimento automático:

1. **Nome / Razão Social:** Consulta de Pessoas Físicas e Jurídicas na base da Receita Federal e fontes abertas.
2. **CNPJ:** Quadro de Sócios e Administradores (QSA), capital social, CNAE, situação cadastral e filiais.
3. **CPF:** Identificação de participações societárias e empresas coligadas.
4. **Cruzamento Multi-Alvo:** Mapeamento de nós em comum para detecção de grupos econômicos de fato e laranjas.
5. **E-mail OSINT:** Identificação de pegada digital, serviços correlatos, domínios e titularidades.
6. **Telefone:** Mapeamento de operadora, DDD regional, WhatsApp e empresas vinculadas ao contato.
7. **Aeronave RAB:** Consulta de propriedade, operador e situação na ANAC (Registro Aeronáutico Brasileiro).
8. **Veículo / Renavam:** Validação de frotas, placas e indicadores patrimoniais.

---

## 🚀 Funcionalidades & Arquitetura Forense

* **Grafo Relacional Interativo:** Visualização em teia (via `@xyflow/react`) com nós especializados para Empresas, Sócios, Processos Judiciais (DataJud) e Infraestrutura Digital.
* **Visão em Cards Estruturados:** Modo alternativo neuroadaptado para leitura ágil e comparativa dos alvos.
* **Dossiê Judicial Especializado:** Geração automatizada de relatórios em 3 modalidades:
  * *Execução:* Localização de bens e ativos ocultos para penhora (SISBAJUD/RENAJUD).
  * *IDPJ:* Incidente de Desconsideração da Personalidade Jurídica (Art. 50 CC / Art. 133 CPC).
  * *Compliance:* Due diligence preventivo e compliance reputacional.
* **Exportação Multiformato:** Exportação completa das evidências e dossiês em **PDF pericial**, planilha **Excel (XLSX)** estruturada e imagem de alta resolução.
* **PWA & Mobile First:** Aplicativo instalável (Progressive Web App) para iOS (Safari Web Clip) e Android/Desktop, com operação offline-first e navegação tátil háptica.

---

## 🛠️ Stack Tecnológica

* **Frontend:** React 19, Vite, Tailwind CSS v4
* **Grafos & Visualização:** `@xyflow/react` (React Flow)
* **Geração de Documentos:** `jspdf`, `xlsx` (SheetJS), `html-to-image`
* **Ícones:** `lucide-react`
* **Linter & Otimização:** `oxlint`

---

## 💻 Como Executar Localmente

### Pré-requisitos
* Node.js 20+
* npm

### Instalação
```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento local
npm run dev

# Compilar para produção
npm run build

# Executar linter
npm run lint
```

---

## ⚖️ Conformidade Legal & Privacidade

O CataVínculo opera em estrita conformidade com a **Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD)**, respaldado no legítimo interesse (Art. 7º, IX), proteção do crédito (Art. 7º, X) e utilização de bases públicas disponibilizadas pelos órgãos oficiais (Receita Federal do Brasil, Conselho Nacional de Justiça - DataJud, ANAC e SENATRAN).
