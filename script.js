// Navigation functionality
document.addEventListener("DOMContentLoaded", function () {
  // Get all navigation links and sections
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");
  const dropdownLinks = document.querySelectorAll(".dropdown-menu a");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  // Footer quick links navigation
  document.querySelectorAll(".footer-nav a").forEach(function (link) {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        // Use the same navigation logic as main nav
        const targetSection = document.querySelector(href);
        if (targetSection) {
          document
            .querySelectorAll(".section")
            .forEach((section) => section.classList.remove("active"));
          targetSection.classList.add("active");
          window.scrollTo({ top: 0, behavior: "smooth" });
          // Update nav active state
          document
            .querySelectorAll(".nav-link")
            .forEach((nav) => nav.classList.remove("active"));
          const navLink = document.querySelector(
            '.nav-link[href="' + href + '"]'
          );
          if (navLink) navLink.classList.add("active");
        }
      }
    });
  });

  // Function to show a section
  function showSection(sectionId) {
    // Hide all sections
    sections.forEach((section) => {
      section.classList.remove("active");
    });

    // Remove active class from all nav links
    navLinks.forEach((link) => {
      link.classList.remove("active");
    });

    // Show the target section
    const targetSection = document.querySelector(sectionId);
    if (targetSection) {
      targetSection.classList.add("active");

      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    // Close mobile menu if open
    navMenu.classList.remove("active");
  }

  // Handle main navigation clicks
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Only handle hash links
      if (href && href.startsWith("#")) {
        e.preventDefault();
        showSection(href);
        this.classList.add("active");
      }
    });
  });

  // Handle dropdown menu clicks
  dropdownLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const href = this.getAttribute("href");
      showSection(href);
    });
  });

  // Handle analysis card clicks (from all-analyses page)
  document.querySelectorAll(".analysis-card").forEach((card) => {
    card.addEventListener("click", function (e) {
      e.preventDefault();
      const href = this.getAttribute("href");
      showSection(href);
    });
  });

  // Handle back button clicks
  document.querySelectorAll(".back-button").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const href = this.getAttribute("href");
      showSection(href);
    });
  });

  // Scroll to Top Button
  const scrollTopBtn = document.getElementById("scrollTop");

  if (scrollTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    });

    // Scroll to top when clicked
    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Mobile menu toggle
  navToggle.addEventListener("click", function () {
    navMenu.classList.toggle("active");
  });

  // Handle dropdown on mobile
  const dropdown = document.querySelector(".dropdown > .nav-link");
  if (dropdown) {
    dropdown.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        this.parentElement.classList.toggle("active");
      }
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".navbar")) {
      navMenu.classList.remove("active");
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener("hashchange", function () {
    const hash = window.location.hash || "#home";
    showSection(hash);
  });

  // Initialize with the correct section on page load
  const initialHash = window.location.hash || "#home";
  showSection(initialHash);

  // Add smooth scrolling for any internal links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#") {
        e.preventDefault();
      }
    });
  });

  // Add fade-in effect on scroll for content boxes
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe all content boxes
  document.querySelectorAll(".content-box").forEach((box) => {
    box.style.opacity = "0";
    box.style.transform = "translateY(20px)";
    box.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(box);
  });

  // Add active state to nav based on scroll position (alternative navigation method)
  let isNavigating = false;

  window.addEventListener("scroll", function () {
    if (isNavigating) return;

    const scrollPosition = window.scrollY;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        const sectionId = section.getAttribute("id");
        const correspondingLink = document.querySelector(
          `.nav-link[href="#${sectionId}"]`
        );

        if (correspondingLink && !section.classList.contains("active")) {
          // Don't auto-switch sections on scroll, just update active nav link
          navLinks.forEach((link) => link.classList.remove("active"));
          correspondingLink.classList.add("active");
        }
      }
    });
  });
});

