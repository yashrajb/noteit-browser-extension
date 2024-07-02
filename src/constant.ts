import twitterLogo from "@app/assets/twitter.png";
import githubLogo from "@app/assets/github.svg";
import bmcLogo from "@app/assets/bmc-logo.svg";

export const MAIN_URL = "https://notesit.netlify.app";
export interface ILinks {
  title: string;
  href: string;
  imgSrc: string;
}

export const EVENTS = {
  SELECTION: "SELECTION",
  SHAREDNOTE: "SHARED_NOTE",
};

export const links: ILinks[] = [
  {
    title: "twitter",
    href: `https://twitter.com/intent/tweet?text=Note it is a simple chrome extension that saves the content of the webpage. You can also share the link of your content and also you can export saved content as a text file ${MAIN_URL} (via @yashrajbasan1)`,
    imgSrc: twitterLogo,
  },
  {
    title: "BMC logo",
    href: "https://www.buymeacoffee.com/yashrajbasandev",
    imgSrc: bmcLogo,
  },
  {
    title: "Github",
    href: "https://github.com/yashrajb/noteit-browser-extension",
    imgSrc: githubLogo,
  },
];