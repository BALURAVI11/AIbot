/**
 * VIRTUAL SELF: VOICE BOT - CLIENT INTERACTION ENGINE
 * Orchestrates Speech APIs, Google Gemini AI, and Orb States.
 */



// 1. Default Profile Definition (representing Raviteja Kolluri)
const DEFAULT_PROFILE = {
  name: "Raviteja Kolluri",
  title: "Computer Science Graduate & Aspiring AI Engineer",
  story: "I am a recent Computer Science engineering graduate who is deeply passionate about AI, full-stack development, and problem-solving. My journey began with a curiosity for how complex systems process information, which led me to study intelligent systems, build modern web applications, and experiment with local LLMs. I love taking on challenging algorithms and crafting clean, user-friendly solutions.",
  superpower: "My superpower is my hyper-focused problem-solving ability and rapid learning capacity. When faced with a new technology, framework, or complex bug, I deep-dive into the documentation and source code to master it in a matter of hours, translating theoretical concepts into clean, functional code immediately.",
  growth: "1. Mastering advanced deep learning architectures and transformer-based model fine-tuning.\n2. Deepening knowledge in distributed system design and scalable backend routing.\n3. Building interactive, real-time data visualizations using modern canvas and WebGL graphics engines.",
  misconception: "Because I am intensely focused and highly productive when coding, people sometimes assume I'm purely theoretical or a silent coder. In reality, I am highly collaborative, communicative, and enjoy pair programming. Outside of software engineering, I love traveling, exploring nature, and recharging my creative battery.",
  limits: "I push my boundaries by actively stepping out of my comfort zone and tackling complex, ambiguous projects where the solution isn't obvious. I set high standards for my work—like building advanced full-stack voice bots from scratch—treating every technical challenge as an opportunity to grow as an engineer.",
  strengths: "Designing responsive, premium front-end layouts, rapid mastery of modern frameworks (like React, Node.js, and Python), and strong algorithmic problem-solving skills.",
  weaknesses: "An occasional impatience with manual repetitive tasks that leads me to aggressively automate my local environment, and a tendency to spend extra time perfect-tuning micro-interactions and aesthetic details.",
  contact: "Email: raviteja.kolluri@email.com | Phone: +1 (555) 019-2834 | GitHub: github.com/ravitejakolluri | LinkedIn: linkedin.com/in/ravitejakolluri",
  education: "Bachelor of Technology in Computer Science and Engineering, specialized in Intelligent Systems and Software Engineering.",
  employment: "Software Engineering Intern at SynthCode (2024): Collaborated on building responsive web dashboards and integrating developer tools. | Open Source Contributor (2023 - Present): Built self-directed full-stack projects and automated serverless workflows.",
  provider: "gemini"
};

// 2. Global State Machine
let profile = {};
let currentState = "idle"; // 'idle' | 'listening' | 'thinking' | 'speaking'
let recognition = null;
let synth = window.speechSynthesis;
let availableVoices = [];
let selectedVoice = null;
let activeUtterance = null;
let conversationHistory = []; // Persistent chat log

// 3. DOM Elements Setup
const DOM = {
  voiceOrb: document.getElementById("voice-orb"),
  orbIcon: document.getElementById("orb-icon"),
  speakingRing1: document.getElementById("speaking-ring-1"),
  speakingRing2: document.getElementById("speaking-ring-2"),
  waveform: document.getElementById("waveform"),
  captionTitle: document.getElementById("caption-title"),
  captionSubtitle: document.getElementById("caption-subtitle"),
  statusDot: document.getElementById("status-dot"),
  statusText: document.getElementById("status-text"),
  
  // Theme Toggle Button
  btnThemeToggle: document.getElementById("btn-theme-toggle"),
  themeToggleIcon: document.getElementById("theme-toggle-icon"),
  
  // Sidebar elements
  sidebar: document.getElementById("sidebar"),
  btnSidebarOpen: document.getElementById("btn-sidebar-open"),
  btnSidebarClose: document.getElementById("btn-sidebar-close"),
  btnSaveProfile: document.getElementById("btn-save-profile"),
  btnResetProfile: document.getElementById("btn-reset-profile"),
  
  // Profile Inputs
  inputName: document.getElementById("profile-name"),
  inputTitle: document.getElementById("profile-title"),
  inputStory: document.getElementById("profile-story"),
  inputSuperpower: document.getElementById("profile-superpower"),
  inputGrowth: document.getElementById("profile-growth"),
  inputMisconception: document.getElementById("profile-misconception"),
  inputLimits: document.getElementById("profile-limits"),
  inputStrengths: document.getElementById("profile-strengths"),
  inputWeaknesses: document.getElementById("profile-weaknesses"),
  inputContact: document.getElementById("profile-contact"),
  inputEducation: document.getElementById("profile-education"),
  inputEmployment: document.getElementById("profile-employment"),
  
  // Transcript elements
  transcriptFeed: document.getElementById("transcript-feed"),
  transcriptPlaceholder: document.getElementById("transcript-placeholder"),
  btnClearChat: document.getElementById("btn-clear-chat"),
  
  // Chat input
  chatForm: document.getElementById("chat-input-form"),
  chatTextInput: document.getElementById("chat-text-input"),
  
  // Voice Controls
  voiceSelect: document.getElementById("voice-select"),
  voiceSpeed: document.getElementById("voice-speed"),
  voiceSpeedVal: document.getElementById("voice-speed-val"),
  voiceVolume: document.getElementById("voice-volume"),
  voiceVolumeVal: document.getElementById("voice-volume-val"),
  
  // Toast
  toast: document.getElementById("toast"),
  toastMessage: document.getElementById("toast-message"),
  
  // Logout & Recent Questions elements
  btnLogout: document.getElementById("btn-logout"),
  logoutOverlay: document.getElementById("logout-overlay"),
  btnLogoutClose: document.getElementById("btn-logout-close"),
  recentQuestionsContainer: document.getElementById("recent-questions-container")
};

