"use client";
// import { useUser } from "@/contexts/userContext";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
import LoginComponent from "../forms/login";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  // const { user } = useUser();
  // const router = useRouter();

  // useEffect(() => {
  //   if (user) {
  //     router.push("/dashboard");
  //   }
  // }, [router, user]);

  return (
    <section>
      <LoginComponent />
      {children}
    </section>
  );
};

export default AuthWrapper;
