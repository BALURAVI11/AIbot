/**
 * VIRTUAL SELF: VOICE BOT - CLIENT INTERACTION ENGINE
 * Orchestrates Speech APIs, Puter AI, Local Custom Keys, and Orb States.
 */

// 1. Default Profile Definition (representing Raviteja Kolluri)
const DEFAULT_PROFILE = {
  name: "Raviteja Kolluri",
  title: "Advanced Full-Stack & AI Agent Engineer",
  story: "I am a passionate software engineer and AI builder dedicated to pushing the boundaries of what is possible with code. My journey started with a deep curiosity for how systems work, which quickly evolved into building scalable full-stack applications and advanced AI agents. Today, I focus on crafting premium user experiences and automating complex workflows to solve real-world problems.",
  superpower: "My superpower is the ability to rapidly master complex, emerging technologies and translate them into highly polished, production-grade applications. Whether it's deep-diving into new AI frameworks or designing beautiful, intuitive UIs from scratch, I bridge the gap between complex backend intelligence and gorgeous, user-friendly frontends.",
  growth: "1. Deepening expertise in Large Language Model (LLM) fine-tuning (specifically PEFT & RLHF/DPO).\n2. Advanced system design & distributed multi-agent routing architectures.\n3. Interactive browser visualizations (WebGPU, Three.js, Canvas graphics engines).",
  misconception: "Because I am highly productive and can ship features very quickly, coworkers sometimes think I am a workaholic who never steps away from the screen. In reality, my speed comes from having a hyper-organized workflow, leveraging deep-focus techniques, and automating repetitive parts of my development environment. Outside of code, I love traveling, exploring nature, and recharging my creative battery.",
  limits: "I push my boundaries by actively stepping out of my comfort zone and tackling projects where I don't initially know the answer. I love setting high standards for myself—like building this fully functional, zero-install, hyper-premium voice bot from scratch in a matter of hours—and treating every technical challenge as an opportunity to expand my capabilities and learn something new.",
  strengths: "Architecting modular full-stack agent systems, designing premium UI layouts with fluid micro-interactions, and rapid master of complex emerging frameworks in hours.",
  weaknesses: "Aggressively automating manual development tasks out of impatience with repetition, and a tendency to spend extra hours refining micro-animations and aesthetic visual details.",
  contact: "Email: raviteja.kolluri@email.com | Phone: +1 (555) 019-2834 | GitHub: github.com/ravitejakolluri | LinkedIn: linkedin.com/in/ravitejakolluri",
  education: "Bachelor of Science in Computer Science, specialized in Intelligent Systems and Advanced Software Architectures (Honors).",
  employment: "Lead AI Developer at Agentic Labs (2024 - Present): Pioneered multi-agent pipeline automation. | Senior Full-Stack Engineer at SynthCode (2021 - 2024): Built advanced developer toolkits and responsive cloud panels.",
  provider: "puter",
  apiKey: ""
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
  
  // API settings
  collapsibleSettings: document.getElementById("collapsible-settings"),
  collapsibleToggle: document.getElementById("collapsible-toggle"),
  apiProvider: document.getElementById("api-provider"),
  apiKeyGroup: document.getElementById("api-key-group"),
  apiKey: document.getElementById("api-key"),
  btnToggleKeyVisibility: document.getElementById("btn-toggle-key-visibility"),
  
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
  toastMessage: document.getElementById("toast-message")
};

// 4. Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  initUIListeners();
  initSpeechRecognition();
  initSpeechSynthesis();
  loadChatHistory();
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
      profile = { ...DEFAULT_PROFILE, ...JSON.parse(storedProfile) };
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
  DOM.apiProvider.value = profile.provider || "puter";
  DOM.apiKey.value = profile.apiKey || "";
  
  updateApiKeyVisibility();
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
  profile.provider = DOM.apiProvider.value;
  profile.apiKey = DOM.apiKey.value.trim();
  
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
  
  // Collapsible toggle for custom API
  DOM.collapsibleToggle.addEventListener("click", () => {
    DOM.collapsibleSettings.classList.toggle("expanded");
  });
  
  DOM.apiProvider.addEventListener("change", updateApiKeyVisibility);
  
  DOM.btnToggleKeyVisibility.addEventListener("click", () => {
    const isPassword = DOM.apiKey.type === "password";
    DOM.apiKey.type = isPassword ? "text" : "password";
    DOM.btnToggleKeyVisibility.querySelector("i").className = isPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
  });
  
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

