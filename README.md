# 🎬 PlayTube

A full-stack video sharing platform built with the MERN stack — inspired by YouTube. Users can create channels, upload videos, post shorts, manage playlists, and interact with content.

---

## 🚀 Tech Stack

### Frontend
- **React 19** — UI library
- **Vite** — Build tool
- **Tailwind CSS v4** — Styling
- **Redux Toolkit** — State management
- **React Router DOM v7** — Client-side routing
- **Axios** — HTTP requests
- **Firebase** — Google Authentication
- **React Icons** — Icon library

### Backend
- **Node.js** — Runtime environment
- **Express.js** — Web framework
- **MongoDB + Mongoose** — Database
- **JWT + Cookies** — Authentication
- **Bcryptjs** — Password hashing
- **Multer** — File uploads
- **Cloudinary** — Media storage (videos, images)
- **Nodemailer** — OTP email service

---

## ✨ Features

### Authentication
- Sign Up / Sign In / Sign Out
- Google OAuth (via Firebase)
- Forgot Password with OTP verification

### Channel
- Create & update your channel (avatar, banner, name, description)
- View any channel's profile

### Videos
- Upload videos with thumbnail, title, description & tags
- View all videos on Home feed
- Shorts (vertical short videos)

### Content Creation
- Upload Videos
- Upload Shorts
- Create Posts (community tab)
- Create Playlists

---

## 📁 Project Structure

```
PlayTube/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   ├── sendMail.js
│   │   └── token.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── video.controller.js
│   │   └── short.controller.js
│   ├── middlewares/
│   │   ├── isAuth.js
│   │   └── multer.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── channelModel.js
│   │   ├── videoModel.js
│   │   ├── shortModel.js
│   │   ├── postModel.js
│   │   └── playlistModel.js
│   ├── routes/
│   │   ├── authRoute.js
│   │   ├── userRoute.js
│   │   └── contentRoute.js
│   └── index.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   │   ├── Channel/
    │   │   ├── Videos/
    │   │   ├── Shorts/
    │   │   ├── Playlist/
    │   │   └── Post/
    │   ├── Redux/
    │   ├── customHooks/
    │   └── App.jsx
    └── utils/
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Firebase project

### 1. Clone the repository
```bash
git clone https://github.com/Rajkamal017/PlayTube.git
cd PlayTube
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=8000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL=your_gmail_address
EMAIL_PASSWORD=your_gmail_app_password
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:
```env
VITE_SERVER_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
```

Start the frontend:
```bash
npm run dev
```

---

## 🌐 API Endpoints

### Auth Routes — `/api/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register new user |
| POST | `/signin` | Login user |
| POST | `/signout` | Logout user |
| POST | `/google` | Google OAuth login |
| POST | `/send-otp` | Send OTP to email |
| POST | `/verify-otp` | Verify OTP |
| POST | `/reset-password` | Reset password |

### User Routes — `/api/user`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/current` | Get logged in user |
| POST | `/create-channel` | Create a channel |
| PUT | `/update-channel` | Update channel details |
| GET | `/channel` | Get own channel data |

### Content Routes — `/api/content`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/video` | Upload a video |
| GET | `/videos` | Get all videos |
| POST | `/short` | Upload a short |
| GET | `/shorts` | Get all shorts |

---

## 🚢 Deployment

| Service | Platform |
|---------|----------|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) |
| Database | [MongoDB Atlas](https://www.mongodb.com/atlas) |
| Media | [Cloudinary](https://cloudinary.com) |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Rajkamal** — [@Rajkamal017](https://github.com/Rajkamal017)
