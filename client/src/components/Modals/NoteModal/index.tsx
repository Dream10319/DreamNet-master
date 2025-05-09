import React from "react";
import { Button, Flex, Input, Modal, Form, Typography } from "antd";
import { MessageContext } from "@/App";
import { apis } from "@/apis";
import { useParams } from "react-router-dom";

interface NoteModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  note: any;
  handleOk: () => void;
}

const NoteModal: React.FC<NoteModalProps> = ({
  open,
  setOpen,
  note,
  handleOk,
}) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const messageAPI = React.useContext(MessageContext);
  const [loading, setLoading] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const NoteAction = async (values: any) => {
    try {
      setLoading(true);
      const response: any = note
        ? await apis.UpdateEventNoteById(id as string, note.EventNoteId, {
            note: values.note,
          })
        : await apis.AddEventNoteById(id as string, {
            note: values.note,
          });
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
      if (note) {
        form.setFieldsValue({
          note: note.NoteText,
        });
      } else {
        form.setFieldsValue({
          note: "",
        });
      }
    }
  }, [open]);

  return (
    <Modal
      title={
        <Typography.Title level={4} style={{ margin: 0 }}>
          {note ? "Edit Note" : "Add Note"}
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
        onFinish={NoteAction}
        style={{ width: "100%", marginTop: 20, marginBottom: 5 }}
        layout="vertical"
      >
        <Form.Item
          name="note"
          style={{ marginBottom: 20 }}
          rules={[{ required: true, message: "Please input note!" }]}
          initialValue={note?.NoteText}
        >
          <Input.TextArea
            placeholder="Note"
            style={{ resize: "none", height: 150 }}
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

export default NoteModal;