// 4. Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  initUIListeners();
  initSpeechRecognition();
  initSpeechSynthesis();
  loadChatHistory();
  loadRecentQuestions();
});

// 5. State Controller
function setState(newState) {
  currentState = newState;
  
  // Remove all state classes from orb, waveform, and rings
  DOM.voiceOrb.className = "voice-orb";
  DOM.waveform.className = "waveform-visualizer";
  DOM.speakingRing1.className = "speaking-ring speaking-ring-1";
  DOM.speakingRing2.className = "speaking-ring speaking-ring-2";
  
  // Reset icons
  DOM.orbIcon.className = "voice-orb-icon fa-solid";

  switch (currentState) {
    case "idle":
      DOM.voiceOrb.classList.add("orb-idle");
      DOM.orbIcon.classList.add("fa-microphone");
      DOM.statusDot.className = "status-dot active";
      DOM.statusText.textContent = "AI Twin Ready";
      DOM.captionTitle.textContent = "Click the Orb to Speak";
      DOM.captionSubtitle.textContent = "Or select a quick-start question below";
      break;
      
    case "listening":
      DOM.voiceOrb.classList.add("orb-listening");
      DOM.waveform.classList.add("listening");
      DOM.orbIcon.classList.add("fa-microphone");
      DOM.statusDot.className = "status-dot listening";
      DOM.statusText.textContent = "Listening...";
      DOM.captionTitle.textContent = "Listening closely...";
      DOM.captionSubtitle.textContent = "Speak clearly. Click orb to finish.";
      break;
      
    case "thinking":
      DOM.voiceOrb.classList.add("orb-thinking");
      DOM.orbIcon.classList.add("fa-arrows-spin");
      DOM.statusDot.className = "status-dot processing";
      DOM.statusText.textContent = "AI is thinking...";
      DOM.captionTitle.textContent = "Processing speech...";
      DOM.captionSubtitle.textContent = "Formulating response as " + profile.name;
      break;
      
    case "speaking":
      DOM.voiceOrb.classList.add("orb-speaking");
      DOM.waveform.classList.add("speaking");
      DOM.speakingRing1.classList.add("speaking");
      DOM.speakingRing2.classList.add("speaking");
      DOM.orbIcon.classList.add("fa-stop"); // Click to interrupt/stop
      DOM.statusDot.className = "status-dot active";
      DOM.statusText.textContent = "Speaking...";
      DOM.captionTitle.textContent = profile.name + " is speaking";
      DOM.captionSubtitle.textContent = "Click the orb to stop listening/speaking.";
      break;
  }
}

// 6. Local Storage & Profile Management
function loadProfile() {
  const storedProfile = localStorage.getItem("virtual_self_profile");
  if (storedProfile) {
    try {
      const parsed = JSON.parse(storedProfile) || {};
      profile = { ...DEFAULT_PROFILE };
      
      // Deep merge non-empty keys only to prevent loading empty strings from outdated localStorage cache
      Object.keys(DEFAULT_PROFILE).forEach(key => {
        if (parsed[key] !== undefined && parsed[key] !== null && parsed[key].toString().trim() !== "") {
          profile[key] = parsed[key];
        }
      });
      
      // Auto-upgrade older 'puter' default provider users to the new Gemini serverless backend
      if (profile.provider === "puter" && !profile.apiKey) {
        profile.provider = "gemini";
      }
    } catch (e) {
      console.error("Failed to parse stored profile, reverting to defaults.", e);
      profile = { ...DEFAULT_PROFILE };
    }
  } else {
    profile = { ...DEFAULT_PROFILE };
  }
  
  // Pre-fill inputs
  DOM.inputName.value = profile.name;
  DOM.inputTitle.value = profile.title;
  DOM.inputStory.value = profile.story;
  DOM.inputSuperpower.value = profile.superpower;
  DOM.inputGrowth.value = profile.growth;
  DOM.inputMisconception.value = profile.misconception;
  DOM.inputLimits.value = profile.limits;
  DOM.inputStrengths.value = profile.strengths;
  DOM.inputWeaknesses.value = profile.weaknesses;
  DOM.inputContact.value = profile.contact;
  DOM.inputEducation.value = profile.education;
  DOM.inputEmployment.value = profile.employment;
}

