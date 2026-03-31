# 🧠 Lab Monitor — Sistema de Visualização de Ocupação de Computadores

## 📌 Visão Geral

O **Lab Monitor** é uma aplicação web interativa para monitoramento em tempo real da ocupação de computadores em um laboratório.

O sistema utiliza uma representação espacial (2D e futuramente 3D) da sala para exibir:

* Status de cada máquina (livre, ocupada, offline)
* Usuário atual
* Informações operacionais
* Interação visual intuitiva

O objetivo é substituir listas e planilhas por uma **visualização inteligente e espacial**, facilitando a gestão de recursos compartilhados.

---

## 🚀 Funcionalidades (MVP atual)

### ✔️ Visualização 2D da sala

* Planta do laboratório baseada em SVG
* Representação de mesas, PCs e TV
* Layout inspirado na estrutura real

### ✔️ Status em tempo real (simulado)

* Atualização automática a cada poucos segundos
* Mudança dinâmica entre:

  * 🟢 Livre
  * 🔴 Ocupado
  * ⚫ Offline

### ✔️ Interação com PCs

* Hover → exibe tooltip
* Clique → abre painel lateral com detalhes

### ✔️ Painel lateral (Dashboard)

Exibe informações como:

* ID do computador
* Status atual
* Usuário logado
* IP (simulado)
* Tempo de uso (simulado)

---

## 🧱 Arquitetura do Projeto

### 📁 Estrutura de Pastas

```bash
src/
│
├── components/
│   ├── Lab2D.tsx        # Visualização 2D da sala
│   ├── SidePanel.tsx    # Painel lateral com informações
│   └── (futuro) Lab3D.tsx
│
├── data/
│   └── pcs.ts           # Estado inicial dos computadores
│
├── App.tsx              # Estado global + simulação
├── main.tsx             # Entry point
└── index.css
```

---

## ⚙️ Tecnologias Utilizadas

* **React + TypeScript**
* **Vite**
* **SVG (renderização 2D)**
* (Futuro) **Three.js + React Three Fiber**

---

## 🧠 Modelo de Dados

```ts
type PCStatus = "livre" | "ocupado" | "offline";

type PC = {
  id: string;
  x: number;
  y: number;
  status: PCStatus;
  user?: string;
};
```

---

## 🔄 Fluxo da Aplicação

1. O estado inicial (`pcs`) é carregado
2. Um `setInterval` simula mudanças de status
3. O componente `Lab2D` renderiza a sala
4. Interações:

   * Hover → tooltip
   * Click → seleção do PC
5. O `SidePanel` exibe os detalhes do PC selecionado

---

## ▶️ Como rodar o projeto

### 1. Criar projeto

```bash
npm create vite@latest lab-monitor
cd lab-monitor
npm install
```

Escolha:

* React
* TypeScript

---

### 2. Rodar localmente

```bash
npm run dev
```

Acesse:

```bash
http://localhost:5173
```

---

### 3. Build para produção

```bash
npm run build
```

---

## 🌐 Deploy gratuito

### Opção recomendada: Cloudflare Pages

1. Acesse:
   https://pages.cloudflare.com

2. Conecte com GitHub

3. Configure:

```bash
Build command: npm run build
Output directory: dist
```

4. Deploy automático

Você receberá uma URL como:

```bash
https://lab-monitor.pages.dev
```

---

## 🎨 Convenção de Cores

| Status  | Cor      |
| ------- | -------- |
| Livre   | Verde    |
| Ocupado | Vermelho |
| Offline | Cinza    |

---

## 🔥 Próximas Evoluções

### 🔹 Curto prazo

* Melhorar tooltip (UI/UX)
* Painel lateral com mais dados
* Animações (pulse em PC ativo)
* Zoom e navegação no mapa

### 🔹 Médio prazo

* Integração com backend
* WebSocket para tempo real real
* Sistema de reservas
* Filtros (livres / ocupados)

### 🔹 Avançado

* 🧊 Visualização 3D (React Three Fiber)
* Avatar/posição de usuários
* Heatmap de uso
* Analytics de ocupação

---

## 🖥️ Integração futura com PCs reais

Será implementado um **agente local** em cada máquina que enviará:

* Usuário logado
* Status ativo/inativo
* Última atividade
* Heartbeat periódico

Fluxo:

```text
PC → Agente → API → WebSocket → Frontend
```

---

## ⚠️ Considerações importantes

* Este projeto atualmente **não possui backend**
* Os dados são simulados
* O foco inicial é validar a interface e UX

---

## 🧩 Filosofia do Projeto

Este sistema não é apenas um mapa.

Ele é um:

> **Sistema visual inteligente de gestão de recursos computacionais**

O diferencial não está no 3D, mas sim em:

* Visualização espacial
* Estado em tempo real
* Interação direta com o ambiente

---

## 👨‍💻 Autor

Projeto desenvolvido para uso em laboratório acadêmico, com foco em:

* Engenharia de Computação
* Sistemas distribuídos
* Visualização de dados
* Interfaces interativas

---

## 📄 Licença

MIT (ou defina conforme necessário)

---

## ⭐ Contribuição

Pull requests são bem-vindos. Para mudanças maiores, abra uma issue primeiro.

---

## 🚀 Roadmap resumido

* [x] MVP 2D funcional
* [x] Tooltip + painel
* [x] Simulação de tempo real
* [ ] Integração backend
* [ ] Agente nos PCs
* [ ] Versão 3D
* [ ] Sistema completo de gestão

---

## 🧠 Insight final

> Você não está construindo um "mapa bonito".

Você está construindo um **sistema operacional visual do laboratório**.
