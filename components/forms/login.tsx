"use client";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link } from "@nextui-org/react";
import { AnimatedDiv } from "@/components/motion";
import { useUser } from "@/contexts/userContext";
import {
    MailIcon,
    LockIcon,
    GoogleIcon,
    GithubIcon
} from "@/components/icons";
import { button } from "@/components/primitives";
import {
    signInWithGoogle,
    signInWithGithub
} from "@/lib/firebase/auth";
import { useState } from "react";



export const LoginComponent = () => {
    const { showLogin, toggleLogin } = useUser();


    const [ data, setData ] = useState({
        email: "",
        password: "",
        remember: false
    });

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
                        value={data.email}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange={(e: any) => setData({ ...data, email: e.target.value})}
                        />
                        <Input
                        endContent={
                            <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                        variant="bordered"
                        value={data.password}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange={(e: any) => setData({ ...data, password: e.target.value})}
                        />
                        <div className="flex py-2 px-1 justify-between">
                        <Checkbox
                            classNames={{
                            label: "text-small",
                            }}
                            onChange={() => setData({ ...data, remember: !data.remember })}
                        >
                            Remember me
                        </Checkbox>
                        <Link color="primary" href="#" size="sm" className="font-normal text-xs">
                            Forgot password?
                        </Link>
                        </div>
                        <Button className={`${button({ hideOnMobile: true })} uppercase`} onPress={onClose}>
                            Login
                        </Button>
                        <hr />
                        <p className="mt-2 font-normal text-xs text-center">Or Sign In Using</p>
                        <div className="flex flex-row justify-center gap-2">
                            <GoogleIcon size={30} className="cursor-pointer" onClick={() => signInWithGoogle()} width={24} height={24}/>
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