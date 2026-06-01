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
      autoCopyEnabled: false,
      lastAutoCopyTime: null,
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

    case 'toggleAutoCopy':
      chrome.storage.local.get(['autoCopyEnabled']).then(({ autoCopyEnabled }) => {
        const newState = !autoCopyEnabled;
        chrome.storage.local.set({ autoCopyEnabled: newState });
        log('info', `Auto-copy toggled to: ${newState}`);
        safeSendResponse(sendResponse, { status: 'success', autoCopyEnabled: newState });
      });
      return true;

    case 'getAutoCopyStatus':
      chrome.storage.local.get(['autoCopyEnabled', 'lastAutoCopyTime']).then((data) => {
        safeSendResponse(sendResponse, { 
          status: 'success', 
          autoCopyEnabled: data.autoCopyEnabled ?? false,
          lastAutoCopyTime: data.lastAutoCopyTime ?? null
        });
      });
      return true;

    default:
      log('warn', `Unknown action: ${request.action}`);
      safeSendResponse(sendResponse, { status: 'error', message: 'Unknown action' });
  }

  return true;
});

// ========================
// KEYBOARD COMMANDS
// ========================
chrome.commands.onCommand.addListener((command) => {
  log('info', 'Command triggered:', { command });
  console.log('[BG] Command triggered:', command);
  
  if (command === 'copy-slide') {
    log('info', 'Copy slide command triggered');
    console.log('[BG] Copy slide command triggered - getting active tab');
    
    // Get the active tab and send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      console.log('[BG] Tabs query result:', tabs);
      const tab = tabs[0];
      
      if (!tab) {
        console.error('[BG] No active tab found');
        log('error', 'No active tab found');
        return;
      }
      
      console.log('[BG] Active tab URL:', tab.url);
      
      if (tab?.id && tab.url?.includes('pw.live')) {
        console.log('[BG] Sending message to tab:', tab.id);
        chrome.tabs.sendMessage(tab.id, { action: 'copySlideFromShortcut' }).then(() => {
          console.log('[BG] Message sent successfully');
          log('info', 'Message sent to content script');
        }).catch((err) => {
          console.error('[BG] Failed to send message:', err);
          log('warn', 'Failed to send message to content script', { error: String(err) });
        });
      } else {
        console.warn('[BG] Not on pw.live page or no tab ID');
        log('warn', 'Not on pw.live page or no tab ID', { tabId: tab?.id, url: tab?.url });
      }
    }).catch((err) => {
      console.error('[BG] Error querying tabs:', err);
      log('error', 'Error querying tabs', { error: String(err) });
    });
  }
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
// const YOUTUBE_URL_PATTERN = "youtube.com";

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete' && tab.url) {
//     if (tab.url.includes(YOUTUBE_URL_PATTERN)) {
//       chrome.tabs.remove(tabId, () => {
//         console.log("YouTube blocked and tab closed.");
//       });
//     }
//   }
// });

// ========================
// PW.LIVE AUTO-FEATURES
// Auto-runs: hide timestamps, hide chat, enable right-click, picture-in-picture
// ========================
const PW_URL_PATTERN = "pw.live";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes(PW_URL_PATTERN)) {
    // Execute all features automatically
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: autoRunPWFeatures
    });
  }
});

// Main function that runs all features automatically on PW.live
const autoRunPWFeatures = () => {
  // 1. HIDE TIMESTAMPS
  const handleHideTimeStamps = () => {
    const timeDiv = document.getElementById("current-time-placeholder");
    const timePleaseFol = document.querySelector("#progress-placeholder");
    const vjsElement = document.querySelector(".vjs-progress-holder");

    if (timeDiv) {
      timeDiv.style.opacity = "0";
      timeDiv.style.pointerEvents = "none";
    }
    if (timePleaseFol) {
      timePleaseFol.style.opacity = "0";
      timePleaseFol.style.pointerEvents = "none";
    }
    if (vjsElement) {
      vjsElement.style.opacity = "0";
      vjsElement.style.pointerEvents = "none";
    }
    console.log('✓ Timestamps hidden successfully');
  };

  // 2. HIDE CHAT
  const handleHideChat = () => {
    const chatContainer = document.querySelector("[class*='chat']");
    const chatSidebar = document.querySelector("[class*='sidebar']");
    const chatSection = document.querySelector("section[class*='chat']");
    
    if (chatContainer) {
      chatContainer.style.display = "none";
    }
    if (chatSidebar && chatSidebar.textContent.includes('Chat')) {
      chatSidebar.style.display = "none";
    }
    if (chatSection) {
      chatSection.style.display = "none";
    }
    console.log('✓ Chat hidden successfully');
  };

  // 3. ENABLE RIGHT-CLICK
  const handleEnabledRightClick = () => {
    document.oncontextmenu = null;
    document.body.oncontextmenu = null;
    document.onselectstart = null;
    document.body.onselectstart = null;
    document.oncopy = null;
    document.body.oncopy = null;

    document.addEventListener(
      "contextmenu",
      (e) => {
        e.stopPropagation();
      },
      true
    );
    console.log('✓ Right-click enabled!');
  };

  // 4. PICTURE-IN-PICTURE
  const handlePictureInPicture = () => {
    const videoElement = document.querySelector("video");
    if (videoElement && document.pictureInPictureEnabled) {
      videoElement.requestPictureInPicture().catch((error) => {
        console.log('PiP not available yet, will try again');
      });
    }
  };

  // Run hide timestamps immediately
  handleHideTimeStamps();

  // Run hide chat after a small delay
  setTimeout(() => {
    handleHideChat();
  }, 500);

  // Run enable right-click immediately
  handleEnabledRightClick();

  // Try picture-in-picture after video loads
  setTimeout(() => {
    handlePictureInPicture();
  }, 1000);

  // Re-run every 3 seconds to handle dynamically loaded elements
  setInterval(() => {
    handleHideTimeStamps();
    handleHideChat();
  }, 3000);

  console.log('All PW.live features activated automatically!');
};

