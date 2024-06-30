import { tv } from "tailwind-variants";

export const title = tv({
  base: "tracking-tight inline font-semibold font-mono",
  variants: {
    color: {
      violet: "from-[#FF1CF7] to-[#b249f8]",
      yellow: "from-[#FF705B] to-[#FFB457]",
      blue: "from-[#5EA2EF] to-[#0072F5]",
      cyan: "from-[#00b7fa] to-[#01cfea]",
      green: "from-[#6FEE8D] to-[#17c964]",
      pink: "from-[#FF72E1] to-[#F54C7A]",
      foreground: "dark:from-[#FFFFFF] dark:to-[#4B4B4B]",
    },
    size: {
      xs: "text-xl lg:text-2xl",
      sm: "text-3xl lg:text-4xl",
      md: "text-[2rem] lg:text-5xl leading-9",
      lg: "text-4xl lg:text-6xl",
    },
    fullWidth: {
      true: "w-full block",
    },
  },
  defaultVariants: {
    size: "md",
  },
  compoundVariants: [
    {
      color: [
        "violet",
        "yellow",
        "blue",
        "cyan",
        "green",
        "pink",
        "foreground",
      ],
      class: "bg-clip-text text-transparent bg-gradient-to-b",
    },
  ],
});

export const subtitle = tv({
  base: "w-full md:w-1/2 my-2 text-md lg:text-lg text-default-600 block max-w-full",
  variants: {
    fullWidth: {
      true: "!w-full",
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});

export const button = tv({
  base: "text-xs md:test-sm lg:text-md text-default-600 font-normal hover:opacity-50 ",
  variants: {
    color: {
      gradient:
        "bg-gradient-to-tr from-yellow-500 dark:from-pink-500 dark:to-yellow-500 to-pink-500",
      blue: "bg-gradient-to-tr from-[#5EA2EF] to-[#0072F5]",
      cyan: "bg-gradient-to-tr from-[#00b7fa] to-[#01cfea]",
      pink: "bg-gradient-to-tr from-[#FF72E1] to-[#F54C7A]",
      primary: "bg-primary",
      secondary: "bg-secondary",
    },
    hideOnMobile: {
      true: "hidden md:flex",
    },
  },
  defaultVariants: {
    color: "gradient",
  },
});

export const errorMessage = tv({
  base: "text-xs lg:text-sm text-[#FF0000] pl-[1em] text-left",
});
