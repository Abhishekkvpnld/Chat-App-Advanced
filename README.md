# 💬 Advanced Chat App

A full-stack **real-time chat application** built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js).  
It provides **secure authentication, real-time messaging, group chats, notifications, file sharing, and an admin dashboard** for monitoring.

🚀 **Live Demo:** [Chat App](https://chat-app-advanced.vercel.app/)  
💻 **GitHub Repo:** [Chat-App-Advanced](https://github.com/Abhishekkvpnld/Chat-App-Advanced)

---

## ✨ Features
- 🔐 **User Authentication & Authorization** (JWT-based)  
- 💬 **One-to-one & Group Chat**  
- 📢 **Real-time Messaging & Notifications** (Socket.io)  
- 📎 **File Sharing** (Multer + Cloudinary integration)  
- 👥 **Friend Request Management**  
- 🗂️ **Admin Dashboard** for monitoring data  
- 📊 **Analytics Dashboard** (React-Chart.js)  
- 🎨 **Responsive UI** with Material UI  
- 🍞 **Toast Notifications** (react-hot-toast)  

---

## 🛠️ Tech Stack
### Frontend
- React.js  
- Redux Toolkit  
- Material UI  
- React-Chart.js  
- react-hot-toast  

### Backend
- Node.js  
- Express.js  
- MongoDB  
- Socket.io  

### Other Tools
- JWT (Authentication)  
- Multer + Cloudinary (File Handling)  
- Git & GitHub (Version Control)  
- Vercel (Deployment)  

---

## ⚙️ Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Abhishekkvpnld/Chat-App-Advanced.git
   cd Chat-App-Advanced
   ```

2. Install dependencies for both **frontend** and **backend**:
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

3. Create a `.env` file in the **server** folder and add:
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Run the development servers:
   - Backend:
     ```bash
     cd server
     npm run dev
     ```
   - Frontend:
     ```bash
     cd client
     npm start
     ```

---

👨‍💻 **Author:** [Abhishek KV](https://www.linkedin.com/in/abhishek-kv-77b0b7286/)  
📂 **Portfolio:** [Click Here](https://abhishekkvpnld.github.io/Portfolio/)  
