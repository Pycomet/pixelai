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
import {
  Dropdown,
  DropdownTrigger,
  DropdownSection,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, HeartFilledIcon } from "@/components/icons";
import { Avatar } from "@nextui-org/avatar";

import { signOut } from "@/lib/firebase/auth";
import { useUser } from "@/contexts/userContext";
import { usePathname } from "next/navigation";
import { defaultRoutes } from "@/config/routes";
import Logo from "@/components/logo";

export const Navbar = () => {
  const { user, toggleLogin, loading } = useUser();
  const pathname = usePathname();

  const renderDropdown = () => {
    return (
      <Dropdown showArrow>
        <DropdownTrigger>
          <Avatar
            isBordered
            className="cursor-pointer"
            as={Link}
            src={user?.photoURL as string}
          />
        </DropdownTrigger>
        <DropdownMenu variant="flat">
          <DropdownSection title={`Hi, ${user?.displayName}`} showDivider>
            <DropdownItem
              key="dashboard"
              className="text-right"
              as={NextLink}
              href="/dashboard"
            >
              Dashboard
            </DropdownItem>
            <DropdownItem key="profile" className="text-right">
              Profile
            </DropdownItem>
            <DropdownItem key="history" className="text-right">
              Settings
            </DropdownItem>
          </DropdownSection>
          <DropdownSection>
            <DropdownItem
              key="logout"
              className="text-right"
              onClick={() => signOut()}
            >
              Sign out
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    );
  };

  if (pathname === (defaultRoutes?.register?.path as string)) {
    return null;
  } else {
    return (
      <NextUINavbar maxWidth="xl" position="sticky">
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <Logo />
          </NavbarBrand>
          <ul className="hidden lg:flex gap-4 justify-start ml-2">
            {siteConfig.navItems.map(
              (item: { href: string; label: string }) => (
                <NavbarItem key={item.href}>
                  <NextLink
                    className={clsx(
                      linkStyles({ color: "foreground" }),
                      "data-[active=true]:text-primary data-[active=true]:font-medium"
                    )}
                    color="foreground"
                    href={item.href}
                  >
                    {item.label}
                  </NextLink>
                </NavbarItem>
              )
            )}
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
            <>
              <NavbarItem className="hidden md:flex gap-2">
                <Button
                  onPress={() => toggleLogin()}
                  className="bg-gradient-to-tr from-yellow-500 dark:from-pink-500 dark:to-yellow-500 to-pink-500 text-sm font-normal"
                  isLoading={loading}
                >
                  Sign In
                </Button>
              </NavbarItem>
            </>
          ) : (
            <NavbarItem className="flex gap-2">{renderDropdown()}</NavbarItem>
          )}
          <NavbarItem className="hidden md:flex">
            <Button
              isExternal
              as={Link}
              className="text-sm font-normal text-default-600 bg-default-100"
              href={siteConfig.links.sponsor}
              startContent={<HeartFilledIcon className="text-danger" />}
              variant="flat"
            />
          </NavbarItem>
        </NavbarContent>

        <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
          {!user ? <NavbarMenuToggle /> : renderDropdown()}
        </NavbarContent>

        <NavbarMenu>
          <div className="mx-4 mt-2 flex flex-col gap-2 text-center">
            {siteConfig.navMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  color="foreground"
                  href={item.href}
                  size="lg"
                  className="hover:text-red-500"
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))}
            <br />
            <NavbarMenuItem key="button">
              {!user ? (
                <Button
                  onPress={() => {
                    !user ? toggleLogin() : signOut();
                  }}
                  className="bg-gradient-to-tr from-yellow-500 dark:from-pink-500 dark:to-yellow-500 to-pink-500 text-sm font-normal"
                  isLoading={loading}
                >
                  {user ? "Log Out" : "Log In"}
                </Button>
              ) : (
                renderDropdown()
              )}
            </NavbarMenuItem>
          </div>
        </NavbarMenu>
      </NextUINavbar>
    );
  }
};

export default Navbar;
