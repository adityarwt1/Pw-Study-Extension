import { renderToStaticMarkup } from "react-dom/server";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { getAcitveWindow } from "../utils/chromeApis/getCurrentAcitivewindow";

const togglePageScrollControls = (upIcon: string, downIcon: string) => {
  const controlsId = "pw-page-scroll-controls";
  const controlsVersion = "3";
  const existingControls = document.getElementById(controlsId);
  if (existingControls) {
    if (existingControls.getAttribute("data-version") === controlsVersion) {
      existingControls.dispatchEvent(new Event("pw-scroll-stop"));
      existingControls.remove();
      return;
    }

    existingControls.dispatchEvent(new Event("pw-scroll-stop"));
    existingControls.remove();
  }

  const host = document.createElement("div");
  host.id = controlsId;
  host.setAttribute("data-version", controlsVersion);
  const shadowRoot = host.attachShadow({ mode: "open" });
  shadowRoot.innerHTML = `
    <style>
      .controls {
        position: fixed;
        right: 24px;
        bottom: 24px;
        z-index: 2147483647;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      button {
        display: grid;
        width: 48px;
        height: 48px;
        place-items: center;
        padding: 0;
        border: 1px solid rgba(255, 255, 255, 0.24);
        border-radius: 50%;
        background: #18181b;
        color: #fff;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
        cursor: pointer;
        touch-action: none;
        user-select: none;
      }

      button:hover {
        background: #38383f;
      }

      button:focus-visible {
        outline: 2px solid #c084fc;
        outline-offset: 3px;
      }

      svg {
        width: 18px;
        height: 18px;
      }
    </style>
    <div class="controls">
      <button type="button" aria-label="Scroll up" title="Scroll up">${upIcon}</button>
      <button type="button" aria-label="Scroll down" title="Scroll down">${downIcon}</button>
    </div>
  `;

  const [upButton, downButton] = shadowRoot.querySelectorAll("button");
  let animationFrame = 0;
  let activeButton: HTMLButtonElement | null = null;

  const stopScrolling = () => {
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    activeButton = null;
  };

  const startScrolling = (button: HTMLButtonElement, direction: -1 | 1) => (event: PointerEvent) => {
    if (event.button !== 0 || activeButton) return;
    event.preventDefault();

    const viewportArea = Math.max(1, window.innerWidth * window.innerHeight);
    const scrollableElements = Array.from(document.querySelectorAll<HTMLElement>("*"))
      .filter((element) => {
        if (host.contains(element) || element.clientHeight === 0) return false;

        const style = window.getComputedStyle(element);
        const maxScroll = element.scrollHeight - element.clientHeight;
        const canScrollVertically =
          element === document.scrollingElement ||
          ["auto", "scroll", "overlay", "hidden"].includes(style.overflowY);
        const canScrollInDirection = direction > 0
          ? element.scrollTop < maxScroll - 1
          : element.scrollTop > 1;

        return canScrollVertically && maxScroll > 1 && canScrollInDirection;
      })
      .map((element) => {
        const bounds = element.getBoundingClientRect();
        const visibleWidth = Math.max(0, Math.min(bounds.right, window.innerWidth) - Math.max(bounds.left, 0));
        const visibleHeight = Math.max(0, Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0));
        const visibleAreaRatio = (visibleWidth * visibleHeight) / viewportArea;
        const isMainContent = element.matches("main, article, [role='main']");

        return {
          element,
          score:
            (element.scrollHeight - element.clientHeight) *
            visibleAreaRatio *
            (isMainContent ? 2 : 1),
        };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score);

    const target = scrollableElements[0]?.element ?? document.scrollingElement;
    if (!target) return;

    activeButton = button;
    button.setPointerCapture(event.pointerId);
    const startedAt = performance.now();
    let previousFrameAt = startedAt;

    const scroll = (now: number) => {
      if (activeButton !== button) return;

      const elapsedSeconds = (now - startedAt) / 1000;
      const frameSeconds = Math.min((now - previousFrameAt) / 1000, 0.05);
      previousFrameAt = now;
      const speed = Math.min(1800, 220 + elapsedSeconds * 700);
      const currentScrollTop = target.scrollTop;
      const maxScroll = target.scrollHeight - target.clientHeight;
      const nextScrollTop = Math.max(
        0,
        Math.min(maxScroll, currentScrollTop + direction * speed * frameSeconds),
      );

      if (nextScrollTop === currentScrollTop) {
        stopScrolling();
        return;
      }

      target.scrollTop = nextScrollTop;
      animationFrame = window.requestAnimationFrame(scroll);
    };

    animationFrame = window.requestAnimationFrame(scroll);
  };

  upButton.addEventListener("pointerdown", startScrolling(upButton, -1));
  downButton.addEventListener("pointerdown", startScrolling(downButton, 1));
  for (const button of [upButton, downButton]) {
    button.addEventListener("pointerup", stopScrolling);
    button.addEventListener("pointercancel", stopScrolling);
    button.addEventListener("lostpointercapture", stopScrolling);
  }
  window.addEventListener("blur", stopScrolling);
  host.addEventListener("pw-scroll-stop", stopScrolling);
  document.documentElement.appendChild(host);
};

const PageScrollControls = () => {
  const toggleControls = async () => {
    try {
      const activeTab = await getAcitveWindow();
      if (activeTab?.id === undefined) {
        throw new Error("No active browser tab found.");
      }

      await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: togglePageScrollControls,
        args: [
          renderToStaticMarkup(<FaArrowUp aria-hidden="true" />),
          renderToStaticMarkup(<FaArrowDown aria-hidden="true" />),
        ],
      });
    } catch (error) {
      console.error("Failed to toggle page scroll controls:", error);
    }
  };

  return (
    <button onClick={toggleControls} title="Toggle page scroll buttons">
      Scroll Page
    </button>
  );
};

export default PageScrollControls;
