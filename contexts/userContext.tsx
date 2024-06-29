import { ReactNode, useContext, createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "@/lib/firebase/auth";
import { User } from "firebase/auth";

interface UserContextProps {
    user: User | null;
    loading: boolean;
    showLogin: boolean;
    toggleLogin: () => void
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [showLogin, setShowLogin] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const toggleLogin = () => {
        // Toggle showing of the login form
        setShowLogin(!showLogin);
    }

    return (
        <UserContext.Provider value={{ user, loading, showLogin, toggleLogin }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextProps => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};