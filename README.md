# ChatApp

Full-stack realtime chat built with React (Vite) on the frontend and Express/MongoDB with Socket.io on the backend. Supports authenticated messaging, image upload via Cloudinary, and online user presence.

## Stack
- Frontend: React 19, Vite, Tailwind/DaisyUI, Zustand, Socket.io client, React Router
- Backend: Express, MongoDB/Mongoose, JWT auth (HTTP-only cookie), Socket.io, Cloudinary for media

## Prerequisites
- Node.js 18+ and npm
- MongoDB instance (local or remote)
- Cloudinary account (for avatar/message image uploads)

## Setup
1) Install dependencies
```bash
cd Backend && npm install
cd Frontend && npm install(Different Terminal)
```

2) Backend environment (`Backend/.env`)
```bash
PORT=4000
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=replace-with-strong-secret
NODE_ENV=development
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloud-key
CLOUDINARY_API_SECRET=your-cloud-secret
```

3) Start backend (terminal 1)
```bash
cd Backend
npm run dev
# runs on http://localhost:4000
```

4) Start frontend (terminal 2)
```bash
cd Frontend
npm run dev
# opens Vite dev server (default http://localhost:5173)
```

## Notes
- The frontend Axios instance targets `http://localhost:4000/api`. If you change the backend port/host, update `Frontend/src/lib/axios.js`.
- Auth uses HTTP-only cookies; keep `withCredentials` enabled when changing origins/CORS.
- Image uploads require Cloudinary keys. If you want to run without media uploads, provide placeholder keys or adjust the upload calls in `Backend/src/controllers`.
