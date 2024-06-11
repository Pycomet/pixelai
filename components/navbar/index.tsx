"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import Image from "next/image";
import {
    Dropdown,
    DropdownTrigger,
    DropdownSection,
    DropdownMenu,
    DropdownItem
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  GithubIcon,
  HeartFilledIcon,
} from "@/components/icons";
import { signInWithGoogle, signOut } from "@/lib/firebase/auth";
import { Avatar } from "@nextui-org/avatar";
import { useUser } from "@/contexts/userContext";
import LogoImage from "@/assets/logo.png";
import { AnimatedDiv } from "../motion";


export const Navbar = () => {

  const { user, loading } = useUser();

  const handleSignIn = async () => {
      await signInWithGoogle();
  };

  const handleSignOut = async () => {
      await signOut();
  };

  return (
    <NextUINavbar maxWidth="2xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <AnimatedDiv>
              <Image
                src={LogoImage.src}
                width={200}
                height={200}
                alt="PixelAI"
                className="justify-start mt-2"
              />
            </AnimatedDiv>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item: { href: string, label: string }) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        
        {!user ? (
          <NavbarItem className="hidden md:flex gap-2">
            <Button
              onClick={handleSignIn}
              className="bg-gradient-to-tr from-yellow-500 dark:from-pink-500 dark:to-yellow-500 to-pink-500 text-sm font-normal"
              isLoading={loading}
            >
              Sign In
            </Button>
          </NavbarItem>) : (
            <NavbarItem className="hidden md:flex gap-2">
                <Dropdown showArrow>
                    <DropdownTrigger>
                        <Avatar isBordered className="cursor-pointer" as={Link} src={"https://i.pravatar.cc/150?u=a042581f4e29026024d"} />
                    </DropdownTrigger>
                    <DropdownMenu variant="flat">
                        <DropdownSection title={`Hi, ${user.displayName}`} showDivider>
                            <DropdownItem
                                key="profile"
                                className="text-center"
                            >
                                Profile
                            </DropdownItem>
                            <DropdownItem
                                key="history"
                                className="text-center"
                            >
                                History
                            </DropdownItem>
                        </DropdownSection>
                        <DropdownSection>
                            <DropdownItem
                                key="logout"
                                onClick={handleSignOut}
                                className="text-center"
                            >
                                Log Out 
                            </DropdownItem>
                        </DropdownSection>

                    </DropdownMenu>
                </Dropdown>
            </NavbarItem>
          )
        }
        <NavbarItem className="hidden md:flex">
          <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.sponsor}
            startContent={<HeartFilledIcon className="text-danger" />}
            variant="flat"
          >
            Sponsor
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};

export default Navbar;