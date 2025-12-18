import React, { useState, useEffect, type ReactNode } from "react";
import EmployeeContext from "./EmpContext";
import type { Employee } from "../common/types";
import { apiRequest } from "../Services/apiService";

interface EmployeeProviderProps {
  children: ReactNode;
}

const EmployeeProvider: React.FC<EmployeeProviderProps> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await apiRequest<Employee[]>({
          endpoint: "/api/employees",
          method: "GET",
        });

        setEmployees(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
        setEmployees([]);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees;

  return (
    <EmployeeContext.Provider value={{ filteredEmployees, setEmployees }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export default EmployeeProvider;
