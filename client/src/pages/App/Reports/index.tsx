import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Table,
  Typography,
  Button,
  Input,
  Space,
  type InputRef,
  DatePicker,
} from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import { apis } from "@/apis";
import type { FilterDropdownProps } from "antd/es/table/interface";
import dayjs, { Dayjs } from "dayjs";
import { ExportJsonCsv } from "react-export-json-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ReportsPage = () => {
  interface PrintableEvent {
    Code: string;
    EventName: string;
    Priority: string;
    Status: string;
    Source: string;
    Due: string;
    Type: string;
  }

  interface Contact {
    ContactId: string;
    Email: string;
    ContactName: string;
    OrgName: string;
  }

  interface InitialData {
    contacts: Contact[];
    code: any;
    eventPriority: any;
    eventStatus: any;
    eventType: any;
    attachmentType: any;
  }

  interface EventRecord {
    DueDate: string;
    EventStatus: string;
    [key: string]: any;
  }

  const [events, setEvents] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [eventsForPrint, setEventsForPrint] = useState<PrintableEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [subTableData, setSubTableData] = useState<Record<string, any[]>>({});
  const [initialData, setInitialData] = useState<InitialData>({
    code: [],
    eventPriority: [],
    eventStatus: [],
    eventType: [],
    contacts: [],
    attachmentType: [],
  });

  const searchPropertyInput = useRef<InputRef>(null);

  const headers = [
    { key: "Code", name: "Code" },
    { key: "EventName", name: "EventName" },
    { key: "Priority", name: "Priority" },
    { key: "Status", name: "Status" },
    { key: "Source", name: "Source" },
    { key: "Due", name: "Due" },
    { key: "Type", name: "Type" },
  ];

  const expandedRowRender = (record: any) => {
    const subColumns = [
      {
        title: "Date",
        dataIndex: "NoteDate",
        key: "date",
        render: (value: string) =>
          new Date(value).toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
      },
      { title: "User", dataIndex: "UserEmail", key: "user" },
      { title: "Note", dataIndex: "NoteText", key: "note" },
    ];
    const data = subTableData[record.EventId] || [];
    return <Table columns={subColumns} dataSource={data} pagination={false} rowKey="EventNoteId" />;
  };

  const handleExpand = async (expanded: boolean, record: any) => {
    const id = record.EventId;
    if (expanded) {
      setExpandedRowKeys([id]);
      if (!subTableData[id]) {
        try {
          const response: any = await apis.GetEventNoteListById(id);
          if (response.status) {
            setSubTableData((prev) => ({ ...prev, [id]: response.payload.notes }));
          }
        } catch (error) {
          console.error("Failed to fetch note data:", error);
        }
      }
    } else {
      setExpandedRowKeys([]);
    }
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "Code",
      sorter: (a: any, b: any) => a.Code.localeCompare(b.Code),
      filters: initialData.code.map((c: any) => ({ text: c.Code, value: c.Code })),
      onFilter: (value: any, record: any) => record.Code === value,
    },
    {
      title: "EventName",
      dataIndex: "Title",
      sorter: (a: any, b: any) => a.Title.localeCompare(b.Title),
    },
    {
      title: "Priority",
      dataIndex: "EventPriority",
      filters: initialData.eventPriority.map((p: any) => ({ text: p.Priority, value: p.Priority })),
      onFilter: (value: any, record: any) => record.EventPriority === value,
    },
    {
      title: "Status",
      dataIndex: "EventStatus",
      filters: initialData.eventStatus.map((s: any) => ({ text: s.Status, value: s.Status })),
      onFilter: (value: any, record: any) => record.EventStatus === value,
    },
    {
      title: "Source",
      dataIndex: "Source",
      sorter: (a: any, b: any) => a.Source.localeCompare(b.Source),
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
            placeholder="Search Source"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button type="primary" onClick={() => confirm()} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
              Search
            </Button>
            <Button onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
              Reset
            </Button>
            <Button type="link" size="small" onClick={() => confirm({ closeDropdown: false })}>
              Filter
            </Button>
            <Button type="link" size="small" onClick={() => close()}>
              Close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
      onFilter: (value: any, record: any) =>
        record.Source.toString().toLowerCase().includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: (visible: boolean) => {
        if (visible) {
          setTimeout(() => searchPropertyInput.current?.select(), 100);
        }
      },
    },
    {
      title: "Due",
      dataIndex: "DueDate",
      render: (date: string) => dayjs(date).format("MM/DD/YYYY"),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => {
        const selectedDate = selectedKeys[0] ? dayjs(selectedKeys[0] as string) : null;
        return (
          <div style={{ padding: 8 }}>
            <DatePicker
              value={selectedDate}
              onChange={(date: Dayjs | null) => {
                const formatted = date ? date.format("MM/DD/YYYY") : "";
                setSelectedKeys(formatted ? [formatted] : []);
              }}
              style={{ marginBottom: 8, display: "block" }}
            />
            <Button onClick={() => confirm()} type="primary" size="small" style={{ width: 90, marginRight: 8 }}>
              Filter
            </Button>
            <Button onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </div>
        );
      },
      onFilter: (value: any, record: EventRecord) =>
        dayjs(record.DueDate).format("MM/DD/YYYY") === value,
      sorter: (a: any, b: any) =>
        new Date(a.DueDate).getTime() - new Date(b.DueDate).getTime(),
    },
    {
      title: "Type",
      dataIndex: "EventType",
      filters: initialData.eventType.map((t: any) => ({ text: t.Type, value: t.Type })),
      onFilter: (value: any, record: any) => record.EventType === value,
    },
  ];

  const GetEventList = async () => {
    setLoading(true);
    try {
      const response: any = await apis.GetEventList();
      if (response.status) {
        setEvents(response.payload.events);
        setFilteredData(response.payload.events); // Set initial filtered data
      }
    } finally {
      setLoading(false);
    }
  };

  const GetInitialData = async () => {
    try {
      const response: any = await apis.GetEventInitialData();
      if (response.status) {
        setInitialData(response.payload);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    GetInitialData();
    GetEventList();
  }, []);

  useEffect(() => {
    const tempForPrint: PrintableEvent[] = filteredData.map((item) => {
      const matchedPriority = initialData.eventPriority.find((p: any) => p.EPriorityId === item.Priority);
      const matchedStatus = initialData.eventStatus.find((s: any) => s.EStatusId === item.Status);
      const matchedType = initialData.eventType.find((t: any) => t.ETypeId === item.Type);

      return {
        Code: item.Code,
        EventName: item.Title,
        Priority: matchedPriority?.Priority || item.EventPriority || "",
        Status: matchedStatus?.Status || item.EventStatus || "",
        Source: item.Source,
        Due: item.DueDate,
        Type: matchedType?.Type || item.EventType || "",
      };
    });
    setEventsForPrint(tempForPrint);
  }, [filteredData, initialData]);

  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = headers.map((h) => h.name);
    const tableRows = eventsForPrint.map((item) => [
      item.Code,
      item.EventName,
      item.Priority,
      item.Status,
      item.Source,
      dayjs(item.Due).format("MM/DD/YYYY"),
      item.Type,
    ]);
    doc.text("Events Listing", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("events-listing.pdf");
  };

  return (
    <Card
      title={<Typography.Title level={4} style={{ margin: 0 }}>EVENTS LISTING</Typography.Title>}
      extra={
        <Space>
          <ExportJsonCsv headers={headers} items={eventsForPrint} fileTitle="events-listing.csv">
            Export CSV
          </ExportJsonCsv>
          <Button type="primary" icon={<DownloadOutlined />} onClick={exportPDF}>
            Export PDF
          </Button>
        </Space>
      }
    >
      <Table
        dataSource={events}
        rowKey="EventId"
        bordered
        columns={columns}
        expandedRowRender={expandedRowRender}
        expandedRowKeys={expandedRowKeys}
        onExpand={handleExpand}
        expandIconColumnIndex={columns.length}
        loading={loading}
        size="small"
        pagination={{ pageSize: 20 }}
        scroll={{ x: true }}
        onChange={(_pagination, _filters, _sorter, extra) => {
          setFilteredData(extra.currentDataSource); // Always update filtered data
        }}
      />
    </Card>
  );
};

export default ReportsPage;
