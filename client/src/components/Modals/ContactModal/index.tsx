import React from "react";
import { Button, Flex, Modal, Form, Typography, Select } from "antd";
import { MessageContext } from "@/App";
import { apis } from "@/apis";
import { useParams } from "react-router-dom";

interface ContactModalProps {
  contacts: Array<any>;
  open: boolean;
  setOpen: (value: boolean) => void;
  handleOk: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({
  open,
  setOpen,
  handleOk,
  contacts,
}) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const messageAPI = React.useContext(MessageContext);
  const [loading, setLoading] = React.useState(false);
  const [userList, setUserList] = React.useState<Array<any>>([]);

  const handleClose = () => {
    setOpen(false);
  };

  const ContactAction = async (values: any) => {
    try {
      setLoading(true);
      const response: any = await apis.AddContactByEventId(id as string, {
        contactId: values.contact,
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
    const fetchUserList = async () => {
      try {
        const response: any = await apis.GetUserList();
        setUserList(response.payload.users);
      } catch (error) {
        messageAPI.open({
          type: "error",
          content: "Failed to load user list.",
        });
      }
    };

    if (open) {
      form.resetFields();
      fetchUserList();
    }
  }, [open]);

  const mergedContacts = React.useMemo(() => {
    const contactMap = new Map<string, any>();

    contacts.forEach((contact) => {
      contactMap.set(contact.ContactId, {
        value: contact.ContactId,
        label: `${contact.ContactName}${contact.Email ? ` (${contact.Email})` : ""}`,
      });
    });

    userList.forEach((user) => {
      if (!contactMap.has(user.UserId)) {
        contactMap.set(user.UserId, {
          value: user.UserId,
          label: `${user.UserName}${user.UserEmail ? ` (${user.UserEmail})` : ""}`,
        });
      }
    });

    return Array.from(contactMap.values());
  }, [contacts, userList]);

  return (
    <Modal
      title={
        <Typography.Title level={4} style={{ margin: 0 }}>
          Add Contact
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
        onFinish={ContactAction}
        style={{ width: "100%", marginTop: 20, marginBottom: 5 }}
        layout="vertical"
      >
        <Form.Item
          name="contact"
          rules={[{ required: true, message: "Please select contact!" }]}
        >
          <Select
            showSearch
            placeholder="Select a contact"
            filterOption={(input, option: any) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={mergedContacts}
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

export default ContactModal;
