# 🌿 ThreatSec Agri: Adversarial-Robust & Secure Smart Farming

An Agentic AI-powered smart farming platform that combines computer vision, conversational AI, and explainable intelligence while strictly adhering to **Defensive Cybersecurity** and **Adversarial Machine Learning** principles. The system integrates deep learning-based disease detection with defensive mechanisms designed to protect agricultural IoT infrastructure from data poisoning, sensor spoofing, and adversarial image perturbations.

---

## 🛡️ Cybersecurity & Defensive AI Overview

ThreatSec Agri is designed to secure the modern agricultural supply chain by integrating image classification with **Defensive AI**. Recognizing that smart farming IoT endpoints are prime targets for cyber attacks, this platform ensures data integrity and model robustness:

- **Adversarial Robustness:** The computer vision model is hardened against adversarial evasion attacks (e.g., FGSM, PGD) ensuring that maliciously perturbed crop images do not spoof the diagnosis.
- **Zero-Trust AI Agent:** The integrated Agentic AI chatbot operates on a zero-trust architecture, sanitizing all user inputs to prevent prompt injection and SSRF (Server-Side Request Forgery) attacks.
- **Data Integrity & Poisoning Defense:** Uses Explainable AI (XAI) and confidence scoring to detect anomalies and potential data poisoning attempts in incoming IoT sensor streams and user uploads.

---

## 🚀 Core AIML + Security Features

- **Adversarially-Trained Crop Disease Detection:** Deep learning models trained to resist adversarial image manipulation.
- **Agentic AI with Input Sanitization:** Intent-based query handling with strict bounds checking and prompt-injection defense.
- **Explainable AI (XAI) for Threat Hunting:** Provides transparent confidence scores and symptom mapping to help analysts detect sensor spoofing or false positives.
- **Knowledge Graph-Driven Reasoning:** A secure, local knowledge graph that cross-references IoT data to identify logical inconsistencies indicative of an attack.
- **Hybrid Reasoning:** Combines image predictions and symptom analysis to validate data integrity before issuing agricultural recommendations.
- **Secure React Dashboard:** A unified frontend with integrated chatbot, built with secure coding practices (XSS/CSRF mitigation).

---

## 🏗️ Architecture & Threat Model

```
                User / IoT Sensor
                   │ (TLS Encrypted)
        ┌─────────┴─────────┐
        │                   │
  Input Sanitizer     Image Anomaly Det.
        │                   │
        └─────────┬─────────┘
                  │
          FastAPI (Zero-Trust)
                  │
      ┌───────────┼────────────┐
      │           │            │
 Intent      Robust AI Model  Knowledge Graph
Detection         │               │
      │           │               │
      └───────────┼───────────────┘
                  │
          Hybrid AI Reasoning
         (Anomaly Validation)
                  │
          Explainable Response
```

---

## 💻 Technology Stack

### Defensive AI & Machine Learning
- **Frameworks:** TensorFlow / Keras, OpenCV, Scikit-learn
- **Security:** Adversarial Training, Input Perturbation Detection
- **AI Components:** Agentic AI Workflow, Knowledge Graph, Explainable AI (XAI)

### Secure Backend & Frontend
- **Backend:** FastAPI (Python) with JWT Authentication, Rate Limiting, and strict CORS policies.
- **Frontend:** React.js with Content Security Policy (CSP) and XSS protections.
- **Database:** PostgreSQL (Encrypted at rest, parameterized queries to prevent SQLi).

---

## 📂 Project Structure

```
AgriSenseAI/
│
├── frontend/          # React app (XSS-hardened)
├── backend/           # FastAPI services (Zero-trust architecture)
├── models/            # Adversarially trained DL models
├── dataset/           # Sanitized training data
├── knowledge/         # Threat & Disease knowledge graph
├── APIs/              # Rate-limited REST endpoints
├── assets/
├── requirements.txt
└── README.md
```

---

## 🔍 Key Functionalities

- **Intelligent Disease Prediction:** Robust to noisy or maliciously altered crop images.
- **Conversational AI:** Secure agricultural assistance without prompt-leakage.
- **Knowledge-Driven Explanation:** Helps users and security analysts understand AI decision boundaries.
- **Confidence Scoring:** Uncertainty analysis to flag potential adversarial inputs or sensor errors.
- **Weather & Crop Modules:** Integrated via secure, authenticated external APIs.

---

## 🔮 Future Enhancements (Security Roadmap)

- **IoT Sensor Threat Intelligence:** Real-time detection of DDoS or botnet activity on agricultural sensors.
- **Federated Learning:** Privacy-preserving AI training across multiple farms without sharing raw data.
- **Blockchain Data Integrity:** Immutable ledger for crop disease reports and automated treatments.
- **Retrieval-Augmented Generation (RAG):** With strict data-access controls and role-based filtering.

---

## 👥 Contributors

- Yashodhan Rajapkar
- Swarali A Mahishi
- Kaivalya Gharat

---

## 📜 License

This project is developed for educational and security research purposes.
