export interface ITab extends chrome.tabs.Tab {
  id: number;
  title: string;
  url: string;
}
