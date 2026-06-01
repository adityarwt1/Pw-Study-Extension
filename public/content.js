/// <reference types="chrome" />

console.log('[Content Script] Loaded on:', window.location.href);

// GLOBAL message listener (before any page checks)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Content] GLOBAL Message received:', request);
  if (request.action === 'copySlideFromShortcut') {
    console.log('[Content] Copy slide shortcut triggered from background, silent:', request.silent);
    if (window.location.href.includes('pw.live')) {
      copySlideToClipboard?.(request.silent);
    } else {
      console.error('[Content] Not on pw.live page, cannot copy slide');
      if (!request.silent) {
        alert('This feature only works on pw.live lecture pages');
      }
    }
  }
});

console.log('[Content] GLOBAL Message listener registered');

// ========================
// COPY SLIDE FUNCTIONALITY (GLOBAL)
// ========================
const copySlideToClipboard = async (silent = false) => {
  try {
    console.log('[Content] Copy slide triggered, silent:', silent);

    function getSlideAtTime(slides, currentTimeInSeconds) {
      let low = 0, high = slides.length - 1, result = 0;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (parseInt(slides[mid].timeStamp, 10) <= currentTimeInSeconds) {
          result = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      return slides[result];
    }

    // Get parameters from URL
    const url = new URL(window.location.href);
    console.log('[Content] Current URL:', url.href);
    
    let batchSlug = url.searchParams.get("batchSlug");
    const subjectSlug = url.searchParams.get("subjectSlug");
    const scheduleId = url.searchParams.get("scheduleId");
    const token = localStorage.getItem("token");

    console.log('[Content] URL Params:', { batchSlug, subjectSlug, scheduleId, token: !!token });

    // If batchSlug is a text slug (not numeric), use parentId instead
    if (batchSlug && !/^\d+$/.test(batchSlug)) {
      const parentId = url.searchParams.get("parentId");
      console.log('[Content] batchSlug is text, using parentId:', parentId);
      if (parentId) {
        batchSlug = parentId;
      }
    }

    if (!token || !batchSlug || !subjectSlug || !scheduleId) {
      console.error('[Content] Missing required parameters', { token: !!token, batchSlug, subjectSlug, scheduleId });
      if (!silent) {
        alert("Missing required parameters. Make sure:\n1. Token is set\n2. You're on a pw.live lecture page\n3. All URL parameters are present");
      }
      return;
    }

    // Fetch slides from API
    const apiUrl = `https://api.penpencil.co/v1/batches/${batchSlug}/subject/${subjectSlug}/schedule/${scheduleId}/slides`;
    console.log('[Content] Fetching from API:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        authorization: `Bearer ${token}`,
        Referer: "https://www.pw.live/",
      },
    });

    console.log('[Content] API Response status:', response.status);
    
    if (!response.ok) throw new Error(`API failed: ${response.status}`);

    const data = await response.json();
    console.log('[Content] API Response data received, slides count:', data.data.slides?.length);
    
    const slides = data.data.slides;

    // Get current video time and find matching slide
    const video = document.querySelector("video");
    const currentTime = (video?.currentTime || 0) + 210;
    console.log('[Content] Current video time:', video?.currentTime, 'adjusted:', currentTime);
    
    const currentSlide = getSlideAtTime(slides, currentTime);
    console.log('[Content] Current slide:', currentSlide);
    
    const imageUrl = currentSlide.img.baseUrl + currentSlide.img.key;
    console.log('[Content] Image URL retrieved:', imageUrl);

    // Fetch image
    const responseImg = await fetch(imageUrl);
    if (!responseImg.ok) throw new Error(`Fetch failed: ${responseImg.status}`);
    const blob = await responseImg.blob();
    console.log('[Content] Image blob received, size:', blob.size);

    // Convert to PNG and copy to clipboard
    const pngBlob = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Canvas toBlob failed"))),
          "image/png"
        );
      };
      img.onerror = () => reject(new Error("Image load failed"));
      img.src = URL.createObjectURL(blob);
    });

    await navigator.clipboard.write([new ClipboardItem({ "image/png": pngBlob })]);
    console.log('[Content] ✓ Slide copied to clipboard!');
    if (!silent) {
      alert("✓ Slide copied to clipboard! (Shift+Alt+C)");
    }
  } catch (error) {
    console.error('[Content] Error copying slide:', error);
    if (!silent) {
      alert("Error: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  }
};
    if (!responseImg.ok) throw new Error(`Fetch failed: ${responseImg.status}`);
    const blob = await responseImg.blob();
    console.log('[Content] Image blob received, size:', blob.size);

    // Convert to PNG and copy to clipboard
    const pngBlob = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Canvas toBlob failed"))),
          "image/png"
        );
      };
      img.onerror = () => reject(new Error("Image load failed"));
      img.src = URL.createObjectURL(blob);
    });

    await navigator.clipboard.write([new ClipboardItem({ "image/png": pngBlob })]);
    console.log('[Content] ✓ Slide copied to clipboard!');
    alert("✓ Slide copied to clipboard! (Shift+Alt+C)");
  } catch (error) {
    console.error('[Content] Error copying slide:', error);
    alert("Error: " + (error instanceof Error ? error.message : "Unknown error"));
  }
};

console.log('[Content] copySlideToClipboard function defined');

// Only run page-specific features on PW.live
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

  // Listen for messages from background script (local backup)
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('[Content] Local Message received:', request);
    if (request.action === 'copySlideFromShortcut') {
      console.log('[Content] Copy slide shortcut triggered (local)');
      copySlideToClipboard();
    }
  });

  console.log('[Content] Local Message listener also registered');

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

