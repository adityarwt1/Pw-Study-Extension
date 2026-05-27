// This runs in the browser context (content script)

const slides = [
  {
    _id: "6a16cb2f2a62d83fdc7951c1",
    scheduleId: "6a15e27a4c450d279cd99e3c",
    serialNumber: 1,
    name: "slide-1",
    img: {
      _id: "6a16ccfae2ecde82a0836fa8",
      name: "file.png",
      baseUrl: "https://static.pw.live/",
      key: "5eb393ee95fab7468a79d189/49ab6b6e-7612-4acf-a055-05d40377a554.png",
    },
    timeStamp: "1",
    status: "Active",
  },
  // ... more slides
];

// Get current slide based on video timestamp
function getSlideNumber(slides) {
  const videoElement = document.querySelector("video");
  const currentTimeInSeconds = videoElement ? Math.floor(videoElement.currentTime) : 0;

  let low = 0;
  let high = slides.length - 1;
  let result = 0;

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    const slideTimestamp = parseInt(slides[mid].timeStamp);

    if (slideTimestamp <= currentTimeInSeconds) {
      result = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return slides[result];
}

// Convert image blob to PNG
const convertToPng = (blob) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d").drawImage(img, 0, 0);
    canvas.toBlob(resolve, "image/png");
  };
  img.onerror = () => reject(new Error("Failed to load image"));
  img.src = URL.createObjectURL(blob);
});

// Main copy function - WORKING VERSION
const copyImage = async () => {
  try {
    const currentSlide = getSlideNumber(slides);
    const imageUrl = currentSlide.img.baseUrl + currentSlide.img.key;

    console.log("Copying slide:", currentSlide.name);
    
    // Fetch image
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Failed to fetch image");
    
    const blob = await response.blob();
    
    // Convert to PNG
    const pngBlob = await convertToPng(blob);

    // Copy to clipboard
    const item = new ClipboardItem({ "image/png": pngBlob });
    await navigator.clipboard.write([item]);

    console.log("✅ Image copied to clipboard!");
    return { success: true, slide: currentSlide.name };
  } catch (error) {
    console.error("❌ Error copying image:", error);
    return { success: false, error: error.message };
  }
};

// Export for use in extension
window.copySlideImage = copyImage;

// Listen for message from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copySlide") {
    copyImage().then(sendResponse);
    return true; // Keep channel open for async response
  }
});
