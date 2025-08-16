import { createContext, useContext, useState, type ReactNode } from "react"
import type Pass from "../../utils/Pass";
import { INIT_PASS } from "../../utils/constants";

type PassContextType = {
    passList: Pass[];
    setPassList: React.Dispatch<React.SetStateAction<Pass[]>>;
} | null;

export const PassContext = createContext<PassContextType>(null);

const PassProvider = ({ children }: { children: ReactNode }) => {
    const [passList, setPassList] = useState<Pass[]>(INIT_PASS);
    const value = {
        passList,
        setPassList,
    };

    return (
        <PassContext.Provider value={value}>
            {children}
        </PassContext.Provider>
    )
}

export const usePass = () => {
    const context = useContext(PassContext);
    if (!context) {
        throw new Error("usePass must be used within a PassProvider");
    }
    return context;
}

export default PassProvider