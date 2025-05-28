import { useContext, useEffect, useState } from "react";
import { Form, Input, Button, Card, Flex, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MessageContext, useAuth } from "@/App";
import { SignIn } from "@/store/slices/AuthSlice";
import { apis } from "@/apis";
import { RootState } from "@/store";

const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const messageAPI = useContext(MessageContext);
  const [loading, setLoading] = useState(false);
  const { refreshToken } = useAuth();

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const response: any = await apis.SignIn(values);
      if (response.status) {
        messageAPI.open({
          type: "success",
          content: response.message,
        });
        dispatch(SignIn(response.payload.token));
        refreshToken();
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
              Sign In
            </Typography.Title>
          }
          style={{ width: "100%" }}
        >
          <Form
            name="signin_form"
            initialValues={{ remember: true }}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            onFinish={handleLogin}
          >
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
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            {/* <Row style={{ marginBottom: 10 }}>
              <Col span={12}></Col>
              <Col span={12} style={{ textAlign: "right" }}>
                <Button
                  type="link"
                  style={{ padding: 0 }}
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password
                </Button>
              </Col>
            </Row> */}
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Sign In
              </Button>
            </Form.Item>
            {/* <Row className="linkSignup">
              <Form.Item>
                Don't have an account?{" "}
                <Button type="link" onClick={() => navigate("/signup")}>
                  Sign Up Now
                </Button>
              </Form.Item>
            </Row> */}
          </Form>
        </Card>
      </div>
    </Flex>
  );
};

export default SignInPage;