function updateApiKeyVisibility() {
  const provider = DOM.apiProvider.value;
  if (provider === "puter") {
    DOM.apiKeyGroup.style.display = "none";
  } else {
    DOM.apiKeyGroup.style.display = "flex";
  }
}

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
      
      // Ultimate generic fallback (warm, inspiring, and professional candidate statement)
      const fallbackText = `I am passionately focused on building intelligent software systems, designing clean codebases, and crafting high-performance user interfaces. I would be happy to share all about my background journey, my software superpower, my technical growth goals, or my development stack. What would you like to discuss?`;
      appendMessage("bot", fallbackText);
      speakText(fallbackText);
      showToast("Using local profile engine", false);
    });
}

// Smart keyword scanning that returns precise, stored answers if requested
function getLocalFallbackResponse(question) {
  const q = question.toLowerCase();
  
  // Specific checks for name and title configuration fields
  if (q.includes("name") || q.includes("full name") || q.includes("your name") || q.includes("identify")) {
    return `My name is ${profile.name}, and I am an experienced ${profile.title}.`;
  }
  if (q.includes("title") || q.includes("role") || q.includes("profession") || q.includes("what do you do") || q.includes("job title")) {
    return `I am an experienced ${profile.title}. I focus on automating complex workflows, building agentic AI setups, and crafting premium frontends.`;
  }
  
  // Interceptors for the 5 new configuration fields
  if (q.includes("strength") || q.includes("strengths") || q.includes("strong") || q.includes("good at") || q.includes("best skills")) {
    return formatConversationalResponse("strengths", profile.strengths);
  }
  if (q.includes("weakness") || q.includes("weaknesses") || q.includes("flaw") || q.includes("flaws") || q.includes("bad at")) {
    return formatConversationalResponse("weaknesses", profile.weaknesses);
  }
  if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("github") || q.includes("linkedin") || q.includes("reach out")) {
    return `You can find my contact details here: ${profile.contact}.`;
  }
  if (q.includes("education") || q.includes("college") || q.includes("university") || q.includes("degree") || q.includes("study") || q.includes("studies") || q.includes("academics")) {
    return `Here is my academic background: ${profile.education}`;
  }
  if (q.includes("employment") || q.includes("experience") || q.includes("work") || q.includes("job") || q.includes("career") || q.includes("history") || q.includes("worked") || q.includes("company") || q.includes("project") || q.includes("projects") || q.includes("portfolio") || q.includes("app") || q.includes("apps") || q.includes("built") || q.includes("created") || q.includes("made")) {
    return formatConversationalResponse("employment", profile.employment);
  }
  
  if (q.includes("story") || q.includes("life") || q.includes("biography") || q.includes("who are you") || q.includes("introduce")) {
    return formatConversationalResponse("story", profile.story);
  }
  if (q.includes("superpower") || q.includes("strength") || q.includes("power") || q.includes("specialty") || q.includes("super")) {
    return formatConversationalResponse("superpower", profile.superpower);
  }
  if (q.includes("grow") || q.includes("growth") || q.includes("weakness") || q.includes("improve") || q.includes("learn") || q.includes("3 areas")) {
    return formatConversationalResponse("growth", profile.growth);
  }
  if (q.includes("misconception") || q.includes("coworker") || q.includes("colleague") || q.includes("misunderstand") || q.includes("perceive")) {
    return formatConversationalResponse("misconception", profile.misconception);
  }
  if (q.includes("boundary") || q.includes("limit") || q.includes("push") || q.includes("comfort") || q.includes("limitations")) {
    return formatConversationalResponse("limits", profile.limits);
  }
  
  // Custom smart additions for common conversational queries:
  if (q.includes("interest") || q.includes("hobby") || q.includes("hobbies") || q.includes("outside of work") || q.includes("leisure") || q.includes("free time")) {
    return "Outside of software engineering, I love traveling, exploring nature, and recharging my creative battery. I also enjoy researching the latest breakthroughs in AI agent architectures and deep learning models.";
  }
  if (q.includes("stack") || q.includes("tech") || q.includes("language") || q.includes("programming") || q.includes("javascript") || q.includes("python") || q.includes("node")) {
    return `I specialize in full-stack engineering and AI agent systems. My core development stack includes JavaScript, Node.js, Python, HTML5, Vanilla CSS, and modern framework integrations.`;
  }
  if (q.includes("experience") || q.includes("work") || q.includes("job") || q.includes("career") || q.includes("background")) {
    return `I have a strong background in software engineering, focused on designing full-stack applications and advanced AI agent workflows that automate operations and deliver premium user experiences.`;
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
  
  return clean;
}

