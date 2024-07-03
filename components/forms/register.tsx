"use client";
import { useCallback, useState } from "react";
import { Button, Checkbox, Input } from "@nextui-org/react";
import { AnimatedDiv } from "@/components/motion";
import {
  MailIcon,
  LockIcon,
  GoogleIcon,
  GithubIcon,
  UnlockIcon,
} from "@/components/icons";
import { signInWithGoogle, signInWithGithub } from "@/lib/firebase/auth";
import { button, errorMessage, title } from "@/components/primitives";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const registerFormSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
  subscribe: yup.boolean().default(false),
});

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  subscribe: boolean;
};

export const RegisterComponent = () => {
  // const { message } = useMessage();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerFormSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);

    console.log(data);

    setTimeout(() => {
      setLoading(false);
      reset();
    }, 2000);
  };

  const PasswordIcon = useCallback(() => {
    if (showPassword) {
      return (
        <UnlockIcon
          onClick={() => setShowPassword(!showPassword)}
          className="hover:cursor-pointer text-2xl text-default-400 pointer-events-none flex-shrink-0"
        />
      );
    } else {
      return (
        <LockIcon
          onClick={() => setShowPassword(!showPassword)}
          className="hover:cursor-pointer text-2xl text-default-400 pointer-events-none flex-shrink-0"
        />
      );
    }
  }, [showPassword]);

  return (
    <AnimatedDiv className="w-2/3 md:w-[30em] gap-2">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <h1 className={`${title({ size: "xs" })} text-center`}>
          Create A New Account
        </h1>
        <br />
        <Input
          {...register("name", { required: true })}
          autoFocus
          label="Name"
          placeholder="Enter your full name"
          variant="bordered"
        />
        {errors.name && <p className={errorMessage()}>{errors.name.message}</p>}
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
          endContent={<PasswordIcon />}
          label="Password"
          placeholder="Enter your password"
          type={showPassword ? "text" : "password"}
          variant="bordered"
        />
        {errors.password && (
          <p className={errorMessage()}>{errors.password.message}</p>
        )}
        <Input
          {...register("confirmPassword", { required: true })}
          endContent={<PasswordIcon />}
          label="Confirm Password"
          placeholder="Enter your password again"
          type={showPassword ? "text" : "password"}
          variant="bordered"
        />
        {errors.confirmPassword && (
          <p className={errorMessage()}>{errors.confirmPassword.message}</p>
        )}
        <div className="flex flex-col py-2 px-1 gap-2">
          <Checkbox
            classNames={{
              label: "text-small",
            }}
          >
            I agree to the terms and conditions
          </Checkbox>
          <Checkbox
            {...register("subscribe", { required: true })}
            classNames={{
              label: "text-small",
            }}
          >
            Subscribe to get updates
          </Checkbox>
        </div>
        <Button
          isLoading={loading}
          className={`${button({ hideOnMobile: false })} uppercase justify-center w-auto px-[5em] mx-auto`}
          type="submit"
        >
          Register
        </Button>
        <p className="mt-2 font-normal text-xs text-center">Or Sign Up Using</p>
        <div className="flex flex-row justify-center gap-2">
          <GoogleIcon
            size={50}
            className="cursor-pointer"
            onClick={() => signInWithGoogle()}
          />
          <GithubIcon
            size={50}
            className="cursor-pointer"
            onClick={() => signInWithGithub()}
          />
        </div>
      </form>
    </AnimatedDiv>
  );
};

export default RegisterComponent;
