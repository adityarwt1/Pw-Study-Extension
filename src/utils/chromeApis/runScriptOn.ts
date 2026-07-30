export const excuteScript = async <T extends unknown[], R = unknown>(
  tabId: number,
  func: (...args: T) => R | Promise<R>,
  args: T = [] as unknown as T,
): Promise<R | undefined> => {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func,
    args,
  });

  return results?.[0]?.result as R | undefined;
};