// =============================================
// Text-to-Speech Audio Narration
// =============================================
document.addEventListener("DOMContentLoaded", function () {
  // Check if browser supports Speech Synthesis
  if (!("speechSynthesis" in window)) {
    console.warn("Text-to-speech not supported in this browser");
    const audioControls = document.getElementById("audioControls");
    if (audioControls) {
      audioControls.style.display = "none";
    }
    return;
  }

  const audioToggle = document.getElementById("audioToggle");
  const audioSettings = document.getElementById("audioSettings");
  const audioSettingsPanel = document.getElementById("audioSettingsPanel");
  const audioStatus = document.getElementById("audioStatus");
  const speechRateInput = document.getElementById("speechRate");
  const speechPitchInput = document.getElementById("speechPitch");
  const voiceSelect = document.getElementById("voiceSelect");
  const rateValue = document.getElementById("rateValue");
  const pitchValue = document.getElementById("pitchValue");

  let synth = window.speechSynthesis;
  let utterance = null;
  let isPlaying = false;
  let isPaused = false;
  let voices = [];

  // Load available voices
  function loadVoices() {
    voices = synth.getVoices();
    voiceSelect.innerHTML = "";

    // Filter for English voices or show all if no English voices
    const englishVoices = voices.filter((voice) => voice.lang.startsWith("en"));
    const voicesToShow = englishVoices.length > 0 ? englishVoices : voices;

    voicesToShow.forEach((voice, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = `${voice.name} (${voice.lang})`;
      if (voice.default) {
        option.selected = true;
      }
      voiceSelect.appendChild(option);
    });
  }

  // Load voices on page load and when they change
  loadVoices();
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
  }

  // Get readable text from current section
  function getReadableText() {
    const activeSection = document.querySelector(".section.active");
    if (!activeSection) return "";

    // Clone the section to manipulate it
    const clone = activeSection.cloneNode(true);

    // Remove elements that shouldn't be read
    const elementsToRemove = clone.querySelectorAll(
      ".back-button, .analysis-meta, .story-image-container, nav, button"
    );
    elementsToRemove.forEach((el) => el.remove());

    // Get text content
    let text = clone.textContent || clone.innerText;

    // Clean up the text
    text = text.replace(/\s+/g, " ").trim();

    return text;
  }

  // Update status message
  function showStatus(message, duration = 2000) {
    audioStatus.textContent = message;
    audioStatus.classList.add("visible");
    setTimeout(() => {
      audioStatus.classList.remove("visible");
    }, duration);
  }

  // Toggle audio playback
  audioToggle.addEventListener("click", function () {
    if (isPlaying) {
      if (isPaused) {
        // Resume
        synth.resume();
        isPaused = false;
        updatePlayButton(true);
        showStatus("Resumed");
      } else {
        // Pause
        synth.pause();
        isPaused = true;
        updatePlayButton(false);
        showStatus("Paused");
      }
    } else {
      // Start new speech
      startSpeech();
    }
  });

  // Start speech synthesis
  function startSpeech() {
    const text = getReadableText();

    if (!text || text.length === 0) {
      showStatus("No content to read");
      return;
    }

    // Cancel any ongoing speech
    synth.cancel();

    // Create new utterance
    utterance = new SpeechSynthesisUtterance(text);

    // Set voice
    const selectedVoice = voiceSelect.value;
    if (voices[selectedVoice]) {
      utterance.voice = voices[selectedVoice];
    }

    // Set speech parameters
    utterance.rate = parseFloat(speechRateInput.value);
    utterance.pitch = parseFloat(speechPitchInput.value);
    utterance.volume = 1;

    // Event handlers
    utterance.onstart = function () {
      isPlaying = true;
      isPaused = false;
      updatePlayButton(true);
      showStatus("Reading...", 1000);
    };

    utterance.onend = function () {
      isPlaying = false;
      isPaused = false;
      updatePlayButton(false);
      showStatus("Finished");
    };

    utterance.onerror = function (event) {
      console.error("Speech synthesis error:", event);
      isPlaying = false;
      isPaused = false;
      updatePlayButton(false);
      showStatus("Error occurred");
    };

    // Start speaking
    synth.speak(utterance);
  }

  // Update play button appearance
  function updatePlayButton(playing) {
    const icon = audioToggle.querySelector(".audio-icon");
    const text = audioToggle.querySelector(".audio-text");

    if (playing) {
      text.textContent = "Pause";
      audioToggle.classList.add("active");
    } else {
      icon.textContent = "🔊";
      text.textContent = "Listen to Page";
      audioToggle.classList.remove("active");
    }
  }

  // Toggle settings panel
  audioSettings.addEventListener("click", function (e) {
    e.stopPropagation();
    audioSettingsPanel.classList.toggle("visible");
  });

  // Close settings panel when clicking outside
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".audio-controls-container")) {
      audioSettingsPanel.classList.remove("visible");
    }
  });

  // Update rate value display
  speechRateInput.addEventListener("input", function () {
    rateValue.textContent = this.value;
    if (isPlaying && utterance) {
      // Restart with new settings
      const wasPlaying = !isPaused;
      synth.cancel();
      if (wasPlaying) {
        startSpeech();
      }
    }
  });

  // Update pitch value display
  speechPitchInput.addEventListener("input", function () {
    pitchValue.textContent = this.value;
    if (isPlaying && utterance) {
      // Restart with new settings
      const wasPlaying = !isPaused;
      synth.cancel();
      if (wasPlaying) {
        startSpeech();
      }
    }
  });

  // Voice change
  voiceSelect.addEventListener("change", function () {
    if (isPlaying && utterance) {
      // Restart with new voice
      const wasPlaying = !isPaused;
      synth.cancel();
      if (wasPlaying) {
        startSpeech();
      }
    }
  });

  // Stop speech when navigating to different section
  document
    .querySelectorAll(
      ".nav-link, .dropdown-menu a, .analysis-card, .back-button"
    )
    .forEach((link) => {
      link.addEventListener("click", function () {
        if (isPlaying) {
          synth.cancel();
          isPlaying = false;
          isPaused = false;
          updatePlayButton(false);
        }
      });
    });

  // Keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    // Alt + P to play/pause
    if (e.altKey && e.key === "p") {
      e.preventDefault();
      audioToggle.click();
    }
    // Alt + S to stop
    if (e.altKey && e.key === "s") {
      e.preventDefault();
      if (isPlaying) {
        synth.cancel();
        isPlaying = false;
        isPaused = false;
        updatePlayButton(false);
        showStatus("Stopped");
      }
    }
  });

  // Clean up on page unload
  window.addEventListener("beforeunload", function () {
    if (synth.speaking) {
      synth.cancel();
    }
  });
});