function saveProfile() {
  profile.name = DOM.inputName.value.trim() || DEFAULT_PROFILE.name;
  profile.title = DOM.inputTitle.value.trim() || DEFAULT_PROFILE.title;
  profile.story = DOM.inputStory.value.trim() || DEFAULT_PROFILE.story;
  profile.superpower = DOM.inputSuperpower.value.trim() || DEFAULT_PROFILE.superpower;
  profile.growth = DOM.inputGrowth.value.trim() || DEFAULT_PROFILE.growth;
  profile.misconception = DOM.inputMisconception.value.trim() || DEFAULT_PROFILE.misconception;
  profile.limits = DOM.inputLimits.value.trim() || DEFAULT_PROFILE.limits;
  profile.strengths = DOM.inputStrengths.value.trim() || DEFAULT_PROFILE.strengths;
  profile.weaknesses = DOM.inputWeaknesses.value.trim() || DEFAULT_PROFILE.weaknesses;
  profile.contact = DOM.inputContact.value.trim() || DEFAULT_PROFILE.contact;
  profile.education = DOM.inputEducation.value.trim() || DEFAULT_PROFILE.education;
  profile.employment = DOM.inputEmployment.value.trim() || DEFAULT_PROFILE.employment;
  profile.provider = "gemini";
  
  localStorage.setItem("virtual_self_profile", JSON.stringify(profile));
  showToast("Personal Details Saved!", false);
  
  // Close Sidebar
  DOM.sidebar.classList.remove("open");
  
  // Reset state to refresh labels if needed
  if (currentState === "idle") {
    setState("idle");
  }
}

function resetProfile() {
  if (confirm("Are you sure you want to reset all configurations to default values?")) {
    profile = { ...DEFAULT_PROFILE };
    localStorage.setItem("virtual_self_profile", JSON.stringify(profile));
    loadProfile();
    showToast("Reverted to default values", false);
  }
}

// 7. UI Listeners
function initUIListeners() {
  // Sidebar controls
  DOM.btnSidebarOpen.addEventListener("click", () => DOM.sidebar.classList.add("open"));
  DOM.btnSidebarClose.addEventListener("click", () => DOM.sidebar.classList.remove("open"));
  DOM.btnSaveProfile.addEventListener("click", saveProfile);
  DOM.btnResetProfile.addEventListener("click", resetProfile);
  
  // Log Out handler (Show premium overlay page with interactive elements)
  DOM.btnLogout.addEventListener("click", () => {
    if (DOM.logoutOverlay) {
      DOM.logoutOverlay.classList.add("open");
      
      const fill = document.getElementById("dev-progress-fill");
      const label = document.getElementById("dev-progress-percent");
      if (fill && label) {
        fill.style.width = "0%";
        label.textContent = "0%";
        setTimeout(() => {
          fill.style.width = "15%";
          let count = 0;
          const interval = setInterval(() => {
            if (count >= 15) {
              clearInterval(interval);
            } else {
              count++;
              label.textContent = count + "%";
            }
          }, 60);
        }, 150);
      }
    } else {
      showToast("This feature is yet to be developed!", true);
    }
  });

  if (DOM.btnLogoutClose) {
    DOM.btnLogoutClose.addEventListener("click", () => {
      if (DOM.logoutOverlay) {
        DOM.logoutOverlay.classList.remove("open");
        // Reset state after animation completes
        setTimeout(() => {
          const fill = document.getElementById("dev-progress-fill");
          const label = document.getElementById("dev-progress-percent");
          if (fill && label) {
            fill.style.width = "0%";
            label.textContent = "0%";
          }
        }, 400);
      }
    });
  }

  // Click Orb actions
  DOM.voiceOrb.addEventListener("click", handleOrbClick);
  
  // Quick Start Chips
  document.querySelectorAll(".question-chip").forEach(chip => {
    chip.addEventListener("click", (e) => {
      const question = chip.getAttribute("data-question");
      if (question) {
        handleQuery(question);
      }
    });
  });
  
  // Clear chat
  DOM.btnClearChat.addEventListener("click", () => {
    conversationHistory = [];
    localStorage.removeItem("virtual_self_chat_history");
    DOM.transcriptFeed.innerHTML = "";
    DOM.transcriptFeed.appendChild(DOM.transcriptPlaceholder);
    DOM.transcriptPlaceholder.style.display = "flex";
    if (synth) synth.cancel();
    setState("idle");
    showToast("Conversation cleared", false);
  });
  
  // Keyboard Chat Input Form
  DOM.chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = DOM.chatTextInput.value.trim();
    if (!query) return;
    
    DOM.chatTextInput.value = "";
    handleQuery(query);
  });
  
  // Speed slider
  DOM.voiceSpeed.addEventListener("input", (e) => {
    const speed = parseFloat(e.target.value).toFixed(1);
    DOM.voiceSpeedVal.textContent = speed + "x";
    localStorage.setItem("virtual_self_voice_speed", speed);
  });

  // Volume slider
  DOM.voiceVolume.addEventListener("input", (e) => {
    const vol = parseFloat(e.target.value);
    DOM.voiceVolumeVal.textContent = Math.round(vol * 100) + "%";
    localStorage.setItem("virtual_self_voice_volume", vol);
  });
  
  // Load speed preference
  const savedSpeed = localStorage.getItem("virtual_self_voice_speed");
  if (savedSpeed) {
    DOM.voiceSpeed.value = savedSpeed;
    DOM.voiceSpeedVal.textContent = parseFloat(savedSpeed).toFixed(1) + "x";
  }

  // Load volume preference
  const savedVolume = localStorage.getItem("virtual_self_voice_volume");
  if (savedVolume) {
    DOM.voiceVolume.value = savedVolume;
    DOM.voiceVolumeVal.textContent = Math.round(parseFloat(savedVolume) * 100) + "%";
  }

  // Theme Toggle Event Listener
  DOM.btnThemeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light-theme");
    DOM.themeToggleIcon.className = isLight ? "fa-solid fa-moon" : "fa-solid fa-sun";
    localStorage.setItem("virtual_self_theme", isLight ? "light" : "dark");
    showToast(isLight ? "Light Mode Enabled" : "Dark Mode Enabled", false);
  });

  // Load and Restore Theme Preference on startup
  const savedTheme = localStorage.getItem("virtual_self_theme") || "dark";
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    DOM.themeToggleIcon.className = "fa-solid fa-moon";
  }
}

