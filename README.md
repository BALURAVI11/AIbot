# 🎙️ AlterEgo: Premium AI Voice Bot Console

Welcome to **AlterEgo**, a futuristic, state-of-the-art interactive AI Voice Bot designed to represent **Raviteja Kolluri** (Advanced Full-Stack & AI Agent Engineer) in job assessments, interviews, and portfolio reviews. 

Out-of-the-box, the application functions as a **zero-install, high-availability voice console** that allows anyone to converse with Raviteja's AI Twin, hear him speak, view a real-time rolling transcript, and even customize his profile parameters in real-time.

---

## ⚡ Quick Start Guide (Run Instantly)

No complex installations, database setups, or database runs are required! There are two quick ways to launch the app:

### Option A: One-Command Native Server (Recommended)
Because modern browsers (like Google Chrome and Safari) restrict microphone permissions and `localStorage` caching when opening raw static files directly under the `file://` protocol, we have provided a **zero-dependency Node.js HTTP server** to serve the application locally.

1.  Open your terminal and ensure you are in the project folder:
    ```bash
    cd /Users/kolluriraviteja/Desktop/100x
    ```
2.  Launch the native local server:
    ```bash
    node server.js
    ```
3.  **Done!** The server will start on port `3000` and **automatically open AlterEgo** in your default web browser at **`http://localhost:3000`**.

---

### Option B: Raw Static Launch
If you do not have Node.js installed, you can run the files directly:
1.  Open the project folder and **double-click the `index.html` file**.
2.  It will open instantly in your default web browser (Safari, Firefox, or Chrome).
3.  *Note: Depending on browser security policies, microphone permission might prompt on every click under the raw file:// protocol. If so, utilize the keyboard input form at the bottom of the transcript pane to test.*

---

## 🚀 Key Features

*   **⚡ High-Availability Fallback AI Routing (Primary ⇄ Fallback)**:
    *   **Primary Engine**: Powered by **Google Gemini AI** (`gemini-2.5-flash`), routed securely through the local/serverless `/api/chat` backend proxy.
    *   **Fallback Engine**: If Gemini experiences a connection timeout, rate-limits, or quota block, the serverless handler automatically and silently falls hot-over to **Groq AI** using the state-of-the-art **Llama-3.3-70b-versatile** model, guaranteeing 100% production-grade uptime.
*   **🎙️ Native Voice Integration**:
    *   **Speech-to-Text (STT)**: Speak directly to the bot using high-performance browser speech recognition (`webkitSpeechRecognition`).
    *   **Text-to-Speech (TTS)**: The bot reads responses back using high-fidelity system-synthesized voices with dynamic vocal speed and volume control.
*   **🎨 Premium Cyber-Neural Aesthetics**: 
    *   A custom-designed **glowing fingerprint logo** asset (`alter_ego_logo.png`) that was dynamically AI-generated for this rebranding.
    *   A gorgeous **Split-Screen Console** designed for desktop viewports. Left side handles voice centerpiece actions, and the right side hosts a full-height chat dialogue workspace.
    *   An **interactive voice orb** that breathes in idle mode, pulses crimson when listening, rotates gradient mesh layers when thinking, and ripples concentric wave vectors when speaking.
    *   An animated glowing multi-bar **soundwave visualizer**.
*   **🌓 Dark & Light Mode Theme Switcher**: Features a circular glass button in the header that instantly morphs the entire design between a deep cosmic midnight theme and a frosted mint-white layout, saving your preference automatically.
*   **🔒 High-Fidelity Interactive Logout Page Overlay**: A beautiful fullscreen glassmorphic modal representing the system logout experience. Triggered via a sleek bracket button in the header, it features a pulsating neon icon, futuristic explanation, an animated simulated progress bar (loading from `0%` to `15%` to indicate its backlog status), and a "Return to Dashboard" close action.
*   **🕒 Persistent "Recently Asked Questions" (Past Searches Memory)**: Located at the bottom of the sliding configuration drawer, this panel stores the user's last 10 unique custom queries dynamically using `localStorage` persistence. Clicking any past question automatically slides the sidebar closed, instantly re-submits the query, and triggers the voice/text response.
*   **⌨️ Inline Keyboard Accessibility**: A sleek text-input bar at the bottom of the transcript lets users type questions manually in noisy rooms or on browsers with disabled microphones.
*   **⚡ Quick-Start Prompt Chips**: Interactive pills let users immediately query standard interview questions with a single click.
*   **⚙️ Live Configuration Dashboard (Train Your Twin)**: A beautiful slide-out drawer dashboard where users can review, edit, and save custom answers. Edits instantly retrain the AI Twin!
*   **🛡️ Robust Conversational Enhancements**: Features a conversational reformatting parser that converts dry profile texts into natural, active, first-person replies (*"I completed my..."*, *"I did..."*, *"My core focus is on..."*) so the AI Twin always responds authentically in character.
*   **💬 Sleek and Collapsible Error Toggles**: If both AI backends fail, instead of showing a raw technical error block, AlterEgo shows a clean, user-friendly apology message with a tiny **"Get more"** link that lets developers easily expand and inspect technical details if clicked.

