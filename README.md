<p align="center">
  <img src="./frontend/public/playtube.webp" alt="PlayTube Logo" width="120" />
</p>

<h1 align="center">🎬 PlayTube</h1>

<p align="center">
  A full-stack AI generated video sharing platform with Web3 crypto rewards.
  <br/>
  Built with the MERN stack.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?logo=mongodb" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" />
</p>

---

## 📌 Overview

PlayTube is a feature-rich video sharing platform where users can create channels, upload videos & shorts, earn crypto rewards for watching, tip creators, manage playlists, and interact with a community — all in one place.
Link - https://playtube-frontendv1.onrender.com/

---

## 🚀 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **Vite** | Build tool |
| **Tailwind CSS v4** | Styling |
| **Redux Toolkit** | State management |
| **React Router DOM v7** | Client-side routing |
| **Axios** | HTTP requests |
| **Firebase** | Google Authentication |
| **React Icons** | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express.js** | Server & API |
| **MongoDB + Mongoose** | Database |
| **JWT + Cookies** | Authentication |
| **Bcryptjs** | Password hashing |
| **Multer** | File upload handling |
| **Cloudinary** | Media storage (videos, images) |
| **Nodemailer** | OTP email service |

---

## ✨ Features

### 🔐 Authentication
- Sign Up / Sign In / Sign Out
- Google OAuth integration via Firebase
- Forgot Password with OTP email verification

### 📺 Channel System
- Create & update channels (avatar, banner, name, description, category)
- View public channel profiles with tabs — Videos, Playlists, Posts & About
- Dynamic subscriber count display

### 🎥 Video Hub
- Upload HD videos with title, description, custom thumbnail & tags
- Home feed with video grid showing views, dates & channel links
- **Ambient Glow Mode** — cinematic glow around the video player that pulses with category gradients

### 🪙 Web3 Rewards & Wallet
- Earn **1.0 PTC** (PlayTube Coin) per unique video watched, capped at **5.0 PTC/day**
- Wallet dashboard `/wallet` — balance, daily stats, USD estimate & transaction ledger
- **Creator Tipping** — send custom/preset PTC tips directly from the watch page to support creators

### 📂 Playlists & Bookmarks
- **Bookmarks** — one-click save videos to library, viewable at `/saved`
- **Playlists** — create, edit, and manage playlists with a checklist drawer popup in the video player
- Playlist view page `/playlist/:playlistId` with video removal support

### 💬 Social Interactions
- Live comments — post, delete & view relative timestamps with author profiles
- Video Like / Dislike ratings
- **Community Posts** — share text & images under channel tab with toggle-likes and owner removal

### ⚡ Shorts Feed
- Vertical shorts player (TikTok / YouTube Shorts style)
- Swipe controls, view count updates, link copying & interaction indicators

---

## 📁 Project Structure

```
PlayTube/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js       # Cloudinary setup
│   │   ├── db.js               # MongoDB connection
│   │   ├── sendMail.js         # Nodemailer OTP
│   │   └── token.js            # JWT token generator
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── video.controller.js
│   │   └── short.controller.js
│   ├── middlewares/
│   │   ├── isAuth.js           # JWT auth middleware
│   │   └── multer.js           # File upload middleware
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
    │   ├── components/         # Reusable components
    │   ├── pages/
    │   │   ├── Channel/        # Create, Update, View Channel
    │   │   ├── Videos/         # Create & Watch Video
    │   │   ├── Shorts/         # Create & View Shorts
    │   │   ├── Playlist/       # Create & View Playlist
    │   │   └── Post/           # Community Posts
    │   ├── Redux/              # Store, userSlice, contentSlice
    │   ├── customHooks/        # GetCurrentUser, GetChannelData, etc.
    │   └── App.jsx
    └── utils/
        └── firebase.js
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
| GET | `/getuser` | Get logged-in user profile, wallet & history |
| POST | `/createchannel` | Create channel (avatar, banner, name, category) |
| POST | `/updatechannel` | Update channel details |
| GET | `/getchannel` | Get owner's channel details |
| POST | `/channel/:channelId/subscribe` | Subscribe / Unsubscribe a channel |
| GET | `/channel/:channelId` | Get public channel details |
| POST | `/watch-history/:videoId` | Add video to watch history |
| GET | `/watch-history` | Get watch history |
| GET | `/subscriptions/videos` | Get videos from subscribed channels |
| POST | `/save-video/:videoId` | Toggle bookmark (save/unsave) |
| GET | `/saved-videos` | Get all bookmarked videos |
| POST | `/earn-reward/:videoId` | Earn 1.0 PTC for watching a video |
| POST | `/tip-creator` | Send PTC tip to a creator |

### Content Routes — `/api/content`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create-video` | Upload a video |
| GET | `/get-all-videos` | Get all videos |
| GET | `/video/:videoId` | Get single video details |
| DELETE | `/video/:videoId` | Delete video (DB + Cloudinary) |
| PUT | `/video/:videoId` | Update video details |
| GET | `/search` | Search videos by title/tags |
| POST | `/video/:videoId/view` | Increment view count |
| GET | `/liked-videos` | Get liked videos |
| POST | `/video/:videoId/comment` | Add comment |
| GET | `/video/:videoId/comments` | Get video comments |
| DELETE | `/video/:videoId/comment/:commentId` | Delete comment |
| POST | `/video/:videoId/like` | Toggle video like |
| POST | `/create-short` | Upload a Short |
| GET | `/shorts` | Get all Shorts |
| GET | `/short/:shortId` | Get Short by ID |
| POST | `/short/:shortId/like` | Toggle Short like |
| POST | `/short/:shortId/view` | Increment Short views |

### Playlist Routes — `/api/playlist`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create` | Create a new playlist |
| GET | `/user/playlists` | Get all user's playlists |
| GET | `/:playlistId` | Get playlist with videos |
| DELETE | `/:playlistId` | Delete playlist |
| POST | `/:playlistId/video/:videoId` | Add video to playlist |
| DELETE | `/:playlistId/video/:videoId` | Remove video from playlist |

### Community Post Routes — `/api/post`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create` | Create text/image post |
| GET | `/channel/:channelId` | Get all posts of a channel |
| DELETE | `/:postId` | Delete post |
| POST | `/:postId/like` | Toggle post like |

---

## 🚢 Deployment

| Service | Platform |
|---------|----------|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) |
| Database | [MongoDB Atlas](https://www.mongodb.com/atlas) |
| Media Storage | [Cloudinary](https://cloudinary.com) |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Rajkamal** — [@Rajkamal017](https://github.com/Rajkamal017)

---

<p align="center">⭐ Star this repo if you found it helpful!</p>
