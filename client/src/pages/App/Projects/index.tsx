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
import { setEventData, setIsOpenEventModal } from "@/store/slices/AppSlice";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { apis } from "@/apis";

const ProjectsPage = () => {
  const dispatch = useDispatch();
  const [projects, setProjects] = React.useState<Array<any>>([]);
  const [loading, setLoading] = React.useState(false);
  const searchPropertyInput = React.useRef<InputRef>(null);
  const [initialData, setInitialData] = React.useState({
    projectStatus: [],
    projectDeveloper: [],
    projectContractor: [],
  });

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "ProjectCode",
      sorter: (a: any, b: any) => a.ProjectCode.localeCompare(b.ProjectCode),
    },
    {
      title: "Status",
      dataIndex: "ProjectStatusName",
      sorter: (a: any, b: any) =>
        a.ProjectStatusName.localeCompare(b.ProjectStatusName),
      filters: initialData.projectStatus.map((status: string) => ({
        text: status,
        value: status,
      })),
      onFilter: (value: any, record: any) => record.ProjectStatusName === value,
    },
    {
      title: "Property",
      dataIndex: "ProjectName",
      sorter: (a: any, b: any) => a.ProjectName.localeCompare(b.ProjectName),
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
        record.ProjectName.toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: (visible: boolean) => {
        if (visible) {
          setTimeout(() => searchPropertyInput.current?.select(), 100);
        }
      },
    },
    {
      title: "Contractor",
      dataIndex: "ConOrgName",
      sorter: (a: any, b: any) =>
        String(a.ConOrgName).localeCompare(String(b.ConOrgName)),
      filters: initialData.projectContractor.map((ma: string) => ({
        text: ma,
        value: ma,
      })),
      onFilter: (value: any, record: any) => record.ConOrgName === value,
    },
    {
      title: "Developer",
      dataIndex: "DevOrgName",
      sorter: (a: any, b: any) => a.DevOrgName.localeCompare(b.DevOrgName),
      filters: initialData.projectDeveloper.map((Group: string) => ({
        text: Group,
        value: Group,
      })),
      onFilter: (value: any, record: any) => record.DevOrgName === value,
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
                  eventId: record.ProjectId,
                  eventType: "project",
                })
              );
              dispatch(setIsOpenEventModal(true));
            }}
          />
        </Flex>
      ),
    },
  ];

  const GetProjectList = async () => {
    try {
      setLoading(true);
      const response: any = await apis.GetProjectList();
      if (response.status) {
        setProjects(response.payload.projects);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const GetProjectInitial = async () => {
    try {
      const response: any = await apis.GetProjectInitialData();
      if (response.status) {
        setInitialData(response.payload);
      }
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    GetProjectInitial();
    GetProjectList();
  }, []);

  return (
    <Card
      title={
        <Typography.Title level={4} style={{ margin: 0 }}>
          Project List
        </Typography.Title>
      }
    >
      <Table
        dataSource={projects}
        rowKey="ProjectId"
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

export default ProjectsPage;
