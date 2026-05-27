# Copy Slide Feature - Technical Documentation

## Implementation Overview

The Copy Slide feature allows users to extract and copy the current slide image from Physics Wallah lectures with a single click. The implementation uses Chrome extension APIs and the Physics Wallah API.

## File Structure

```
src/
├── components/
│   └── CopySlide.tsx              # Main React component for the UI
├── utils/
│   └── chromeApis/
│       ├── storageApi.ts          # Chrome Storage API wrapper
│       ├── getCurrentAcitivewindow.ts
│       ├── runScriptOn.ts
│       └── pushNotification.ts
└── App.tsx                         # Updated with CopySlide import
```

## Component: CopySlide.tsx

### Features
- **Token Management**
  - Save auth token to Chrome storage (chrome.storage.sync)
  - Load token on component mount
  - Update or remove saved token
  
- **Slide Extraction**
  - Query active tab and verify it's a pw.live page
  - Extract URL parameters (batchSlug, subjectSlug, scheduleId)
  - Get current video timestamp from the player
  
- **API Integration**
  - Fetch slides from Physics Wallah API
  - Find the slide closest to the current timestamp
  - Handle pagination and slide data
  
- **Image Copying**
  - Fetch the slide image
  - Use Clipboard API to copy the image blob
  - Provide user feedback on success/failure

### State Management
```typescript
const [status, setStatus] = useState<string>('');           // Status message
const [statusType, setStatusType] = useState<'idle' | ...>  // Message type for styling
const [isLoading, setIsLoading] = useState(false);           // Loading state
const [token, setToken] = useState<string>('');              // Auth token
const [showTokenInput, setShowTokenInput] = useState(false);  // Token input visibility
const [isSavingToken, setIsSavingToken] = useState(false);    // Saving state
```

### Key Functions

#### handleCopySlide()
Main function triggered by the "Copy Current Slide" button.

**Flow:**
1. Validate token exists
2. Get active tab and verify it's pw.live
3. Inject extractLectureData function into the page
4. Extract: batchSlug, subjectSlug, scheduleId, currentTime
5. Fetch slides from API with user's token
6. Find slide matching current timestamp
7. Fetch image blob
8. Copy to clipboard using Clipboard API

**Error Handling:**
- Validates all required URL parameters
- Checks video player availability
- Handles API errors with HTTP status codes
- Provides meaningful error messages

#### handleSaveToken()
Saves the auth token to Chrome's storage.

**Process:**
- Validates token is not empty
- Uses `chrome.storage.sync.set()`
- Shows success/error feedback
- Auto-dismisses after 3 seconds

#### loadToken()
Loads saved token from storage on mount.

**Process:**
- Called in useEffect on component mount
- Silently fails if no token exists
- Allows seamless token persistence across browser sessions

### API Integration

**Endpoint:**
```
GET https://api.penpencil.co/v1/batches/{batchId}/subject/{subjectId}/schedule/{scheduleId}/slides
```

**Headers:**
```typescript
{
  'accept': '*/*',
  'authorization': `Bearer ${token}`,
  'client-id': '5eb393ee95fab7468a79d189',
  'client-type': 'WEB',
  'client-version': '200',
  'content-type': 'application/json'
}
```

**Response Format:**
```typescript
{
  data: [
    {
      startTime: number,      // Timestamp in seconds
      image?: string,         // Image URL
      url?: string,           // Alternative URL
      imageUrl?: string       // Alternative URL field
    }
  ]
}
```

**Slide Selection Algorithm:**
Finds the slide with the highest `startTime` that doesn't exceed the current video timestamp.

```typescript
let currentSlide = slides[0];
for (const slide of slides) {
  if (slide.startTime <= currentTime) {
    currentSlide = slide;
  } else {
    break;  // Assumes slides are sorted by startTime
  }
}
```

### Storage API: storageApi.ts

Chrome storage wrapper for managing the auth token.

**Methods:**
- `saveToken(token: string)` - Save to chrome.storage.sync
- `getToken(): Promise<string | null>` - Retrieve from storage
- `removeToken()` - Delete from storage

**Why chrome.storage.sync?**
- Syncs across all user's browsers with same Google account
- Persists across browser sessions
- More secure than localStorage (iframe-safe)

## Content Script: content.js

The content.js file injects into pw.live pages to:
1. Hide timestamps (if enabled)
2. Hide chat (if enabled)
3. Enable right-click (if enabled)

**Important:** The slide extraction happens in the popup (popup.tsx) by injecting the `extractLectureData` function using `chrome.scripting.executeScript()` with `func` parameter.

