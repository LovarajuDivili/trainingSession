import { createContext } from "react";
import type { Employee } from "../common/types";

interface OutletContext {
  filteredEmployees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
}

const EmployeeContext = createContext<OutletContext | null>(null);

export default EmployeeContext;
