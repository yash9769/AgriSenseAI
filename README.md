# 🌿 AgriSense AI

An Agentic AI-powered smart farming platform that combines computer vision, conversational AI, and explainable intelligence to assist users in crop disease diagnosis and agricultural decision-making. The system integrates deep learning-based disease detection with an intelligent chatbot capable of providing contextual explanations, crop recommendations, weather insights, and treatment suggestions through a unified interface.

---

## Overview

AgriSense AI is designed to simplify crop health analysis by integrating image classification, explainable AI, and intelligent conversational workflows. Rather than returning only a disease prediction, the platform explains the diagnosis by providing confidence scores, probable causes, symptoms, preventive measures, and recommended treatments.

The application supports both image-driven and conversational interactions, enabling users to either upload crop images or describe symptoms to receive AI-assisted recommendations.

---

## Features

- Image-based crop disease detection using deep learning
- Agentic AI chatbot with intent-based query handling
- Explainable AI with disease causes, symptoms, and treatments
- Knowledge graph-driven reasoning layer
- Hybrid reasoning using image predictions and symptom analysis
- Confidence-aware prediction with uncertainty handling
- Weather assistance and crop recommendation modules
- Interactive React dashboard with integrated chatbot and prediction workflow

---

## System Workflow

1. User uploads a crop image or submits a text query.
2. The chatbot identifies the user's intent.
3. Appropriate backend services process the request.
4. Disease predictions are generated using the trained ML model.
5. Knowledge graph reasoning enriches predictions with explanations.
6. Hybrid reasoning combines image confidence and symptom mapping.
7. The final response includes:
   - Disease prediction
   - Confidence score
   - Explanation
   - Possible causes
   - Recommended treatment
   - Preventive measures

---

## Technology Stack

### Frontend
- React.js
- HTML
- CSS
- JavaScript

### Backend
- FastAPI
- Python
- REST APIs

### Machine Learning
- TensorFlow / Keras
- OpenCV
- Scikit-learn
- NumPy
- Pandas

### AI Components
- Agentic AI Workflow
- Knowledge Graph
- Explainable AI (XAI)
- Hybrid Reasoning
- Confidence-based Decision Logic

### Database
- PostgreSQL

---

## Architecture

```
                User
                  │
        ┌─────────┴─────────┐
        │                   │
   Chat Interface      Image Upload
        │                   │
        └─────────┬─────────┘
                  │
            FastAPI Backend
                  │
      ┌───────────┼────────────┐
      │           │            │
 Intent      Disease Model   Knowledge Graph
Detection         │               │
      │           │               │
      └───────────┼───────────────┘
                  │
          Hybrid AI Reasoning
                  │
          Explainable Response
                  │
             React Dashboard
```

---

## Project Structure

```
AgriSenseAI/
│
├── frontend/
├── backend/
├── models/
├── dataset/
├── knowledge/
├── APIs/
├── assets/
├── requirements.txt
└── README.md
```

---

## Key Functionalities

- Intelligent disease prediction from crop images
- Conversational AI for agricultural assistance
- Knowledge-driven disease explanation
- Symptom-based fallback reasoning
- Confidence scoring and uncertainty analysis
- Crop recommendation support
- Weather information integration
- Unified dashboard for AI interactions

---

## Future Enhancements

- Voice-enabled chatbot
- Multilingual support
- Mobile application
- IoT sensor integration
- Satellite weather analytics
- Retrieval-Augmented Generation (RAG)
- Autonomous multi-agent farming assistants

---

## Contributors

- Yashodhan Rajapkar
- Swarali A Mahishi
- Kaivalya Gharat

---

## License

This project is developed for educational and research purposes.
