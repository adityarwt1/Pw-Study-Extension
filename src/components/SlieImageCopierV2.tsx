import { useState } from "react";

// interface SlideImg {
//   _id: string;
//   name: string;
//   baseUrl: string;
//   key: string;
// }

// interface Slide {
//   _id: string;
//   scheduleId: string;
//   scheduleIds: string[];
//   serialNumber: number;
//   name: string;
//   img: SlideImg;
//   imageUrl: string;
//   solutionUrls: string[];
//   solutionVerified: boolean;
//   isCompleted: boolean;
//   timeStamp: string;
//   slug: string;
//   status: string;
  // slideVisited: boolean;
//   slideForTimeline: boolean;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   updatedBy: string;
// }

const slideImageCopier = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const handleCopyCurrentSlide = async () => {
    try {
      setIsCopying(true);
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab?.id) {
        alert("No active tab found");
        setIsCopying(false);
        return;
      }

      // Step 1: Run script in page context to get slide image URL
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        func: async () => {

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

            // If batchSlug is a text slug (not numeric), use parentId instead
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

            const video = document.querySelector("video");
            const currentTime = (video?.currentTime || 0)  +210;
            const currentSlide = getSlideAtTime(slides, currentTime);
            const imageUrl = currentSlide.img.baseUrl + currentSlide.img.key;
            return imageUrl;
          } catch (e: any) {
            throw new Error(e.message);
          }
        },
      });

      const imageUrl = results[0]?.result as string;
      if (!imageUrl) {
        alert("Could not get image URL. Make sure:\n1. You're on a pw.live lecture page\n2. Token is set\n3. Video is playing");
        setIsCopying(false);
        return;
      }

      // Step 2: Fetch image and copy in extension context (has clipboard access)
      const responseImg = await fetch(imageUrl);
      if (!responseImg.ok) throw new Error(`Fetch failed: ${responseImg.status}`);
      const blob = await responseImg.blob();

      // Convert to PNG
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
      setIsCopied(true);
      setIsCopying(false);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      setIsCopying(false);
      console.error("Error:", error);
      alert("Error: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  return (
    <button onClick={handleCopyCurrentSlide} disabled={isCopying}>
      {isCopying ? "Copying..." : isCopied ? "Copied" : "Copy!"}
    </button>
  );
};

export default slideImageCopier;