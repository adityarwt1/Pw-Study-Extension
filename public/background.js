/// <reference types="chrome" />

console.log('🚀 Background service worker loaded! (Fully enhanced template)');

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
    log('info', 'First install – defaults set');
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
  log('info', 'Browser startup – background reloaded');
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
      safeSendResponse(sendResponse, { status: 'success', message: 'Pong from enhanced background!', data: request.data });
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
// PW.LIVE DARK MODE
// ========================
const PW_URL_PATTERN = "https://www.pw.live";
const YOUTUBE_URL_PATTERN = "youtube.com";
(async()=>{
await chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the page has finished loading and has a URL
  if (changeInfo.status === 'complete' && tab.url) {
    
    // Check if the URL contains youtube.com
    if (tab.url.includes(YOUTUBE_URL_PATTERN)) {
      
      // Correct API to close a specific tab
      chrome.tabs.remove(tabId, () => {
        console.log("YouTube blocked and tab closed.");
      });
    }
  }
});
})()

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete' && tab.url && tab.url.includes(PW_URL_PATTERN)) {
//     chrome.scripting.executeScript({
//       target: { tabId: tabId },
//       func: pwDarkModeScript
//     });
//   }
// });

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes(PW_URL_PATTERN)) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: handleHideTimeStams
    });
  }
});

const handleHideTimeStams = ()=>{
  const timeDiv = document.getElementById("current-time-placeholder")
  timeDiv.style.opacity  = 0
}
function pwDarkModeScript() {
  if (window.hasDarkModeApplied) return;
  window.hasDarkModeApplied = true;

  let light = true;

  function change_theme() {
    const html = document.getElementsByTagName("html")[0];
    if (light) {
      html.style.filter = "invert(1) hue-rotate(180deg)";
      light = false;
    } else {
      html.style.filter = "invert(0) hue-rotate(0deg)";
      light = true;
    }
    fix_containers();
  }

  function fix_containers() {
    const imgs = document.getElementsByTagName("img");
    const vids = document.getElementsByTagName("video");
    const pwlogo = document.getElementsByClassName("mouse_pointer")[0];

    for (let img of imgs) {
      img.style.filter = light ? "" : "invert(1) hue-rotate(180deg)";
    }
    for (let vid of vids) {
      vid.style.filter = light ? "" : "invert(1) hue-rotate(180deg)";
    }
    if (pwlogo) {
      pwlogo.style.filter = light ? "" : "invert(0) hue-rotate(180deg)";
    }
  }

  document.addEventListener('keyup', (e) => {
    if (e.keyCode === 68 && e.altKey && e.shiftKey) {
      change_theme();
    } else if (e.keyCode === 70 && e.altKey && e.shiftKey) {
      fix_containers();
    }
  });

  change_theme();
}

// ========================
// YOUTUBE EDUCATIONAL FILTER
// ========================
const YOUTUBE_URL = 'https://www.youtube.com';

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete' && tab.url && tab.url.includes(YOUTUBE_URL)) {
//     chrome.scripting.executeScript({
//       target: { tabId: tabId },
//       func: hideNonEducationalVideos
//     });
//   }
// });

// This function gets injected into the YouTube page
function hideNonEducationalVideos() {
  console.log('🎓 Educational YouTube Filter Active');
  
  // Prevent double initialization
  if (window.hasEducationalFilter) return;
  window.hasEducationalFilter = true;

  // Educational keywords to filter
  const educationalKeywords = [
    'jee', 'nta', 'exam', 'study', 'tutorial', 'learn', 
    'education', 'college', 'neet', 'upsc', 'iit', 
    'physics', 'chemistry', 'mathematics', 'biology',
    'class', 'lecture', 'course', 'coaching'
  ];

  function filterVideos() {
    const videoElements = document.querySelectorAll('ytd-rich-item-renderer');
    let hiddenCount = 0;
    let shownCount = 0;

    videoElements.forEach(video => {
      const titleSpan = video.querySelector('.ytLockupMetadataViewModelTitle span.ytAttributedStringHost');
      
      if (titleSpan) {
        const titleText = titleSpan.textContent.toLowerCase();
        
        const isEducational = educationalKeywords.some(keyword => 
          titleText.includes(keyword)
        );
        
        if (!isEducational) {
          video.style.display = 'none';
          hiddenCount++;
        } else {
          video.style.display = '';
          shownCount++;
        }
      }
    });

    console.log(`✅ Filtered: ${shownCount} educational videos shown, ${hiddenCount} hidden`);
  }

  // Initial filter
  filterVideos();

  // Watch for new videos (infinite scroll)
  const contentsElement = document.querySelector('#contents');
  if (contentsElement) {
    const observer = new MutationObserver(() => {
      filterVideos();
    });

    observer.observe(contentsElement, {
      childList: true,
      subtree: true
    });
    
    console.log('👀 Watching for new videos...');
  }
}

// // ========================
// // YOUTUBE SHORTS HIDER
// // ========================
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete' && tab.url && tab.url.includes(YOUTUBE_URL)) {
//     chrome.scripting.executeScript({
//       target: { tabId: tabId },
//       func: hideYouTubeShorts
//     });
//   }
// });

function hideYouTubeShorts() {
  console.log('🚫 Hiding YouTube Shorts');
  
  if (window.hasShortsHider) return;
  window.hasShortsHider = true;

  function hideShorts() {
    // Hide Shorts shelf on homepage
    const shortsShelf = document.querySelector('ytd-reel-shelf-renderer');
    if (shortsShelf) {
      shortsShelf.style.display = 'none';
      console.log('Hidden Shorts shelf');
    }

    // Hide individual short videos
    const shortVideos = document.querySelectorAll('ytd-rich-item-renderer');
    shortVideos.forEach(video => {
      const thumbnail = video.querySelector('yt-thumbnail-view-model');
      if (thumbnail) {
        const overlays = thumbnail.querySelectorAll('.ytThumbnailBadgeViewModelHost');
        overlays.forEach(overlay => {
          const badgeText = overlay.textContent.trim();
          // Shorts don't have time badges like "10:55"
          if (!badgeText.includes(':')) {
            video.style.display = 'none';
          }
        });
      }
    });

    // Hide Shorts in sidebar
    const sidebarShorts = document.querySelectorAll('ytd-guide-entry-renderer');
    sidebarShorts.forEach(entry => {
      if (entry.textContent.includes('Shorts')) {
        entry.style.display = 'none';
      }
    });
  }

  // Run initially
  setTimeout(hideShorts, 1000);

  // Watch for changes
  const observer = new MutationObserver(hideShorts);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

export {};