import React from "react";
import {
  Flex,
  Card,
  Table,
  Typography,
  Button,
  Space,
  Input,
  Switch,
  type InputRef,
  Tag,
} from "antd";
import { useDispatch } from "react-redux";
import { setEventData, setIsOpenEventModal } from "@/store/slices/AppSlice";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { apis } from "@/apis";

const OrganisationsPage = () => {
  const dispatch = useDispatch();
  const [organisations, setOrganisations] = React.useState<Array<any>>([]);
  const [filteredData, setFilteredData] = React.useState<Array<any>>([]);
  const [loading, setLoading] = React.useState(false);
  const searchPropertyInput = React.useRef<InputRef>(null);
  const searchContactInput = React.useRef<InputRef>(null);
  const [filters, setFilters] = React.useState([]);

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const onChange = (_pagination: any, filters: any) => {
    setFilters(filters["Type"] || []);
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "OrgCode",
      sorter: (a: any, b: any) => a.OrgCode.localeCompare(b.OrgCode),
    },
    {
      title: "Status",
      dataIndex: "IsActive",
      render: (isActive: boolean) => <Switch checked={isActive} size="small" />,
      filters: [
        { text: "Active", value: true },
        { text: "InActive", value: false },
      ],
      onFilter: (value: any, record: any) => record.IsActive === value,
    },
    {
      title: "Type",
      dataIndex: "Type",
      render: (_: any, record: any) => (
        <Flex gap={1}>
          {record.IsSupplier ? <Tag color="magenta">Supplier</Tag> : null}
          {record.IsContractor ? <Tag color="red">Contractor</Tag> : null}
          {record.IsDeveloper ? <Tag color="volcano">Developer</Tag> : null}
          {record.IsManufacturer ? (
            <Tag color="orange">Manufacturer</Tag>
          ) : null}
          {record.IsLettingAgent ? <Tag color="gold">LettingAgent</Tag> : null}
          {record.IsManagingAgent ? (
            <Tag color="lime">ManagingAgent</Tag>
          ) : null}
          {record.IsTenant ? <Tag color="green">Tenant</Tag> : null}
          {record.IsOwner ? <Tag color="cyan">Owner</Tag> : null}
          {record.IsUs ? <Tag color="blue">Us</Tag> : null}
          {record.IsLender ? <Tag color="geekblue">Lender</Tag> : null}
          {record.IsBorrower ? <Tag color="purple">Borrower</Tag> : null}
        </Flex>
      ),
      filters: [
        { text: "IsSupplier", value: "IsSupplier" },
        { text: "IsContractor", value: "IsContractor" },
        { text: "IsDeveloper", value: "IsDeveloper" },
        { text: "IsManufacturer", value: "IsManufacturer" },
        { text: "IsLettingAgent", value: "IsLettingAgent" },
        { text: "IsManagingAgent", value: "IsManagingAgent" },
        { text: "IsTenant", value: "IsTenant" },
        { text: "IsOwner", value: "IsOwner" },
        { text: "IsUs", value: "IsUs" },
        { text: "IsLender", value: "IsLender" },
        { text: "IsBorrower", value: "IsBorrower" },
      ],
    },
    {
      title: "Organisation",
      dataIndex: "OrgName",
      sorter: (a: any, b: any) => a.OrgName.localeCompare(b.OrgName),
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
            placeholder={`Search Organisation`}
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
        record.OrgName.toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: (visible: boolean) => {
        if (visible) {
          setTimeout(() => searchPropertyInput.current?.select(), 100);
        }
      },
    },
    {
      title: "Contact",
      dataIndex: "ContactNames",
      render: (names: string) =>
        names && names.split(",").length > 0 ? (
          <ul style={{ margin: 0 }}>
            {names.split(",").map((name: string) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        ) : null,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        close,
      }: FilterDropdownProps) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchContactInput}
            placeholder={`Search Contact`}
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
        record.ContactNames &&
        record.ContactNames.toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: (visible: boolean) => {
        if (visible) {
          setTimeout(() => searchPropertyInput.current?.select(), 100);
        }
      },
    },
    {
      title: "Events",
      render: (_: any, record: any) => (
        <Flex>
          <Button
            size="small"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              dispatch(
                setEventData({
                  eventId: record.OrgId,
                  eventType: "organisation",
                })
              );
              dispatch(setIsOpenEventModal(true));
            }}
          />
        </Flex>
      ),
    },
  ];

  const GetOrganisationList = async () => {
    try {
      setLoading(true);
      const response: any = await apis.GetOrganisationList();
      if (response.status) {
        setOrganisations(response.payload.organisations);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  // const GetOrganisationInitial = async () => {
  //   try {
  //     const response: any = await apis.GetOrganisationInitialData();
  //     if (response.status) {
  //       setInitialData(response.payload);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  React.useEffect(() => {
    // GetOrganisationInitial();
    GetOrganisationList();
  }, []);

  React.useEffect(() => {
    if (filters.length > 0) {
      setFilteredData(
        organisations.filter((org: any) =>
          filters.every((filter: string) => org[filter])
        )
      );
    } else {
      setFilteredData(organisations);
    }
  }, [organisations, filters]);

  return (
    <Card
      title={
        <Typography.Title level={4} style={{ margin: 0 }}>
          Organisation List
        </Typography.Title>
      }
    >
      <Table
        dataSource={filteredData}
        rowKey="OrgId"
        bordered
        columns={columns}
        loading={loading}
        size="small"
        pagination={{
          pageSize: 20,
        }}
        scroll={{
          x: true,
        }}
        onChange={onChange}
      />
    </Card>
  );
};

export default OrganisationsPage;
