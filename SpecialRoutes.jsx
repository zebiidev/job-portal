"use client";

import { usePathname } from "next/navigation";

const SpecialRoutes = ({
  children,
  hideOn = ["/login", "/signup", "/dashboard"],
}) => {
  const pathname = usePathname();

  const isSpecialRoute = hideOn.some((route) => pathname.startsWith(route));

  if (isSpecialRoute) return null;

  return children;
};

export default SpecialRoutes;