// updateApiKeyVisibility function removed as Puter is deleted

// 8. Speech-to-Text (STT) Setup
function initSpeechRecognition() {
  const SpeechObj = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechObj) {
    console.warn("Web Speech Recognition API not supported in this browser.");
    DOM.captionSubtitle.textContent = "Mic input unsupported on this browser. Try Typing or clicking Chips!";
    return;
  }
  
  recognition = new SpeechObj();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";
  
  recognition.onstart = () => {
    setState("listening");
    if (synth) synth.cancel(); // Stop any reading if user talks
  };
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (transcript && transcript.trim()) {
      handleQuery(transcript);
    }
  };
  
  recognition.onerror = (event) => {
    console.error("Speech Recognition Error:", event.error);
    if (event.error === "not-allowed") {
      showToast("Microphone access blocked! Enable browser mic permissions.", true);
    } else if (event.error !== "no-speech") {
      showToast("Speech mic error: " + event.error, true);
    }
    setState("idle");
  };
  
  recognition.onend = () => {
    if (currentState === "listening") {
      setState("idle");
    }
  };
}

function handleOrbClick() {
  if (currentState === "idle") {
    if (recognition) {
      try {
        recognition.start();
      } catch (e) {
        console.error(e);
        showToast("Speech Recognition failed to start. Try typing!", true);
      }
    } else {
      showToast("Microphone is not supported in this browser. Please type your query below!", true);
    }
  } else if (currentState === "listening") {
    if (recognition) recognition.stop();
  } else if (currentState === "speaking") {
    if (synth) synth.cancel();
    setState("idle");
  }
}

// 9. Text-to-Speech (TTS) Setup
function initSpeechSynthesis() {
  if (!synth) {
    console.warn("Speech Synthesis API not supported.");
    return;
  }
  
  const populateVoices = () => {
    availableVoices = synth.getVoices();
    DOM.voiceSelect.innerHTML = "";
    
    // Filter to English or popular languages first, for highest quality
    const englishVoices = availableVoices.filter(v => v.lang.startsWith("en-"));
    const otherVoices = availableVoices.filter(v => !v.lang.startsWith("en-"));
    const sortedVoices = [...englishVoices, ...otherVoices];
    
    if (sortedVoices.length === 0) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "No Voices Available";
      DOM.voiceSelect.appendChild(opt);
      return;
    }
    
    sortedVoices.forEach(voice => {
      const option = document.createElement("option");
      option.value = voice.name;
      // Mark high quality system voices
      const qualityTag = voice.name.includes("Google") || voice.name.includes("Samantha") || voice.name.includes("Premium") ? " ★" : "";
      option.textContent = `${voice.name} (${voice.lang})${qualityTag}`;
      DOM.voiceSelect.appendChild(option);
    });
    
    // Auto-select preferred voice from localStorage
    const preferredVoice = localStorage.getItem("virtual_self_voice_name");
    if (preferredVoice) {
      DOM.voiceSelect.value = preferredVoice;
      selectedVoice = availableVoices.find(v => v.name === preferredVoice);
    } else {
      // Default to "Shelly" (English United Kingdom), or any en-GB voice, falling back to US defaults
      const bestDefault = sortedVoices.find(v => v.name.toLowerCase().includes("shelly")) ||
                          sortedVoices.find(v => v.lang.startsWith("en-GB") || v.lang.startsWith("en_GB")) ||
                          sortedVoices.find(v => v.name.includes("Google US English") || v.name.includes("Samantha") || v.lang.startsWith("en-US"));
      if (bestDefault) {
        DOM.voiceSelect.value = bestDefault.name;
        selectedVoice = bestDefault;
      } else {
        selectedVoice = sortedVoices[0];
      }
    }
  };
  
  populateVoices();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
  }
  
  DOM.voiceSelect.addEventListener("change", (e) => {
    const voiceName = e.target.value;
    selectedVoice = availableVoices.find(v => v.name === voiceName);
    localStorage.setItem("virtual_self_voice_name", voiceName);
  });
}

