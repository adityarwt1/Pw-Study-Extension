export const excuteScript = async <T extends unknown[]>(
  tabId: number,
  func: (...args: T) => void,
  args: T = [] as unknown as T,
) => {
  await chrome.scripting.executeScript({
    target: { tabId },
    func,
    args,
  });
};