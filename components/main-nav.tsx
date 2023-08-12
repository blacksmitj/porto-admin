"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();

  const routes = [
    {
      href: `/`,
      label: "Overview",
      active: pathname === `/`,
    },
    {
      href: `/works`,
      label: "Works",
      active: pathname === `/works`,
    },
    {
      href: `/projects`,
      label: "Projects",
      active: pathname === `/projects`,
    },
    {
      href: `/educations`,
      label: "Educations",
      active: pathname === `/educations`,
    },
    {
      href: `/roles`,
      label: "Roles",
      active: pathname === `/roles`,
    },
    {
      href: `/skills`,
      label: "Skills",
      active: pathname === `/skills`,
    },
    {
      href: `/settings`,
      label: "Settings",
      active: pathname === `/settings`,
    },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <Link
          href={route.href}
          key={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