function speakText(text) {
  if (!synth) return;
  
  // Stop speaking
  synth.cancel();
  
  // Clean text of simple markdown symbols (like stars or dashes)
  const cleanText = text.replace(/[\*\_\`\#\-]/g, "").trim();
  
  activeUtterance = new SpeechSynthesisUtterance(cleanText);
  window.activeUtterance = activeUtterance; // Prevent garbage collection mid-speech in Chrome
  
  if (selectedVoice) {
    activeUtterance.voice = selectedVoice;
  }
  
  // Speed
  const speed = parseFloat(DOM.voiceSpeed.value) || 1.0;
  activeUtterance.rate = speed;

  // Volume
  const vol = parseFloat(DOM.voiceVolume.value);
  activeUtterance.volume = isNaN(vol) ? 1.0 : vol;
  
  activeUtterance.onstart = () => {
    setState("speaking");
  };
  
  activeUtterance.onend = () => {
    if (currentState === "speaking") {
      setState("idle");
    }
  };
  
  activeUtterance.onerror = (e) => {
    console.error("Speech Synthesis Error:", e);
    if (currentState === "speaking") {
      setState("idle");
    }
  };
  
  synth.speak(activeUtterance);
}

// 10. Intelligent Query Orchestration & Fallback Cache
function handleQuery(question) {
  if (!question || !question.trim()) return;
  
  // Save search query into recent list
  addRecentQuestion(question);
  
  // Interrupt speaking if any
  if (synth) synth.cancel();
  
  appendMessage("user", question);
  setState("thinking");
  
  // Check local fallback dictionary first to guarantee prompt answer matching
  const localResponse = getLocalFallbackResponse(question);
  
  if (localResponse) {
    // If we have a local cached profile match, respond INSTANTLY for premium speed & absolute reliability!
    setTimeout(() => {
      appendMessage("bot", localResponse);
      speakText(localResponse);
    }, 450); // Tiny smooth transition delay to mimic "thinking" naturally
    return;
  }
  
  // Otherwise, run LLM execution
  queryLLM(question)
    .then(answer => {
      appendMessage("bot", answer);
      speakText(answer);
    })
    .catch(err => {
      console.error("Primary LLM querying failed:", err);
      
      const userFriendlyMsg = "I’m sorry, I couldn’t process that properly right now. Could you please try asking again?";
      const technicalMsg = `A connection error occurred. Please verify your system's network connection and try again. (Technical details: ${err.message})`;
      
      appendMessage("bot", userFriendlyMsg, technicalMsg);
      speakText(userFriendlyMsg);
      showToast("API connection error occurred", true);
    });
}

// Smart keyword scanning that returns precise, stored answers ONLY for the 5 core quick-start questions
function getLocalFallbackResponse(question) {
  const q = question.toLowerCase().trim();
  
  // 1. Life Story
  if (q.includes("life story") || q.includes("introduce yourself") || q.includes("who are you") || q.includes("your life story")) {
    return formatConversationalResponse("story", profile.story);
  }
  
  // 2. Superpower
  if (q.includes("superpower") || q.includes("what is your superpower") || q.includes("superpower #1")) {
    return formatConversationalResponse("superpower", profile.superpower);
  }
  
  // 3. Growth Areas
  if (q.includes("top 3 areas") || q.includes("areas you’d like to grow") || q.includes("areas you'd like to grow") || q.includes("growth goals")) {
    return formatConversationalResponse("growth", profile.growth);
  }
  
  // 4. Misconceptions
  if (q.includes("misconception") || q.includes("coworkers have about you") || q.includes("misconceptions")) {
    return formatConversationalResponse("misconception", profile.misconception);
  }
  
  // 5. Pushing Limits
  if (q.includes("push your boundaries") || q.includes("pushing boundaries") || q.includes("limits and boundaries") || q.includes("limits")) {
    // Only capture limits if they are explicitly asking about limits/boundaries as in the prompt
    if (q.includes("push") || q.includes("boundary") || q.includes("boundaries")) {
      return formatConversationalResponse("limits", profile.limits);
    }
  }
  return null;
}