// ========================
// EXCALIDRAW AUTO-SAVE
// Automatically saves Excalidraw drawings after idle period
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

function excalidrawAutoSave() {
  if (window.hasExcalidrawAutoSave) return;
  window.hasExcalidrawAutoSave = true;

  console.log('Excalidraw Auto-Save Active');

  const TARGET_ORIGIN = 'https://excalidraw.com';
  const IDLE_TIME_MS = 2000;
  const MIN_TIME_BETWEEN_SAVES = 10000;
  const ENABLE_VISUAL_INDICATOR = true;

  if (window.location.origin === TARGET_ORIGIN) {
    console.log('Auto-save script loaded');
    console.log('Idle timeout:', IDLE_TIME_MS / 1000, 'seconds');

    let idleTimer = null;
    let lastSaveTime = Date.now();
    let saveIndicator = null;

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

    function showSaveNotification() {
      if (saveIndicator) {
        saveIndicator.style.opacity = '1';
        setTimeout(() => {
          saveIndicator.style.opacity = '0';
        }, 2000);
      }
    }

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

    function resetIdleTimer() {
      if (idleTimer) {
        clearTimeout(idleTimer);
      }
      idleTimer = setTimeout(triggerCtrlS, IDLE_TIME_MS);
    }

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

    activityEvents.forEach(eventType => {
      document.addEventListener(eventType, resetIdleTimer, { passive: true });
    });

    console.log('Ready! Draw and stop to auto-save.');
    resetIdleTimer();
  }
}

// ========================
// SMART PICTURE-IN-PICTURE MANAGER
// Uses Chrome Tab API to detect media playback
// Automatically manages PIP based on tab audible state
// No dependency on video elements
// ========================

// Store tabs with active media and their PIP state
// const mediaPlayingTabs = new Map();
// const pipActiveTabs = new Set();

// /**
//  * Check if tab has audible media playing
//  * Uses Chrome's built-in audible property
//  */
// function isTabPlayingMedia(tab) {
//   return tab.audible === true;
// }

// /**
//  * Monitor all tabs for media playback state changes
//  */
// chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
//   // Ignore non-media related changes
//   if (!('audible' in changeInfo)) {
//     return;
//   }

//   const isPlayingNow = isTabPlayingMedia(tab);
//   const wasPlaying = mediaPlayingTabs.has(tabId);

//   console.log(`Tab ${tabId} media state changed:`, {
//     url: tab.url,
//     audible: tab.audible,
//     active: tab.active,
//     isPlayingNow,
//     wasPlaying
//   });

//   // Update tracking
//   if (isPlayingNow) {
//     mediaPlayingTabs.set(tabId, {
//       url: tab.url,
//       title: tab.title,
//       timestamp: Date.now()
//     });
//   } else {
//     mediaPlayingTabs.delete(tabId);
//   }

//   // If tab is not active and media just started or is playing
//   if (isPlayingNow && !tab.active) {
//     console.log(`Media playing in background tab ${tabId}, attempting PIP`);
//     await attemptPIP(tabId);
//   }

//   // If tab became inactive while playing
//   if (isPlayingNow && !tab.active && !pipActiveTabs.has(tabId)) {
//     console.log(`Tab ${tabId} is inactive with media, attempting PIP`);
//     await attemptPIP(tabId);
//   }
// });

