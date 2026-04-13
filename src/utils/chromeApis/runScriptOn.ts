export const excuteScript = async (
  tabId: number,
  func: (...args: unknown[]) => void,
  args: unknown[] = [],
) => {
  await chrome.scripting.executeScript({
    target: { tabId },
    func,
    args,
  });
};