"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react";
import { AnimatedDiv } from "@/components/motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUser } from "@/contexts/userContext";
import { MailIcon, LockIcon, GoogleIcon, GithubIcon } from "@/components/icons";
import { button, errorMessage } from "@/components/primitives";
import {
  signInWithGoogle,
  signInWithPassword,
  signInWithGithub,
} from "@/lib/firebase/auth";
import * as yup from "yup";
import { useMessage } from "@/contexts/messageContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { defaultRoutes } from "@/config/routes";

const loginFormSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please input a valid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
  remember: yup.boolean().default(false),
});

type LoginFormData = {
  email: string;
  password: string;
  remember: boolean;
};

export const LoginComponent = () => {
  const { showLogin, toggleLogin } = useUser();
  const { message } = useMessage();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginFormSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    // TODO: Add Remember me functionality
    setLoading(true);

    const user = await signInWithPassword(data.email, data.password);

    setTimeout(() => {
      setLoading(false);
      reset();
    }, 2000);

    if (user) {
      router.push("/dashboard"); // adjust the path as needed
    } else {
      message(
        "Failed to sign in. Please check your credentials and try again.",
        "error"
      );
    }
  };

  return (
    <AnimatedDiv>
      <Modal
        isOpen={showLogin}
        onOpenChange={() => toggleLogin()}
        placement="top-center"
        backdrop="blur"
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1 className="font-black">Login</h1>
                <p className="font-normal text-xs">
                  Don&apos;t have an account?{" "}
                  <Link
                    href={defaultRoutes.register.path}
                    size="sm"
                    className="cursor-pointer text-xs"
                  >
                    Sign Up
                  </Link>
                </p>
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-2"
                >
                  <Input
                    {...register("email", { required: true })}
                    autoFocus
                    endContent={
                      <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    label="Email"
                    placeholder="Enter your email"
                    variant="bordered"
                  />
                  {errors.email && (
                    <p className={errorMessage()}>{errors.email.message}</p>
                  )}
                  <Input
                    {...register("password", { required: true })}
                    endContent={
                      <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    variant="bordered"
                  />
                  {errors.password && (
                    <p className={errorMessage()}>{errors.password.message}</p>
                  )}
                  <div className="flex py-2 px-1 justify-between">
                    <Checkbox
                      classNames={{
                        label: "text-small",
                      }}
                      {...register("remember")}
                    >
                      Remember me
                    </Checkbox>
                    <Link
                      color="primary"
                      href="#"
                      size="sm"
                      className="font-normal text-xs"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Button
                    isLoading={loading}
                    className={`${button({ hideOnMobile: true })} uppercase justify-center w-auto px-[5em] mx-auto`}
                    type="submit"
                  >
                    Login
                  </Button>
                  <hr className="mx-20" />
                  <p className="mt-2 font-normal text-xs text-center">
                    Or Sign In Using
                  </p>
                  <div className="flex flex-row justify-center gap-2">
                    <GoogleIcon
                      className="cursor-pointer"
                      onClick={() => signInWithGoogle()}
                    />
                    <GithubIcon
                      className="cursor-pointer"
                      onClick={() => signInWithGithub()}
                    />
                  </div>
                </form>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </AnimatedDiv>
  );
};

export default LoginComponent;
