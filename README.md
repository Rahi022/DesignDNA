<div align="center">

# 🎨 DesignDNA

### AI-Powered Design Intelligence Platform

Analyze • Improve • Generate • Manage

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)
![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv)
![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

*A modern AI-powered platform for intelligent design analysis, logo generation, and creative workflow management.*

</div>

---

# 📖 Overview

DesignDNA is an AI-powered full-stack web application developed during my **Software Development Internship at LEO GRAPHICS**.

The platform helps designers and businesses analyze uploaded designs, generate AI-powered logo ideas, manage creative projects, and streamline the overall design workflow through an intuitive dashboard.

It combines modern web technologies with Artificial Intelligence and Image Processing to deliver a smart design assistant.

---

# ✨ Features

### 👤 User Module

- User Registration & Login
- JWT Authentication
- Profile Management

### 🎨 AI Design Module

- AI Logo Generator
- AI Design Suggestions
- Prompt-Based Design Generation
- Color Palette Analysis

### 🖼 Image Processing

- Upload Images
- Design Analysis
- Color Detection
- Image Processing using OpenCV

### 📊 Dashboard

- User Dashboard
- Analytics Overview
- Logo History
- Design History

### 👨‍💼 Admin Panel

- User Management
- Logo Management
- Analytics Dashboard
- Prompt Management

### 📱 Responsive Design

- Mobile Friendly
- Tablet Support
- Desktop Optimized

---

# 🛠 Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

## Backend

- FastAPI
- SQLAlchemy
- REST API

## AI & Image Processing

- Google Gemini API
- OpenCV
- Pillow

## Database

- SQLite

## Authentication

- JWT Authentication

## Deployment

- Vercel
- Render

## Version Control

- Git
- GitHub

---

# 🏗 System Architecture

```text
                 User
                   │
                   ▼
         Next.js Frontend
                   │
                   ▼
           FastAPI Backend
                   │
     ┌─────────┬──────────┬─────────┐
     │         │          │         │
 Gemini API  OpenCV   SQLite DB  JWT Auth
     │
     ▼
 AI Analysis & Results
     │
     ▼
 Dashboard & Reports
```

---

# 📂 Project Structure

```
DesignDNA/
│
├── app/
│   ├── (dashboard)/
│   ├── admin/
│   ├── login/
│   ├── register/
│   ├── history/
│   ├── components/
│   ├── services/
│   └── utils/
│
├── backend/
│   ├── routers/
│   ├── services/
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── security.py
│   ├── main.py
│   └── requirements.txt
│
├── README.md
├── package.json
└── .gitignore
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/Rahi022/DesignDNA.git

cd DesignDNA
```

---

## Frontend

```bash
npm install

npm run dev
```

Runs on:

```
http://localhost:3000
```

---

## Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

Runs on:

```
http://localhost:8000
```

---

# 🔑 Environment Variables

Frontend

```
NEXT_PUBLIC_API_URL=
```

Backend

```
GEMINI_API_KEY=

JWT_SECRET_KEY=

DATABASE_URL=
```

---

# 📸 Screenshots

> Replace these with your project screenshots.

- 🏠 Home Page

  <img width="1917" height="985" alt="Screenshot 2026-07-03 005614" src="https://github.com/user-attachments/assets/b60fcc35-5ab2-4cc3-a61f-9940ded8080a" />


- 📊 Dashboard

  <img width="1918" height="1072" alt="Screenshot 2026-07-03 005640" src="https://github.com/user-attachments/assets/02e40bb6-831b-42a1-8f5d-c9564118a117" />


- 🎨 Logo Generator

  <img width="1918" height="1078" alt="Screenshot 2026-07-03 010005" src="https://github.com/user-attachments/assets/9149481a-1cec-4967-b993-d750b1b1220a" />


- 📤 Upload Design

  <img width="673" height="920" alt="Screenshot 2026-07-03 005908" src="https://github.com/user-attachments/assets/89d15cd2-7c90-4b31-babd-5a54b33b676d" />


- 📈 Analytics

  <img width="1918" height="1075" alt="Screenshot 2026-07-03 010402" src="https://github.com/user-attachments/assets/1266028d-daa3-4547-9f8e-51981ecef484" />


- 👨‍💼 Settings

  <img width="1918" height="1077" alt="Screenshot 2026-07-03 010439" src="https://github.com/user-attachments/assets/2ed4f7dc-fbe1-4189-8a60-48136a1bdbb2" />


---

# 🚀 Future Improvements

- AI Image Enhancement
- AI Design Scoring
- OCR Integration
- Team Collaboration
- Cloud Storage
- Multi-language Support
- Dark Mode
- PDF Report Generation

---

# 👨‍💻 Author

**Rahi Patel**

Software Development Intern

LEO GRAPHICS

📧 Email: *(Your Email)*

🔗 LinkedIn: *(Your LinkedIn)*

---

# 📄 License

This project is licensed under the MIT License.

---

<div align="center">

⭐ If you found this project useful, don't forget to star the repository!

</div>
