# 🎙️ Virtual Self: Premium AI Voice Bot Console

Welcome to **VirtualSelf**, a futuristic, state-of-the-art interactive AI Voice Bot designed to represent **Raviteja Kolluri** (Advanced Full-Stack & AI Agent Engineer) in job assessments and interviews. 

Out-of-the-box, the application functions as a **zero-install, keyless voice console** that allows anyone to converse with Raviteja's AI Twin, hear him speak, view a real-time rolling transcript, and even re-train his profile or configure API keys on-the-fly!

---

## ⚡ Quick Start Guide (Run Instantly)

No complex installations, database setups, or `npm install` runs are required! There are two quick ways to launch the app:

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
3.  **Done!** The server will start on port `3000` and **automatically open the Voice Bot** in your default web browser at **`http://localhost:3000`**.

---

### Option B: Raw Static Launch
If you do not have Node.js installed, you can run the files directly:
1.  Open the project folder and **double-click the `index.html` file**.
2.  It will open instantly in your default web browser (Safari, Firefox, or Chrome).
3.  *Note: Depending on browser security policies, microphone permission might prompt on every click under the raw file:// protocol. If so, utilize the keyboard input form at the bottom of the transcript pane to test.*

---

## 🚀 Key Features

*   **🔒 Out-of-the-Box Keyless AI**: Powered by **Puter.js v2** (`puter.ai.chat`), triggering advanced LLMs (`gpt-4o-mini`) directly from browser frontend code with **no private API keys required** out-of-the-box.
*   **🎙️ Native Voice Integration**:
    *   **Speech-to-Text (STT)**: Speaks directly to the bot using high-performance browser speech recognition (`webkitSpeechRecognition`).
    *   **Text-to-Speech (TTS)**: The bot reads responses back using high-fidelity system-synthesized voices with dynamic vocal speed and voice font selections.
*   **🎨 Stunning Oceanic Aurora Interface**: 
    *   A gorgeous **Split-Screen Console** designed for desktop viewports. Left side handles voice centerpiece actions, and the right side hosts a full-height chat dialogue workspace.
    *   An **interactive voice orb** that breathes in idle mode, pulses crimson when listening, rotates gradient mesh layers when thinking, and ripples concentric wave vectors when speaking.
    *   An animated glowing multi-bar **soundwave visualizer**.
*   **🌓 Dark & Light Mode Theme Switcher**: Features a circular glass button in the header that instantly morphs the entire design between a deep cosmic midnight theme and a frosted mint-white layout, saving your preference automatically.
*   **⌨️ Inline Keyboard Accessibility**: A sleek text-input bar at the bottom of the transcript lets users type questions manually in noisy rooms or on browsers with disabled microphones.
*   **⚡ Quick-Start Prompt Chips**: Interactive pills let users immediately query the five standard interview questions with a single click.
*   **⚙️ Live Configuration Dashboard (Train Your Twin)**: A beautiful slide-out drawer dashboard where users can review, edit, and save custom answers. Edits instantly retrain the AI Twin!
*   **🛡️ Robust Offline / Rate-Limit Fallback**: Features an intelligent local keyword scanning cache. If the LLM experiences rate limits or network issues, the bot immediately formats your saved details conversationally and speaks them, ensuring it *never* fails a test.

---

## 🛠️ What We Used (The Tech Stack)

*   **HTML5 Structure**: Structured with semantic tags for accessibility, search crawling, and clean accessibility markers.
*   **Vanilla CSS3 (Variable Driven)**: Built entirely with vanilla CSS custom properties (variables), Flexbox, CSS transitions, and high-end animations (glowing meshes, keyframe ripples). Avoids bulky utility frameworks for ultra-fast asset deliveries.
*   **Vanilla JavaScript (ES6+ State Machine)**: Clean state controllers managing state variables (`idle`, `listening`, `thinking`, `speaking`), syncing LocalStorage parameters, binding UI event listeners, and routing API calls.
*   **Puter.js Developer Cloud**: Abstracted keyless LLM gateways executing free browser-direct inference.
*   **Browser Web Speech APIs**: Built-in, zero-dependency browser recognition and synthesis engines.
*   **FontAwesome Icons**: High-quality SVG icon assets for premium UI status displays.

---

## 🏗️ How We Built It (Architectural Overview)

