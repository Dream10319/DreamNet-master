import React from "react";
import { Flex, Card, Table, Typography, Button } from "antd";
import { DeleteOutlined, EditFilled } from "@ant-design/icons";
import { apis } from "@/apis";
import UserModal from "@/components/Modals/UserModal";
import DeleteModal from "@/components/Modals/DeleteModal";
import { MessageContext } from "@/App";
import EditUserModal from "@/components/Modals/EditUserModal";

const UsersPage = () => {
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [users, setUsers] = React.useState<Array<any>>([]);
  const [loading, setLoading] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const messageAPI = React.useContext(MessageContext);

  const columns = [
    {
      title: "Id",
      dataIndex: "UserId",
      sorter: (a: any, b: any) => a.UserId > b.UserId,
    },
    {
      title: "Name",
      dataIndex: "UserName",
      sorter: (a: any, b: any) => a.UserName.localeCompare(b.UserName),
    },
    {
      title: "Email",
      dataIndex: "UserEmail",
      sorter: (a: any, b: any) => a.UserEmail.localeCompare(b.UserEmail),
    },
    {
      title: "User Role",
      dataIndex: "UserRole",
      sorter: (a: any, b: any) => a.UserRole.localeCompare(b.UserRole),
    },
    {
      title: "Created Date",
      dataIndex: "UserCreatedAt",
      render: (createdDate: any) => {
        if (!createdDate) return "";
        const date = new Date(createdDate);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <Flex gap={8}>
          <Button
            size="small"
            type="primary"
            icon={<EditFilled />}
            onClick={() => {
              setCurrentUser(record);
              setEditOpen(true); // open modal for editing
            }}
          >
          </Button>
          <Button
            size="small"
            type="primary"
            icon={<DeleteOutlined />}
            danger
            onClick={() => {
              setCurrentUser(record);
              setDeleteOpen(true);
            }}
          />
        </Flex>
      ),
    },
  ];

  const GetUserList = async () => {
    try {
      setLoading(true);
      const response: any = await apis.GetUserList();
      if (response.status) {
        setUsers(response.payload.users);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const DeleteUser = async () => {
    try {
      if (currentUser) {
        setDeleteLoading(true);
        const response: any = await apis.DeleteUserById(currentUser.UserId);
        if (response.status) {
          setDeleteOpen(false);
          messageAPI.open({
            type: "success",
            content: response.message,
          });
          GetUserList();
        }
      }
    } catch (err: any) {
      messageAPI.open({
        type: "error",
        content: err?.response?.data?.message || "Something went wrong!!!",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  React.useEffect(() => {
    GetUserList();
  }, []);

  return (
    <>
      <Card
        title={
          <Flex align="center" justify="space-between">
            <Typography.Title level={4} style={{ margin: 0 }}>
              User List
            </Typography.Title>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true);
                setCurrentUser(null);
              }}
            >
              Add
            </Button>
          </Flex>
        }
      >
        <Table
          dataSource={users}
          rowKey="UserId"
          bordered
          columns={columns}
          loading={loading}
          size="small"
          pagination={{
            pageSize: 20,
          }}
          scroll={{
            x: true,
          }}
        />
      </Card>
      <UserModal
        open={open}
        setOpen={setOpen}
        handleOk={() => {
          GetUserList();
        }}
      />
      <EditUserModal
        open={editOpen}
        setOpen={setEditOpen}
        userId={currentUser?.UserId}
        handleOk={() => {
          GetUserList();
        }}
      />
      <DeleteModal
        handleOk={DeleteUser}
        loading={deleteLoading}
        open={deleteOpen}
        setOpen={setDeleteOpen}
        text="Are you certain you wish to proceed with the deletion of this user?"
      />
    </>
  );
};

export default UsersPage;
