import React from "react";
import {
  Layout,
  Avatar,
  Dropdown,
  Flex,
  Button,
  Typography,
  Menu,
  type MenuProps,
} from "antd";
import { UserOutlined, MenuOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { SignOut } from "@/store/slices/AuthSlice";
import { setIsToggled } from "@/store/slices/AppSlice";
import { RootState } from "@/store";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: React.ReactNode;
}

const AppHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authUser } = useSelector((state: RootState) => state.auth);
  const [items, setItems] = React.useState<MenuItem[]>([]);
  const selectedKey = location.pathname.replace("/", "") || "home";

  const handlelogout = () => {
    dispatch(SignOut());
  };

  const profileItems: MenuProps["items"] = [
    {
      key: "log-out",
      label: <span onClick={handlelogout}>Log out</span>,
    },
  ];

  const handleMenuClick = (e: any) => {
    navigate("/" + e.key);
  };

  React.useEffect(() => {
    if (authUser) {
      let initialItems: Array<any> = [
        {
          key: "events",
          label: <span>Events</span>,
        },
        {
          key: "rentals",
          label: <span>Rentals</span>,
        },
        {
          key: "projects",
          label: <span>Projects</span>,
        },
        {
          key: "organisations",
          label: <span>Organisations</span>,
        },
        {
          key: "reports",
          label: <span>Reports</span>,
        },
      ];

      if (authUser.role === "ADMIN") {
        initialItems = initialItems.concat([
          {
            key: "users",
            label: <span>Users</span>,
          },
          {
            key: "settings",
            label: <span>Settings</span>,
          },
        ]);
      }
      setItems(initialItems);
    }
  }, [authUser]);

  return (
    <Header
      style={{
        padding: "0 20px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Flex
        justify="space-between"
        align="center"
        style={{ height: "100%" }}
        gap={20}
      >
        <Flex align="center" gap={20}>
          <Button
            type="text"
            icon={<MenuOutlined />}
            style={{ width: 50 }}
            className="hideOnDesktop"
            onClick={() => {
              dispatch(setIsToggled(true));
            }}
          />
          <Typography.Title level={3} style={{ margin: 0, fontWeight: "bold" }}>
            Dream Net
          </Typography.Title>
        </Flex>
        <Menu
          mode="horizontal"
          className="hideOnMobile"
          selectedKeys={[selectedKey]}
          style={{ borderRight: 0, flex: 1, minWidth: 0 }}
          items={items}
          onClick={handleMenuClick}
        />
        <Dropdown menu={{ items: profileItems }} placement="bottomLeft" arrow>
          <Avatar
            icon={<UserOutlined />}
            style={{ marginLeft: 20, cursor: "pointer" }}
          />
        </Dropdown>
      </Flex>
    </Header>
  );
};

export default AppHeader;
