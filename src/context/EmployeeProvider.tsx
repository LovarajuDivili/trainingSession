import React, { useState, type ReactNode } from "react";
import EmployeeContext from "./EmployeeContext";
import { employeeData } from "../common/dummyData";
import type { Employee } from "../common/types";

interface EmployeeProviderProps {
  children: ReactNode;
}

const EmployeeProvider: React.FC<EmployeeProviderProps> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(employeeData);
  const filteredEmployees = employees;

  return (
    <EmployeeContext.Provider value={{ filteredEmployees, setEmployees }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export default EmployeeProvider;
