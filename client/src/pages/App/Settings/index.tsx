import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Typography,
  Button,
  Form,
  Input,
  Popconfirm,
  message,
  Space,
  Tabs,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { apis } from "@/apis";

const { TabPane } = Tabs;

type Priority = { EPriorityId: number; Priority: string };
type Status = { EStatusId: number; Status: string };
type Type = { ETypeId: number; Type: string };

const SettingsManager = () => {
  const [loading, setLoading] = useState(false);

  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [types, setTypes] = useState<Type[]>([]);

  const [formPriority] = Form.useForm();
  const [formStatus] = Form.useForm();
  const [formType] = Form.useForm();

  // Loaders
  const loadPriorities = async () => {
    try {
      setLoading(true);
      const res: any = await apis.GetPriorityList();
      setPriorities(res.payload.priorities);
    } catch {
      message.error("Failed to load priorities");
    } finally {
      setLoading(false);
    }
  };

  const loadStatuses = async () => {
    try {
      setLoading(true);
      const res: any = await apis.GetStatusList();
      setStatuses(res.payload.statuses);
    } catch {
      message.error("Failed to load statuses");
    } finally {
      setLoading(false);
    }
  };

  const loadTypes = async () => {
    try {
      setLoading(true);
      const res: any = await apis.GetTypeList();
      setTypes(res.payload.types);
    } catch {
      message.error("Failed to load types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPriorities();
    loadStatuses();
    loadTypes();
  }, []);

  // Add handlers
  const addPriority = async (values: { Priority: string }) => {
    try {
      await apis.AddPriority(values);
      message.success("Priority added");
      formPriority.resetFields();
      loadPriorities();
    } catch {
      message.error("Failed to add priority");
    }
  };

  const addStatus = async (values: { Status: string }) => {
    try {
      await apis.AddStatus(values);
      message.success("Status added");
      formStatus.resetFields();
      loadStatuses();
    } catch {
      message.error("Failed to add status");
    }
  };

  const addType = async (values: { Type: string }) => {
    try {
      await apis.AddType(values);
      message.success("Type added");
      formType.resetFields();
      loadTypes();
    } catch {
      message.error("Failed to add type");
    }
  };

  // Delete handler
  const handleDelete = async (
    id: number,
    category: "priority" | "status" | "type"
  ) => {
    try {
      if (category === "priority") {
        await apis.DeletePriority(id);
        loadPriorities();
      } else if (category === "status") {
        await apis.DeleteStatus(id);
        loadStatuses();
      } else if (category === "type") {
        await apis.DeleteType(id);
        loadTypes();
      }
      message.success("Deleted successfully");
    } catch {
      message.error("That field is used already, so can't delete");
    }
  };

  // Columns for each table
  const priorityColumns = [
    {
      title: "Priority",
      dataIndex: "Priority",
      key: "Priority",
      sorter: (a: Priority, b: Priority) =>
        a.Priority.localeCompare(b.Priority),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Priority) => (
        <Popconfirm
          title="Are you sure to delete this priority?"
          onConfirm={() => handleDelete(record.EPriorityId, "priority")}
          okText="Yes"
          cancelText="No"
        >
          <Button
            size="small"
            danger
            type="primary"
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
      ),
    },
  ];

  const statusColumns = [
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      sorter: (a: Status, b: Status) => a.Status.localeCompare(b.Status),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Status) => (
        <Popconfirm
          title="Are you sure to delete this status?"
          onConfirm={() => handleDelete(record.EStatusId, "status")}
          okText="Yes"
          cancelText="No"
        >
          <Button
            size="small"
            danger
            type="primary"
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
      ),
    },
  ];

  const typeColumns = [
    {
      title: "Type",
      dataIndex: "Type",
      key: "Type",
      sorter: (a: Type, b: Type) => a.Type.localeCompare(b.Type),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Type) => (
        <Popconfirm
          title="Are you sure to delete this type?"
          onConfirm={() => handleDelete(record.ETypeId, "type")}
          okText="Yes"
          cancelText="No"
        >
          <Button
            size="small"
            danger
            type="primary"
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card
      title={
        <Typography.Title level={4} style={{ margin: 0 }}>
          Settings
        </Typography.Title>
      }
    >
      <Tabs defaultActiveKey="priorities" centered>
        <TabPane tab="Priorities" key="priorities">
          <Form
            form={formPriority}
            layout="inline"
            onFinish={addPriority}
            style={{ marginBottom: 16 }}
          >
            <Form.Item
              name="Priority"
              rules={[{ required: true, message: "Please input priority" }]}
            >
              <Input placeholder="New Priority" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add Priority
              </Button>
            </Form.Item>
          </Form>
          <Table
            size="small"
            bordered
            columns={priorityColumns}
            dataSource={priorities}
            rowKey="EPriorityId"
            loading={loading}
            pagination={{ pageSize: 20 }}
          />
        </TabPane>

        <TabPane tab="Statuses" key="statuses">
          <Form
            form={formStatus}
            layout="inline"
            onFinish={addStatus}
            style={{ marginBottom: 16 }}
          >
            <Form.Item
              name="Status"
              rules={[{ required: true, message: "Please input status" }]}
            >
              <Input placeholder="New Status" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add Status
              </Button>
            </Form.Item>
          </Form>
          <Table
            size="small"
            bordered
            columns={statusColumns}
            dataSource={statuses}
            rowKey="EStatusId"
            loading={loading}
            pagination={{ pageSize: 20 }}
          />
        </TabPane>

        <TabPane tab="Types" key="types">
          <Form
            form={formType}
            layout="inline"
            onFinish={addType}
            style={{ marginBottom: 16 }}
          >
            <Form.Item
              name="Type"
              rules={[{ required: true, message: "Please input type" }]}
            >
              <Input placeholder="New Type" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add Type
              </Button>
            </Form.Item>
          </Form>
          <Table
            size="small"
            bordered
            columns={typeColumns}
            dataSource={types}
            rowKey="ETypeId"
            loading={loading}
            pagination={{ pageSize: 20 }}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default SettingsManager;