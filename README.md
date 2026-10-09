# 💬 ChitChat - Advanced Real-Time Chat & Video Calling Platform

<p align="center">
  <img src="client/src/icon.jpg" alt="ChitChat Logo" width="120" style="border-radius: 20%;" />
</p>

<p align="center">
  A production-ready, feature-rich real-time communication platform built on the <b>MERN stack</b>, powered by <b>Socket.io</b> for real-time events and <b>WebRTC (Simple-Peer)</b> for peer-to-peer audio and video calls. Includes a dedicated <b>Admin Analytics Dashboard</b> for platform monitoring and moderation.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Socket.io-4.7-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io" />
  <img src="https://img.shields.io/badge/WebRTC-Simple--Peer-333333?style=for-the-badge&logo=webrtc&logoColor=white" alt="WebRTC" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Material--UI-007FFF?style=for-the-badge&logo=mui&logoColor=white" alt="MUI" />
  <img src="https://img.shields.io/badge/Redux--Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux" />
</p>

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Directory Structure](#-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Server Setup](#1-server-setup)
  - [Client Setup](#2-client-setup)
- [Environment Variables](#-environment-variables)
- [Socket & WebRTC Signaling Events](#-socket--webrtc-signaling-events)
- [API Endpoints Overview](#-api-endpoints-overview)
- [Admin Dashboard](#-admin-dashboard)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### ⚡ Real-Time Messaging & Presence
- **One-on-One & Group Chats:** Instant messaging with optimistic UI updates and persistent database history.
- **Socket.io Powered:** Bidirectional, low-latency WebSocket communication for messages, notifications, and status alerts.
- **Typing Indicators:** Real-time "typing..." notifications when contacts are actively drafting a message.
- **Online / Offline Status:** Real-time tracking and broadcasting of active connected users.
- **Unread Notification Badges:** Real-time alert counts for messages across direct chats and groups.

### 📞 WebRTC Audio & Video Calling
- **Peer-to-Peer Calling:** Audio and video calls powered by **Simple-Peer** and Google STUN servers.
- **Incoming Call Dialog:** Interactive caller notifications with Accept and Reject actions.
- **Call Controls:** Toggle microphone (mute/unmute), switch camera on/off, and end call dynamically.
- **Cross-Platform Responsive Screen:** Fullscreen or dialog-based call view with local and remote stream synchronization.

### 👥 Group Collaboration
- Create custom groups with multiple members.
- Rename groups, add new participants, or remove members (admin privileges).
- Leave group functionality with real-time membership sync.

### 📎 Media & Attachment Sharing
- Share images, audio recordings, videos, and documents directly in chat.
- Multer file validation and seamless cloud storage upload via **Cloudinary**.

### 🔐 Security & Authentication
- Secure signup and login using **bcrypt** password hashing.
- **JWT (JSON Web Token)** authentication stored in secure, **HTTP-only cookies** to prevent XSS attacks.
- Input validation and sanitization using `express-validator`.
- Protected frontend routes with session restoration on refresh.

### 📊 Admin Analytics Dashboard
- Secret-key protected admin authentication.
- **Interactive Visualizations:** Chart.js graphs displaying chat vs. message metrics and activity trends.
- **MUI DataGrid Tables:** Moderation and inspection views for registered users, active chats, and message history.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Redux Toolkit, React Router DOM v6, Framer Motion, Material UI (MUI), Lucide React, Tailwind CSS |
| **Real-Time & Calling** | Socket.io-client, Simple-Peer (WebRTC), STUN Server integration |
| **Backend** | Node.js, Express.js (v5), Socket.io, HTTP |
| **Database & ORM** | MongoDB, Mongoose |
| **Storage & Uploads** | Cloudinary SDK, Multer |
| **Security & Auth** | JSON Web Tokens (JWT), Bcrypt, Cookie-Parser, CORS |
| **Analytics & Data** | Chart.js, React-Chartjs-2, MUI X-DataGrid |

---

## 🏗 System Architecture

```text
 ┌────────────────────────────────────────────────────────┐
 │                      Client (React)                    │
 │  ┌───────────────────────┐  ┌────────────────────────┐ │
 │  │   UI (MUI + Motion)   │  │ Redux Toolkit & Hooks  │ │
 │  └───────────┬───────────┘  └───────────┬────────────┘ │
 └──────────────┼──────────────────────────┼──────────────┘
                │ HTTP / REST              │ WebSocket / Signaling
                ▼                          ▼
 ┌────────────────────────────────────────────────────────┐
 │                   Express & Socket.io                  │
 │  ┌───────────────────────┐  ┌────────────────────────┐ │
 │  │ REST API & Auth JWT   │  │ Socket Event Handlers  │ │
 │  └───────────┬───────────┘  └───────────┬────────────┘ │
 └──────────────┼──────────────────────────┼──────────────┘
                │                          │
        ┌───────┴────────┐                 │ P2P WebRTC Handshake
        │                │                 ▼
        ▼                ▼         ┌───────────────┐
  ┌───────────┐   ┌────────────┐   │ Peer-to-Peer  │
  │  MongoDB  │   │ Cloudinary │   │ Audio / Video │
  │ (Mongoose)│   │  (Media)   │   │  Media Stream │
  └───────────┘   └────────────┘   └───────────────┘
```

---

## 📁 Directory Structure

```text
Real-time_chat-app/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/          # Protected route wrappers
│   │   │   ├── call/          # Video/Audio call screen, dialog & buttons
│   │   │   ├── dialogs/       # Group add, confirm delete, file send dialogs
│   │   │   ├── layout/        # App header, loader, layout wrappers
│   │   │   ├── shared/        # Avatars, message items, user items
│   │   │   ├── specific/      # Chat list, notifications, search dialog
│   │   │   └── styles/        # Styled components & UI utilities
│   │   ├── constants/         # Socket event constants, colors, routes
│   │   ├── hooks/             # Custom hooks (useCall, socket listeners)
│   │   ├── pages/             # Home, Chat, Groups, Login, Admin Dashboard
│   │   ├── redux/             # Redux store, slices (auth, chat, misc)
│   │   ├── socket.jsx         # Socket context provider
│   │   ├── App.jsx            # Route definitions & app initialization
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── server/
    ├── constants/             # Event names, server configuration
    ├── controllers/           # User, chat, and admin route controllers
    ├── lib/                   # Helper functions (socket mapping, validators)
    ├── middlewares/           # Authentication, error handler, multer upload
    ├── models/                # Mongoose schemas (User, Chat, Message, Request)
    ├── routes/                # API routes (userRoute, chatRoute, adminRoute)
    ├── seeders/               # Test data generation scripts (faker)
    ├── utils/                 # DB connection, Cloudinary features, tokens
    ├── app.js                 # Express server & Socket.io initialization
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (running locally or MongoDB Atlas connection string)
- A free [Cloudinary](https://cloudinary.com/) account for attachment storage

---

### 1. Server Setup

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `server` directory (you can use `.sampleEnv` as reference):
   ```env
   PORT=3000
   NODE_ENV=DEVELOPMENT
   MONGO_URI=mongodb://127.0.0.1:27017/chat-app
   JWT_SECRET=your_super_secret_jwt_key
   ADMIN_SECRET_KEY=your_admin_secret_key
   CLIENT_URL=http://localhost:5173

   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:3000` by default.*

---

### 2. Client Setup

1. Open a new terminal tab and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `client` directory:
   ```env
   VITE_SERVER=http://localhost:3000
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client will start on `http://localhost:5173`.*

5. Open your browser and visit `http://localhost:5173`.

---

## 🔑 Environment Variables

### Backend (`server/.env`)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Port number for Express server | `3000` |
| `NODE_ENV` | Environment mode | `DEVELOPMENT` or `PRODUCTION` |
| `MONGO_URI` | MongoDB connection URI | `mongodb://127.0.0.1:27017/chat-app` |
| `JWT_SECRET` | Secret string for signing auth tokens | `any_secure_random_string` |
| `ADMIN_SECRET_KEY` | Secret passkey for admin dashboard access | `admin123` |
| `CLIENT_URL` | Allowed frontend URL for CORS | `http://localhost:5173` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_api_secret` |

### Frontend (`client/.env`)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_SERVER` | Base URL of the backend API server | `http://localhost:3000` |

---

## 📡 Socket & WebRTC Signaling Events

### Real-Time Messaging & Status
| Event Name | Direction | Description |
| :--- | :--- | :--- |
| `NEW_MESSAGE` | Client ⇄ Server | Emitted when sending/receiving a new chat message |
| `NEW_MESSAGE_ALLERT` | Server → Client | Alerts users in the chat of an unread message |
| `START_TYPING` | Client ⇄ Server | Broadcasts that a user is actively typing |
| `STOP_TYPING` | Client ⇄ Server | Broadcasts that typing has ceased |
| `CHAT_JOINED` / `CHAT_LEFT` | Client → Server | Updates the active chat room connection |
| `ONLINE_USERS` | Server → Client | Broadcasts current online user list |

### WebRTC Call Signaling
| Event Name | Direction | Description |
| :--- | :--- | :--- |
| `CALL_USER` | Caller → Server | Initiates call, forwards SDP offer signal & caller profile |
| `INCOMING_CALL` | Server → Callee | Delivers incoming call prompt to the target user |
| `CALL_ACCEPTED` | Callee ⇄ Caller | Exchanges SDP answer signal to establish P2P connection |
| `CALL_REJECTED` | Callee → Caller | Notifies caller that the call was declined or user is offline |
| `CALL_ENDED` | Client ⇄ Server | Terminates stream and tears down peer connection |

---

## 🔌 API Endpoints Overview

### User Routes (`/api/v1/user`)
- `POST /new` — Register a new user with avatar upload
- `POST /login` — User authentication & cookie issue
- `GET /profile` — Fetch currently authenticated user profile
- `GET /logout` — Clear auth cookie and logout
- `GET /search` — Search for other users to connect
- `PUT /sendrequest` — Send a friend request
- `PUT /acceptrequest` — Accept / reject pending friend request
- `GET /notifications` — Fetch incoming friend requests

### Chat Routes (`/api/v1/chat`)
- `POST /new` — Create a new group chat
- `GET /my` — Get all single and group chats for current user
- `GET /my/groups` — Get all groups managed by current user
- `PUT /addmembers` — Add members to an existing group
- `PUT /removemember` — Remove a member from a group
- `DELETE /leave/:id` — Leave a group chat
- `POST /message` — Send media / attachment messages
- `GET /message/:id` — Fetch message history for a chat
- `GET /:id` / `PUT /:id` / `DELETE /:id` — Get, rename, or delete a chat

### Admin Routes (`/api/v1/admin`)
- `POST /verify` — Authenticate admin using secret key
- `GET /logout` — Admin logout
- `GET /users` — Get all registered users and statistics
- `GET /chats` — Get all chats and member counts
- `GET /messages` — Get all platform messages
- `GET /stats` — Overall platform metrics (counts, charts data)

---

## 🛡 Admin Dashboard

To access the Admin Dashboard:
1. Navigate to `/admin` in the frontend (e.g. `http://localhost:5173/admin`).
2. Enter the secret key configured in `ADMIN_SECRET_KEY` in your `server/.env`.
3. Explore the analytics charts, user directory, chat inspector, and message moderation views.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**. Feel free to use and modify it for personal and commercial projects.
