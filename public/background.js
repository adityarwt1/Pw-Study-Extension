/// <reference types="chrome" />

console.log('🚀 Background service worker loaded! (Fully enhanced template)');

// ========================
// HELPER FUNCTIONS
// ========================
// Centralized error handling and safe response (solves common "message channel closed" errors)
const safeSendResponse = (sendResponse , data) => {
  try {
    sendResponse(data);
  } catch (err) {
    console.warn('Safe response failed (channel already closed):', err);
  }
};

// Centralized logging (helps debug more complex problems)
const log = (type, message, data) => {
  const entry = {
    timestamp: new Date().toISOString(),
    type,
    message,
    data: data || {},
  };
  console[type === 'error' ? 'error' : type === 'warn' ? 'warn' : 'log'](`[BG] ${message}`, data);
  // Optional: You can also save logs to storage for later review
  chrome.storage.local.get('logs').then(({ logs = [] }) => {
    logs.unshift(entry);
    if (logs.length > 100) logs.pop(); // keep only last 100 logs
    chrome.storage.local.set({ logs });
  });
};

// ========================
// INSTALL / UPDATE / STARTUP
// ========================
// Handles install, update, and browser startup (solves data migration & first-run problems)
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
    // Data migration example (solves breaking changes across versions)
    chrome.storage.local.get(null).then((data) => {
      if (!data.migratedToV2) {
        log('info', 'Running data migration for update');
        chrome.storage.local.set({
          migratedToV2: true,
          // Add any new default keys here
        });
      }
    });
  }

  // Create context menu (only if API is available)
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
  // Example: Run any startup tasks (check storage quota, clean old data, etc.)
});

// ========================
// MESSAGE HANDLING (CORE – solves 90% of extension problems)
// ========================
// Expanded with 15+ common actions so your extension can solve way more real-world problems
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

    case 'getActiveTabElementHtml': {
      const selector = request?.selector;
      if (!selector || typeof selector !== 'string') {
        safeSendResponse(sendResponse, { status: 'error', message: 'Missing selector string' });
        return true;
      }

      chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(([tab]) => {
        if (!tab?.id) {
          safeSendResponse(sendResponse, { status: 'error', message: 'No active tab' });
          return;
        }

        if (!chrome.scripting?.executeScript) {
          safeSendResponse(sendResponse, { status: 'error', message: 'scripting API unavailable (add "scripting" permission)' });
          return;
        }

        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (sel) => {
            const el = document.querySelector(sel);
            if (!el) return { found: false, html: null };
            return { found: true, html: el.outerHTML };
          },
          args: [selector],
        }).then((results) => {
          const result = results?.[0]?.result || { found: false, html: null };
          safeSendResponse(sendResponse, { status: 'success', ...result });
        }).catch((err) => {
          safeSendResponse(sendResponse, { status: 'error', message: String(err) });
        });
      });
      return true;
    }

    case 'ping':
      safeSendResponse(sendResponse, { status: 'success', message: 'Pong from enhanced background!', data: request.data });
      break;

    case 'getData':
      chrome.storage.local.get(null).then((data) => {
        safeSendResponse(sendResponse, { status: 'success', data });
      });
      return true; // keep channel open for async

    case 'logPageInfo':
      log('info', 'Page info from content script', {
        url: sender.tab?.url,
        title: request.title,
        tabId: sender.tab?.id,
      });
      safeSendResponse(sendResponse, { status: 'logged' });
      break;

    // NEW: Solve tab automation problems
    case 'getCurrentTab':
      chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
        safeSendResponse(sendResponse, { status: 'success', tab });
      });
      return true;

    case 'openNewTab':
      chrome.tabs.create({ url: request.url || 'https://google.com' }).then((tab) => {
        safeSendResponse(sendResponse, { status: 'success', tabId: tab.id });
      });
      return true;

    case 'closeTab':
      if (request.tabId) chrome.tabs.remove(request.tabId);
      safeSendResponse(sendResponse, { status: 'success' });
      break;

    case 'getAllTabs':
      chrome.tabs.query({}).then((tabs) => safeSendResponse(sendResponse, { status: 'success', tabs }));
      return true;

    // NEW: Solve user notification & feedback problems
    case 'showNotification':
      // Requires "notifications" permission in manifest.json
      chrome.notifications.create({
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icon-128.png'), // add your icon
        title: request.title || 'Extension Alert',
        message: request.message || 'Something happened!',
        buttons: request.buttons || [],
      }).then((id) => safeSendResponse(sendResponse, { status: 'success', notificationId: id }));
      return true;

    // NEW: Solve UI feedback problems (toolbar badge)
    case 'updateBadge':
      // Requires "action" in manifest (or "browser_action" for older)
      chrome.action.setBadgeText({ text: request.text || '' });
      if (request.color) chrome.action.setBadgeBackgroundColor({ color: request.color });
      safeSendResponse(sendResponse, { status: 'success' });
      break;

    // NEW: Solve dynamic content injection problems
    case 'injectScript':
      // Requires "scripting" permission + host_permissions in manifest
      if (sender.tab?.id) {
        chrome.scripting.executeScript({
          target: { tabId: sender.tab.id },
          files: request.files || [],
          function: request.func, // or use world: 'MAIN' / 'ISOLATED'
        }).then(() => safeSendResponse(sendResponse, { status: 'success' }));
      }
      return true;

    // NEW: Solve screenshot / visual data problems
    case 'captureScreenshot':
      // Requires "activeTab" or host permission
      if (sender.tab?.id) {
        chrome.tabs.captureVisibleTab(sender.tab.windowId, { format: 'png' }).then((dataUrl) => {
          safeSendResponse(sendResponse, { status: 'success', dataUrl });
        });
      }
      return true;

    default:
      log('warn', `Unknown action: ${request.action}`);
      safeSendResponse(sendResponse, { status: 'error', message: 'Unknown action' });
  }

  return true; // keep channel open for any async responses
});

