# 🧠 MemoryLink Companion  
**Modular Cognitive Support System for Dementia Care**  
_By Neha Menon | GitHub Repository: [memory-link-companion](https://github.com/neharmenon05/memory-link-companion)_  
_Based on [DimAssist](https://github.com/neharmenon05/dim_assist), the foundational assistive framework._

---

## 🧭 Overview

MemoryLink Companion is a next-generation assistive platform designed to support individuals living with dementia. It builds upon the core architecture of DimAssist and introduces advanced features such as multi-person recognition, health monitoring, voice-based note capture, and intelligent cueing—all within a secure, caregiver-supervised environment.

---

## 🎯 Key Objectives

- 🧠 Reinforce memory through contextual cues and smart note display.
- 👥 Recognize multiple individuals and associate personalized interactions.
- 🩺 Monitor health parameters and trigger reminders.
- 🔊 Enable voice-based note taking for intuitive interaction.
- 🔐 Enforce high-security access via PIN-based authentication.
- 📱 Deliver a simplified, responsive UI for patients and caregivers.

---

## 🧠 Core Features

### 👥 Multi-Person Recognition
- Facial recognition engine supports multiple known profiles.
- Dynamic tagging and contextual linking of interactions.

### 🩺 Health Monitoring & Reminders
- Tracks health-related events and schedules.
- Sends reminders for medication, hydration, and appointments.

### 🔊 Voice-Based Note Capture
- Allows patients to record notes via voice input.
- Notes are stored temporarily pending caregiver approval.

### 🧾 Smart Notes Display
- Automatically displays relevant notes upon face recognition.
- Contextual cueing based on time, location, and interaction history.

### 👩‍⚕️ Caregiver Approval Workflow
- Secure dashboard for caregivers to validate and manage notes.
- Ensures accuracy, privacy, and ethical oversight.

### 🔐 High-Security Access
- Local PIN-based login system.
- No cloud dependency—ensures privacy and offline usability.

### 📱 Simplified UI/UX
- Built with ShadCN UI and Tailwind CSS for clean, accessible design.
- Responsive layout optimized for elderly users and caregivers.

---

## 🧰 Technology Stack

| Layer            | Technologies Used                          |
|------------------|--------------------------------------------|
| Frontend         | React, TypeScript, Tailwind CSS, ShadCN UI |
| Backend          | Node.js, Vite                              |
| Authentication   | Local PIN-based login                      |
| Recognition      | OpenCV (planned), TensorFlow (planned)     |
| Voice Input      | Web Speech API (planned)                   |
| Configuration    | ESLint, tsconfig, postcss                  |

---

## 🔗 Reference Architecture

MemoryLink Companion is a modular evolution of [DimAssist](https://github.com/neharmenon05/dim_assist), also developed by Neha Menon. It expands the original concept into a scalable, clinically relevant system with enhanced security, usability, and caregiver integration.

---

## 🚀 Setup Instructions

```bash
# Clone the repository
git clone https://github.com/neharmenon05/memory-link-companion

# Navigate to the project directory
cd memory-link-companion

# Install dependencies
npm install

# Start the development server
npm run dev

---

## Tecahnology used
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