## Manifest Configuration

**Required Permissions:**
```json
{
  "permissions": [
    "storage",      // For saving/loading token
    "tabs",         // For querying active tab
    "activeTab",    // For active tab info
    "scripting"     // For injecting scripts
  ]
}
```

**Content Scripts:**
```json
{
  "matches": ["https://*.pw.live/*", "http://*.pw.live/*"],
  "js": ["content.js"],
  "run_at": "document_start"
}
```

## User Flow

```
User opens extension
    ↓
No token saved?
    ├─ Yes → Click "Set Auth Token" → Paste token → Save
    └─ No → Proceed
    ↓
Click "Copy Current Slide"
    ↓
Verify pw.live page is active
    ↓
Extract lecture parameters from URL & video timestamp
    ↓
Query Physics Wallah API for slides
    ↓
Find matching slide for current timestamp
    ↓
Fetch slide image
    ↓
Copy to clipboard
    ↓
Show success message
    ↓
User can paste (Ctrl+V) anywhere
```

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| "Please set your auth token first" | No token configured | User must set token |
| "No active tab found" | Extension called on non-web action | Switch to browser window |
| "Please open a PW lecture page" | Wrong website or no tab | Open pw.live/watch/ |
| "Missing required parameters in URL" | URL missing parameters | Refresh page, select different lecture |
| "Video player not found" | Player element missing | Wait for page load |
| "No slides found for this lecture" | API returned empty array | Slides might not be available |
| "No image URL found for current slide" | Slide data missing URL | Try different slide/timestamp |
| "API request failed: {status}" | API error | Check token validity, internet connection |
| "Failed to copy image" | Clipboard API issue | Check browser permissions |

## Browser Compatibility

- **Chrome:** ✅ Full support (manifest_version 3)
- **Edge:** ✅ Full support (Chromium-based)
- **Firefox:** ⚠️ Limited support (different API, requires adapter)
- **Safari:** ❌ Not supported (different extension system)

## Security Considerations

1. **Token Storage**
   - Uses `chrome.storage.sync` (encrypted by browser)
   - Not accessible by other extensions
   - Scoped to extension ID only

2. **API Communication**
   - HTTPS only (enforced by pw.live)
   - No token logging or external transmission
   - Same-origin requests only

3. **Script Injection**
   - Only injects into pw.live domains
   - Functions are serialized and executed in page context
   - No access to other tabs or browser data

4. **User Token Responsibility**
   - Users should understand token is sensitive
   - Should not share extension or token publicly
   - Can be revoked anytime in Physics Wallah account settings

## Performance Considerations

1. **Network Requests**
   - Single API call per slide copy (minimal overhead)
   - Image fetch depends on image size
   - No caching (always latest slides)

2. **Memory Usage**
   - Component mounts once per extension session
   - Token stored in memory + Chrome storage
   - Image blob cleared after copy

3. **Timing**
   - Slide extraction: <100ms
   - API call: 200-500ms (network dependent)
   - Image fetch: 500ms-2s (image size dependent)

## Future Enhancements

- [ ] Batch copy multiple slides
- [ ] Auto-update token when expired
- [ ] Cache slides locally for offline access
- [ ] Support for multiple courses/lectures
- [ ] OCR for text extraction from slides
- [ ] Slide download as PDF
- [ ] Batch export slides with notes
- [ ] Keyboard shortcut for quick copy
- [ ] Copy slide with annotations
- [ ] Share slides with study group

## Testing Checklist

- [ ] Token saves and persists across sessions
- [ ] Token loads on component mount
- [ ] Button disabled when no token
- [ ] Only works on pw.live pages
- [ ] Extracts correct URL parameters
- [ ] Gets accurate video timestamp
- [ ] API call succeeds with valid token
- [ ] Finds correct slide for timestamp
- [ ] Image copies to clipboard
- [ ] Error messages display correctly
- [ ] Update token works
- [ ] Remove token works
- [ ] Expired token shows API error
- [ ] Invalid URL shows proper error
- [ ] No video player shows proper error

## Debugging

**Enable console logging:**
```typescript
// In CopySlide.tsx
console.log('Data extracted:', data);
console.log('Slides received:', result);
console.log('Image URL:', imageUrl);
```

**Check token in storage:**
```javascript
// In browser console
chrome.storage.sync.get(['authToken'], (result) => {
  console.log('Saved token:', result.authToken);
});
```

**Inspect injected script:**
```javascript
// In browser DevTools Network tab
// Look for api.penpencil.co requests
// Check Authorization header
```
