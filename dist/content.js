/// <reference types="chrome" />

console.log('[Content Script] Loaded on:', window.location.href);

// Only run on PW.live
if (window.location.href.includes('pw.live')) {
  
  // 1. HIDE TIMESTAMPS
  const hideTimestamps = () => {
    const timeDiv = document.getElementById("current-time-placeholder");
    const timePleaseFol = document.querySelector("#progress-placeholder");
    const vjsElement = document.querySelector(".vjs-progress-holder");

    if (timeDiv) {
      timeDiv.style.opacity = "0";
      timeDiv.style.pointerEvents = "none";
      timeDiv.style.visibility = "hidden";
    }
    if (timePleaseFol) {
      timePleaseFol.style.opacity = "0";
      timePleaseFol.style.pointerEvents = "none";
      timePleaseFol.style.visibility = "hidden";
    }
    if (vjsElement) {
      vjsElement.style.opacity = "0";
      vjsElement.style.pointerEvents = "none";
      vjsElement.style.visibility = "hidden";
    }
  };

  // 2. HIDE CHAT
  const hideChat = () => {
    // Try multiple selectors for different chat implementations
    const chatSelectors = [
      "[class*='chat']",
      "[class*='Chat']",
      "[id*='chat']",
      "[data-testid*='chat']",
      "aside[class*='chat']",
      "div[class*='message']"
    ];

    chatSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          // Only hide if it's actually a chat element
          if (el.textContent && (el.textContent.toLowerCase().includes('message') || 
              el.textContent.toLowerCase().includes('send') ||
              el.textContent.toLowerCase().includes('chat'))) {
            el.style.display = "none";
          }
        });
      } catch (e) {
        // Invalid selector, skip
      }
    });
  };

  // 3. ENABLE RIGHT-CLICK
  const enableRightClick = () => {
    // Remove all context menu restrictions
    document.oncontextmenu = null;
    document.body.oncontextmenu = null;
    
    // Enable text selection
    document.onselectstart = null;
    document.body.onselectstart = null;
    document.onmousedown = null;
    
    // Enable copy
    document.oncopy = null;
    document.body.oncopy = null;
    
    // Remove user-select CSS
    document.documentElement.style.userSelect = 'auto';
    document.body.style.userSelect = 'auto';
    
    // Add listener to prevent event bubbling blocking
    document.addEventListener("contextmenu", (e) => {
      e.stopPropagation();
    }, true);

    // Also disable any mousedown restrictions
    document.addEventListener("mousedown", (e) => {
      if (e.button === 2) { // right-click
        e.stopPropagation();
      }
    }, true);

    console.log('✓ Right-click enabled!');
  };



  // Function to run all features
  const initializeFeatures = () => {
    hideTimestamps();
    hideChat();
    enableRightClick();
  };

  // Run immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFeatures);
  } else {
    initializeFeatures();
  }

  // Re-run every 2 seconds to handle dynamically loaded content
  setInterval(initializeFeatures, 2000);

  console.log('✓ All PW.live features initialized!');


}
