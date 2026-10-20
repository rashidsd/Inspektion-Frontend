import useLocalStorage from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Unauthorized from "../pages/Unauthorized";

function Protected({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  const { roles, name } = useLocalStorage();
  const user = localStorage.getItem("user");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  });

  return (
    <>
      {roles.includes(role) || name == "admin" ? (
        <>{children}</>
      ) : (
        <Unauthorized />
      )}
    </>
  );
}

export default Protected;
