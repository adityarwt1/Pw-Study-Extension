import { useEffect, useState } from "react";

const YOUTUBE_BLOCKED_KEY = "youtubeBlocked";

const YouTubeBlocker = () => {
  const [youtubeBlocked, setYoutubeBlocked] = useState(true);

  useEffect(() => {
    chrome.storage.local.get(YOUTUBE_BLOCKED_KEY).then((data) => {
      setYoutubeBlocked(Boolean(data[YOUTUBE_BLOCKED_KEY] ?? true));
    });
  }, []);

  const toggleYouTubeBlock = async () => {
    const nextValue = !youtubeBlocked;
    await chrome.storage.local.set({ [YOUTUBE_BLOCKED_KEY]: nextValue });
    setYoutubeBlocked(nextValue);
  };

  return (
    <button onClick={toggleYouTubeBlock}>
      {youtubeBlocked ? "Allow YouTube" : "Block YouTube"}
    </button>
  );
};

export default YouTubeBlocker;