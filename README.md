# KarmaTute — AI Skill Intelligence Engine for India's Official Statistical System

> **Smart India Hackathon 2026 • Working Prototype**  
> Developed by **Team INDIEFORGE** (Problem Statement: PS26101)

---

## 📌 Executive Summary

KarmaTute is an AI-driven workforce competency intelligence and adaptive learning system designed specifically for India’s Official Statistical System (MoSPI/NSO). It turns workforce capability gaps into evidence-backed execution actions through continuous assessment, AI guidance (KarmaVaani), and encrypted capability tokens (KarmaDNA).

---

## 🏗 Repository Architecture

This repository is organized as a clean **Full-Stack Monorepo**:

```
KarmaTute-AI-Competency-Based-Engine/
├── frontend/                 # React 18 + Vite + Tailwind CSS User Workspace
│   ├── src/                  # Components, Layouts, Features, Hooks & Context
│   ├── public/               # Static Assets & Sample .karma Gati-Login Tokens
│   ├── package.json          # Node Dependencies & Build Scripts
│   └── vite.config.ts        # Vite Build Configuration
│
├── backend/                  # Java 17 + Spring Boot 3 Engine & REST API
│   ├── src/                  # Controllers, Entities, Repositories & Services
│   ├── pom.xml               # Maven Build Configuration
│   └── mvnw.cmd              # Maven Wrapper
│
├── docker-compose.yml        # Multi-container orchestration
└── README.md                 # System Architecture & Documentation
```

---

## ⚡ Quick Start Guide

### Option 1: Running Frontend & Backend Separately

#### 1️⃣ Start Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```
> Backend runs at `http://localhost:8080`

#### 2️⃣ Start Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev
```
> Frontend runs at `http://localhost:5173`

---

### Option 2: Docker Compose (Full Stack)
```bash
docker-compose up --build
```

---

## 🔒 Security & Gati-Login (.karma Token)

KarmaTute features **Gati-Login** using encrypted `.karma` identity tokens for zero-friction authentication. 
A sample file is included at:
`frontend/public/demo_officer.karma`

To test:
1. Select **Gati-Login** on the Entry screen.
2. Upload `demo_officer.karma`.
3. System verifies the KarmaDNA token and opens the officer workspace instantly.

---

## 👥 Team INDIEFORGE

* **Vardhan Kushwaha** — Team Lead · System Architecture & Problem Framing
* **Unnati Pal** — Research & Domain Analysis
* **Yashi Srivastava** — Idea Framing & Debugging
* **Mohammad Owais** — AI Integration & Debugging
* **Mohit Kumar** — Presentation & Debugging
* **Vaibhav Jauhari** — Presentation & Debugging

---
*Built with passion for Smart India Hackathon 2026.*
