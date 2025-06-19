Here’s a combined **`README.md`** for your full‑stack WebRTC project, with separate **client** and **server** sections. Feel free to tweak any URLs, ports, or env‑var names to match your exact setup.

````markdown
# webrtc_

A full‑stack WebRTC communication app with real‑time audio/video calling and in‑room chat.  
This repo contains:

- **client/** – React front‑end  
- **server/** – Node.js/Express signaling & chat back‑end  

---

## 📋 Table of Contents

1. [Features](#-features)  
2. [Tech Stack](#-tech-stack)  
3. [Prerequisites](#-prerequisites)  
4. [Getting Started](#-getting-started)  
   - [Clone the Repo](#clone-the-repo)  
   - [Setup & Run Server](#setup--run-server)  
   - [Setup & Run Client](#setup--run-client)  
5. [Available Scripts](#-available-scripts)  
6. [Folder Structure](#-folder-structure)  
7. [Contributing](#-contributing)  
8. [License](#-license)  

---

## 🚀 Features

- **Peer‑to‑Peer Video & Audio**: One‑on‑one or multi‑user calls  
- **Real‑Time Chat**: Exchange text messages in rooms  
- **Room Management**: Create or join by unique room ID  
- **Screen Sharing**: Share your screen in video rooms  
- **Auth Support (Optional)**: JWT‑based signup/login  
- **Responsive**: Works on desktop and mobile  

---

## 💻 Tech Stack

- **Client**: React, React Router, Context API, Socket.IO Client  
- **Server**: Node.js, Express, Socket.IO Server, JWT (optional)  
- **Bundling**: Create React App  
- **Styling**: CSS Modules & plain CSS  

---

## 🔧 Prerequisites

- **Node.js** v16+ and **npm** (or **yarn**)  
- (Optional) MongoDB if you enable user persistence  

---

## 📥 Getting Started

### Clone the Repo

```bash
git clone https://github.com/DEEPAM3/webrtc_.git
cd webrtc_
````

### Setup & Run Server

1. ```bash
   cd server
   npm install
   ```
2. Create a `.env` file in `server/` (you can copy from `.env.example`):

   ```ini
   PORT=5000
   CLIENT_ORIGIN=http://localhost:3000
   JWT_SECRET=your_jwt_secret       # if using auth
   MONGODB_URI=mongodb://localhost:27017/webrtc
   ```
3. Start the server:

   ```bash
   npm run dev    # with nodemon
   # or
   npm start      # production mode
   ```

By default, it listens on `http://localhost:5000` and accepts Socket.IO connections from your client origin.

### Setup & Run Client

1. ```bash
   cd client
   npm install
   ```
2. Create a `.env` in `client/`:

   ```ini
   REACT_APP_SOCKET_SERVER_URL=http://localhost:5000
   PORT=3000
   HOST=localhost
   ```
3. Start the React app:

   ```bash
   npm start     # or npm run dev
   ```

Open your browser at `http://localhost:3000`. The client will connect to the signaling server automatically.

---

## ⚙️ Available Scripts

### In `server/`

* `npm run dev` – Launch with nodemon
* `npm start` – Run production server
* `npm test` – Run tests (if configured)

### In `client/`

* `npm start` (alias `npm run dev`) – Launch dev server
* `npm run build` – Create production build
* `npm test` – Run test suite
* `npm run eject` – Eject CRA config

---

## 📂 Folder Structure

```
webrtc_/
├─ client/                  # React front‑end
│  ├─ public/
│  └─ src/
│     ├─ components/        # Dashboard, VideoRoom, VoiceRoom, Chat, etc.
│     ├─ context/           # SocketContext
│     ├─ services/          # webrtc signaling helpers
│     └─ App.js, index.js
│
├─ server/                  # Node.js signaling & chat back‑end
│  ├─ config/               # e.g. db.js
│  ├─ middleware/           # auth, error handlers
│  ├─ models/               # User, Room schemas
│  ├─ routes/               # auth & health routes
│  ├─ sockets/              # Socket.IO event logic
│  ├─ server.js             # HTTP + WebSocket entry
│  └─ app.js                # Express app setup
│
├─ .gitignore
├─ LICENSE
└─ README.md                # ← You are here
```

---
