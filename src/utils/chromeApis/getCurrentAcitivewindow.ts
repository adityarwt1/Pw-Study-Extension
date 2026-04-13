export const getAcitveWindow = async (): Promise<chrome.tabs.Tab | null> => {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  return tabs[0] ?? null;
};