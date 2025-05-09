import React from "react";
import { Card, Table, Typography, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { apis } from "@/apis";
import { useNavigate } from "react-router-dom";

const EventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = React.useState<Array<any>>([]);
  // const [filteredData, setFilteredData] = React.useState<Array<any>>([]);
  const [loading, setLoading] = React.useState(false);
  const [initialData, setInitialData] = React.useState({
    eventPriority: [],
    eventStatus: [],
    eventType: [],
    contacts: [],
    attachmentType: [],
  });

  // const handleReset = (clearFilters: () => void) => {
  //   clearFilters();
  // };

  // const onChange = (pagination: any, filters: any) => {
  //   setFilters(filters["Type"] || []);
  // };

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
      sorter: (a: any, b: any) => a.Source.localeCompare(b.Source),
      // sorter: (a: any, b: any) => a.OrgName.localeCompare(b.OrgName),
      // filterDropdown: ({
      //   setSelectedKeys,
      //   selectedKeys,
      //   confirm,
      //   clearFilters,
      //   close,
      // }: FilterDropdownProps) => (
      //   <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
      //     <Input
      //       ref={searchPropertyInput}
      //       placeholder={`Search Organisation`}
      //       value={selectedKeys[0]}
      //       onChange={(e) => {
      //         setSelectedKeys(e.target.value ? [e.target.value] : []);
      //       }}
      //       onPressEnter={() => confirm()}
      //       style={{ marginBottom: 8, display: "block" }}
      //     />
      //     <Space>
      //       <Button
      //         type="primary"
      //         onClick={() => confirm()}
      //         icon={<SearchOutlined />}
      //         size="small"
      //         style={{ width: 90 }}
      //       >
      //         Search
      //       </Button>
      //       <Button
      //         onClick={() => clearFilters && handleReset(clearFilters)}
      //         size="small"
      //         style={{ width: 90 }}
      //       >
      //         Reset
      //       </Button>
      //       <Button
      //         type="link"
      //         size="small"
      //         onClick={() => {
      //           confirm({ closeDropdown: false });
      //         }}
      //       >
      //         Filter
      //       </Button>
      //       <Button
      //         type="link"
      //         size="small"
      //         onClick={() => {
      //           close();
      //         }}
      //       >
      //         close
      //       </Button>
      //     </Space>
      //   </div>
      // ),
      // filterIcon: (filtered: boolean) => (
      //   <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      // ),
      // onFilter: (value: any, record: any) =>
      //   record.OrgName.toString()
      //     .toLowerCase()
      //     .includes((value as string).toLowerCase()),
      // onFilterDropdownOpenChange: (visible: boolean) => {
      //   if (visible) {
      //     setTimeout(() => searchPropertyInput.current?.select(), 100);
      //   }
      // },
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
      render: (DueDate: any) =>
        DueDate ? new Date(DueDate).toLocaleDateString() : "",
      sorter: (a: any, b: any) => {
        if (a.DueDate === null && b.DueDate === null) return 0;
        if (a.DueDate === null) return -1;
        if (b.DueDate === null) return 1;
        return new Date(a.DueDate).getTime() - new Date(b.DueDate).getTime();
      },
    },
    {
      title: "Assigned To",
      dataIndex: "AssignedTo",
    },
    {
      title: "Contact",
      render: (_: any, record: any) =>
        record.Contacts && record.Contacts.split(";").length > 0 ? (
          <ul style={{ margin: 0 }}>
            <li key={0}>
              {record.UserName} - {record.UserEmail}
            </li>
            {record.Contacts.split(";").map((con: string, index: number) => (
              <li key={index + 1}>
                {con.split(",")[0]}
                {con.split(",")[1] !== "" ? ` - ${con.split(",")[1]}` : ""}
              </li>
            ))}
          </ul>
        ) : null,
      // filterDropdown: ({
      //   setSelectedKeys,
      //   selectedKeys,
      //   confirm,
      //   clearFilters,
      //   close,
      // }: FilterDropdownProps) => (
      //   <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
      //     <Input
      //       ref={searchContactInput}
      //       placeholder={`Search Contact`}
      //       value={selectedKeys[0]}
      //       onChange={(e) => {
      //         setSelectedKeys(e.target.value ? [e.target.value] : []);
      //       }}
      //       onPressEnter={() => confirm()}
      //       style={{ marginBottom: 8, display: "block" }}
      //     />
      //     <Space>
      //       <Button
      //         type="primary"
      //         onClick={() => confirm()}
      //         icon={<SearchOutlined />}
      //         size="small"
      //         style={{ width: 90 }}
      //       >
      //         Search
      //       </Button>
      //       <Button
      //         onClick={() => clearFilters && handleReset(clearFilters)}
      //         size="small"
      //         style={{ width: 90 }}
      //       >
      //         Reset
      //       </Button>
      //       <Button
      //         type="link"
      //         size="small"
      //         onClick={() => {
      //           confirm({ closeDropdown: false });
      //         }}
      //       >
      //         Filter
      //       </Button>
      //       <Button
      //         type="link"
      //         size="small"
      //         onClick={() => {
      //           close();
      //         }}
      //       >
      //         close
      //       </Button>
      //     </Space>
      //   </div>
      // ),
      // filterIcon: (filtered: boolean) => (
      //   <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      // ),
      // onFilter: (value: any, record: any) =>
      //   record.ContactNames &&
      //   record.ContactNames.toString()
      //     .toLowerCase()
      //     .includes((value as string).toLowerCase()),
      // onFilterDropdownOpenChange: (visible: boolean) => {
      //   if (visible) {
      //     setTimeout(() => searchPropertyInput.current?.select(), 100);
      //   }
      // },
    },
    {
      title: "Last Update",
      render: (_: any, record: any) =>
        new Date(
          record.LastUpdate ? record.LastUpdate : record.CreateDate
        ).toLocaleDateString(),
      sorter: (a: any, b: any) => {
        const aDate = a.LastUpdate ? a.LastUpdate : a.CreateDate;
        const bDate = b.LastUpdate ? b.LastUpdate : b.CreateDate;
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