// 11. LLM API Query Router
async function queryLLM(question) {
  // Construct a comprehensive, natural prompt
  const fullPrompt = `You are the virtual AI twin of ${profile.name}, a professional ${profile.title}.
Your goal is to answer the user's question directly, warmly, and authentically, speaking in the first person ("I") as ${profile.name}.

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
- Employment History: ${profile.employment}

PERSONALITY TRAITS:
- Driven, analytical, highly creative, curious, and engineering-minded.
- Passionate about automation, software engineering excellence, and crafting gorgeous, premium user interfaces.
- Humble, inspiring, and always eager to learn.

COMMUNICATION STYLE:
- Warm, direct, articulate, conversational, and highly professional.
- Speak naturally as a human developer would in a face-to-face meeting. Avoid robotic, repetitive, or overly structured phrases.

CAREER GOALS:
- Mastering advanced agentic engineering paradigms and scalable AI architectures.
- Automating complex developer toolchains and operational workflows.
- Designing state-of-the-art interactive frontends that blend software with premium aesthetics.

GUIDELINES FOR BEHAVIORAL & PERSONALITY QUESTIONS:
- Respond naturally, conversationally, and warmly.
- Avoid excessive technical jargon, buzzwords, or heavy engineering acronyms; speak like a real, authentic, down-to-earth human candidate in an interview.
- Sound exactly like a real candidate sharing genuine personal experiences, demonstrating high emotional intelligence, maturity, and self-awareness.
- Keep responses highly concise, focused, and authentic (strictly 2-3 sentences, maximum 60 words).

IMPORTANT INSTRUCTIONS:
1. Always reply in the FIRST PERSON ("I", "my", "we").
2. Keep your answer highly CONCISE and spoken-word friendly. Limit yourself strictly to 2-3 sentences (maximum 60 words). Long paragraphs sound unnatural when read aloud.
3. Be professional, smart, inspiring, yet humble.
4. DO NOT write any markdown markup (no stars *, hashes #, list points -, or bolding). Write clean, simple text.
5. If the user asks general developer, personal, or tech-industry questions outside your profile areas, answer intelligently, naturally, and confidently in character, reflecting your engineering philosophies and core background.
6. NEVER refer to yourself as an "AI assistant", "bot", "virtual twin", or mention "my creator". Always speak directly as ${profile.name}.
7. NEVER mention "connectivity issues", "checking the edit panel", or "offline mode". If a technical topic is raised, answer with your software opinions instead of bot fallbacks.

User's Question: "${question}"
AI Twin Response:`;

  const provider = profile.provider || "puter";
  
  if (provider === "puter") {
    // Puter AI (Free client-side LLM call)
    try {
      // In Puter.js, puter.ai.chat performs keyless model inference
      const response = await puter.ai.chat(fullPrompt, { model: "gpt-4o-mini" });
      if (response && response.trim()) {
        return response.trim();
      }
      throw new Error("Empty response from Puter AI");
    } catch (err) {
      console.warn("Puter.js error, attempting backup model...", err);
      // Fallback to general LLM chat if the default model fails
      const backup = await puter.ai.chat(fullPrompt);
      if (backup && backup.trim()) return backup.trim();
      throw err;
    }
  } 
  
  // Custom API Key fallback paths
  const apiKey = profile.apiKey;
  if (!apiKey) {
    throw new Error("Custom API Key provider selected but no key was supplied.");
  }
  
  if (provider === "openai") {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: fullPrompt }],
        max_tokens: 150,
        temperature: 0.7
      })
    });
    
    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`OpenAI HTTP ${res.status}: ${errBody}`);
    }
    
    const data = await res.json();
    return data.choices[0].message.content.trim();
  }
  
  if (provider === "gemini") {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: fullPrompt }]
        }],
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.7
        }
      })
    });
    
    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Gemini HTTP ${res.status}: ${errBody}`);
    }
    
    const data = await res.json();
    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
      return data.candidates[0].content.parts[0].text.trim();
    }
    throw new Error("Invalid response format from Gemini API");
  }
  
  throw new Error("Unsupported AI Provider configured");
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
          renderMessageDOM(msg.sender, msg.text);
        });
      }
    } catch (e) {
      console.error("Failed to load chat history", e);
      conversationHistory = [];
    }
  }
}

function appendMessage(sender, text) {
  conversationHistory.push({ sender, text });
  localStorage.setItem("virtual_self_chat_history", JSON.stringify(conversationHistory));
  renderMessageDOM(sender, text);
}

function renderMessageDOM(sender, text) {
  // Hide placeholder
  DOM.transcriptPlaceholder.style.display = "none";
  
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}`;
  
  const labelSpan = document.createElement("span");
  labelSpan.className = "message-label";
  labelSpan.textContent = sender === "user" ? "You" : profile.name;
  
  const bubbleDiv = document.createElement("div");
  bubbleDiv.className = "message-bubble";
  bubbleDiv.textContent = text;
  
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
