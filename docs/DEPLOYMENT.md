# 🚀 KarmaTute Production & SIH Prototype Deployment Guide

This document provides exact, step-by-step instructions to deploy **KarmaTute** for the 2-month Smart India Hackathon (SIH 2026) prototype period.

---

## 🏗 Target Architecture Overview

* **Frontend**: React 18 + Vite → Hosted as a **Render Static Site**
* **Backend**: Spring Boot 3 + Java 17 → Hosted as a **Render Web Service**
* **Database**: Managed PostgreSQL → Hosted on **Supabase PostgreSQL**

---

## 📋 STEP 1: Supabase PostgreSQL Database Setup

1. Log in to [Supabase Dashboard](https://supabase.com/).
2. Create a new project named `KarmaTute-DB`.
3. Note down your Database Connection String from **Project Settings → Database → Connection string → JDBC**:
   ```
   jdbc:postgresql://db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?sslmode=require
   ```
4. Note your Database Password & Username (`postgres`).

---

## 📋 STEP 2: Render Backend Web Service Setup

1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Web Service**.
3. Connect your GitHub Repository: `VardhanVersion2/KarmaTute-AI-Competency-Based-Engine-for-Officials-PS26101`.
4. Configure settings:
   * **Name**: `karmatute-backend`
   * **Root Directory**: `backend`
   * **Runtime**: `Java`
   * **Build Command**: `./mvnw clean package -DskipTests`
   * **Start Command**: `java -jar target/KarmaTute-0.0.1-SNAPSHOT.jar`
   * **Instance Type**: Free

5. Add **Environment Variables** in Render Dashboard:
   | Variable Name | Value / Description |
   | :--- | :--- |
   | `PORT` | `8080` |
   | `DATABASE_DRIVER` | `org.postgresql.Driver` |
   | `DATABASE_URL` | `jdbc:postgresql://db.[REF].supabase.co:5432/postgres?sslmode=require` |
   | `DATABASE_USERNAME` | `postgres` |
   | `DATABASE_PASSWORD` | `[YOUR_SUPABASE_DB_PASSWORD]` |
   | `DB_POOL_MAX_SIZE` | `5` |
   | `DB_POOL_MIN_IDLE` | `2` |
   | `FRONTEND_ORIGIN` | `https://karmavaani-frontend.onrender.com` |
   | `MISTRAL_API_KEY` | `[YOUR_MISTRAL_AI_KEY]` (Optional fallback) |

6. Deploy the Web Service and copy your public URL (e.g. `https://karmatute-backend.onrender.com`).

---

## 📋 STEP 3: Render Frontend Static Site Setup

1. In Render Dashboard, click **New +** → **Static Site**.
2. Connect your GitHub Repository.
3. Configure settings:
   * **Name**: `karmavaani-frontend`
   * **Root Directory**: `frontend`
   * **Build Command**: `npm install && npm run build`
   * **Publish Directory**: `dist`

4. Add **Environment Variables**:
   | Variable Name | Value |
   | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://karmatute-backend.onrender.com` (Your Render Backend URL) |

5. Deploy the Static Site. Render will automatically apply the `_redirects` file for client-side routing.

---

## 🏥 STEP 4: Verification & Health Checks

Once deployed, verify:
1. **Health Check**:
   `GET https://karmatute-backend.onrender.com/api/health`
   Should return:
   ```json
   { "status": "UP", "service": "KarmaTute Backend Engine" }
   ```

2. **Readiness & DB Check**:
   `GET https://karmatute-backend.onrender.com/api/readiness`
   Should return:
   ```json
   { "status": "READY", "database": "CONNECTED" }
   ```

---

## ❄️ Free-Tier Cold Start Handling

Render Free Web Services automatically sleep after 15 minutes of inactivity.
* The first request to the backend after sleep may take ~30 seconds.
* KarmaTute includes a global splash loader (`GlobalLoader`) to handle cold starts smoothly without throwing errors.

---
*Maintained by Team INDIEFORGE for SIH 2026.*