/**
 * Monitor tab activation to manage PIP
//  */
// chrome.tabs.onActivated.addListener(async (activeInfo) => {
//   const tabId = activeInfo.tabId;

//   try {
//     const [activeTab, allTabs] = await Promise.all([
//       chrome.tabs.get(tabId),
//       chrome.tabs.query({ windowId: activeInfo.windowId })
//     ]);

//     console.log(`Tab activated: ${tabId}`, {
//       url: activeTab.url,
//       audible: activeTab.audible
//     });

//     // Exit PIP for the now-active tab
//     if (pipActiveTabs.has(tabId)) {
//       console.log(`Exiting PIP for newly active tab ${tabId}`);
//       await exitPIP(tabId);
//       pipActiveTabs.delete(tabId);
//     }

//     // Check all other tabs for playing media
//     for (const tab of allTabs) {
//       if (tab.id === tabId) continue; // Skip the active tab
      
//       if (isTabPlayingMedia(tab)) {
//         console.log(`Found playing media in background tab ${tab.id}`);
//         await attemptPIP(tab.id);
//       }
//     }
//   } catch (error) {
//     console.error('Error in tab activation handler:', error);
//   }
// });

// /**
//  * Clean up when tabs are closed
//  */
// chrome.tabs.onRemoved.addListener((tabId) => {
//   mediaPlayingTabs.delete(tabId);
//   pipActiveTabs.delete(tabId);
//   console.log(`Tab ${tabId} removed, cleaned up tracking`);
// });

// /**
//  * Attempt to enable PIP for a tab
//  */
// async function attemptPIP(tabId) {
//   try {
//     // Don't attempt if already in PIP
//     if (pipActiveTabs.has(tabId)) {
//       console.log(`Tab ${tabId} already has PIP active`);
//       return;
//     }

//     const tab = await chrome.tabs.get(tabId);

//     // Skip special URLs
//     if (!tab.url || 
//         tab.url.startsWith('chrome://') || 
//         tab.url.startsWith('chrome-extension://') ||
//         tab.url.startsWith('about:')) {
//       console.log(`Skipping PIP for special URL: ${tab.url}`);
//       return;
//     }

//     console.log(`Injecting PIP script into tab ${tabId}`);

//     await chrome.scripting.executeScript({
//       target: { tabId: tabId },
//       func: enablePIPScript
//     });

//     pipActiveTabs.add(tabId);
//     console.log(`PIP enabled for tab ${tabId}`);

//   } catch (error) {
//     console.log(`Could not enable PIP for tab ${tabId}:`, error.message);
//   }
// }

// /**
//  * Exit PIP for a tab
//  */
// async function exitPIP(tabId) {
//   try {
//     await chrome.scripting.executeScript({
//       target: { tabId: tabId },
//       func: disablePIPScript
//     });
//     console.log(`PIP disabled for tab ${tabId}`);
//   } catch (error) {
//     console.log(`Could not disable PIP for tab ${tabId}:`, error.message);
//   }
// }

// /**
//  * Script injected to enable PIP
//  * Finds ANY video element and enables PIP regardless of state
//  */
// function enablePIPScript() {
//   console.log('PIP enable script running');

//   try {
//     // Check if PIP is supported
//     if (!document.pictureInPictureEnabled) {
//       console.log('PIP not supported');
//       return;
//     }

//     // Skip if already in PIP
//     if (document.pictureInPictureElement) {
//       console.log('PIP already active');
//       return;
//     }

//     // Find all video elements
//     const videos = document.querySelectorAll('video');
//     console.log(`Found ${videos.length} video elements`);

//     if (videos.length === 0) {
//       console.log('No video elements found');
//       return;
//     }

//     // Try each video until one succeeds
//     let pipEnabled = false;
    
//     for (let i = 0; i < videos.length; i++) {
//       const video = videos[i];
      
//       console.log(`Attempting PIP on video ${i}:`, {
//         paused: video.paused,
//         ended: video.ended,
//         readyState: video.readyState,
//         duration: video.duration,
//         currentTime: video.currentTime
//       });

//       // Try to enable PIP
//       video.requestPictureInPicture()
//         .then(() => {
//           console.log(`PIP enabled successfully on video ${i}`);
//           pipEnabled = true;
//         })
//         .catch(err => {
//           console.log(`PIP failed on video ${i}:`, err.message);
//         });

//       // Only try first video
//       if (pipEnabled) break;
//     }

//     // If first attempt fails, try with user gesture simulation
//     if (!pipEnabled) {
//       console.log('Attempting PIP with gesture simulation');
//       const firstVideo = videos[0];
      
//       // Add click listener to capture next user interaction
//       const clickHandler = () => {
//         firstVideo.requestPictureInPicture()
//           .then(() => console.log('PIP enabled via click'))
//           .catch(err => console.log('PIP via click failed:', err.message));
//         document.removeEventListener('click', clickHandler, true);
//       };
      
