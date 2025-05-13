import React from "react";
import { Card, Flex, Spin, Typography, Tabs } from "antd";
import { useParams } from "react-router-dom";
import { MessageContext } from "@/App";
import { apis } from "@/apis";
import { Event } from "./components";

const EventDetailPage = () => {
  const { id } = useParams();
  const messageAPI = React.useContext(MessageContext);
  const [loading, setLoading] = React.useState(false);
  const [event, setEvent] = React.useState<any>(null);
  const [tab, setTab] = React.useState("summary");
  const [initialData, setInitialData] = React.useState({
    eventPriority: [],
    eventStatus: [],
    eventType: [],
    contacts: [],
    attachmentType: [],
  });

  const GetEventDetailById = async (id: string) => {
    try {
      setLoading(true);
      const response: any = await apis.GetEventDetailById(id as string);
      if (response.status) {
        setEvent(response.payload.event);
      }
    } catch (err: any) {
      messageAPI.open({
        type: "error",
        content: err?.response?.data?.message || "Something went wrong!!!",
      });
    } finally {
      setLoading(false);
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
      messageAPI.open({
        type: "error",
        content: err?.response?.data?.message || "Something went wrong!!!",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    GetEventDetailById(id as string);
    GetEventInitial();
  }, [id]);

  return loading ? (
    <Flex justify="center">
      <Spin size="large" />
    </Flex>
  ) : event ? (
    <Card
      className="event-detail"
      title={
        <Typography.Title level={3} style={{ margin: 0 }}>
          {event.Title} ({event.Code})
        </Typography.Title>
      }
    >
      <Tabs
        defaultActiveKey={tab}
        onChange={(value: string) => setTab(value)}
        type="card"
        items={[
          {
            key: "summary",
            label: "Summary",
          },
          {
            key: "notes",
            label: "Notes",
          },
          {
            key: "history",
            label: "History",
          },
          {
            key: "attachments",
            label: "Attachments",
          },
        ]}
      />
      {tab === "summary" ? (
        <Event.Summary
          initialData={initialData}
          eventDetail={event}
          id={id}
          getEvent={() => GetEventDetailById(id as string)}
        />
      ) : tab === "notes" ? (
        <Event.Note
        initialData={initialData} />
      ) : tab === "history" ? (
        <Event.History />
      ) : (
        <Event.Attachment attachmentType={initialData.attachmentType} />
      )}
    </Card>
  ) : null;
};

export default EventDetailPage;
