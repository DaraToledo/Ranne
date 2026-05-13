# 🌿 Ranne Care

> Plataforma de saúde mental corporativa com conformidade NR-1 integrada.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![PWA](https://img.shields.io/badge/PWA-instalável-4ECBA0)
![NR-1](https://img.shields.io/badge/NR--1-compliant-green)
![LGPD](https://img.shields.io/badge/LGPD-compliant-blue)

🌐 **Site oficial:** [rannecare.com.br](https://www.rannecare.com.br/)

---

## 📋 Sobre o Projeto

O **Ranne Care** é uma plataforma web voltada para empresas que precisam 
cuidar da saúde mental dos seus colaboradores e, ao mesmo tempo, cumprir 
as exigências da **NR-1 atualizada** (Portaria MTE nº 1.419/2024), que 
passou a exigir o gerenciamento ativo de riscos psicossociais no ambiente 
de trabalho.

A fiscalização com autuações iniciou em **maio de 2026**, tornando a 
conformidade legal uma necessidade urgente para todas as empresas brasileiras.

---

## ✨ Funcionalidades

### 🔍 Diagnóstico Organizacional
- **QUSP** — Questionário de Saúde Psicossocial com 4 dimensões:
  Burnout, Estresse Físico, Sono/Fadiga Digital e Ansiedade Social
- **ISA** — Índice de Saúde Organizacional (score de 0 a 100)
- Baseado no **MBI de Maslach**, critérios **CID-11 da OMS** e escala
  de tecnoestresse de Tarafdar
- Links de resposta por WhatsApp, e-mail ou intranet — sem login para
  o colaborador

### 📊 Painel de RH
- Dashboard com métricas em tempo real
- **Heatmap por setor** — mapa visual de risco (Crítico / Atenção / OK)
- Ficha individual por colaborador com histórico de evolução
- Alertas automáticos de piora (queda ≥ 15 pontos entre ciclos)
- Filtros por nível de risco e busca por nome

### 📋 Conformidade NR-1
- **AEP** — Avaliação de Riscos Psicossociais Preliminar
- **PGR/Plano de Ação** gerado automaticamente com priorização
- Registro de intervenções auditável (histórico para fiscalização)
- **Relatório de Conformidade NR-1 em PDF** exportável com assinatura
  digital do RH
- Log de capacitações realizadas
- Data de revisão obrigatória do PGR

### 🤖 Suporte ao Colaborador
- **Chatbot de acolhimento 24/7** com IA (Anthropic)
- Canal de escuta anônima permanente
- Check-in semanal de bem-estar
- Feedback pós-diagnóstico em linguagem acessível

### 🔒 Privacidade & Segurança
- **LGPD compliant** — RH acessa apenas scores numéricos, nunca
  respostas de texto aberto
- Setores com menos de 3 colaboradores não exibem score individual
- Dados emocionais individuais invisíveis entre colegas

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 + CSS3 + JavaScript Vanilla | Base do app (single file) |
| PWA (Service Worker + Web Manifest) | Instalável no celular |
| Anthropic API | Chatbot de acolhimento |
| Firebase / LocalStorage | Autenticação e persistência |
| jsPDF | Geração de relatórios em PDF |

---

## 🚀 Como Usar

### Para empresas (RH/Admin)
1. Acesse [rannecare.com.br](https://www.rannecare.com.br/) e crie sua conta
2. Configure o perfil da empresa em **Configurações**
3. Realize a **AEP** (Avaliação de Riscos Preliminar)
4. Crie um **Diagnóstico** e compartilhe o link com sua equipe
5. Acompanhe os resultados no **Dashboard** em tempo real
6. Execute o **Plano de Ação** gerado automaticamente
7. Exporte o **Relatório NR-1** para comprovação junto ao MTE

### Para colaboradores
1. Receba o link do diagnóstico por WhatsApp ou e-mail
2. Responda o QUSP sem precisar criar login
3. Veja seu resultado com orientações personalizadas
4. Use o **chatbot** para suporte emocional a qualquer hora

### Instalar como app (PWA)
- **Android:** Abra no Chrome → menu (⋮) → "Adicionar à tela inicial"
- **iPhone:** Abra no Safari → compartilhar → "Adicionar à Tela de Início"

---

## 📁 Estrutura do Projeto

rannecare/
├── empresa-9.html # App principal (painel RH)
├── manifest.json # Configuração PWA
├── service-worker.js # Cache e funcionamento offline
├── icon-192.png # Ícone do app
└── icon-512.png # Ícone do app (alta resolução)


---

## 🧪 Fundamentação Científica

| Base | Aplicação no App |
|---|---|
| **MBI — Maslach & Jackson (1981)** | Estrutura do QUSP |
| **OMS CID-11 — código QD85** | Critérios de burnout ocupacional |
| **Tarafdar et al. (2007) — JMIS** | Módulo de Fadiga Digital |
| **Edmondson, Harvard (1999)** | Intervenções de segurança psicológica |
| **Deloitte UK (2020)** | ROI em saúde mental corporativa |
| **Lei 14.831/2024** | Certificação de empresa promotora da saúde mental |

---

## 👥 Equipe

| Papel | Nome |
|---|---|
| 🎯 Produto & Negócio | Rafaela Bruno |
| 💻 Desenvolvimento | Dara Toledo |

---

## 📬 Contato

🌐 [rannecare.com.br](https://www.rannecare.com.br/)

---

> *"Dados emocionais transformados em decisões estratégicas."*
> — Ranne Care, 2026
