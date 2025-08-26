import { useEffect } from "react";
import { usePass } from "../components/PassProvider";
import type Pass from "../utils/Pass";
import { INIT_PASS } from "../utils/constants";

const useStoragePass = () => {
  const { passList, setPassList } = usePass();
  const setStoragePass = (newPassList: Pass[]) => {
    localStorage.setItem("passList", JSON.stringify(newPassList));
    setPassList(newPassList);
  };
  const resetStoragePass = () => {
    setStoragePass(INIT_PASS);
  };

  useEffect(() => {
    const storedPassList = localStorage.getItem("passList");
    if (storedPassList) {
      try {
        const parsedPassList: Pass[] = JSON.parse(storedPassList);
        setPassList(parsedPassList);
      } catch (error) {
        console.error("Failed to parse pass list from localStorage:", error);
      }
    }
  }, []);
  return { passList, setStoragePass, resetStoragePass };
};

export default useStoragePass;
