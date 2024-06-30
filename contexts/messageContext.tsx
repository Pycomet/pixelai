import {
  ReactNode,
  useCallback,
  useContext,
  createContext,
  useState,
  useEffect,
} from "react";
import cogoToast from "cogo-toast";

interface MessageContextProps {
  message: (message: string, type: MessageType) => void;
}

type MessageType = "success" | "error" | "warn" | "info" | "loading";

interface MessageProviderProps {
  children: ReactNode;
}

const MessageContext = createContext<MessageContextProps | undefined>(
  undefined
);

export const MessageProvider = ({ children }: MessageProviderProps) => {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<MessageType>("info");

  const [pos] = useState<object>({
    position: "top-right",
  });

  const sendMessage = useCallback(() => {
    if (!message) return;

    switch (type) {
      case "success":
        cogoToast.success(message, pos);
        break;
      case "error":
        cogoToast.error(message, pos);
        break;
      case "warn":
        cogoToast.warn(message, pos);
        break;
      case "loading":
        cogoToast.loading(message, pos);
        break;
      default:
        cogoToast.info(message, pos);
        break;
    }
  }, [message, pos, type]);

  useEffect(() => {
    sendMessage();
    setMessage(null); // Clear message after sending it to UI
  }, [sendMessage, setMessage]);

  const updateMessage = (msg: string, msgType: MessageType) => {
    setMessage(msg);
    setType(msgType);
  };

  return (
    <MessageContext.Provider value={{ message: updateMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = (): MessageContextProps => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
};
