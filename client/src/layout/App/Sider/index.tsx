import React from "react";
import { Menu, Typography, Flex, Drawer } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setIsToggled } from "@/store/slices/AppSlice";

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: React.ReactNode;
}

const AppSider = () => {
  const { authUser } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = location.pathname.replace("/", "") || "home";
  const dispatch = useDispatch();
  const { isToggled } = useSelector((state: RootState) => state.app);
  const [items, setItems] = React.useState<MenuItem[]>([]);

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

  const handleMenuClick = (e: any) => {
    navigate("/" + e.key);
    onClose();
  };

  const onClose = () => {
    dispatch(setIsToggled(false));
  };

  const Navbar = () => (
    <>
      <Flex justify="center" align="center" style={{ margin: 0, height: 60 }}>
        <Typography.Title level={3} style={{ margin: 0, fontWeight: "bold" }}>
          Dream Net
        </Typography.Title>
      </Flex>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        style={{ borderRight: 0 }}
        items={items}
        onClick={handleMenuClick}
      />
    </>
  );

  return (
    <>
      <Drawer
        placement="left"
        onClose={onClose}
        closable={false}
        open={isToggled}
        width={180}
        styles={{
          body: {
            padding: 0,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          },
        }}
        className="hideOnDesktop"
      >
        <Navbar />
      </Drawer>
    </>
  );
};

export default AppSider;
