# 🌿 AgriSense AI: Explainable AI for Smart Farming

AgriSense AI is an advanced ecological monitoring and crop diagnostic platform. Built with **React 19**, **FastAPI**, and **Google Gemini 1.5 Pro**, it provides farmers with explainable, high-fidelity insights into field health, weather risks, and resource management.

![Version](https://img.shields.io/badge/version-1.0.0-emerald)
![License](https://img.shields.io/badge/license-MIT-blue)
![Tech](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20Gemini-emerald)

---

## ✨ Key Modules

### 🔍 AI Crop Pathology
*   **Visual Diagnosis**: Detect diseases, nutrient deficiencies, and pests using imagery and Gemini 1.5 Pro.
*   **Explainable Reasoning**: Detailed breakdowns of visual evidence and pathogen biology.
*   **Actionable Rx**: Categorized treatment protocols (Immediate Response vs. Long-term Prevention).

### 🌤️ Environmental Command Center
*   **Real-time Node Tracking**: Live telemetry (Temp, Humidity, Wind) synchronized from global weather nodes.
*   **Predictive Hazards**: AI-driven alerts for rainfall logging, heat stress, and UV risks.

### 🗺️ Precision Field Mapping
*   **Digital Twin Layout**: Interactive sector-based visualization of your farmland.
*   **IoT Overlays**: Sector-specific moisture indexing and yield forecasting.

### 🤝 Agronomy Social Layer
*   **Farmer Guilds**: Join specialized communities to optimize crop-specific yields.
*   **Expert Forums**: Global discussion hub for sharing node data and field experiences.

---

## 🏗️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Framer Motion |
| **Backend** | FastAPI (Python), SQLAlchemy, SQLite |
| **AI/ML** | Google Gemini 1.5 Pro (Vision & Chat) |
| **Icons & UI** | Material Symbols & Custom SVG Engine |

---

## 🚀 Execution Guide

### Prerequisite Environment
- Python 3.10+
- Node.js 20+
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### 1. Initialize Backend
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Linux: source venv/bin/activate
pip install -r requirements.txt
python -m backend.app
```
*The server will run on `http://localhost:8000` and automatically initialize the SQLite database.*

### 2. Initialize Frontend
```bash
cd frontend
npm install
# Add GEMINI_API_KEY to your .env file
npm run dev
```
*The application will be accessible at `http://localhost:3000`.*

---

## 🔄 The AgriSense Workflow

1.  **Secure Authentication**: Establish an end-to-end encrypted link via the **Military-Grade Login** system.
2.  **Dashboard Sync**: View real-time telemetry from your field sectors.
3.  **Visual Audit**: Upload crop photos for 10-second AI diagnostic processing.
4.  **Field Strategy**: Implement Gemini's "Prescription Strategies" and monitor progress in the History log.
5.  **Community Loop**: Share critical alerts or successful treatment protocols in your local **Farmer Guild**.

---

## 📁 Project Structure

```text
AgriSenseAI/
├── backend/            # FastAPI Server & AI Services
│   ├── routes/         # Unified API endpoints
│   ├── database.py     # SQLAlchemy models & session
│   └── app.py          # Server entry point
├── frontend/           # React 19 SPA
│   ├── src/screens/    # Modular UI components
│   ├── src/App.tsx     # Main router & Auth layer
│   └── vite.config.ts  # Dev server & Proxy setup
└── README.md           # This document
```

---

## 🛡️ License
Distributed under the MIT License. Created with ❤️ for the future of professional agriculture.
