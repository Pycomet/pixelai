"use client";
import { React } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link } from "@nextui-org/react";
import { AnimatedDiv } from "@/components/motion";
import { useUser } from "@/contexts/userContext";
import {
    MailIcon,
    LockIcon,
    GoogleIcon,
    YoutubeIcon,
    GithubIcon
} from "@/components/icons";
import { button } from "@/components/primitives";
import {
    signInWithGoogle,
    signInWithGithub
} from "@/lib/firebase/auth";

export const LoginComponent = () => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const { user, loading } = useUser();

    return (
        <AnimatedDiv>
              <Button
                onPress={onOpen}
                className="bg-gradient-to-tr from-yellow-500 dark:from-pink-500 dark:to-yellow-500 to-pink-500 text-sm font-normal"
                isLoading={loading}
              >
                Sign In
              </Button>

            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
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
                    }
                }}
            >
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1">
                        <h1 className="font-black">Login</h1>
                        <p className="font-normal text-xs">Don&apos;t have an account? <Link size="sm" className="cursor-pointer text-xs">Sign Up</Link></p>
                    </ModalHeader>
                    <ModalBody>
                        <Input
                        autoFocus
                        endContent={
                            <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        label="Email"
                        placeholder="Enter your email"
                        variant="bordered"
                        />
                        <Input
                        endContent={
                            <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                        variant="bordered"
                        />
                        <div className="flex py-2 px-1 justify-between">
                        <Checkbox
                            classNames={{
                            label: "text-small",
                            }}
                        >
                            Remember me
                        </Checkbox>
                        <Link color="primary" href="#" size="sm" className="font-normal text-xs">
                            Forgot password?
                        </Link>
                        </div>
                        <Button className={button({ hideOnMobile: true })} onPress={onClose}>
                            LOGIN
                        </Button>
                        <hr />
                        <p className="mt-2 font-normal text-xs text-center">Or Sign In Using</p>
                        <div className="flex flex-row justify-center gap-2">
                            <GoogleIcon size={30} className="cursor-pointer" onClick={() => signInWithGoogle()}/>
                            <GithubIcon size={30} className="cursor-pointer"
                            onClick={() => signInWithGithub()}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
        </AnimatedDiv>
    );
};

export default LoginComponent;