fetch("https://api.aditya.backend.co/v1/files", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9,hi;q=0.8,ne;q=0.7",
    "authorization": "Bearer myBearerToken",
    "cache-control": "no-cache",
    "client-id": "5eb393ee95fab7468a79d189",
    "client-type": "WEB",
    "content-type": "multipart/form-data; boundary=----WebKitFormBoundary5vgJ5yNVNlWmFCwh",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "randomid": "b13845cf-2326-483e-87f3-5c63cb26ccd9",
    "x-sdk-version": "0.0.28",
  },
  "body": "------WebKitFormBoundary5vgJ5yNVNlWmFCwh\r\nContent-Disposition: form-data; name=\"file\"; filename=\"10oct.png\"\r\nContent-Type: image/png\r\n\r\n\r\n------WebKitFormBoundary5vgJ5yNVNlWmFCwh--\r\n",
  "method": "POST"
});

const uploadResponse = {
    "statusCode": 200,
    "data": {
        "_id": "6ad86dd5a443b0be7a644773",
        "name": "10oct.png",
        "baseUrl": "https://cdn.aditya.live/",
        "key": "5b09189f7285894d9130ccd0/3b2a1f42-b417-46c8-9a80-5a8ebe9cecc5.png",
        "organization": "5eb393ee95fab7468a79d189",
        "createdAt": "2026-10-21T07:46:29.568277414Z",
        "status": "Active"
    },
    "success": true,
    "dataFrom": "core-utilities-go"
}