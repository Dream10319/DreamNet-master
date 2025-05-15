import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { token } = useSelector((state: RootState) => state.auth);

  return token ? <Navigate replace to="/events" /> : children;
};

export default AuthLayout;
