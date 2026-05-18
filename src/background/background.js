/// <reference types="chrome" />

console.log('Background service worker loaded!');

// ========================
// HELPER FUNCTIONS
// ========================
const safeSendResponse = (sendResponse, data) => {
  try {
    sendResponse(data);
  } catch (err) {
    console.warn('Safe response failed (channel already closed):', err);
  }
};

const log = (type, message, data) => {
  const entry = {
    timestamp: new Date().toISOString(),
    type,
    message,
    data: data || {},
  };
  console[type === 'error' ? 'error' : type === 'warn' ? 'warn' : 'log'](`[BG] ${message}`, data);
  chrome.storage.local.get('logs').then(({ logs = [] }) => {
    logs.unshift(entry);
    if (logs.length > 100) logs.pop();
    chrome.storage.local.set({ logs });
  });
};

// ========================
// INSTALL / UPDATE / STARTUP
// ========================
chrome.runtime.onInstalled.addListener((details) => {
  log('info', `Extension ${details.reason}`, details);

  if (details.reason === 'install') {
    chrome.storage.local.set({
      count: 0,
      installed: true,
      installDate: new Date().toISOString(),
      enabled: true,
      version: chrome.runtime.getManifest().version,
      logs: [],
    });
    log('info', 'First install - defaults set');
  }

  if (details.reason === 'update') {
    chrome.storage.local.get(null).then((data) => {
      if (!data.migratedToV2) {
        log('info', 'Running data migration for update');
        chrome.storage.local.set({
          migratedToV2: true,
        });
      }
    });
  }

  if (chrome.contextMenus?.create) {
    chrome.contextMenus.create({
      id: 'myExtension',
      title: 'Send selection to Extension',
      contexts: ['selection'],
    }, () => {
      if (chrome.runtime.lastError) {
        log('warn', 'Context menu already exists (normal on update)');
      }
    });
  } else {
    log('warn', 'contextMenus API unavailable (check "contextMenus" permission)');
  }
});

chrome.runtime.onStartup.addListener(() => {
  log('info', 'Browser startup - background reloaded');
});

// ========================
// MESSAGE HANDLING
// ========================
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  log('info', `Message received: ${request.action}`, { tabId: sender.tab?.id, url: sender.tab?.url });

  switch (request.action) {
    case 'getActiveWindowAndTab':
      Promise.all([
        chrome.windows.getLastFocused({ populate: false }),
        chrome.tabs.query({ active: true, lastFocusedWindow: true }),
      ]).then(([win, tabs]) => {
        const tab = tabs?.[0] || null;
        safeSendResponse(sendResponse, {
          status: 'success',
          windowId: win?.id ?? null,
          tabId: tab?.id ?? null,
          url: tab?.url ?? null,
          title: tab?.title ?? null,
        });
      }).catch((err) => {
        log('error', 'Failed to get active window/tab', { err: String(err) });
        safeSendResponse(sendResponse, { status: 'error', message: 'Failed to get active window/tab' });
      });
      return true;

    case 'ping':
      safeSendResponse(sendResponse, { status: 'success', message: 'Pong from background!', data: request.data });
      break;

    case 'getData':
      chrome.storage.local.get(null).then((data) => {
        safeSendResponse(sendResponse, { status: 'success', data });
      });
      return true;

    default:
      log('warn', `Unknown action: ${request.action}`);
      safeSendResponse(sendResponse, { status: 'error', message: 'Unknown action' });
  }

  return true;
});

// ========================
// TAB EVENTS
// ========================
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    log('info', 'Tab fully loaded', { tabId, url: tab.url, title: tab.title });
  }
});

// ========================
// YOUTUBE BLOCKER
// Block YouTube tabs automatically
// ========================
const YOUTUBE_URL_PATTERN = "youtube.com";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    if (tab.url.includes(YOUTUBE_URL_PATTERN)) {
      chrome.tabs.remove(tabId, () => {
        console.log("YouTube blocked and tab closed.");
      });
    }
  }
});

// ========================
// PW.LIVE HIDE TIMESTAMPS
// Hides the current time display on PW.live
// ========================
const PW_URL_PATTERN = "pw.live";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes(PW_URL_PATTERN)) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: handleHideTimeStamps
    });
  }
});

// Function injected into PW.live to hide timestamp
const handleHideTimeStamps = () => {
  const timeDiv = document.getElementById("current-time-placeholder");
  if (timeDiv) {
    timeDiv.style.opacity = 0;
    console.log('Timestamp hidden successfully');
  } else {
    console.log('Timestamp element not found on this page');
  }
};

// ========================
// EXCALIDRAW AUTO-SAVE
// Automatically saves Excalidraw drawings after idle period
// Triggers Ctrl+S after user stops drawing/interacting
// ========================
const EXCALIDRAW_URL_PATTERN = "excalidraw.com";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes(EXCALIDRAW_URL_PATTERN)) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: excalidrawAutoSave
    });
  }
});

/**
 * Auto-save function for Excalidraw
 * Monitors user activity and triggers Ctrl+S after idle period
 * Configuration:
 * - IDLE_TIME_MS: Time to wait after last activity before saving (default: 2000ms / 2 seconds)
 * - MIN_TIME_BETWEEN_SAVES: Minimum interval between consecutive saves (default: 10000ms / 10 seconds)
 * - ENABLE_VISUAL_INDICATOR: Show visual notification when saving (default: true)
 */
