import { useContext } from "react";
import EmployeeContext from "./EmployeeContext";

export const useEmployeeContext = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployeeContext must be used within EmployeeProvider");
  }
  return context;
};
