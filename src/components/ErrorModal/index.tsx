import { Group, Modal, Title } from "@mantine/core";
import { createContext, useContext, useState, type ReactNode } from "react"
import { MdError, MdWarning } from "react-icons/md";

type ErrorModalContextType = {
    openError: (props: openErrorType) => void;
    closeError: () => void;
} | null;
export const ErrorModalContext = createContext<ErrorModalContextType>(null);

type openErrorType = {
    variants?: variantsType;
    title: string;
    content: ReactNode;
}

type variantsType = "error" | "warning";

const variantsToColor: { [key in variantsType]: string } = {
    error: "red",
    warning: "yellow"
}

const ErrorModalProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<ReactNode>(null);
    const [variant, setVariant] = useState<variantsType>("error");
    const value = {
        openError: ({ variants, title, content }: openErrorType) => {
            setOpen(true);
            setTitle(title);
            setContent(content);
            if (variants) setVariant(variants);
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
                    <Group align="center" c={variantsToColor[variant]} >
                        {
                            (() => {
                                if (variant === "error") return <MdError size={"1.2rem"} />;
                                if (variant === "warning") return <MdWarning size={"1.2rem"} />;
                            })()
                        }
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