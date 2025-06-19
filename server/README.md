# Node.js WebRTC Signaling & Chat Server

A backend server providing signaling and real-time chat capabilities for a React WebRTC communication application. Built with Node.js, Express, and Socket.IO.

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Prerequisites](#-prerequisites)
4. [Installation & Setup](#-installation--setup)

   * [Clone & Install](#clone--install)
   * [Environment Variables](#environment-variables)
   * [Running the Server](#running-the-server)
5. [Available Scripts](#-available-scripts)
6. [Project Structure](#-project-structure)
7. [Signaling Flow](#-signaling-flow)
8. [Contributing](#-contributing)
9. [License](#-license)

---

## 🚀 Features

* **WebRTC Signaling**: Exchange offer, answer, and ICE candidates via Socket.IO
* **Room Management**: Create and join rooms with unique IDs
* **Real-Time Chat**: In-room text messaging supporting multiple users
* **User Authentication**: JSON Web Tokens (JWT) for secure signup and login flows (*optional*)
* **CORS & Security**: Configurable CORS, helmet for basic HTTP hardening
* **Environment Config**: `.env` support for flexible configuration

---

## 💻 Tech Stack

* **Runtime**: Node.js (v16+)
* **Framework**: Express
* **Real-time**: Socket.IO
* **Authentication**: JSON Web Token (JWT)
* **Security**: Helmet, CORS
* **Utilities**: dotenv

---

## 🔧 Prerequisites

* Node.js v16 or higher
* npm (v8+) or yarn
* (Optional) MongoDB or another database if user persistence is enabled

---

## ⚙️ Installation & Setup

### Clone & Install

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>/server
npm install
```

### Environment Variables

Create a `.env` file in the `/server` directory, based on `.env.example`:

```ini
# Server port\ nPORT=5000
# Allowed client origin for CORS
CLIENT_ORIGIN=http://localhost:3000
# JWT secret key (if using authentication)
JWT_SECRET=your_jwt_secret_here
# (Optional) MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/webrtc-chat
```

### Running the Server

```bash
npm start       # Starts production server
npm run dev     # Starts development server with nodemon
```

By default, the server listens on the port defined in `PORT` and accepts Socket.IO connections from the origin defined in `CLIENT_ORIGIN`.

---

## 🛠️ Available Scripts

* `npm start` – Run the server in production mode
* `npm run dev` – Run the server in development mode (auto-restarts on changes)
* `npm test` – Launch unit tests (if configured)

---

## 📂 Project Structure

```
server/
├─ src/
│  ├─ controllers/       # Express controllers for REST endpoints
│  ├─ middlewares/       # Auth, error handling, CORS
│  ├─ routes/            # HTTP routes (e.g., auth, health)
│  ├─ sockets/           # Socket.IO event handlers and logic
│  ├─ utils/             # Helper functions (e.g., token utils)
│  ├─ app.js             # Express app setup
│  └─ server.js          # HTTP & Socket.IO server initialization
├─ .env.example          # Example environment variables
├─ package.json
└─ README.md             # This file
```

---

## 🔄 Signaling Flow

1. **Join Room**: Client emits `join-room` with room ID
2. **Peer Discovery**: Server broadcasts `user-connected` to existing participants
3. **Offer/Answer Exchange**: Clients emit `webrtc-offer` and `webrtc-answer`; server relays to peers
4. **ICE Candidate Exchange**: Clients emit `webrtc-candidate`; server relays ice candidates
5. **Leave/Disconnect**: `disconnect` event notifies remaining peers via `user-disconnected`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m "feat: add new feature"`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) guidelines.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