The system relies on a purely decoupled client-driven serverless architecture. 

1.  **State Synchronization**: On boot, `app.js` initializes your persona details by reading from `localStorage`. If empty, it pre-loads your professional developer answers as defaults.
2.  **Theme Variable Swaps**: The theme toggle works by dynamically adding or removing the `.light-theme` class from the `body` tag. Since all background colors, border opacities, text weights, scrollbars, and glows are linked to CSS variables (`var(--bg-deep)`, `var(--text-primary)`), the entire application morphs colors instantly with zero screen flash.
3.  **Horizontal Grid Split**: Using flexbox layout constraints (`height: calc(100vh - 70px)` and `min-height: 0` rules), the page viewport is locked to the screen, forcing the transcript pane to stretch full-height and scroll inside itself cleanly on desktop, while collapsing into a mobile-responsive vertical layout on mobile.
4.  **Prompt Parameter Injection**: When a question is raised, the script pulls the latest text values directly from the configuration drawer textareas and injects them into a highly descriptive LLM prompt. The system instructions strictly enforce first-person roleplay ("I"), enforce extreme conciseness (under 60 words), and ban bot-like phrases (e.g. *"AI assistant"*, *"connectivity issues"*).

---

## ⚙️ Persona Customization & Manual Prompts

The system is highly flexible and built so **anyone** can test it with their own background:

1.  **Live Configuration Panel Drawer**:
    *   Click **Edit AI Twin** in the top right.
    *   You can directly edit the **Biography**, **Strengths**, **Weaknesses**, **Contact details**, **Education**, or **Employment History** text boxes.
    *   Click **Save Persona**. All changes are saved to browser storage and the AI Twin is **instantly retrained**! Ask the bot about your new details, and it will immediately answer in character.
2.  **Feeding Details Directly inside Prompt Inputs**:
    *   If you wish to test custom prompts or feed background information directly into the conversation (e.g., *"Forget previous details. My name is Alex, a senior designer. Now tell me who you are."*), you can type these instructions directly into the **Keyboard Input Form** at the bottom of the transcript pane.
    *   The LLM will parse your custom input text dynamically and adapt its behavior to your instructions on-the-fly!

---

## 🔑 Optional API Key Fallback (Completely Free & Custom)

While the bot runs completely **free and keyless** out-of-the-box using Puter's developer cloud, we have provided an elegant fallback dashboard for recruiters or power-users who want to connect their own keys:

1.  Open the **Edit AI Twin** panel in the top right.
2.  Scroll to the bottom and expand **Custom API Key (Fallback)**.
3.  Choose your preferred LLM Provider:
    *   **Puter AI**: (Default) Keyless and free.
    *   **OpenAI API**: Runs on `gpt-4o-mini`.
    *   **Gemini API**: Runs on `gemini-1.5-flash`.
4.  Paste your **API Key** (e.g., `sk-...` or Google Key) and click **Save Persona**.
5.  *Security Note: Your keys are processed strictly inside your own browser window. They are saved only to your local machine (`localStorage`) and are never sent to any third-party servers, guaranteeing full privacy.*

---

## 🔍 How to Check and Verify Every Feature

Follow this simple, step-by-step checklist to systematically verify every requirement of the project:

### 1. Verification of the 5 Core Interview Questions (Requirement 1)
*   **Action**: Click each of the **Quick-Start Prompts** chips below the Voice Orb (*Life Story*, *Superpower #1*, *Top 3 Growth Areas*, *Coworkers' Misconception*, *Pushing Boundaries*).
*   **Check**: Verify that the bot transcribes the click, queries the LLM, prints a first-person bubble as *"Raviteja Kolluri"*, and speaks your exact custom details in a natural human voice.

### 2. Verification of New Configuration Fields (Strengths, Weaknesses, Contact, Education, Employment)
*   **Action**: Open the **Edit AI Twin** panel and inspect the five pre-populated areas. Close the panel, and speak or type these questions:
    *   *"What are your strengths?"*
    *   *"Tell me your weaknesses."*
    *   *"How can I contact you?"*
    *   *"Where did you study?"*
    *   *"Tell me about your job experience."*
*   **Check**: Verify that the bot reads your saved settings and answers beautifully, converting raw text paragraphs or lists into flowing conversational sentences.

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
