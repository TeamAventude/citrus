import React, { useEffect } from "react";
import { useLogin } from "hooks";
import { LoginForm } from "templates/Login";

export const Login: React.FC = () => {
  const { onLogin } = useLogin();

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div>
      <LoginForm onSubmit={onLogin} />
    </div>
  );
};

export default Login;
