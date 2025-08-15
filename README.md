# ChatGPT

A lightweight, developer-friendly interface for chatting with LLMs, featuring conversation history, prompt templates, and export/share tools.

## ✨ Features
- 🗨️ Multi-turn conversations with history
- 🧩 Prompt templates & variables
- 📦 Export chats (JSON/Markdown)
- 🔐 API key via `.env`
- 🌓 Dark mode (optional)
- 🚀 Deploy-ready (Render/Vercel/Netlify)

## 🏗️ Tech Stack
- Frontend: React / Next.js (or Vite + React)
- Backend: Node.js + Express (optional)  
- Styling: Tailwind CSS / shadcn/ui  
- State: Zustand / Redux (optional)
- Build: PNPM / NPM / Yarn

> Update this section to match your actual stack.

## 📁 Project Structure
```
ChatGPT/
├─ client/               # React app (UI)
│  ├─ src/
│  │  ├─ components/     # Chat UI, MessageList, InputBar, etc.
│  │  ├─ pages/          # Routes or Next.js pages
│  │  ├─ lib/            # helpers, stores
│  │  └─ styles/
│  └─ package.json
├─ server/               # Express API (optional)
│  ├─ src/
│  │  ├─ routes/         # API routes
│  │  ├─ controllers/    # Request handlers
│  │  └─ utils/
│  └─ package.json
└─ README.md
```

## ⚡ Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Aakash-1603/ChatGPT.git
cd ChatGPT
```

### 2️⃣ Install Dependencies
Frontend:
```bash
cd client
npm install
```
Backend (if applicable):
```bash
cd ../server
npm install
```

### 3️⃣ Configure Environment
Create a `.env` file in the `server` folder:
```env
OPENAI_API_KEY=your_api_key_here
PORT=5000
```

### 4️⃣ Run the App
Frontend:
```bash
npm run dev
```
Backend:
```bash
npm run start
```

## 📜 License
MIT License © 2025 Aakash Asthana
