import React from "react";
import {
  Button,
  Flex,
  Input,
  Modal,
  Form,
  Typography,
  Upload,
  Spin,
  type UploadProps,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { MessageContext } from "@/App";
import { apis } from "@/apis";
import { useParams } from "react-router-dom";

interface AttachmentModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  handleOk: () => void;
  attachmentType: Array<any>;
}

const contentStyle: React.CSSProperties = {
  padding: "50px 80px",
  borderRadius: 4,
};

const getFileExtension = (name: string) => {
  return name.toLowerCase().split(".").pop();
};

const AttachmentModal: React.FC<AttachmentModalProps> = ({
  open,
  setOpen,
  handleOk,
  attachmentType,
}) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const messageAPI = React.useContext(MessageContext);
  const [loading, setLoading] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [uploadedPath, setUploadedPath] = React.useState<string | null>(null);
  const [fileList, setFileList] = React.useState<Array<any>>([]);

  const handleClose = () => {
    if (!uploading) {
      setOpen(false);
      if (uploadedPath) {
        setFileList([]);
        setUploadedPath(null);
      }
    }
  };

  const handleUpload: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    try {
      if (uploadedPath) {
        apis.DeleteUploadedFile({ path: uploadedPath });
      }
      if (newFileList.length > 0) {
        setUploading(true);
        setFileList(newFileList);
        const file: any = newFileList[0].originFileObj;
        const formData = new FormData();
        formData.append("file", file);
        const uploadResponse: any = await apis.UploadFile(formData);
        if (uploadResponse.status) {
          setUploading(false);
          setUploadedPath(uploadResponse.payload.path);
        }
      }
    } catch (err: any) {
      messageAPI.open({
        type: "error",
        content: err?.response?.data.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const AttachmentAction = async (values: any) => {
    try {
      setLoading(true);
      const fileName = values.File.fileList[0].name;
      const response: any = await apis.AddEventAttachmentById(id as string, {
        ...values,
        Type: values.File.fileList[0].type.includes("image/")
          ? attachmentType.filter(
              (type: any) => type.AttachmentTypeName === "Image"
            )[0].EventAttachmentTypeId
          : getFileExtension(fileName) === "pdf"
            ? attachmentType.filter(
                (type: any) => type.AttachmentTypeName === "Pdf"
              )[0].EventAttachmentTypeId
            : getFileExtension(fileName) === "xlsx" ||
                getFileExtension(fileName) === "xls"
              ? attachmentType.filter(
                  (type: any) => type.AttachmentTypeName === "Excel"
                )[0].EventAttachmentTypeId
              : attachmentType.filter(
                  (type: any) => type.AttachmentTypeName === "Word"
                )[0].EventAttachmentTypeId,
        FileName: fileName,
        FilePath: uploadedPath,
      });
      if (response.status) {
        handleClose();
        handleOk();
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
    if (open) {
      form.resetFields();
    }
  }, [open]);

  return (
    <Modal
      title={
        <Typography.Title level={4} style={{ margin: 0 }}>
          Add Attachment
        </Typography.Title>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={400}
      maskClosable={false}
    >
      <Form
        form={form}
        onFinish={AttachmentAction}
        style={{ width: "100%", marginTop: 20, marginBottom: 5 }}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
      >
        <Form.Item
          label="Title"
          name="Title"
          rules={[{ required: true, message: "Please input title!" }]}
        >
          <Input placeholder="Attachment title" />
        </Form.Item>
        <Form.Item
          label="Details"
          name="Details"
          rules={[{ required: true, message: "Please input details!" }]}
        >
          <Input.TextArea
            placeholder="Details"
            style={{ resize: "none", height: 150 }}
          />
        </Form.Item>
        <Form.Item
          label="File"
          name="File"
          rules={[{ required: true, message: "Please upload file!" }]}
        >
          <Upload.Dragger
            beforeUpload={() => false}
            maxCount={1}
            onChange={handleUpload}
            fileList={fileList}
            accept="image/*, .pdf, .doc, .docx, .xlsx, .xls"
            showUploadList={false}
            disabled={uploading || uploadedPath !== null}
          >
            <Flex
              style={{ height: 188, width: "100%" }}
              align="center"
              justify="center"
            >
              {uploading ? (
                <Spin tip={"Uploading..."} size="large">
                  <div style={contentStyle} />
                </Spin>
              ) : (
                <>
                  {uploadedPath ? (
                    <Flex vertical gap={10} align="center" justify="center">
                      <Typography.Text>{fileList[0].name}</Typography.Text>
                      <Button
                        onClick={() => {
                          apis.DeleteUploadedFile({ path: uploadedPath });
                          setUploadedPath(null);
                          setFileList([]);
                          form.setFieldsValue({
                            File: null,
                          });
                        }}
                      >
                        Remove File
                      </Button>
                    </Flex>
                  ) : (
                    <div>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Click or drag file to this area to upload
                      </p>
                      <p className="ant-upload-hint">
                        Support for a single upload.
                      </p>
                    </div>
                  )}
                </>
              )}
            </Flex>
          </Upload.Dragger>
        </Form.Item>
        <Flex justify="flex-end">
          <Button type="primary" htmlType="submit" loading={loading}>
            Save
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

export default AttachmentModal;
