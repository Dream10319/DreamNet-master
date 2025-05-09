import { useContext, useState, useEffect } from "react";
import { Form, Input, Button, Card, Row, Flex, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { MessageContext } from "@/App";
import { apis } from "@/apis";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const messageAPI = useContext(MessageContext);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (values: any) => {
    setLoading(true);
    try {
        const response: any = await apis.SignUp(values);
        if (response.status) {
          messageAPI.open({
            type: "success",
            content: response.message,
          });
          navigate("/signin");
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

  useEffect(() => {
    if (token) {
      navigate("/map");
    }
  }, [token]);

  return (
    <Flex
      justify="center"
      align="center"
      style={{ minHeight: "100vh", height: "100%" }}
    >
      <div style={{ margin: "10px", maxWidth: 400, width: "100%" }}>
        <Flex justify="center" style={{ marginBottom: 20 }}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Dream Net
          </Typography.Title>
        </Flex>
        <Card
          title={
            <Typography.Title level={4} style={{ margin: 0 }}>
              Sign Up
            </Typography.Title>
          }
          style={{ width: "100%" }}
        >
          <Form
            name="signup_form"
            initialValues={{ remember: true }}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            onFinish={handleSignup}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please input your Name!" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Name" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please input your Email!" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your Password!" },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your Password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
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
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Sign Up
              </Button>
            </Form.Item>
            <Row className="linkSignup">
              <Form.Item>
                Already have an account?{" "}
                <Button type="link" onClick={() => navigate("/signin")}>
                  Sign In
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </Card>
      </div>
    </Flex>
  );
};

export default SignUpPage;
