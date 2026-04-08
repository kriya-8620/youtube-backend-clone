# 🎬 YouTube Backend Clone (Node.js)

A scalable YouTube backend clone built using Node.js, Express, MongoDB, and Cloudinary.  
This project implements core YouTube-like backend features including authentication, video uploads, likes, and comments.

---

## 🚀 Features

- User Registration & Login (JWT Authentication)
- Secure Authentication using Access & Refresh Tokens
- Video Upload using Multer
- Cloudinary Integration for media storage
- Like & Comment System
- RESTful API Architecture
- MongoDB Database Integration
- Middleware-based Authentication
- Scalable Backend Structure

---

## 🛠️ Tech Stack

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB
- Mongoose

**Authentication**
- JWT (Access & Refresh Tokens)

**File Handling**
- Multer

**Cloud Storage**
- Cloudinary

**Other Tools**
- Postman
- Git
- GitHub

---

---

## 🔐 Authentication Flow

- User registers with email & password
- JWT access and refresh tokens generated
- Protected routes secured using middleware
- Token-based authorization system

---

## 📡 API Features

### User APIs
- Register User
- Login User
- Logout User
- Refresh Token

### Video APIs
- Upload Video
- Delete Video
- Get Video List

### Interaction APIs
- Like Video
- Comment on Video
- Delete Comment

---

## ☁️ Cloudinary Integration

- Video files stored securely in Cloudinary
- Optimized file management
- Cloud-based storage support

---
## 📡 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Description |
|-------|----------|-------------|
| POST | /api/users/register | Register new user |
| POST | /api/users/login | Login user |
| POST | /api/users/logout | Logout user |
| POST | /api/users/refresh-token | Refresh JWT token |

---

### 🎬 Video APIs

| Method | Endpoint | Description |
|-------|----------|-------------|
| POST | /api/videos/upload | Upload video |
| GET | /api/videos | Get all videos |
| DELETE | /api/videos/:id | Delete video |

---

### ❤️ Interaction APIs

| Method | Endpoint | Description |
|-------|----------|-------------|
| POST | /api/videos/:id/like | Like video |
| POST | /api/videos/:id/comment | Comment video |
| DELETE | /api/comments/:id | Delete comment |

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/kriya-8620/youtube-backend-clone.git

## 📂 Project Structure