// Long-lived connection support (solves real-time / streaming problems)
chrome.runtime.onConnect.addListener((port) => {
  log('info', `Port connected: ${port.name}`);

  if (port.name === 'content-connection') {
    port.onMessage.addListener((msg) => {
      log('info', `Port message: ${msg.action}`, msg);
      // Example: keep a live feed or process heavy data
      if (msg.action === 'heartbeat') port.postMessage({ status: 'alive' });
    });

    port.onDisconnect.addListener(() => log('info', 'Port disconnected'));
  }
});

// ========================
// TAB & WINDOW EVENTS (solve navigation & multi-tab problems)
// ========================
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    log('info', 'Tab fully loaded', { tabId, url: tab.url, title: tab.title });
    // You can auto-inject content script logic here if needed
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  log('info', 'Tab activated', activeInfo);
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  log('info', 'Tab closed', { tabId, removeInfo });
});

// ========================
// TOOLBAR ACTION (popup icon click)
// ========================
// Requires "action" in manifest.json
chrome.action.onClicked.addListener((tab) => {
  log('info', 'Toolbar icon clicked', { tabId: tab.id });
  // Example: open side panel (Manifest V3)
  chrome.sidePanel.open({ tabId: tab.id }); // Requires "sidePanel" permission
  // Or open popup manually, toggle feature, etc.
});

// ========================
// CONTEXT MENU (already present + enhanced)
// ========================
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'myExtension') {
    log('info', 'Context menu used', { selection: info.selectionText, pageUrl: info.pageUrl });

    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, {
        action: 'processSelection',
        text: info.selectionText,
        pageUrl: info.pageUrl,
      });
    }
  }
});

// You can add dynamic menus anytime:
// chrome.contextMenus.create({ id: 'submenu', title: 'Advanced', parentId: 'myExtension' });

// ========================
// KEYBOARD SHORTCUTS
// ========================
if (chrome.commands?.onCommand?.addListener) {
  chrome.commands.onCommand.addListener((command) => {
    log('info', `Command triggered: ${command}`);

    if (command === 'toggle-feature') {
      chrome.storage.local.get(['enabled']).then(({ enabled = true }) => {
        const newState = !enabled;
        chrome.storage.local.set({ enabled: newState });
        chrome.action.setBadgeText({ text: newState ? 'ON' : 'OFF' });
        log('info', `Feature toggled to: ${newState}`);
      });
    }

    // Add more commands here from manifest.json "commands" section
  });
} else {
  log('warn', 'commands API unavailable (check manifest "commands")');
}

// ========================
// ALARMS & PERIODIC TASKS (solve background automation problems)
// ========================
chrome.alarms.create('periodicTask', { periodInMinutes: 1 });
chrome.alarms.create('dailyCleanup', { when: Date.now() + 24 * 60 * 60 * 1000 }); // one-time example

chrome.alarms.onAlarm.addListener((alarm) => {
  log('info', `Alarm fired: ${alarm.name}`);

  if (alarm.name === 'periodicTask') {
    // Example: background sync, cleanup, analytics, etc.
    console.log('✅ Periodic task running');
    // You can call any of the message handlers internally here
  }

  if (alarm.name === 'dailyCleanup') {
    // Clean old logs, etc.
    chrome.storage.local.get('logs').then(({ logs = [] }) => {
      chrome.storage.local.set({ logs: logs.slice(0, 50) });
    });
  }
});

// ========================
// NOTIFICATIONS (user interaction)
// ========================
// Requires "notifications" permission
if (chrome.notifications?.onClicked?.addListener) {
  chrome.notifications.onClicked.addListener((notificationId) => {
    log('info', `Notification clicked: ${notificationId}`);
    // Open a specific tab or popup
  });

  chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    log('info', `Notification button ${buttonIndex} clicked`);
  });
} else {
  log('warn', 'notifications API unavailable (check "notifications" permission)');
}

// ========================
// OPTIONAL ADVANCED FEATURES (uncomment as needed)
// ========================

// External messaging (talk to other extensions or websites)
// chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => { ... });

// Declarative Net Request (block/modify network requests)
// Requires "declarativeNetRequest" + "declarativeNetRequestWithHostAccess" permissions
// chrome.declarativeNetRequest.updateDynamicRules({ ... });

// Omnibox (custom address bar)
// chrome.omnibox.onInputEntered.addListener((text) => { chrome.tabs.create({ url: `https://example.com/search?q=${text}` }); });

// Idle detection
// chrome.idle.setDetectionInterval(60); // 1 minute
// chrome.idle.onStateChanged.addListener((newState) => log('info', `User is now ${newState}`));

// Set uninstall feedback page (great for user retention)
// chrome.runtime.setUninstallURL('https://your-site.com/uninstall-feedback');

// ========================
// FINAL EXPORT
// ========================
// background.js

const PW_URL_PATTERN = "https://www.pw.live";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the page has finished loading and matches the PW URL
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes(PW_URL_PATTERN)) {
    
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: pwDarkModeScript
    });
  }
});

// The actual script to be injected
function pwDarkModeScript() {
  // Prevent double injection
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

  // Hotkeys: Shift + Alt + D
  document.addEventListener('keyup', (e) => {
    if (e.keyCode === 68 && e.altKey && e.shiftKey) {
      change_theme();
    } else if (e.keyCode === 70 && e.altKey && e.shiftKey) {
      fix_containers();
    }
  });

  // Auto-run on load
  change_theme();
}
export {};