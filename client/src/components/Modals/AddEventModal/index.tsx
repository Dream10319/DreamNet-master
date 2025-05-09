import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Flex, Input, Modal, Form, Typography } from "antd";
import { RootState } from "@/store";
import { setIsOpenEventModal } from "@/store/slices/AppSlice";
import { MessageContext } from "@/App";
import { apis } from "@/apis";
import { useNavigate } from "react-router-dom";

const AddEventModal = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const messageAPI = React.useContext(MessageContext);
  const [loading, setLoading] = React.useState(false);
  const { isOpenEventModal, eventId, eventType } = useSelector(
    (state: RootState) => state.app
  );

  const handleClose = () => {
    dispatch(setIsOpenEventModal(false));
  };

  const AddEvent = async (values: any) => {
    try {
      setLoading(true);
      const response: any = await apis.CreateEvent({
        eventId,
        eventType,
        title: values.title,
      });
      if (response.status) {
        handleClose();
        navigate(`/events/${response.payload.id}`);
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
    if (isOpenEventModal) {
      form.resetFields();
    }
  }, [isOpenEventModal]);

  return (
    <Modal
      title={
        <Typography.Title level={4} style={{ margin: 0 }}>
          Add Event
        </Typography.Title>
      }
      open={isOpenEventModal}
      onCancel={handleClose}
      footer={null}
      width={400}
      maskClosable={false}
    >
      <Form
        form={form}
        onFinish={AddEvent}
        style={{ width: "100%", marginTop: 20, marginBottom: 5 }}
        layout="vertical"
      >
        <Form.Item
          name="title"
          style={{ marginBottom: 20 }}
          rules={[{ required: true, message: "Please input title!" }]}
        >
          <Input placeholder="Event Title" />
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

export default AddEventModal;
