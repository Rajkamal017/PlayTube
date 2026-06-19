# 🎬 PlayTube

A full-stack video sharing platform with crypto integration built with the MERN stack — inspired by Odysee & Youtube. Users can create channels, upload videos, post shorts, manage playlists, and interact with content and earn crypto by watching videos.

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

### 🔐 Authentication
- Sign Up / Sign In / Sign Out
- Google OAuth integrations (via Firebase)
- Forgot Password with verification OTP codes

### 📺 Channel System
- Create & update channels (avatar, banner, name, description, category)
- View public channel profiles with tabs for Videos, Playlists, Posts, and About details
- Channel customization and dynamic Subscriber count increments

### 🎥 Video Hub
- Upload high-definition videos with titles, descriptions, custom thumbnails, and search tags
- Home feed video grid listing counts, dates, and channel links
- Cinematic **Ambient Glow Mode** around the watch page video player that dynamically reflects and pulses with video category gradients

### 🪙 Web3 Rewards & Wallet
- Odysee-style watch reward program: earn **1.0 PTC** (PlayTube Coin) per unique video watched, capped at `5.0 PTC` daily
- Dedicated crypto **Wallet dashboard** `/wallet` listing balance, daily claim stats, USD valuation estimate, and transactional ledger logs
- **Creator Tipping**: Send custom/preset tipping coins directly from the watch actions bar to support your favorite creators

### 📂 Playlists & Bookmarks
- **Bookmarks**: Quick one-click bookmarks to save videos to library, listable under `/saved`
- **Playlists**: Create custom playlists, edit titles/descriptions, and toggle video associations using a checklists drawer popup inside the video watch player
- Dynamic playlist view `/playlist/:playlistId` with removal triggers

### 💬 Social Interactions
- Live comments feed: post comments, delete comments, and view relative dates and author profiles
- Video Like/Dislike ratings
- Community Posts: Share text updates and images under the channel tab, complete with toggle-likes and owner removals

### ⚡ Immersive Shorts Feed
- Vertical shorts player (TikTok/YouTube Shorts format) supporting swiping controls, views count updates, links copying, and interaction indicators

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
| GET | `/getuser` | Get logged-in user profile, wallet balance, and history |
| POST | `/createchannel` | Create channel (avatar, banner, name, category) |
| POST | `/updatechannel` | Update channel details and customizable assets |
| GET | `/getchannel` | Get owner's channel details |
| POST | `/channel/:channelId/subscribe` | Subscribe or unsubscribe to a channel |
| GET | `/channel/:channelId` | Get public channel details (populates videos and playlists) |
| POST | `/watch-history/:videoId` | Add video to watch history |
| GET | `/watch-history` | Get watch history (reverse chronological) |
| GET | `/subscriptions/videos` | Get videos uploaded by subscribed channels |
| POST | `/save-video/:videoId` | Toggle video bookmark (save/unsave) |
| GET | `/saved-videos` | Get bookmarked videos |
| POST | `/earn-reward/:videoId` | Earn 1.0 PTC token rewards for watching a video |
| POST | `/tip-creator` | Transfer PTC tokens as a tip to a channel owner |

### Content Routes — `/api/content`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create-video` | Upload a video (video file, thumbnail, tags, category) |
| GET | `/get-all-videos` | Get all uploaded videos |
| GET | `/video/:videoId` | Retrieve single video details (populates channel) |
| DELETE | `/video/:videoId` | Delete video (purges DB entry & Cloudinary files) |
| PUT | `/video/:videoId` | Update video details and thumbnail file |
| GET | `/search` | Case-insensitive video search by title/tags |
| POST | `/video/:videoId/view` | Increment video view count |
| GET | `/liked-videos` | Get liked videos |
| POST | `/video/:videoId/comment` | Add comment |
| GET | `/video/:videoId/comments` | Get video comments feed |
| DELETE | `/video/:videoId/comment/:commentId` | Delete comment (commenter only) |
| POST | `/video/:videoId/like` | Toggle video like state |
| POST | `/create-short` | Upload a Short video |
| GET | `/shorts` | Get all uploaded Shorts |
| GET | `/short/:shortId` | Get Short by ID |
| POST | `/short/:shortId/like` | Toggle Short like state |
| POST | `/short/:shortId/view` | Increment Short view count |

### Playlist Routes — `/api/playlist`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create` | Create a new playlist |
| GET | `/user/playlists` | Fetch all playlists created under the user's channel |
| GET | `/:playlistId` | Get playlist details and populated video details |
| DELETE | `/:playlistId` | Delete playlist |
| POST | `/:playlistId/video/:videoId` | Add video to playlist |
| DELETE | `/:playlistId/video/:videoId` | Remove video from playlist |

### Community Post Routes — `/api/post`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create` | Create a text update / image post |
| GET | `/channel/:channelId` | Get all community posts of a channel |
| DELETE | `/:postId` | Delete post |
| POST | `/:postId/like` | Toggle post like state |

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