function excalidrawAutoSave() {
  // Prevent double initialization
  if (window.hasExcalidrawAutoSave) return;
  window.hasExcalidrawAutoSave = true;

  console.log('Excalidraw Auto-Save Active');

  // ===== CONFIGURATION =====
  const TARGET_ORIGIN = 'https://excalidraw.com';
  const IDLE_TIME_MS = 2000; // 2 seconds - Quick save
  const MIN_TIME_BETWEEN_SAVES = 10000; // Minimum 10 seconds between saves
  const ENABLE_VISUAL_INDICATOR = true; // Show save notification on screen

  // ===== SCRIPT =====
  if (window.location.origin === TARGET_ORIGIN) {
    console.log('Auto-save script loaded');
    console.log('Idle timeout:', IDLE_TIME_MS / 1000, 'seconds');

    let idleTimer = null;
    let lastSaveTime = Date.now();
    let saveIndicator = null;

    // Create visual save indicator
    if (ENABLE_VISUAL_INDICATOR) {
      saveIndicator = document.createElement('div');
      saveIndicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 999999;
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
      `;
      saveIndicator.textContent = 'Auto-saved!';
      document.body.appendChild(saveIndicator);
    }

    // Show save notification
    function showSaveNotification() {
      if (saveIndicator) {
        saveIndicator.style.opacity = '1';
        setTimeout(() => {
          saveIndicator.style.opacity = '0';
        }, 2000);
      }
    }

    // Trigger Ctrl+S
    function triggerCtrlS() {
      const now = Date.now();
      const timeSinceLastSave = now - lastSaveTime;

      if (timeSinceLastSave < MIN_TIME_BETWEEN_SAVES) {
        console.log('Skipping save (too soon)');
        return;
      }

      console.log('Auto-saving...');

      const event = new KeyboardEvent('keydown', {
        key: 's',
        code: 'KeyS',
        keyCode: 83,
        which: 83,
        ctrlKey: true,
        bubbles: true,
        cancelable: true
      });

      document.dispatchEvent(event);

      if (document.activeElement) {
        document.activeElement.dispatchEvent(event);
      }

      lastSaveTime = now;
      // showSaveNotification();
      console.log('Saved at', new Date().toLocaleTimeString());
    }

    // Reset idle timer
    function resetIdleTimer() {
      if (idleTimer) {
        clearTimeout(idleTimer);
      }

      idleTimer = setTimeout(triggerCtrlS, IDLE_TIME_MS);
    }

    // Activity events
    const activityEvents = [
      'mousedown',
      'mousemove',
      'mouseup',
      'touchstart',
      'touchmove',
      'touchend',
      'keydown',
      'wheel'
    ];

    // Attach listeners
    activityEvents.forEach(eventType => {
      document.addEventListener(eventType, resetIdleTimer, { passive: true });
    });

    console.log('Ready! Draw and stop to auto-save.');
    resetIdleTimer();

  } else {
    console.log('Not on target website');
  }
}

// ========================
// PICTURE-IN-PICTURE AUTO-ENABLE
// Automatically enables Picture-in-Picture mode when switching away from a tab with playing video
// Re-enables normal playback when returning to the tab
// ========================

// Track which tabs have videos in PIP mode
let pipTabs = new Map();

// Listen for tab activation changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    // Get all tabs in the current window
    const tabs = await chrome.tabs.query({ windowId: activeInfo.windowId });
    
    for (const tab of tabs) {
      // Skip special URLs
      if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        continue;
      }

      if (tab.id === activeInfo.tabId) {
        // User switched TO this tab - exit PIP if it was active
        if (pipTabs.has(tab.id)) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: exitPictureInPicture
          }).catch(err => console.log('Could not exit PIP:', err.message));
          pipTabs.delete(tab.id);
        }
      } else {
        // User switched AWAY from this tab - enter PIP if video is playing
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: enterPictureInPicture
        }).then(() => {
          pipTabs.set(tab.id, true);
        }).catch(err => {
          // Tab might not support script injection or no video playing
          console.log('Could not enable PIP for tab', tab.id, ':', err.message);
        });
      }
    }
  } catch (error) {
    console.error('Error handling tab activation:', error);
  }
});

/**
 * Function injected to enter Picture-in-Picture mode
 * Finds playing videos and enables PIP
 */
function enterPictureInPicture() {
  try {
    // Find all video elements
    const videos = document.querySelectorAll('video');
    
    for (const video of videos) {
      // Check if video is playing
      if (!video.paused && !video.ended && video.readyState > 2) {
        // Check if PIP is supported and not already active
        if (document.pictureInPictureEnabled && !document.pictureInPictureElement) {
          video.requestPictureInPicture()
            .then(() => {
              console.log('Picture-in-Picture enabled');
            })
            .catch(err => {
              console.log('PIP request failed:', err.message);
            });
          break; // Only enable PIP for first playing video
        }
      }
    }
  } catch (error) {
    console.log('PIP error:', error.message);
  }
}

/**
 * Function injected to exit Picture-in-Picture mode
 * Returns video to normal playback in the tab
 */
function exitPictureInPicture() {
  try {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture()
        .then(() => {
          console.log('Exited Picture-in-Picture');
        })
        .catch(err => {
          console.log('Exit PIP failed:', err.message);
        });
    }
  } catch (error) {
    console.log('Exit PIP error:', error.message);
  }
}

export {};