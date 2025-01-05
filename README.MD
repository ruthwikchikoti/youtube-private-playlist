
# YouTube Playlist Manager

A full-stack application that allows users to import and manage their YouTube playlists with features like drag-and-drop reordering, OTP authentication, and layout persistence.

## 📺 Demo Video
[Watch Demo](https://drive.google.com/file/d/1KR3IlTi2O9kY4d8lOvCkMcgn0-NtqogT/view?usp=sharing)

## 🎯 Overview

The application implements the following key functionalities:

### Frontend Features
- Login via Email OTP
- YouTube playlist import and management
- Drag-and-drop playlist reordering
- Layout persistence
- Video list panel
- Playlist thumbnail view

### Backend Features
- OTP authentication system
- YouTube API integration
- Layout storage and retrieval
- MongoDB data persistence

## 🏗 Project Structure

```bash
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.js
│   │   │   │   └── OtpInput.js
│   │   │   ├── common/
│   │   │   │   ├── Button.js
│   │   │   │   ├── Input.js
│   │   │   │   ├── Loader.js
│   │   │   │   ├── Modal.js
│   │   │   │   ├── PrivateRoute.js
│   │   │   │   └── PublicRoute.js
│   │   │   ├── layout/
│   │   │   │   ├── Header.js
│   │   │   │   ├── Layout.js
│   │   │   │   └── Sidebar.js
│   │   │   └── playlist/
│   │   │       ├── PlaylistCard.js
│   │   │       ├── PlaylistGrid.js
│   │   │       └── VideoList.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── PlaylistContext.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useDrag.js
│   │   │   ├── useFirebase.js
│   │   │   └── usePlaylist.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   ├── NotFound.js
│   │   │   └── YouTubeCallback.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   ├── firebase.js
│   │   │   ├── layout.js
│   │   │   └── youtube.js
│   │   └── utils/
│   │       ├── constants.js
│   │       ├── helpers.js
│   │       └── validation.js
│   └── package.json
└── server/
    ├── src/
    │   ├── config/
    │   │   ├── database.js
    │   │   ├── firebase.js
    │   │   ├── mail.js
    │   │   └── youtube.js
    │   ├── controllers/
    │   │   ├── auth.controller.js
    │   │   ├── layout.controller.js
    │   │   └── youtube.controller.js
    │   ├── middleware/
    │   │   ├── auth.js
    │   │   ├── error.middleware.js
    │   │   └── validation.middleware.js
    │   ├── models/
    │   │   ├── layout.model.js
    │   │   └── user.model.js
    │   ├── routes/
    │   │   ├── auth.routes.js
    │   │   ├── layout.routes.js
    │   │   └── youtube.routes.js
    │   ├── services/
    │   │   ├── auth.service.js
    │   │   ├── layout.service.js
    │   │   ├── mail.service.js
    │   │   └── youtube.service.js
    │   └── utils/
    │       ├── catchAsync.js
    │       ├── email.js
    │       ├── errors.js
    │       ├── helpers.js
    │       ├── validators.js
    │       └── youtube.js
    └── package.json
```

## 🚀 Local Setup

### Prerequisites
- Node.js >= 16
- MongoDB
- YouTube API credentials
- Gmail account for SMTP

### Environment Variables

#### Server (.env)
```env
PORT=
MONGODB_URI=
JWT_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
YOUTUBE_API_KEY=
YOUTUBE_REDIRECT_URI=
FRONTEND_URL=
```

#### Client (.env)
```env
REACT_APP_API_URL=
REACT_APP_YOUTUBE_CLIENT_ID=
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ruthwikchikoti/youtube-private-playlist.git
cd youtube-private-playlist
```

2. **Server Setup**
```bash
cd server
npm install
npm run dev
```

3. **Client Setup**
```bash
cd client
npm install
npm start
```

4. Access the application at `http://localhost:3000`

## 🔑 Key Features

### Authentication
- Email OTP login
- Token-based session management
- Rate limiting for OTP requests

### YouTube Integration
- OAuth2 authentication
- Private playlist access
- Video metadata fetching

### Layout Management
- Drag-and-drop reordering
- Layout persistence
- State management

### Error Handling
- Input validation
- User-friendly error messages
- Request retry logic

