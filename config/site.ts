export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "PixelAI - AI Thumbnail Generator",
  description:
    "Using AI to create engaging thumbnails for online content using advanced language models and image processing. Streamlines the thumbnail creation workflow and enhances visual presentation to boost engagement.",
  navItems: [
    // {
    //   label: "Home",
    //   href: "/",
    // },
    // {
    //   label: "Pricing",
    //   href: "/pricing",
    // },
  ],
  navMenuItems: [
    // {
    //   label: "Home",
    //   href: "/",
    // },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/pycomet",
    docs: "https://github.com/pycomet",
    sponsor: "https://patreon.com/jrgarciadev", // TODO: Add Patreon Account
  },
  searchTopics: [
    "How to make your first $1000",
    "The #1 secret to a desirable outcome",
    "The hidden benefits of keeping a routing",
  ],
};
