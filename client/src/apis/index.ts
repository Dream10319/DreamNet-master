import axios, { AxiosHeaders } from "axios";
import { ACCESS_TOKEN } from "@/constants";
import { store } from "@/store";
import { SignOut } from "@/store/slices/AuthSlice";
import { message } from "antd";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

API.interceptors.request.use((config: any) => {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      const mHeaders = AxiosHeaders.from({
        Authorization: `Bearer ${token}`,
      });

      if (mHeaders) {
        config.headers = mHeaders;
      }
    }
  } catch (error) { }

  return config;
});

API.interceptors.response.use(
  (response: any) => response.data,
  async (error: any) => {
    try {
      const isExpired =
        error?.response?.status === 401 && error?.response?.data?.expired;

      if (isExpired) {
        message.error("Session expired, Please signin again.");
        localStorage.removeItem(ACCESS_TOKEN);
        store.dispatch(SignOut());
        window.location.href = `${window.location.origin}/signin`;
      }
    } catch (e) {
      console.error("Global error handler failed:", e);
    }

    return Promise.reject(error);
  }
);

// Auth
const GetCurrentUser = () => API.get("/api/v1/auth/current-user");
const SignIn = (data: any) => API.post("/api/v1/auth/signin", data);
const SignUp = (data: any) => API.post("/api/v1/auth/signup", data);

// Rentals
const GetRentalInitialData = () => API.get("/api/v1/rentals/initial");
const GetRentalList = () => API.get("/api/v1/rentals/list");

// Projects
const GetProjectInitialData = () => API.get("/api/v1/projects/initial");
const GetProjectList = () => API.get("/api/v1/projects/list");

// Organisations
const GetOrganisationInitialData = () => API.get("/api/v1/organisations/initial");
const GetOrganisationList = () => API.get("/api/v1/organisations/list");

// Events
const GetEventInitialData = () => API.get("/api/v1/events/initial");
const CreateEvent = (data: any) => API.post("/api/v1/events/create", data);
const GetEventList = () => API.get("/api/v1/events/list");
const GetEventDetailById = (id: string) => API.get(`/api/v1/events/${id}/detail`);
const UpdateEventById = (id: string, data: any) => API.patch(`/api/v1/events/${id}/update`, data);
const AddContactByEventId = (id: string, data: any) => API.post(`/api/v1/events/${id}/contacts`, data);
const GetEventContactListById = (id: string) => API.get(`/api/v1/events/${id}/contacts/list`);
const DeleteEventContactById = (id: string, contactId: string) => API.delete(`/api/v1/events/${id}/contacts/${contactId}`);
const GetEventNoteListById = (id: string) => API.get(`/api/v1/events/${id}/notes/list`);
const DeleteEventNoteById = (id: string, noteId: string) => API.delete(`/api/v1/events/${id}/notes/${noteId}`);
const UpdateEventNoteById = (id: string, noteId: string, data: any) => API.patch(`/api/v1/events/${id}/notes/${noteId}`, data);
const AddEventNoteById = (id: string, data: any) => API.post(`/api/v1/events/${id}/notes`, data);
const UploadFile = (data: any) => API.post(`/api/v1/events/upload-file`, data);
const DeleteUploadedFile = (data: any) => API.post('/api/v1/events/upload-file/delete', data);
const AddEventAttachmentById = (id: string, data: any) => API.post(`/api/v1/events/${id}/attachments`, data);
const GetEventAttachmentListById = (id: string) => API.get(`/api/v1/events/${id}/attachments/list`);
const DeleteEventAttachmentById = (id: string, attachId: string) => API.delete(`/api/v1/events/${id}/attachments/${attachId}`);
const GetEventHistoryById = (id: string) => API.get(`/api/v1/events/${id}/history/list`);
const SendEventEmail = (data: {
  contacts: { email: string; name: string }[];
  eventName: string;
  eventDescription: string;
  sourceCode: string;
  sourceName: string;
}) => API.post('/api/v1/events/send-email', data);
const SendEventNoteEmail = (data: {
  contacts: { email: string; name: string }[];
  eventDetail: string;
  note: string;
  userName: string;
  updateTime: string;
}) => API.post('/api/v1/events/send-note-email', data);

// Users
const CreateUser = (data: any) => API.post("/api/v1/users/create", data);
const GetUserById = (id: string) => API.get(`/api/v1/users/user/${id}`);
const UpdateUserById = (id: string, data: any) => API.put(`/api/v1/users/${id}`, data);
const GetUserList = () => API.get("/api/v1/users/list");
const DeleteUserById = (id: string) => API.delete(`/api/v1/users/${id}`);

//Settings
const GetPriorityList = () => API.get("/api/v1/settings/priority");
const AddPriority = (data: { Priority: string }) => API.post("/api/v1/settings/priority", data);
const DeletePriority = (id: number) => API.delete(`/api/v1/settings/priority/${id}`);

const GetStatusList = () => API.get("/api/v1/settings/status");
const AddStatus = (data: { Status: string }) => API.post("/api/v1/settings/status", data);
const DeleteStatus = (id: number) => API.delete(`/api/v1/settings/status/${id}`);

const GetTypeList = () => API.get("/api/v1/settings/type");
const AddType = (data: { Type: string }) => API.post("/api/v1/settings/type", data);
const DeleteType = (id: number) => API.delete(`/api/v1/settings/type/${id}`);

export const apis = {
  SignIn,
  SignUp,
  GetCurrentUser,

  // Rentals
  GetRentalInitialData,
  GetRentalList,

  // Rentals
  GetProjectInitialData,
  GetProjectList,

  // Organisations
  GetOrganisationInitialData,
  GetOrganisationList,

  // Events
  GetEventInitialData,
  CreateEvent,
  GetEventList,
  GetEventDetailById,
  UpdateEventById,
  AddContactByEventId,
  GetEventContactListById,
  DeleteEventContactById,
  AddEventNoteById,
  DeleteEventNoteById,
  GetEventNoteListById,
  UpdateEventNoteById,
  UploadFile,
  DeleteUploadedFile,
  AddEventAttachmentById,
  GetEventAttachmentListById,
  DeleteEventAttachmentById,
  GetEventHistoryById,
  SendEventEmail,
  SendEventNoteEmail,

  // Users
  CreateUser,
  GetUserById,
  UpdateUserById,
  GetUserList,
  DeleteUserById,

  //Settings
  GetPriorityList,
  AddPriority,
  DeletePriority,

  GetStatusList,
  AddStatus,
  DeleteStatus,

  GetTypeList,
  AddType,
  DeleteType,
};