//       document.addEventListener('click', clickHandler, true);
//       console.log('Waiting for user click to enable PIP');
//     }

//   } catch (error) {
//     console.log('PIP script error:', error.message);
//   }
// }

/**
 * Script injected to disable PIP
 */
// function disablePIPScript() {
//   try {
//     if (document.pictureInPictureElement) {
//       document.exitPictureInPicture()
//         .then(() => console.log('PIP exited'))
//         .catch(err => console.log('PIP exit failed:', err.message));
//     } else {
//       console.log('No active PIP to exit');
//     }
//   } catch (error) {
//     console.log('PIP exit error:', error.message);
//   }
// }

/**
 * Monitor window focus changes
 * Useful for detecting when user switches to another window entirely
 */
// chrome.windows.onFocusChanged.addListener(async (windowId) => {
//   if (windowId === chrome.windows.WINDOW_ID_NONE) {
//     console.log('No window focused');
//     return;
//   }

//   try {
//     const tabs = await chrome.tabs.query({ windowId: windowId, active: true });
//     const activeTab = tabs[0];

//     if (activeTab) {
//       console.log('Window focused, active tab:', {
//         tabId: activeTab.id,
//         url: activeTab.url,
//         audible: activeTab.audible
//       });
//     }
//   } catch (error) {
//     console.log('Error in window focus handler:', error);
//   }
// });

// console.log('Smart PIP Manager initialized - monitoring media playback across all tabs');

// ========================
// AUTO-COPY FUNCTIONALITY
// Automatically copy slides every 3 minutes when enabled
// ========================

const AUTO_COPY_INTERVAL = 3 * 60 * 1000; // 3 minutes in milliseconds
let autoCopyIntervalId = null;

// Function to trigger auto-copy on the active pw.live tab
async function triggerAutoCopy() {
  try {
    // Get the active tab
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];

    if (!activeTab) {
      console.log('[AutoCopy] No active tab found');
      return;
    }

    // Check if it's a pw.live tab
    if (!activeTab.url || !activeTab.url.includes('pw.live')) {
      console.log('[AutoCopy] Active tab is not on pw.live, skipping copy');
      return;
    }

    console.log('[AutoCopy] Triggering auto-copy on tab:', activeTab.id);

    // Send message to content script to copy silently
    chrome.tabs.sendMessage(activeTab.id, { 
      action: 'copySlideFromShortcut', 
      silent: true 
    }).then(() => {
      console.log('[AutoCopy] Auto-copy message sent successfully');
      // Update last copy time in storage
      chrome.storage.local.set({ lastAutoCopyTime: new Date().toISOString() });
      log('info', 'Auto-copy executed', { tabId: activeTab.id, url: activeTab.url });
    }).catch((err) => {
      console.warn('[AutoCopy] Failed to send message:', err);
      log('warn', 'Auto-copy message failed', { error: String(err) });
    });

  } catch (error) {
    console.error('[AutoCopy] Error in triggerAutoCopy:', error);
    log('error', 'Auto-copy trigger error', { error: String(error) });
  }
}

// Start auto-copy interval when enabled
function startAutoCopy() {
  if (autoCopyIntervalId !== null) {
    console.log('[AutoCopy] Auto-copy already running');
    return;
  }

  console.log('[AutoCopy] Starting auto-copy interval (every 3 minutes)');
  
  // Trigger immediately
  triggerAutoCopy();

  // Then every 3 minutes
  autoCopyIntervalId = setInterval(triggerAutoCopy, AUTO_COPY_INTERVAL);
  log('info', 'Auto-copy started');
}

// Stop auto-copy interval when disabled
function stopAutoCopy() {
  if (autoCopyIntervalId !== null) {
    clearInterval(autoCopyIntervalId);
    autoCopyIntervalId = null;
    console.log('[AutoCopy] Auto-copy interval stopped');
    log('info', 'Auto-copy stopped');
  }
}

// Check auto-copy status on startup and restore if enabled
chrome.storage.local.get(['autoCopyEnabled']).then(({ autoCopyEnabled }) => {
  console.log('[AutoCopy] Auto-copy enabled on startup:', autoCopyEnabled);
  if (autoCopyEnabled) {
    startAutoCopy();
  }
});

// Listen for storage changes to toggle auto-copy
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && 'autoCopyEnabled' in changes) {
    const newValue = changes.autoCopyEnabled.newValue;
    console.log('[AutoCopy] Auto-copy enabled changed to:', newValue);
    
    if (newValue) {
      startAutoCopy();
    } else {
      stopAutoCopy();
    }
  }
});

export {};