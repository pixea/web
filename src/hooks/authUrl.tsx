import { usePathname } from "next/navigation";

const useAuthUrl = () => {
  const pathname = usePathname();

  // Do not redirect to the login page if the user is already on the login page
  if (pathname.includes("/auth")) {
    return "/auth";
  }

  return `/auth?redirect=${encodeURIComponent(pathname)}` as "/auth";
};

export default useAuthUrl;
