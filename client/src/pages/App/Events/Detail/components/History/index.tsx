import React from "react";
import { Table } from "antd";
import { apis } from "@/apis";
import { useParams } from "react-router-dom";

const EventHistory = () => {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [history, setHistory] = React.useState<Array<any>>([]);

  const GetEventHistoryList = async () => {
    try {
      setLoading(true);
      const response: any = await apis.GetEventHistoryById(id as string);
      if (response.status) {
        setHistory(response.payload.history);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (id) {
      GetEventHistoryList();
    }
  }, [id]);

  return (
    <>
      <Table
        columns={[
          {
            title: "Date",
            dataIndex: "CreatedAt",
            render: (date: any) =>
              new Date(date).toLocaleDateString() +
              " " +
              new Date(date).toLocaleTimeString(),
          },
          {
            title: "User",
            render: (_: any, record: any) =>
              record.UserName + " " + `(${record.UserEmail})`,
          },
          {
            title: "Action",
            dataIndex: "ActionName",
          },
        ]}
        size="small"
        scroll={{
          x: true,
        }}
        loading={loading}
        dataSource={history}
        rowKey={"EventHistoryId"}
      />
    </>
  );
};

export default EventHistory;
