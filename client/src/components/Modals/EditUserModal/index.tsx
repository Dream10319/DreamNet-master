import React from "react";
import { Button, Flex, Input, Modal, Form, Typography, Switch, Select } from "antd";
import { MessageContext } from "@/App";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { apis } from "@/apis";

interface UserModalProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    userId: any;
    handleOk: () => void;
}

const EditUserModal: React.FC<UserModalProps> = ({ open, setOpen, userId, handleOk }) => {
    const [form] = Form.useForm();
    const messageAPI = React.useContext(MessageContext);
    const [loading, setLoading] = React.useState(false);
    const [statusPassword, onStatusPassword] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const UserAction = async (values: any) => {
        const payload = {
            ...values,
            statusPassword: statusPassword,
        };
        try {
            setLoading(true);
            const response: any = await apis.UpdateUserById(userId, payload);
            if (response.status) {
                handleClose();
                handleOk();
                messageAPI.open({
                    type: "success",
                    content: response.message,
                });
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

    const onChangePassword = (checked: any) => {
        onStatusPassword(checked)
    }

    const getUserById = async () => {
        try {
            const response = await apis.GetUserById(userId);
            if (response.status) {
                const result = response?.data.user;

                form.setFieldsValue({
                    UserName: result.UserName,
                    UserEmail: result.UserEmail,
                    UserRole: result.UserRole,
                });
            }

        } catch (err: any) {
            messageAPI.open({
                type: "error",
                content: err?.response?.data?.message || "Something went wrong!!!",
            });
        }
    };

    React.useEffect(() => {
        if (open && userId) {
            form.resetFields();
            getUserById()
        }

    }, [open, userId]);

    return (
        <Modal
            title={
                <Typography.Title level={4} style={{ margin: 0 }}>
                    Update User
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
                    label="Role"
                    name="UserRole"
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
                      ] }
                    />
                    </Form.Item>
                <Flex style={{marginBottom: 20}} gap={5}>                    
                    <Switch defaultChecked={false} onChange={onChangePassword} />
                    <Typography>
                        Change password?
                    </Typography>
                </Flex>
                {statusPassword &&
                    <>
                        <Form.Item
                            label="New Password"
                            name="UserPassword"
                            rules={[
                                ...(statusPassword
                                  ? [{ required: true, message: "Please input password!" }]
                                  : []),
                                {
                                  min: 6,
                                  message: "Password must be at least 6 characters long!",
                                },
                              ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            label="Confirm Password"
                            dependencies={["UserPassword"]}
                            rules={[
                                ...(statusPassword
                                  ? [{ required: true, message: "Please confirm Password!" }]
                                  : []),
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    if (!statusPassword || !value || getFieldValue("UserPassword") === value) {
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
                    </>
                }
                <Flex justify="flex-end">
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Update
                    </Button>
                </Flex>
            </Form>
        </Modal>
    );
};

export default EditUserModal;
