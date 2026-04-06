# 🌿 AgriSense AI – Project TODO

## 🎯 Goal

Build an **Agentic AI Chatbot with Crop Disease Detection** featuring:

* Image-based disease prediction
* Chatbot-based interaction
* Explainable AI (cause + solution)
* Clean UI + backend integration

---

# 🥇 PHASE 1: CORE INTELLIGENCE

## 🤖 Chatbot (Agent Layer)

* [x] Create `/chat` API endpoint
* [x] Accept user text input
* [x] Implement intent detection:
  * [x] Disease query → call `/predict`
  * [x] Weather query → call `/weather`
  * [x] Crop query → call `/crop-recommendation`
* [x] Add follow-up logic:
  * [x] Ask for image if needed
* [x] Return structured response

---

## 🧠 Knowledge Graph (Explanation Layer)

* [x] Create `knowledge.json`
* [x] Add entries:
  * [x] crop
  * [x] disease
  * [x] symptoms
  * [x] cause
  * [x] solution
* [x] Map model output → knowledge data
* [x] Return:
  * [x] explanation
  * [x] cause
  * [x] solution

---

# 🥈 PHASE 2: ML + OUTPUT PROCESSING ✅ COMPLETE

## 🌿 Model Output Cleanup

* [x] Convert labels:
  * Example: `Tomato___Leaf_Blight` → “Leaf Blight”
* [x] Add confidence score (%)
* [x] Add basic severity logic (optional)

---

## 📊 Response Formatting

* [x] Remove raw JSON responses
* [x] Format output as:
  * Disease name
  * Confidence
  * Explanation
  * Cause
  * Solution

---

# 🥉 PHASE 3: FRONTEND INTEGRATION ✅ COMPLETE

## 🔗 Chat Integration

* [x] Connect chat UI → `/chat`
* [x] Display chatbot responses
* [x] Add loading indicator

---

## 📷 Image Upload Integration

* [x] Upload image → `/predict` (via /chat base64)
* [x] Show image preview
* [x] Display prediction result

---

## 🧾 Result Display UI

* [x] Show:
  * [x] Disease name
  * [x] Confidence
  * [x] Explanation
  * [x] Solution
* [x] Keep UI clean and readable

---

# 🏅 PHASE 4: SYSTEM FLOW ✅ COMPLETE

## 🔄 Unified Experience

* [x] Allow:
  * [x] Chat input
  * [x] Image upload
* [x] Chatbot suggests actions (buttons)
* [x] Show results in single dashboard (chat history)

---

# 🎯 PHASE 5: FINAL POLISH ✅ COMPLETE

## ✨ UI Enhancements

* [x] Add loading text (“AI is thinking…”)
* [x] Use icons:
  * 🌿 Disease
  * 📊 Confidence
  * 🧠 Explanation
  * 💡 Solution
* [x] Add color indicators for confidence (severity High/Med/Low)

---

## 🧠 Reasoning Flow (High Impact)

* [x] Display:
  * Detected Pattern → Disease → Cause → Action (grid flow)

---

## 🏷️ Branding

* [x] Project Name: AgriSense AI / AgroMind
* [x] Add tagline:
  * “Explainable AI for Smart Farming”

---

# 🏁 FINAL CHECKLIST ✅ ALL WORKING

## ✅ Must Work

* [x] Chatbot responds correctly
* [x] Image prediction works
* [x] Explanation is shown
* [x] Frontend ↔ backend connected
* [x] Clean UI

---

# 🧠 PHASE 6: PGM + SOFT COMPUTING LAYER ✅ COMPLETE

## 📊 Probabilistic Output

* [x] Modify prediction output to include top 3 classes
* [x] Display probability (%) for each class
* [x] Sort by highest confidence

---

## 🌫️ Uncertainty Handling

* [x] Define confidence thresholds:
  * High (>80%)
  * Medium (50–80%)
  * Low (<50%)
* [x] Add messages:
  * Low confidence → “Uncertain prediction due to unclear input”
  * Medium → “Multiple possible diseases detected”

---

## 🔗 Symptom-Disease Mapping (Graph Layer)

* [x] Create `symptom_graph.json`
* [x] Structure: symptom → diseases → probability weight
* [x] Example: Yellow leaves → Nitrogen deficiency (0.6), Leaf curl (0.3)
* [x] Use when: User asks via chatbot, Image confidence low

---

## 🧠 Hybrid Reasoning

* [x] Combine: Model prediction + Symptom-based probability
* [x] Generate final ranked diseases

---

## 📊 UI Enhancements for PGM

* [x] Show: Top 3 predictions with % bars
* [x] Add “Confidence Level” badge: High / Medium / Low
* [x] Add “Reasoning Flow”: Symptom → Disease → Action

---

## 🏁 Final Integration

* [x] Integrate PGM logic inside `/chat`
* [x] Use fallback: If no image → use symptom graph
* [x] Merge outputs into final response

---

# 🚀 FINAL OUTPUT

User should be able to:

* Upload image OR ask question
* Get:
  * Disease prediction
  * Confidence score
  * Explanation
  * Cause
  * Solution

---

# 💥 PROJECT STATUS TARGET

👉 From: “Multiple APIs”
👉 To: “Intelligent AI System”

