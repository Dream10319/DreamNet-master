import React from "react";
import { Navigate } from "react-router-dom";
import { Layout } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import AppHeader from "./Header";
import AppSider from "./Sider";
import { MessageContext } from "@/App";
import { apis } from "@/apis";
import { SetAuthUser } from "@/store/slices/AuthSlice";
import AddEventModal from "@/components/Modals/AddEventModal";

const { Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const messageAPI = React.useContext(MessageContext);
  const { token } = useSelector((state: RootState) => state.auth);

  const GetAuthUser = async () => {
    try {
      const response: any = await apis.GetCurrentUser();
      if (response.status) {
        dispatch(SetAuthUser(response.payload.user));
      }
    } catch (err: any) {
      messageAPI.open({
        type: "error",
        content: err?.response?.data?.message,
      });
    }
  };

  React.useEffect(() => {
    if (token) {
      GetAuthUser();
    }
  }, [token]);

  return token ? (
    <Layout style={{ minHeight: "100vh" }}>
      <AppSider />
      <Layout>
        <AppHeader />
        <Content style={{ padding: 20 }}>{children}</Content>
      </Layout>
      <AddEventModal />
    </Layout>
  ) : (
    <Navigate to="/" />
  );
};

export default AppLayout;