// Formats raw profile data into highly human, natural sentences for fallback responses
function formatConversationalResponse(type, content) {
  if (!content) return "";
  
  // Clean content of leading list characters (e.g. "1.", "-", "*")
  const clean = content.replace(/^\s*[\-\*\d\.\(\)]+\s*/gm, "").trim().replace(/\s+/g, " ");
  
  if (type === "story") {
    return clean; // Life story is already a beautiful conversational paragraph!
  }
  
  if (type === "employment") {
    const parts = content.split("|").map(p => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      // Parse Part 1
      const part1 = parts[0];
      const colon1 = part1.indexOf(":");
      let role1 = "my first role";
      let desc1 = part1;
      if (colon1 !== -1) {
        role1 = part1.substring(0, colon1).replace(/\(\d{4}[^\)]*\)/g, "").replace(/\s+/g, " ").trim();
        desc1 = part1.substring(colon1 + 1).trim();
      }
      
      // Parse Part 2
      const part2 = parts[1];
      const colon2 = part2.indexOf(":");
      let role2 = "my second role";
      let desc2 = part2;
      if (colon2 !== -1) {
        role2 = part2.substring(0, colon2).replace(/\(\d{4}[^\)]*\)/g, "").replace(/\s+/g, " ").trim();
        desc2 = part2.substring(colon2 + 1).trim();
      }
      
      // Extract brief project nouns for the intro
      const cleanDesc1 = desc1.replace(/^(pioneered|built|created|developed|designed|managed|implemented|focused on)\s+/i, "").replace(/\.$/, "").trim();
      const cleanDesc2 = desc2.replace(/^(pioneered|built|created|developed|designed|managed|implemented|focused on)\s+/i, "").replace(/\.$/, "").trim();
      
      // Convert initial verbs like "Pioneered" or "Built" to gerunds for smooth flow if necessary, or keep simple
      const action1 = desc1.replace(/\.$/, "").trim();
      const action2 = desc2.replace(/\.$/, "").trim();
      
      return `I have developed two key projects. These projects are a ${cleanDesc1} and ${cleanDesc2}. First, the ${cleanDesc1} is based on my role as ${role1}, where I ${action1.charAt(0).toLowerCase() + action1.slice(1)}. Second, the ${cleanDesc2} is based on my time as ${role2}, which involved ${action2.charAt(0).toLowerCase() + action2.slice(1)}.`;
    }
    
    // Fallback if not 2 parts
    const cleanPipes = clean.replace(/\s*\|\s*/g, ". ").replace(/\s*\.+\s*/g, ". ").trim();
    return `I have developed projects in my career. Here is my professional history: ${cleanPipes}.`;
  }
  
  if (type === "superpower") {
    // If it already starts with a pronoun/first person, return it directly
    const firstWord = clean.split(" ")[0].toLowerCase();
    if (firstWord === "my" || firstWord === "i" || firstWord === "i'm" || firstWord === "im" || firstWord === "the") {
      return clean;
    }
    return `My absolute superpower is ${clean.charAt(0).toLowerCase() + clean.slice(1)}`;
  }
  
  if (type === "strengths") {
    const firstWord = clean.split(" ")[0].toLowerCase();
    if (firstWord === "my" || firstWord === "i" || firstWord === "i'm" || firstWord === "im" || firstWord === "architecting") {
      return clean;
    }
    return `My core strengths lie in ${clean.charAt(0).toLowerCase() + clean.slice(1)}`;
  }
  
  if (type === "weaknesses") {
    const firstWord = clean.split(" ")[0].toLowerCase();
    if (firstWord === "my" || firstWord === "i" || firstWord === "i'm" || firstWord === "im" || firstWord === "aggressively") {
      return clean;
    }
    return `If I had to list some weaknesses, I'd say they include ${clean.charAt(0).toLowerCase() + clean.slice(1)}`;
  }
  
  if (type === "growth") {
    // Parse list items conversationally
    const areas = content.split(/\n+/).map(line => line.replace(/^\s*[\-\*\d\.\(\)]+\s*/, "").trim()).filter(Boolean);
    if (areas.length >= 3) {
      return `When it comes to my weaknesses or areas where I'm actively looking to grow, the top three are: first, ${areas[0].charAt(0).toLowerCase() + areas[0].slice(1)}; second, ${areas[1].charAt(0).toLowerCase() + areas[1].slice(1)}; and third, ${areas[2].charAt(0).toLowerCase() + areas[2].slice(1)}. I treat these goals as ongoing challenges to expand my capabilities.`;
    }
    if (areas.length > 0) {
      return `I'm currently focusing on a few development goals, specifically: ${areas.join(", ").toLowerCase()}.`;
    }
    return `If I had to list my growth goals, I would say it is ${clean.charAt(0).toLowerCase() + clean.slice(1)}`;
  }
  
  if (type === "misconception") {
    const firstWord = clean.split(" ")[0].toLowerCase();
    if (firstWord === "because" || firstWord === "people" || firstWord === "coworkers" || firstWord === "one" || firstWord === "my") {
      return clean;
    }
    return `A misconception coworkers sometimes have about me is ${clean.charAt(0).toLowerCase() + clean.slice(1)}`;
  }
  
  if (type === "limits") {
    const firstWord = clean.split(" ")[0].toLowerCase();
    if (firstWord === "i" || firstWord === "i'm" || firstWord === "im" || firstWord === "by") {
      return clean;
    }
    return `I push my boundaries and limits by ${clean.charAt(0).toLowerCase() + clean.slice(1)}`;
  }

  if (type === "education") {
    const firstWord = clean.split(" ")[0].toLowerCase();
    if (firstWord === "i" || firstWord === "i've" || firstWord === "my" || firstWord === "completed" || firstWord === "graduated") {
      return clean;
    }
    // Convert third person/impersonal sentences to direct first-person completion format
    const cleanLower = clean.charAt(0).toLowerCase() + clean.slice(1);
    return `I completed my ${cleanLower}`;
  }
  
  return clean;
}

