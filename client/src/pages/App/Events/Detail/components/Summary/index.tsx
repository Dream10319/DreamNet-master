import React from "react";
import {
  Col,
  Form,
  Input,
  Row,
  Flex,
  Select,
  Button,
  Switch,
  Typography,
  DatePicker,
  InputNumber,
  Table,
  Divider,
  GetProp,
  TableProps
} from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { InitialDataType, EventDetailType } from "@/types";
import { apis } from "@/apis";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import ContactModal from "@/components/Modals/ContactModal";
import DeleteModal from "@/components/Modals/DeleteModal";
import { MessageContext } from "@/App";
import type { SorterResult } from 'antd/es/table/interface';

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface DataType {
  name: string;
  email: string;
  mobile: string;
  company: string;
}

interface EventSummaryProps {
  id: any;
  initialData: InitialDataType;
  eventDetail: EventDetailType;
  getEvent: () => void;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>['field'];
  sortOrder?: SorterResult<any>['order'];
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

const EventSummary: React.FC<EventSummaryProps> = ({
  id,
  initialData,
  eventDetail,
  getEvent,
}) => {
  const navigate = useNavigate();
  const [saving, setSaving] = React.useState(false);
  const [contacts, setContacts] = React.useState<Array<any>>([]);
  const [open, setOpen] = React.useState(false);
  const [loadingContact, setLoadingContact] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [currentContact, setCurrentContact] = React.useState<any>(null);
  const [form] = Form.useForm();
  const messageAPI = React.useContext(MessageContext);
  const [tableParams, setTableParams] = React.useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });


  const SaveEvent = async (values: any) => {
    try {
      setSaving(true);
      const resDetail: any = await apis.GetEventDetailById(id);
      const isUpdate = resDetail.payload.event.Description !== null;

      const response: any = await apis.UpdateEventById(id, values);
      if (response.status) {
        getEvent();
      }

      const resContacts: any = await apis.GetEventContactListById(id);
      const tempContacts = [
        {
          Email: resDetail.payload.event.UserEmail,
          Name: resDetail.payload.event.UserName
        },
        ...resContacts.payload.contacts.map((contact: any) => {
          const tempContact = initialData.contacts.find(
            (con: any) => con.ContactId === contact.ContactId
          );
          return {
            Email: tempContact.Email,
            Name: tempContact.ContactName
          };
        })
      ];

      const reqBody = {
        contacts: tempContacts,
        eventName: resDetail.payload.event.Title,
        eventDescription: values.Description,
        sourceCode: resDetail.payload.event.Code,
        sourceName: resDetail.payload.event.Source,
        IsUpdate: isUpdate
      }

      const resEmailResult: any = await apis.SendEventEmail(reqBody);

      if (resEmailResult.status) {
        messageAPI.open({
          type: "success",
          content: resEmailResult.message,
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  const GetEventContactList = async (id: string) => {
    try {
      setLoadingContact(true);
      const response: any = await apis.GetEventContactListById(id);
      if (response.status) {
        form.setFieldsValue({
          Status:
            eventDetail.Status || response.payload.contacts.length > 0
              ? 1
              : null,
        });
        const tempContacts = response.payload.contacts.map(
          (contact: any, index: number) => {
            const tempContact = initialData.contacts.filter(
              (con: any) => con.ContactId === contact.ContactId
            )[0];
            return {
              index: index + 1,
              id: contact.EventContactId,
              Email: tempContact.Email,
              Name: tempContact.ContactName,
              Mobile: tempContact.MobilePhoneNumber,
              Company: tempContact.OrgName,
            };
          }
        );
        setContacts([
          {
            index: 0,
            Email: eventDetail.UserEmail,
            Name: eventDetail.UserName,
            Mobile: "",
            Company: "",
          },
          ...tempContacts,
        ]);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: response.payload.contacts.length + 1,
          },
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingContact(false);
    }
  };

  const handleTableChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setContacts([]);
    }
  };

  React.useEffect(() => {
    if (id && eventDetail && initialData.contacts.length > 0) {
      GetEventContactList(id);
    }
  }, [eventDetail, id, initialData]);


  const DeleteContact = async () => {
    try {
      if (currentContact) {
        setDeleteLoading(true);
        const response: any = await apis.DeleteEventContactById(
          id,
          currentContact.id
        );
        if (response.status) {
          setDeleteOpen(false);
          // messageAPI.open({
          //   type: "success",
          //   content: response.message,
          // });
          GetEventContactList(id);
        }
      }
    } catch (err: any) {
      // messageAPI.open({
      //   type: "error",
      //   content: err?.response?.data?.message || "Something went wrong!!!",
      // });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Form
        layout="horizontal"
        className="summary-form"
        onFinish={SaveEvent}
        form={form}
      >
        <Row>
          <Col
            xs={24}
            sm={12}
            md={9}
            lg={9}
            xl={9}
            style={{ padding: "0px 5px" }}
          >
            <Form.Item label="Source">
              <Input
                disabled
                value={`${eventDetail.Source} (${eventDetail.Code})`}
              />
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={12}
            md={5}
            lg={5}
            xl={5}
            style={{ padding: "0px 5px" }}
          >
            <Form.Item
              label="Priority"
              name="Priority"
              initialValue={eventDetail.Priority}
              rules={[{ required: true, message: "Please select priority!" }]}
            >
              <Select
                options={initialData.eventPriority.map((priority: any) => {
                  return {
                    label: priority.Priority,
                    value: priority.EPriorityId,
                  };
                })}
              />
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={12}
            md={5}
            lg={5}
            xl={5}
            style={{ padding: "0px 5px" }}
          >
            <Form.Item
              label="Type"
              name="Type"
              initialValue={eventDetail.Type}
              rules={[{ required: true, message: "Please select type!" }]}
            >
              <Select
                options={initialData.eventType.map((type: any) => {
                  return {
                    label: type.Type,
                    value: type.ETypeId,
                  };
                })}
              />
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={12}
            md={5}
            lg={5}
            xl={5}
            style={{ padding: "0px 5px" }}
          >
            <Form.Item label="Status" name="Status">
              <Select
                options={initialData.eventStatus.map((status: any) => {
                  return {
                    label: status.Status,
                    value: status.EStatusId,
                  };
                })}
              />
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={12}
            md={4}
            lg={4}
            xl={4}
            style={{ padding: "0px 5px" }}
          >
            <Form.Item
              label="Created"
              initialValue={dayjs(eventDetail.CreateDate)}
            >
              <DatePicker
                format="DD/MM/YYYY"
                disabled
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={12}
            md={5}
            lg={5}
            xl={5}
            style={{ padding: "0px 5px" }}
          >
            <Form.Item label="User">
              <Input value={eventDetail.UserName} disabled />
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={12}
            md={5}
            lg={5}
            xl={5}
            style={{ padding: "0px 5px" }}
          >
            <Form.Item
              label="Due"
              name="DueDate"
              initialValue={
                eventDetail.DueDate ? dayjs(eventDetail.DueDate) : ""
              }
              rules={[{ required: true, message: "Please choose due date!" }]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={12}
            md={4}
            lg={4}
            xl={4}
            style={{ padding: "0px 5px" }}
          >
            <Form.Item
              label="Recurring"
              name="IsRecurring"
              initialValue={eventDetail.IsRecurring}
              rules={[{ required: true, message: "Please select recurring!" }]}
            >
              <Select
                options={[
                  {
                    label: "Yes",
                    value: 1,
                  },
                  {
                    label: "No",
                    value: 0,
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={12}
            md={6}
            lg={6}
            xl={6}
            style={{ padding: "0px 5px" }}
          >
            <Form.Item label="Interval">
              <Flex gap={5}>
                <Form.Item
                  name="IntervalY"
                  style={{ width: "30%" }}
                  initialValue={eventDetail.IntervalY}
                  dependencies={["IsRecurring"]}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (getFieldValue("IsRecurring") === 1 && !value) {
                          return Promise.reject();
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <InputNumber
                    type="number"
                    placeholder="Years"
                    style={{ width: "100%" }}
                    step={1}
                    min={0}
                  />
                </Form.Item>
                <Form.Item
                  name="IntervalM"
                  style={{ width: "30%" }}
                  initialValue={eventDetail.IntervalM}
                  dependencies={["IsRecurring"]}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (getFieldValue("IsRecurring") === 1 && !value) {
                          return Promise.reject();
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <InputNumber
                    type="number"
                    placeholder="Months"
                    style={{ width: "100%" }}
                    step={1}
                    min={0}
                  />
                </Form.Item>
                <Form.Item
                  name="IntervalD"
                  style={{ width: "30%" }}
                  initialValue={eventDetail.IntervalD}
                  dependencies={["IsRecurring"]}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (getFieldValue("IsRecurring") === 1 && !value) {
                          return Promise.reject();
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <InputNumber
                    type="number"
                    placeholder="Days"
                    step={1}
                    min={0}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Flex>
            </Form.Item>
          </Col>
          <Col span={24} style={{ padding: "0px 5px" }}>
            <Form.Item
              label="Details"
              name="Description"
              initialValue={eventDetail.Description}
              rules={[{ required: true, message: "Please input details!" }]}
            >
              <Input.TextArea style={{ resize: "none", height: 100 }} />
            </Form.Item>
          </Col>
          <Col span={24} style={{ padding: "0px 5px" }}>
            <Form.Item label="Private">
              <Switch />
            </Form.Item>
          </Col>
        </Row>
        <Flex gap={10} align="center" style={{ marginTop: 10 }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Contacts
          </Typography.Title>
          <Button
            icon={<PlusOutlined />}
            size="small"
            type="primary"
            onClick={() => {
              setCurrentContact(null);
              setOpen(true);
            }}
          />
        </Flex>
        <Divider style={{ margin: "5px 0px" }} />
        <Table
          columns={[
            { title: "Name", dataIndex: "Name" },
            {
              title: "Email",
              dataIndex: "Email",
            },
            { title: "Mobile", dataIndex: "Mobile" },
            {
              title: "Company",
              dataIndex: "Company",
            },
            {
              title: "Actions",
              render: (_: any, record: any) => (
                <Flex>
                  <Button
                    type="primary"
                    icon={<DeleteOutlined />}
                    danger
                    disabled={record.index === 0}
                    onClick={() => {
                      setCurrentContact(record);
                      setDeleteOpen(true);
                    }}
                  />
                </Flex>
              ),
            },
          ]}
          size="small"
          scroll={{
            x: true,
          }}
          loading={loadingContact}
          dataSource={contacts}
          pagination={tableParams.pagination}
          rowKey={"index"}
          onChange={handleTableChange}
        />
        <Row>
          <Flex
            justify="flex-end"
            gap={10}
            style={{ width: "100%", padding: "0px 5px", marginTop: 10 }}
          >
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: 100 }}
              loading={saving}
              disabled={contacts.length <= 1}
            >
              SAVE
            </Button>
            <Button
              style={{ width: 100 }}
              onClick={() => {
                navigate("/events");
              }}
            >
              CANCEL
            </Button>
          </Flex>
        </Row>
      </Form>

      <ContactModal
        open={open}
        setOpen={setOpen}
        handleOk={() => GetEventContactList(id)}
        contacts={initialData.contacts}
      />
      <DeleteModal
        handleOk={DeleteContact}
        loading={deleteLoading}
        open={deleteOpen}
        setOpen={setDeleteOpen}
        text="Delete Contact?"
      />
    </>
  );
};

export default EventSummary;
