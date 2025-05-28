import React, { useState, useEffect, createContext, useContext } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import AppRouter from "./routes";
import { ConfigProvider, message } from "antd";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "./constants";

export const MessageContext = React.createContext<any>(null);

interface JwtPayload {
  id: number;
  role: string;
  name: string;
  exp: number;
  iat?: number;
}
interface AuthContextType {
  decodedToken: JwtPayload | null;
  refreshToken: () => void;
}

const AuthContext = createContext<AuthContextType>({
  decodedToken: null,
  refreshToken: () => { },
});

const App = () => {
  const [decodedToken, setDecodedToken] = useState<JwtPayload | null>(null);

  const refreshToken = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setDecodedToken(decoded);
      } catch {
        setDecodedToken(null);
      }
    } else {
      setDecodedToken(null);
    }
  };

  useEffect(() => {
    refreshToken(); // Load token on initial mount
  }, []);

  const [messageApi, contextHolder] = message.useMessage();

  return (
    <Provider store={store}>
      <ConfigProvider>
        <MessageContext.Provider value={messageApi}>
          {contextHolder}
          <AuthContext.Provider value={{ decodedToken, refreshToken }}>
            <AppRouter />
          </AuthContext.Provider>
        </MessageContext.Provider>
      </ConfigProvider>
    </Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default App;