---

## 🛠️ What We Used (The Tech Stack)

*   **HTML5 Structure**: Structured with semantic tags for accessibility, search crawling, and clean accessibility markers.
*   **Vanilla CSS3 (Variable Driven)**: Built entirely with vanilla CSS custom properties (variables), Flexbox, CSS transitions, and high-end animations (glowing meshes, keyframe ripples). Avoids bulky utility frameworks for ultra-fast asset deliveries.
*   **Vanilla JavaScript (ES6+ State Machine)**: Clean state controllers managing state variables (`idle`, `listening`, `thinking`, `speaking`), syncing LocalStorage parameters, binding UI event listeners, and routing API calls.
*   **Node.js & Vercel Serverless Functions**: Native Node.js backends (`server.js` locally and `/api/chat` on Vercel) proxying API requests securely to bypass automated Push Protection blocks and protect developer API keys.
*   **Browser Web Speech APIs**: Built-in, zero-dependency browser recognition and synthesis engines.
*   **FontAwesome Icons**: High-quality SVG icon assets for premium UI status displays.

---

## 🏗️ How We Built It (Architectural Overview)

The system relies on a decoupled, secure client-to-serverless proxy architecture. 

1.  **State Synchronization**: On boot, `app.js` initializes your persona details by reading from `localStorage`. If empty, it pre-loads your professional developer answers as defaults.
2.  **Theme Variable Swaps**: The theme toggle works by dynamically adding or removing the `.light-theme` class from the `body` tag. Since all background colors, border opacities, text weights, scrollbars, and glows are linked to CSS variables (`var(--bg-deep)`, `var(--text-primary)`), the entire application morphs colors instantly with zero screen flash.
3.  **Horizontal Grid Split**: Using flexbox layout constraints (`height: calc(100vh - 70px)` and `min-height: 0` rules), the page viewport is locked to the screen, forcing the transcript pane to stretch full-height and scroll inside itself cleanly on desktop, while collapsing into a mobile-responsive vertical layout on mobile.
4.  **Prompt Parameter Injection**: When a question is raised, the script pulls the latest text values directly from the configuration drawer textareas and injects them into a highly descriptive LLM prompt. The system instructions strictly enforce first-person roleplay ("I"), enforce spoken-word conciseness (under 70 words to prevent truncation), and ban bot-like phrases (e.g. *"AI assistant"*, *"connectivity issues"*).

---

## ⚙️ Persona Customization & Profile Saving

The system is highly flexible and built so **anyone** can test it with their own background:

1.  **Live Configuration Panel Drawer**:
    *   Click **Personal Details** in the top right.
    *   You can directly edit the **Biography**, **Strengths**, **Weaknesses**, **Contact details**, **Education**, or **Employment History** text boxes.
    *   Click **Save Details**. All changes are saved to browser storage and the AI Twin is **instantly retrained**! Ask the bot about your new details, and it will immediately answer in character.
2.  **Conversational Formatting**:
    *   Even if you enter raw bullet points or resume titles in the sidebar, the script converts them into flowing, active, first-person replies (e.g. *"I completed my Bachelor of Science in..."*), maintaining an organic candidate character dialogue.

---

## 🔑 Secure API Keys Configuration (No Front-End Overrides)

