import { useState } from "react";
import { getAcitveWindow } from "../utils/chromeApis/getCurrentAcitivewindow";
import { excuteScript } from "../utils/chromeApis/runScriptOn";

const slideImageCopier = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [isSetup, setIsSetup] = useState(false);

  const handleSetupShortcut = async () => {
    try {
      setIsCopied(false);
      const tabInfor = await getAcitveWindow();
      if (!tabInfor?.id) {
        alert("No active tab found");
        return;
      }

      // Inject the copy functionality and keyboard listener into the page
      await excuteScript(
        tabInfor.id,
        () => {
          // Function to copy current slide
          async function copySlideToClipboard() {
            try {
              console.log('[Injected] Copy slide triggered');

              function getSlideAtTime(slides: any[], currentTimeInSeconds: number) {
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
              let batchSlug = url.searchParams.get("batchSlug");
              const subjectSlug = url.searchParams.get("subjectSlug");
              const scheduleId = url.searchParams.get("scheduleId");
              const token = localStorage.getItem("token");

              console.log('[Injected] URL Params:', { batchSlug, subjectSlug, scheduleId, token: !!token });

              // If batchSlug is a text slug (not numeric), use parentId instead
              if (batchSlug && !/^\d+$/.test(batchSlug)) {
                const parentId = url.searchParams.get("parentId");
                console.log('[Injected] batchSlug is text, using parentId:', parentId);
                if (parentId) {
                  batchSlug = parentId;
                }
              }

              if (!token || !batchSlug || !subjectSlug || !scheduleId) {
                alert("Missing required parameters. Make sure:\n1. Token is set\n2. You're on a pw.live lecture page\n3. All URL parameters are present");
                return;
              }

              // Fetch slides from API
              const apiUrl = `https://api.penpencil.co/v1/batches/${batchSlug}/subject/${subjectSlug}/schedule/${scheduleId}/slides`;
              console.log('[Injected] Fetching from API:', apiUrl);
              
              const response = await fetch(apiUrl, {
                headers: {
                  authorization: `Bearer ${token}`,
                  Referer: "https://www.pw.live/",
                },
              });

              console.log('[Injected] API Response status:', response.status);
              
              if (!response.ok) throw new Error(`API failed: ${response.status}`);

              const data = await response.json();
              console.log('[Injected] Slides received:', data.data.slides?.length);
              
              const slides = data.data.slides;

              // Get current video time and find matching slide
              const video = document.querySelector("video") as HTMLVideoElement;
              const currentTime = (video?.currentTime || 0) + 210;
              console.log('[Injected] Current time:', currentTime);
              
              const currentSlide = getSlideAtTime(slides, currentTime);
              const imageUrl = currentSlide.img.baseUrl + currentSlide.img.key;
              console.log('[Injected] Image URL:', imageUrl);

              // Fetch image
              const responseImg = await fetch(imageUrl);
              if (!responseImg.ok) throw new Error(`Fetch failed: ${responseImg.status}`);
              const blob = await responseImg.blob();

              // Convert to PNG and copy to clipboard
              const pngBlob: Blob = await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                  const canvas = document.createElement("canvas");
                  canvas.width = img.width;
                  canvas.height = img.height;
                  canvas.getContext("2d")!.drawImage(img, 0, 0);
                  canvas.toBlob(
                    (b) => (b ? resolve(b) : reject(new Error("Canvas toBlob failed"))),
                    "image/png"
                  );
                };
                img.onerror = () => reject(new Error("Image load failed"));
                img.src = URL.createObjectURL(blob);
              });

              await navigator.clipboard.write([new ClipboardItem({ "image/png": pngBlob })]);
              console.log('[Injected] ✓ Slide copied to clipboard!');
              // alert("✓ Slide copied to clipboard! (Use Shift+Alt+C next time)");
            } catch (error) {
              console.error('[Injected] Error:', error);
              alert("Error: " + (error instanceof Error ? error.message : "Unknown error"));
            }
          }

          // Listen for Shift + Alt + C keyboard shortcut
          document.onkeyup = function (e) {
            const evt = (window.event || e) as KeyboardEvent;
            // 67 = 'C' key
            if (evt.keyCode == 67 && evt.altKey && evt.shiftKey) {
              console.log('[Injected] Shift+Alt+C pressed');
              copySlideToClipboard();
            }
          };

          console.log('[Injected] ✓ Slide copy shortcut setup complete! (Shift+Alt+C ready)');
          // alert("✓ Setup complete! Now use Shift+Alt+C to copy slides");
        },
        []
      );

      setIsSetup(true);
    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  const handleCopyNow = async () => {
    try {
      setIsCopied(false);
      const tabInfor = await getAcitveWindow();
      if (!tabInfor?.id) {
        alert("No active tab found");
        return;
      }

      // Copy immediately
      await excuteScript(
        tabInfor.id,
        async () => {
          function getSlideAtTime(slides: any[], currentTimeInSeconds: number) {
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

          try {
            const url = new URL(window.location.href);
            let batchSlug = url.searchParams.get("batchSlug");
            const subjectSlug = url.searchParams.get("subjectSlug");
            const scheduleId = url.searchParams.get("scheduleId");
            const token = localStorage.getItem("token");

            if (batchSlug && !/^\d+$/.test(batchSlug)) {
              const parentId = url.searchParams.get("parentId");
              if (parentId) {
                batchSlug = parentId;
              }
            }

            if (!token || !batchSlug || !subjectSlug || !scheduleId) {
              throw new Error("Missing required parameters");
            }

            const response = await fetch(
              `https://api.penpencil.co/v1/batches/${batchSlug}/subject/${subjectSlug}/schedule/${scheduleId}/slides`,
              {
                headers: {
                  authorization: `Bearer ${token}`,
                  Referer: "https://www.pw.live/",
                },
              }
            );
            
            if (!response.ok) throw new Error(`API failed: ${response.status}`);
            
            const data = await response.json();
            const slides = data.data.slides;

            const video = document.querySelector("video") as HTMLVideoElement;
            const currentTime = (video?.currentTime || 0) + 210;
            const currentSlide = getSlideAtTime(slides, currentTime);
            const imageUrl = currentSlide.img.baseUrl + currentSlide.img.key;
            return imageUrl;
          } catch (e: any) {
            throw new Error(e.message);
          }
        },
        []
      );

      // Show feedback
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button onClick={handleSetupShortcut}>
        {isSetup ? "✓ Setup Done" : "Setup (Shift+Alt+C)"}
      </button>
      <button onClick={handleCopyNow}>
        {isCopied ? "Copied!" : "Copy Now"}
      </button>
    </div>
  );
};

export default slideImageCopier;