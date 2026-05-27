# Copy Slide Feature - Setup Guide

## Overview
The **Copy Slide** feature allows you to quickly copy the current lecture slide image to your clipboard from Physics Wallah lectures. This is useful for note-taking and studying.

## How to Get Your Auth Token

Your auth token is a Bearer token used to authenticate with the Physics Wallah API. Follow these steps:

### Method 1: Browser Developer Tools (Recommended)
1. Open Physics Wallah (pw.live) in your browser
2. Open **Developer Tools** (Press `F12` or `Ctrl+Shift+I`)
3. Go to the **Network** tab
4. Make a request or refresh the page
5. Look for any API request to `api.penpencil.co`
6. Click on the request and go to the **Headers** tab
7. Scroll down to **Request Headers** and find the `authorization` header
8. Copy the value (it looks like: `Bearer eyJ0eXAi...`)

### Method 2: Browser Storage
1. Open Physics Wallah (pw.live)
2. Open **Developer Tools** (Press `F12`)
3. Go to **Application** tab
4. Click on **Storage** > **Local Storage** > `https://www.pw.live`
5. Look for a key that contains `token` or `auth`
6. If you find a Bearer token, copy it

### Method 3: Check Cookies
1. Open Physics Wallah (pw.live)
2. Open **Developer Tools** (Press `F12`)
3. Go to **Application** > **Cookies** > `https://www.pw.live`
4. Look for a cookie named `token` or `authorization`
5. Copy the value

## How to Use the Copy Slide Feature

1. **Set Your Token:**
   - Click the extension popup
   - Click "Set Auth Token" button
   - Paste your Bearer token in the text area
   - Click "Save Token"
   - The token is stored securely in Chrome's storage

2. **Copy a Slide:**
   - Open a Physics Wallah lecture (pw.live/watch/)
   - Position the video at the time/slide you want to copy
   - Click the "Copy Current Slide" button in the extension
   - Wait for the success message
   - Paste the image anywhere (Ctrl+V)

3. **Update or Remove Token:**
   - Click "Update Token" to enter a new token
   - Click "Remove Saved Token" to delete the stored token

## Troubleshooting

### "Please open a PW lecture page"
- Make sure you're on a Physics Wallah lecture page (url contains `pw.live/watch/`)
- The extension only works on PW lecture pages

### "Missing required parameters in URL"
- The lecture URL is missing necessary parameters
- Try refreshing the page or selecting a different lecture

### "No slides found for this lecture"
- This lecture might not have slides available
- Try a different lecture or timestamp

### "API request failed"
- Your token might be expired
- Get a new token and update it in the extension
- Check if you have active internet connection

### Token not saving
- Check if Chrome's storage permission is enabled
- Try using a private/incognito window to test

## Token Security Notes

- Your token is stored locally in your browser using Chrome's `chrome.storage.sync` API
- The token is never sent to external servers (except to Physics Wallah's official API)
- Each browser profile has its own stored token
- Tokens can expire - if you get auth errors, update your token

## API Endpoint Information

The extension uses the official Physics Wallah API:
- **Endpoint:** `https://api.penpencil.co/v1/batches/{batchId}/subject/{subjectId}/schedule/{scheduleId}/slides`
- **Method:** GET
- **Headers Required:**
  - `authorization`: Bearer token
  - `client-id`: 5eb393ee95fab7468a79d189
  - `client-type`: WEB
  - `client-version`: 200

## Features

✅ Extract current video timestamp  
✅ Query nearest slide image  
✅ Copy image to clipboard  
✅ Show status messages  
✅ Store token securely  
✅ Works only on pw.live  
✅ Error handling and feedback  

## FAQ

**Q: Is my token safe?**  
A: Yes, your token is stored locally in Chrome and only used to communicate with Physics Wallah's official API.

**Q: Does this violate Terms of Service?**  
A: This extension uses the official Physics Wallah API with your own credentials. It's similar to using their official website.

**Q: Can I use this on other websites?**  
A: No, this feature is designed specifically for Physics Wallah lectures (pw.live).

**Q: What if my token expires?**  
A: Simply update it in the extension. You'll need to get a new token following the methods above.

**Q: Does it work offline?**  
A: No, it requires internet connection to fetch from the Physics Wallah API.
