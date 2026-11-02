const YOUTUBE_TOPICS_KEY = "youtubeTopics";
const VIDEO_CARD_SELECTOR = [
  "ytd-rich-item-renderer",
  "ytd-video-renderer",
  "ytd-compact-video-renderer",
  "ytd-grid-video-renderer",
  "ytd-reel-item-renderer",
].join(",");

let topics = [];
let scheduled = false;

const filterVideoCards = () => {
  scheduled = false;

  document.querySelectorAll(VIDEO_CARD_SELECTOR).forEach((card) => {
    const text = (card.textContent ?? "").toLocaleLowerCase();
    const shouldShow =
      topics.length === 0 || topics.some((topic) => text.includes(topic));

    if (shouldShow) {
      card.removeAttribute("data-pw-topic-filter-hidden");
    } else {
      card.setAttribute("data-pw-topic-filter-hidden", "true");
    }
  });
};

const scheduleFilter = () => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(filterVideoCards);
};

const applyTopics = (value) => {
  topics = (typeof value === "string" ? value : "")
    .split(",")
    .map((topic) => topic.trim().toLocaleLowerCase())
    .filter(Boolean);
  scheduleFilter();
};

const style = document.createElement("style");
style.textContent =
  '[data-pw-topic-filter-hidden="true"] { display: none !important; }';
(document.head ?? document.documentElement).appendChild(style);

chrome.storage.local
  .get(YOUTUBE_TOPICS_KEY)
  .then((data) => applyTopics(data[YOUTUBE_TOPICS_KEY]))
  .catch((error) => {
    console.error("[YouTube topic filter] Failed to load saved topics:", error);
  });

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes[YOUTUBE_TOPICS_KEY]) {
    applyTopics(changes[YOUTUBE_TOPICS_KEY].newValue);
  }
});

new MutationObserver(scheduleFilter).observe(document.documentElement, {
  childList: true,
  subtree: true,
});
