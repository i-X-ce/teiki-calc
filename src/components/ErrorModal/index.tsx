import { Group, Modal, Title } from "@mantine/core";
import { createContext, useContext, useState, type ReactNode } from "react"
import { MdError } from "react-icons/md";

type ErrorModalContextType = {
    openError: ({ title, content }: { title: string, content: ReactNode }) => void;
    closeError: () => void;
} | null;
export const ErrorModalContext = createContext<ErrorModalContextType>(null);

const ErrorModalProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<ReactNode>(null);
    const value = {
        openError: ({ title, content }: { title: string, content: ReactNode }) => {
            setOpen(true);
            setTitle(title);
            setContent(content);
        },
        closeError: () => {
            setOpen(false);
        }
    }

    return (
        <ErrorModalContext.Provider value={value}>
            {children}
            <Modal
                title={
                    <Group align="center" c={"red"} >
                        <MdError size={"1.2rem"} />
                        <Title order={3}>
                            {title}
                        </Title>
                    </Group>
                }
                opened={open}
                onClose={() => value.closeError()}>
                {content}
            </Modal>
        </ErrorModalContext.Provider >
    )
}

export const useErrorModal = () => {
    const context = useContext(ErrorModalContext);
    if (!context) {
        throw new Error("useErrorModal must be used within a ErrorModalProvider");
    }
    return context;
}

export default ErrorModalProvider