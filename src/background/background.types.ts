export interface ITab extends browser.tabs.Tab {
  id: number;
  title: string;
  url: string;
}