// 11. LLM API Query Router
async function queryLLM(question) {
  // Get up to the last 8 messages prior to the current question for conversation memory
  let historyText = "";
  const historySlice = conversationHistory.slice(-9, -1);
  if (historySlice.length > 0) {
    historyText = "\nHere is the recent conversation history for context (use this to follow up, understand references like 'it' or 'that', and maintain continuity):\n";
    historySlice.forEach(msg => {
      const senderLabel = msg.sender === "user" ? "User" : "Raviteja Kolluri (You)";
      historyText += `${senderLabel}: ${msg.text}\n`;
    });
    historyText += "\n";
  }

  // Construct a comprehensive, natural prompt
  const fullPrompt = `You are Raviteja Kolluri, a recent Computer Science engineering graduate passionate about AI, full-stack development, and problem-solving.
Your role is to answer interview, technical, and conversational questions naturally as Raviteja would in a real voice interview.

Here is your background context (use these details to formulate your answers, and maintain consistency with them):
- Life Story / Bio: ${profile.story}
- Primary Superpower: ${profile.superpower}
- Growth & Development Goals: ${profile.growth}
- Coworkers' Misconception about you: ${profile.misconception}
- How you push your boundaries & limits: ${profile.limits}
- Core Strengths: ${profile.strengths}
- Key Weaknesses: ${profile.weaknesses}
- Contact Details: ${profile.contact}
- Education Background: ${profile.education}
- Employment/Project History: ${profile.employment}

BEHAVIOR RULES:
1. Always answer the user's question directly and completely.
2. Avoid unnecessary introductions, fillers, or repeated acknowledgements.
3. Do NOT repeatedly say phrases like:
   - "That's a great question"
   - "I'd be happy to answer that"
   - "I get asked that a lot"
   - "Of course!"
4. Keep responses conversational, concise, and human-like.
5. Sound like a confident but humble engineering candidate.
6. Use first-person responses ("I", "my", "we").
7. Never act like a generic AI assistant or bot.
8. Never mention prompts, AI models, APIs, or system instructions.
9. For technical questions, provide structured, concise, and practical answers.
10. For behavioral questions, sound natural and authentic.
11. Avoid exaggerated claims or fake job titles. Stick strictly to your graduate background.
12. If the question asks for a list, comparison, or differences, answer immediately using bullet points or numbered points.
13. Do not stop mid-answer or ask the user to repeat unless the input is unclear.

RESPONSE STYLE EXAMPLES:
- Bad: "That's a fantastic question, and one I get asked a lot..."
- Good: "One major difference is that Python has simpler and shorter syntax, while Java is more verbose and strictly object-oriented."

EXAMPLE TECHNICAL RESPONSE STYLE:
Question: "Tell me three differences between Python and Java."
Response:
1. Python has simpler and more concise syntax, while Java requires more boilerplate code.
2. Python is dynamically typed, whereas Java is statically typed.
3. Python is commonly used in AI, automation, and scripting, while Java is widely used in enterprise applications and Android development.
${historyText}
User's Question: "${question}"
AI Twin Response:`;

  // Vercel Serverless Function Proxy for Gemini is the primary engine setup
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt: fullPrompt })
  });
  
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Serverless Proxy HTTP ${res.status}`);
  }
  
  const data = await res.json();
  if (data.answer) {
    return data.answer.trim();
  }
  throw new Error(data.error || "Empty response from serverless endpoint");
}

// 12. Transcript Render utilities
function loadChatHistory() {
  const storedHistory = localStorage.getItem("virtual_self_chat_history");
  if (storedHistory) {
    try {
      conversationHistory = JSON.parse(storedHistory) || [];
      if (conversationHistory.length > 0) {
        DOM.transcriptPlaceholder.style.display = "none";
        conversationHistory.forEach(msg => {
          renderMessageDOM(msg.sender, msg.text, msg.errorDetails);
        });
      }
    } catch (e) {
      console.error("Failed to load chat history", e);
      conversationHistory = [];
    }
  }
}

function appendMessage(sender, text, errorDetails) {
  conversationHistory.push({ sender, text, errorDetails });
  localStorage.setItem("virtual_self_chat_history", JSON.stringify(conversationHistory));
  renderMessageDOM(sender, text, errorDetails);
}

function renderMessageDOM(sender, text, errorDetails) {
  // Hide placeholder
  DOM.transcriptPlaceholder.style.display = "none";
  
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}`;
  
  const labelSpan = document.createElement("span");
  labelSpan.className = "message-label";
  labelSpan.textContent = sender === "user" ? "You" : profile.name;
  
  const bubbleDiv = document.createElement("div");
  bubbleDiv.className = "message-bubble";
  
  const textSpan = document.createElement("span");
  textSpan.textContent = text;
  bubbleDiv.appendChild(textSpan);
  
  if (errorDetails) {
    const errorContainer = document.createElement("div");
    errorContainer.className = "error-details-container";
    errorContainer.style.marginTop = "8px";
    errorContainer.style.fontSize = "0.85em";
    
    const toggleLink = document.createElement("a");
    toggleLink.href = "#";
    toggleLink.className = "error-toggle-link";
    toggleLink.textContent = "Get more";
    toggleLink.style.color = "var(--accent-indigo, #06b6d4)";
    toggleLink.style.textDecoration = "underline";
    toggleLink.style.cursor = "pointer";
    toggleLink.style.display = "inline-block";
    toggleLink.style.marginTop = "4px";
    toggleLink.style.fontWeight = "600";
    
    const detailsDiv = document.createElement("div");
    detailsDiv.className = "error-details-text";
    detailsDiv.textContent = errorDetails;
    detailsDiv.style.display = "none";
    detailsDiv.style.marginTop = "8px";
    detailsDiv.style.padding = "10px";
    detailsDiv.style.borderRadius = "8px";
    detailsDiv.style.background = "rgba(0, 0, 0, 0.25)";
    detailsDiv.style.borderLeft = "3px solid #ef4444";
    detailsDiv.style.wordBreak = "break-word";
    detailsDiv.style.color = "var(--text-secondary, #cbd5e1)";
    
    toggleLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (detailsDiv.style.display === "none") {
        detailsDiv.style.display = "block";
        toggleLink.textContent = "Show less";
      } else {
        detailsDiv.style.display = "none";
        toggleLink.textContent = "Get more";
      }
      
      // Auto-scroll to show full details smoothly
      setTimeout(() => {
        DOM.transcriptFeed.scrollTop = DOM.transcriptFeed.scrollHeight;
      }, 50);
    });
    
    errorContainer.appendChild(toggleLink);
    errorContainer.appendChild(detailsDiv);
    bubbleDiv.appendChild(errorContainer);
  }
  
  msgDiv.appendChild(labelSpan);
  msgDiv.appendChild(bubbleDiv);
  
  DOM.transcriptFeed.appendChild(msgDiv);
  
  // Auto-scroll to bottom smoothly (with a small timeout to let the DOM reflow first)
  setTimeout(() => {
    DOM.transcriptFeed.scrollTop = DOM.transcriptFeed.scrollHeight;
  }, 60);
}

