import React, { useState } from "react";
import { Card, Table, Typography, Button, Input, Space, type InputRef, DatePicker } from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import { apis } from "@/apis";
import type { FilterDropdownProps } from "antd/es/table/interface";
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { ExportJsonCsv } from 'react-export-json-csv';

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
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [events, setEvents] = React.useState<any[]>([]);
  const [eventsForPrint, setEventsForPrint] = React.useState<PrintableEvent[]>([]);
  const searchPropertyInput = React.useRef<InputRef>(null);
  const [loading, setLoading] = React.useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = React.useState<React.Key[]>([]);
  const [subTableData, setSubTableData] = React.useState<Record<string, any[]>>({});

  const headers = [
    { key: 'Code', name: 'Code' },
    { key: 'EventName', name: 'EventName' },
    { key: 'Priority', name: 'Priority' },
    { key: 'Status', name: 'Status' },
    { key: 'Source', name: 'Source' },
    { key: 'Due', name: 'Due' },
    { key: 'Type', name: 'Type' },
  ]

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

  const [initialData, setInitialData] = React.useState<InitialData>({
    code: [],
    eventPriority: [],
    eventStatus: [],
    eventType: [],
    contacts: [],
    attachmentType: [],
  });

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const expandedRowRender = (record: any) => {
    const subColumns = [
      {
        title: 'Date',
        dataIndex: 'NoteDate',
        key: 'date',
        render: (value: string) =>
          new Date(value).toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })
      },
      { title: 'User', dataIndex: 'UserEmail', key: 'user' },
      { title: 'Note', dataIndex: 'NoteText', key: 'note' },
    ];

    const data = subTableData[record.EventId] || [];

    return (
      <Table
        columns={subColumns}
        dataSource={data}
        pagination={false}
        rowKey="EventNoteId"
      />
    );
  };

  const handleExpand = async (expanded: boolean, record: any) => {
    const id = record.EventId;

    if (expanded) {
      setExpandedRowKeys([id]); // expand only one at a time

      // Only fetch if not already loaded
      if (!subTableData[id]) {
        try {
          const response: any = await apis.GetEventNoteListById(id as string);
          if (response.status) {
            setSubTableData(prev => ({ ...prev, [id]: response.payload.notes }));
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
      filters: initialData.code
        ? initialData.code.map((pri: any) => {
          return {
            text: pri.Code,
            value: pri.Code,
          };
        })
        : [],
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
      title: "Due",
      dataIndex: "DueDate",
      render: (date: string) => dayjs(date).format("MM/DD/YYYY"),
      filterDropdown: (props: FilterDropdownProps) => {
        const {
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        } = props;

        const selectedDate = selectedKeys[0] ? dayjs(selectedKeys[0] as string) : null;

        return (
          <div style={{ padding: 8 }}>
            <DatePicker
              value={selectedDate}
              onChange={(date: Dayjs | null) => {
                const formatted = date ? date.format("MM/DD/YYYY") : '';
                setSelectedKeys(formatted ? [formatted] : []);
              }}
              style={{ marginBottom: 8, display: 'block' }}
            />
            <Button
              onClick={() => confirm()}
              type="primary"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Filter
            </Button>
            <Button
              onClick={() => clearFilters?.()}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </div>
        );
      },
      onFilter: (value: string | number | boolean, record: EventRecord) => {
        const recordDate = dayjs(record.DueDate).format("MM/DD/YYYY");
        return recordDate === value;
      },
      sorter: (a: any, b: any) => {
        if (a.DueDate === null && b.DueDate === null) return 0;
        if (a.DueDate === null) return -1;
        if (b.DueDate === null) return 1;
        return new Date(a.DueDate).getTime() - new Date(b.DueDate).getTime();
      },
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

  React.useEffect(() => {
    const tempForPrint: PrintableEvent[] = filteredData.map((item) => {
      const matchedPriority = initialData.eventPriority.find(
        (p: { EPriorityId: any; }) => p.EPriorityId === item.Priority
      );
      const matchedStatus = initialData.eventStatus.find(
        (p: { EStatusId: any; }) => p.EStatusId === item.Status
      );
      const matchedType = initialData.eventType.find(
        (p: { ETypeId: any; }) => p.ETypeId === item.Type
      );

      return {
        Code: item.Code,
        EventName: item.Title,
        Priority: matchedPriority?.Priority || '', // fallback if not found
        Status: matchedStatus?.Status || '',
        Source: item.Source,
        Due: item.DueDate,
        Type: matchedType?.Type || '',
      };
    });

    setEventsForPrint(tempForPrint);
  }, [filteredData]);

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
          EVENTS LISTING
        </Typography.Title>
      }
    >
      <ExportJsonCsv
        headers={headers}
        items={eventsForPrint}
        fileTitle="my-data.csv"
      >
        <Button type="primary" icon={<DownloadOutlined />}>
          Export CSV
        </Button>
      </ExportJsonCsv>
      <Table
        dataSource={events}
        rowKey="EventId"
        bordered
        columns={columns as any}
        expandedRowRender={expandedRowRender}
        expandedRowKeys={expandedRowKeys}
        onExpand={handleExpand}
        expandIconColumnIndex={columns.length}
        loading={loading}
        size="small"
        pagination={{
          pageSize: 20,
        }}
        scroll={{
          x: true,
        }}
        onChange={(pagination, filters, sorter, extra) => {
          if (extra.action === 'filter' || extra.action === 'sort') {
            setFilteredData(extra.currentDataSource);
          }
        }}
      //   onChange={onChange}
      />
    </Card>
  );
};

export default ReportsPage;
