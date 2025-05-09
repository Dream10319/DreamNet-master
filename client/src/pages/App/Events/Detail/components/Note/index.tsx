import React from "react";
import NoteModal from "@/components/Modals/NoteModal";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Table } from "antd";
import DeleteModal from "@/components/Modals/DeleteModal";
import { apis } from "@/apis";
import { useParams } from "react-router-dom";
import TextTruncate from "react-text-truncate";

const Truncate = ({ text }: { text: string }) => {
  const [isTruncated, setIsTruncated] = React.useState(true);
  const handleToggle = () => {
    setIsTruncated(!isTruncated);
  };

  return isTruncated ? (
    <TextTruncate
      line={1}
      element="p"
      truncateText="…"
      text={text}
      textTruncateChild={<a onClick={handleToggle}>More</a>}
    />
  ) : (
    <p>
      {text} <a onClick={handleToggle}>Less</a>
    </p>
  );
};

const EventNote = () => {
  const { id } = useParams();
  const [open, setOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [currentNote, setCurrentNote] = React.useState<any>(null);
  const [notes, setNotes] = React.useState<Array<any>>([]);

  const DeleteNote = async () => {
    try {
      setDeleteLoading(true);
      const response: any = await apis.DeleteEventNoteById(
        id as string,
        currentNote.EventNoteId as string
      );
      if (response.status) {
        GetEventNoteList();
        setDeleteOpen(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const GetEventNoteList = async () => {
    try {
      setLoading(true);
      const response: any = await apis.GetEventNoteListById(id as string);
      if (response.status) {
        setNotes(response.payload.notes);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (id) {
      GetEventNoteList();
    }
  }, [id]);

  return (
    <>
      <Table
        title={() => (
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentNote(null);
              setOpen(true);
            }}
          >
            Add Note
          </Button>
        )}
        columns={[
          {
            title: "Date",
            dataIndex: "NoteDate",
            render: (date: any) => new Date(date).toLocaleDateString(),
          },
          {
            title: "User",
            render: (_: any, record: any) =>
              record.UserName + " " + `(${record.UserEmail})`,
          },
          {
            title: "Note",
            dataIndex: "NoteText",
            render: (NoteText: string) => <Truncate text={NoteText} />,
          },
          {
            title: "Actions",
            render: (_: any, record: any) => (
              <Flex gap={10}>
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  size="small"
                  onClick={() => {
                    setDeleteOpen(true);
                    setCurrentNote(record);
                  }}
                />
                <Button
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => {
                    setOpen(true);
                    setCurrentNote(record);
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
        loading={loading}
        dataSource={notes}
        rowKey={"EventNoteId"}
      />
      <NoteModal
        open={open}
        setOpen={setOpen}
        note={currentNote}
        handleOk={GetEventNoteList}
      />
      <DeleteModal
        handleOk={DeleteNote}
        open={deleteOpen}
        setOpen={setDeleteOpen}
        loading={deleteLoading}
        text="Delete Note?"
      />
    </>
  );
};

export default EventNote;
