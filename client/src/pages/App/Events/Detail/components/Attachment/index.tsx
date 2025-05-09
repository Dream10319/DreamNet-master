import React from "react";
import AttachmentModal from "@/components/Modals/AttachmentModal";
import {
  DeleteOutlined,
  PlusOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Button, Flex, Table } from "antd";
import DeleteModal from "@/components/Modals/DeleteModal";
import { apis } from "@/apis";
import { useParams } from "react-router-dom";

interface EventAttachmentProps {
  attachmentType: Array<any>;
}

const EventAttachment: React.FC<EventAttachmentProps> = ({
  attachmentType,
}) => {
  const { id } = useParams();
  const [open, setOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [currentAttach, setCurrentAttach] = React.useState<any>(null);
  const [attachments, setAttachments] = React.useState<Array<any>>([]);

  const getFileExtension = (name: string) => {
    return name.toLowerCase().split(".").pop();
  };

  const DeleteNote = async () => {
    try {
      setDeleteLoading(true);
      const response: any = await apis.DeleteEventAttachmentById(
        id as string,
        currentAttach.EventAttachmentId as string
      );
      if (response.status) {
        GetEventAttachmentList();
        setDeleteOpen(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const GetEventAttachmentList = async () => {
    try {
      setLoading(true);
      const response: any = await apis.GetEventAttachmentListById(id as string);
      if (response.status) {
        setAttachments(response.payload.attachments);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (id) {
      GetEventAttachmentList();
    }
  }, [id]);

  return (
    <>
      <Table
        title={() => (
          <Button
            size="small"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentAttach(null);
              setOpen(true);
            }}
          >
            Add File
          </Button>
        )}
        columns={[
          {
            title: "Date",
            dataIndex: "UploadedAt",
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
            title: "Title",
            dataIndex: "Title",
          },
          {
            title: "Type",
            render: (_: any, record: any) => (
              <Button
                onClick={() => {
                  if (
                    record.AttachmentTypeName === "Image" ||
                    record.AttachmentTypeName === "Pdf"
                  ) {
                    window.open(
                      import.meta.env.VITE_BACKEND_URL + "/" + record.FilePath,
                      "_blank"
                    );
                  }
                }}
                icon={
                  record.AttachmentTypeName === "Image" ? (
                    <FileImageOutlined />
                  ) : record.AttachmentTypeName === "Pdf" ? (
                    <FilePdfOutlined />
                  ) : record.AttachmentTypeName === "Word" ? (
                    <FileWordOutlined />
                  ) : (
                    <FileExcelOutlined />
                  )
                }
                disabled={
                  record.AttachmentTypeName === "Word" ||
                  record.AttachmentTypeName === "Excel"
                }
              />
            ),
          },
          {
            title: "Actions",
            render: (_: any, record: any) => (
              <Flex gap={10}>
                <Button
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    const pdfUrl = `${import.meta.env.VITE_BACKEND_URL}/${record.FilePath}`;
                    fetch(pdfUrl, {
                      method: "GET",
                      headers: {
                        "Content-Type":
                          record.AttachmentTypeName === "Pdf"
                            ? "application/pdf"
                            : record.AttachmentTypeName === "Image"
                              ? "image/jpeg"
                              : record.AttachmentTypeName === "Word"
                                ? getFileExtension(record.FileName) === "doc"
                                  ? "application/msword"
                                  : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                : record.AttachmentTypeName === "Excel"
                                  ? getFileExtension(record.FileName) === "xls"
                                    ? "application/vnd.ms-excel"
                                    : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                  : "application/octet-stream",
                      },
                    })
                      .then((response) => response.blob())
                      .then((blob) => {
                        const url = window.URL.createObjectURL(
                          new Blob([blob])
                        );
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute(
                          "download",
                          `Attachment-${record.EventAttachmentId}-${record.FileName}`
                        );
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      });
                  }}
                />
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  size="small"
                  onClick={() => {
                    setDeleteOpen(true);
                    setCurrentAttach(record);
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
        dataSource={attachments}
        rowKey={"EventAttachmentId"}
      />
      <AttachmentModal
        open={open}
        setOpen={setOpen}
        attachmentType={attachmentType}
        handleOk={GetEventAttachmentList}
      />
      <DeleteModal
        handleOk={DeleteNote}
        open={deleteOpen}
        setOpen={setDeleteOpen}
        loading={deleteLoading}
        text="Delete Attachment?"
      />
    </>
  );
};

export default EventAttachment;