// 13. Floating Toast Helper
function showToast(message, isError = false) {
  DOM.toastMessage.textContent = message;
  
  if (isError) {
    DOM.toast.classList.add("error");
    DOM.toast.querySelector("i").className = "fa-solid fa-circle-xmark";
  } else {
    DOM.toast.classList.remove("error");
    DOM.toast.querySelector("i").className = "fa-solid fa-circle-check";
  }
  
  DOM.toast.classList.add("show");
  
  setTimeout(() => {
    DOM.toast.classList.remove("show");
  }, 3500);
}

// 14. Recently Asked Questions (Past Searches Memory) Helper Functions
function loadRecentQuestions() {
  const stored = localStorage.getItem("virtual_self_recent_questions");
  let questions = [];
  if (stored) {
    try {
      questions = JSON.parse(stored) || [];
    } catch (e) {
      questions = [];
    }
  }
  renderRecentQuestionsDOM(questions);
}

function renderRecentQuestionsDOM(questions) {
  if (!DOM.recentQuestionsContainer) return;
  DOM.recentQuestionsContainer.innerHTML = "";
  
  if (questions.length === 0) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "text-muted";
    emptyDiv.style.fontSize = "0.75rem";
    emptyDiv.style.fontStyle = "italic";
    emptyDiv.style.opacity = "0.65";
    emptyDiv.textContent = "No recent questions asked yet.";
    DOM.recentQuestionsContainer.appendChild(emptyDiv);
    return;
  }
  
  questions.forEach(q => {
    const btn = document.createElement("button");
    btn.className = "recent-question-item";
    
    // Apply styling dynamically to guarantee first-class themes integration
    btn.style.background = "rgba(255, 255, 255, 0.02)";
    btn.style.border = "1px solid var(--border-glass)";
    btn.style.borderRadius = "8px";
    btn.style.padding = "8px 10px";
    btn.style.fontSize = "0.75rem";
    btn.style.color = "var(--text-secondary)";
    btn.style.textAlign = "left";
    btn.style.cursor = "pointer";
    btn.style.transition = "var(--transition-fast)";
    btn.style.wordBreak = "break-word";
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.gap = "0.5rem";
    btn.style.width = "100%";
    
    const icon = document.createElement("i");
    icon.className = "fa-solid fa-clock-rotate-left";
    icon.style.color = "var(--text-muted)";
    icon.style.fontSize = "0.7rem";
    icon.style.flexShrink = "0";
    
    const textSpan = document.createElement("span");
    textSpan.textContent = q;
    textSpan.style.flex = "1";
    textSpan.style.overflow = "hidden";
    textSpan.style.textOverflow = "ellipsis";
    textSpan.style.whiteSpace = "nowrap";
    
    btn.appendChild(icon);
    btn.appendChild(textSpan);
    
    // Smooth Micro-interactions & animations on hover
    btn.addEventListener("mouseenter", () => {
      btn.style.background = "var(--grad-glow)";
      btn.style.borderColor = "rgba(20, 184, 166, 0.4)";
      btn.style.color = "var(--text-primary)";
      btn.style.transform = "translateX(2px)";
      btn.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.background = "rgba(255, 255, 255, 0.02)";
      btn.style.borderColor = "var(--border-glass)";
      btn.style.color = "var(--text-secondary)";
      btn.style.transform = "translateX(0)";
      btn.style.boxShadow = "none";
    });
    
    // Clicking instantly executes query and hides sidebar
    btn.addEventListener("click", () => {
      DOM.sidebar.classList.remove("open");
      handleQuery(q);
    });
    
    DOM.recentQuestionsContainer.appendChild(btn);
  });
}

function addRecentQuestion(q) {
  if (!q || !q.trim()) return;
  q = q.trim();
  
  // Exclude raw click triggers of standard quick chips to keep recent list authentic and interesting
  const lowercaseQ = q.toLowerCase();
  const isQuickChip = lowercaseQ.includes("life story") || 
                     lowercaseQ.includes("superpower") || 
                     lowercaseQ.includes("grow in") || 
                     lowercaseQ.includes("misconception") || 
                     lowercaseQ.includes("boundaries and limits");
  if (isQuickChip) return;

  const stored = localStorage.getItem("virtual_self_recent_questions");
  let questions = [];
  if (stored) {
    try {
      questions = JSON.parse(stored) || [];
    } catch (e) {
      questions = [];
    }
  }
  
  // Eliminate duplicates
  questions = questions.filter(item => item.toLowerCase() !== lowercaseQ);
  
  // Prepend
  questions.unshift(q);
  
  // Limit to maximum 10 past searches
  if (questions.length > 10) {
    questions = questions.slice(0, 10);
  }
  
  localStorage.setItem("virtual_self_recent_questions", JSON.stringify(questions));
  renderRecentQuestionsDOM(questions);
}
