import React from "react";
import { Card, Table, Typography, Button, Input, Space, type InputRef, } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { apis } from "@/apis";
import { useNavigate } from "react-router-dom";
import type { FilterDropdownProps } from "antd/es/table/interface";

const EventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = React.useState<Array<any>>([]);
  const searchPropertyInput = React.useRef<InputRef>(null);
  const [loading, setLoading] = React.useState(false);
  interface Contact {
    ContactId: string;
    Email: string;
    ContactName: string;
    OrgName: string;
  }
  interface ContactValue {
    email: string;
    name: string;
    orgname: string;
  }
  interface InitialData {
    contacts: Contact[];
    eventPriority: any;
    eventStatus: any;
    eventType: any;
    attachmentType: any;
  }

  const [initialData, setInitialData] = React.useState<InitialData>({
    eventPriority: [],
    eventStatus: [],
    eventType: [],
    contacts: [],
    attachmentType: [],
  });

  const [contactData, setContactdata] = React.useState<Record<string, ContactValue>>({});
  React.useEffect(() => {
    const tempData: Record<string, ContactValue> = {};
    if (!initialData || !initialData.contacts) return;
    initialData.contacts.forEach(contact => {
      tempData[contact.ContactId] = {
        email: contact.Email,
        name: contact.ContactName,
        orgname: contact.OrgName,
      };
    });
    setContactdata(tempData);
  }, [initialData]);

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "Code",
      sorter: (a: any, b: any) => a.Code.localeCompare(b.Code),
    },
    {
      title: "Title",
      dataIndex: "Title",
      sorter: (a: any, b: any) => a.Title.localeCompare(b.Title),
    },
    {
      title: "Status",
      dataIndex: "EventStatus",
      filters: initialData.eventStatus
        ? initialData.eventStatus.map((status: any) => {
          return {
            text: status.Status,
            value: status.Status,
          };
        })
        : [],
      onFilter: (value: any, record: any) => record.EventStatus === value,
    },
    {
      title: "Type",
      dataIndex: "EventType",
      filters: initialData.eventType
        ? initialData.eventType.map((type: any) => {
          return {
            text: type.Type,
            value: type.Type,
          };
        })
        : [],
      onFilter: (value: any, record: any) => record.EventType === value,
    },
    {
      title: "Source",
      dataIndex: "Source",
      sorter: (a: any, b: any) => a.OrgName.localeCompare(b.Source),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        close,
      }: FilterDropdownProps) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchPropertyInput}
            placeholder={`Search Source`}
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
              }}
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      onFilter: (value: any, record: any) =>
        record.Source.toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: (visible: boolean) => {
        if (visible) {
          setTimeout(() => searchPropertyInput.current?.select(), 100);
        }
      },
    },
    {
      title: "Priority",
      dataIndex: "EventPriority",
      filters: initialData.eventPriority
        ? initialData.eventPriority.map((pri: any) => {
          return {
            text: pri.Priority,
            value: pri.Priority,
          };
        })
        : [],
      onFilter: (value: any, record: any) => record.EventPriority === value,
    },
    {
      title: "Due",
      dataIndex: "DueDate",
      render: (DueDate: any) => {
        if (!DueDate) return "";
        const date = new Date(DueDate);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
      sorter: (a: any, b: any) => {
        if (a.DueDate === null && b.DueDate === null) return 0;
        if (a.DueDate === null) return -1;
        if (b.DueDate === null) return 1;
        return new Date(a.DueDate).getTime() - new Date(b.DueDate).getTime();
      },
    },
    {
      title: "Assigned To",
      render: (_: any, record: any) => {
        if (!record.Contacts) return null;

        const contactIds: string[] = record.Contacts.split(",").map((id: string) => id.trim());

        const uniqueOrgs: string[] = Array.from(
          new Set(
            contactIds
              .map((id) => contactData[id]?.orgname || null)
              .filter((orgname): orgname is string => Boolean(orgname))
          )
        );

        return (
          <ul style={{ margin: 0 }}>
            {uniqueOrgs.map((org, index) => (
              <li key={index}>{org}</li>
            ))}
          </ul>
        );
      },
    },
    {
      title: "Last Update",
      render: (_: any, record: any) => {
        const rawDate = record.LastUpdate || record.CreateDate;
        if (!rawDate) return "";
        const date = new Date(rawDate);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
      sorter: (a: any, b: any) => {
        const aDate = a.LastUpdate || a.CreateDate;
        const bDate = b.LastUpdate || b.CreateDate;
        if (aDate === null && bDate === null) return 0;
        if (aDate === null) return -1;
        if (bDate === null) return 1;
        return new Date(aDate).getTime() - new Date(bDate).getTime();
      },
    },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            navigate(`/events/${record.EventId}`);
          }}
        />
      ),
    },
  ];

  const GetEventList = async () => {
    try {
      setLoading(true);
      const response: any = await apis.GetEventList();
      if (response.status) {
        setEvents(response.payload.events);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const GetOrganisationInitial = async () => {
    try {
      const response: any = await apis.GetOrganisationInitialData();
      if (response.status) {
        setInitialData(response.payload);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const GetEventInitial = async () => {
    try {
      setLoading(true);
      const response: any = await apis.GetEventInitialData();
      if (response.status) {
        setInitialData(response.payload);
      }
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    GetOrganisationInitial();
    GetEventList();
    GetEventInitial();
  }, []);

  // React.useEffect(() => {
  //   if (filters.length > 0) {
  //     setFilteredData(
  //       organisations.filter((org: any) =>
  //         filters.every((filter: string) => org[filter])
  //       )
  //     );
  //   } else {
  //     setFilteredData(organisations);
  //   }
  // }, [organisations, filters]);

  return (
    <Card
      title={
        <Typography.Title level={4} style={{ margin: 0 }}>
          EVENTS
        </Typography.Title>
      }
    >
      <Table
        dataSource={events}
        rowKey="EventId"
        bordered
        columns={columns as any}
        loading={loading}
        size="small"
        pagination={{
          pageSize: 20,
        }}
        scroll={{
          x: true,
        }}
      //   onChange={onChange}
      />
    </Card>
    
  );
};

export default EventsPage;
