import React from "react";
import { Button, Flex, Input, Modal, Form, Typography, Select } from "antd";
import { MessageContext } from "@/App";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { apis } from "@/apis";

interface UserModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  handleOk: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ open, setOpen, handleOk }) => {
  const [form] = Form.useForm();
  const messageAPI = React.useContext(MessageContext);
  const [loading, setLoading] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const UserAction = async (values: any) => {
    try {
      setLoading(true);
      const response: any = await apis.CreateUser(values);
      if (response.status) {
        handleClose();
        handleOk();
      }
    } catch (err: any) {
      messageAPI.open({
        type: "error",
        content: err?.response?.data?.message || "Something went wrong!!!",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open]);

  return (
    <Modal
      title={
        <Typography.Title level={4} style={{ margin: 0 }}>
          Add User
        </Typography.Title>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={400}
      maskClosable={false}
    >
      <Form
        form={form}
        onFinish={UserAction}
        style={{ width: "100%", marginTop: 20, marginBottom: 5 }}
        layout="vertical"
      >
        <Form.Item
          label="Name"
          name="UserName"
          rules={[{ required: true, message: "Please input name!" }]}
        >
          <Input placeholder="Name" prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item
          label="Email"
          name="UserEmail"
          rules={[{ required: true, message: "Please input email!" }]}
        >
          <Input placeholder="Email" type="email" prefix={<MailOutlined />} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="UserPassword"
          rules={[
            { required: true, message: "Please input password!" },
            {
              min: 6,
              message: "Password must be at least 6 characters long!",
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={["UserPassword"]}
          rules={[
            { required: true, message: "Please confirm Password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("UserPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm Password"
          />
        </Form.Item>
        <Form.Item
          name="UserRole"
          label="Role"
          rules={[{ required: true, message: "Please select role!" }]}
        >
          <Select
            options={[
              {
                value: "USER",
                label: "USER",
              },
              {
                value: "ADMIN",
                label: "ADMIN",
              },
            ]}
          />
        </Form.Item>
        <Flex justify="flex-end">
          <Button type="primary" htmlType="submit" loading={loading}>
            Save
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

export default UserModal;
