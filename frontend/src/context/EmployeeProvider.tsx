import React, { useState, useEffect, type ReactNode, useContext } from "react";
import EmployeeContext from "./EmployeeContext";
import type { Employee } from "../common/types";
import { UserContext } from "../components/UserContext";

interface EmployeeProviderProps {
  children: ReactNode;
}

const EmployeeProvider: React.FC<EmployeeProviderProps> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const { token } = useContext(UserContext);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch("http://localhost:5000/api/employees", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch employees");
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        setEmployees([]); 
      }
    }
    fetchEmployees();
  }, [token]); 

  const filteredEmployees = employees;

  return (
    <EmployeeContext.Provider value={{ filteredEmployees, setEmployees }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export default EmployeeProvider;
