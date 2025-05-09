import React from "react";
import {
  Flex,
  Card,
  Table,
  Typography,
  Button,
  Space,
  Input,
  type InputRef,
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setIsOpenEventModal, setEventData } from "@/store/slices/AppSlice";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { apis } from "@/apis";

const RentalsPage = () => {
  const dispatch = useDispatch();
  const [rentals, setRentals] = React.useState<Array<any>>([]);
  const [loading, setLoading] = React.useState(false);
  const searchPropertyInput = React.useRef<InputRef>(null);
  const searchTenantInput = React.useRef<InputRef>(null);
  const [initialData, setInitialData] = React.useState({
    rentalStatus: [],
    rentalGroup: [],
    rentalMA: [],
  });

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "RentalCode",
      sorter: (a: any, b: any) => a.RentalCode.localeCompare(b.RentalCode),
    },
    {
      title: "Status",
      dataIndex: "RentalStatusName",
      sorter: (a: any, b: any) =>
        a.RentalStatusName.localeCompare(b.RentalStatusName),
      filters: initialData.rentalStatus.map((status: string) => ({
        text: status,
        value: status,
      })),
      onFilter: (value: any, record: any) => record.RentalStatusName === value,
    },
    {
      title: "Group",
      dataIndex: "RentalGroupName",
      sorter: (a: any, b: any) =>
        a.RentalGroupName.localeCompare(b.RentalGroupName),
      filters: initialData.rentalGroup.map((Group: string) => ({
        text: Group,
        value: Group,
      })),
      onFilter: (value: any, record: any) => record.RentalGroupName === value,
    },
    {
      title: "Property",
      dataIndex: "RentalName",
      sorter: (a: any, b: any) => a.RentalName.localeCompare(b.RentalName),
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
            placeholder={`Search Property`}
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
        record.RentalName.toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: (visible: boolean) => {
        if (visible) {
          setTimeout(() => searchPropertyInput.current?.select(), 100);
        }
      },
    },
    {
      title: "Tenant",
      dataIndex: "TenOrgName",
      sorter: (a: any, b: any) =>
        String(a.TenOrgName).localeCompare(String(b.TenOrgName)),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        close,
      }: FilterDropdownProps) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchTenantInput}
            placeholder={`Search Tenant`}
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
        record.TenOrgName &&
        record.TenOrgName.toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: (visible: boolean) => {
        if (visible) {
          setTimeout(() => searchTenantInput.current?.select(), 100);
        }
      },
    },
    {
      title: "Managing Agent",
      dataIndex: "MAOrgName",
      sorter: (a: any, b: any) =>
        String(a.MAOrgName).localeCompare(String(b.MAOrgName)),
      filters: initialData.rentalMA.map((ma: string) => ({
        text: ma,
        value: ma,
      })),
      onFilter: (value: any, record: any) => record.MAOrgName === value,
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
                setEventData({ eventId: record.RentalId, eventType: "rental" })
              );
              dispatch(setIsOpenEventModal(true));
            }}
          />
        </Flex>
      ),
    },
  ];

  const GetRentalList = async () => {
    try {
      setLoading(true);
      const response: any = await apis.GetRentalList();
      if (response.status) {
        setRentals(response.payload.rentals);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const GetRentalInitial = async () => {
    try {
      const response: any = await apis.GetRentalInitialData();
      if (response.status) {
        setInitialData(response.payload);
      }
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    GetRentalInitial();
    GetRentalList();
  }, []);

  return (
    <Card
      title={
        <Typography.Title level={4} style={{ margin: 0 }}>
          Rental List
        </Typography.Title>
      }
    >
      <Table
        dataSource={rentals}
        rowKey="RentalId"
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
      />
    </Card>
  );
};

export default RentalsPage;