To ensure maximum security and protect private developer credentials, AlterEgo **removes manual client-side API Key fields in the UI**. All requests are proxied securely through the backend.

### Local Development (.env)
Simply open the [.env](file:///Users/kolluriraviteja/Desktop/100x/.env) file in the root folder and add your Gemini and Groq API keys:
```env
# Gemini API Key for local development
GEMINI_API_KEY=AIzaSyYourGeminiAPIKeyHere...

# Fallback Groq API Key
GROQ_API_KEY=gsk_YourActualGroqAPIKeyHere...
```

### Production Deployment (Vercel Dashboard)
When deploying the app to production, configure these variables inside the Vercel Dashboard under **Project Settings -> Environment Variables**:
*   `GEMINI_API_KEY` (Your Google Gemini API Key)
*   `GROQ_API_KEY` (Your Groq API Key)

No keys are ever committed to Git, keeping your production deployment completely secure, compliant, and zero-maintenance!

---

## 🔍 How to Check and Verify Every Feature

Follow this simple, step-by-step checklist to systematically verify every requirement of the project:

### 1. Verification of the 5 Core Interview Questions (Requirement 1)
*   **Action**: Click each of the **Quick-Start Prompts** chips below the Voice Orb (*Life Story*, *Superpower #1*, *Top 3 Growth Areas*, *Coworkers' Misconception*, *Pushing Boundaries*).
*   **Check**: Verify that the bot transcribes the click, queries the LLM, prints a first-person bubble as *"Raviteja Kolluri"*, and speaks your exact custom details in a natural human voice.

### 2. Verification of New Configuration Fields (Strengths, Weaknesses, Contact, Education, Employment)
*   **Action**: Open the **Personal Details** panel and inspect the five pre-populated areas. Close the panel, and speak or type these questions:
    *   *"What are your strengths?"*
    *   *"Tell me your weaknesses."*
    *   *"How can I contact you?"*
    *   *"Where did you study?"*
    *   *"Tell me about your job experience."*
*   **Check**: Verify that the bot reads your saved settings and answers beautifully, converting raw text paragraphs or lists into flowing first-person sentences.

### 3. Verification of Voice Input and Speech Output (Requirement 2)
*   **Action**: Click the central **Voice Orb**. Allow microphone access in your browser.
*   **Check**: The orb turns crimson and says *"Listening closely..."*. Speak a question (e.g., *"What is your story?"*).
*   **Check**: The browser auto-detects when you stop speaking, transcribes it under your bubble, and switches to the spinning cyan *"Thinking"* animation.
*   **Check**: The orb turns violet and **reads the answer back aloud** while concentric ripples wave out. Click the orb while it's speaking to verify it instantly interrupts/stops the voice.

### 4. Verification of the Theme Switcher (Dark & Light Mode)
*   **Action**: Click the **Sun/Moon Button** in the header.
*   **Check**: The interface instantly morphs into a bright, frosted mint-white theme. The central voice orb transforms into a glowing, translucent white sphere. Refresh the page to verify that the light theme remains active automatically.

### 5. Verification of Chat Log Persistence
*   **Action**: Ask a couple of questions, then **refresh your browser window**.
*   **Check**: The conversation transcript remains visible. Now, click the **Clear** button next to the transcript header.
*   **Check**: The chat log is instantly cleared, returning the transcript feed to its empty placeholder state.

### 6. Verification of the Logout Page Overlay
*   **Action**: Click the **Log Out** bracket icon in the top header (next to the theme toggle).
*   **Check**: Verify that the dark glassmorphic overlay wraps the screen, and the development backlog progress bar animates from `0%` to `15%` with the text *"This feature is yet to be developed!"*.
*   **Check**: Click the **Return to Dashboard** button and verify that the overlay transitions out smoothly, returning you to your active twin workspace.

### 7. Verification of the Recently Asked Questions Panel
*   **Action**: Submit a custom query (e.g., *"What is your favorite stack?"*).
*   **Check**: Open the **Personal Details** sidebar drawer and scroll to the bottom. Verify that your query appears in the **Recent Questions** list.
*   **Check**: Click the past question button and check that the sidebar slides closed and the AI Twin automatically re-runs and answers the question. Refresh the page to verify that the query list persists safely in browser `localStorage`.
