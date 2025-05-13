import express from "express";
import { EventController } from "@controllers/EventController";
import { Auth } from "@middlewares/index";

const router = express.Router();
const eventController = new EventController();

router.get("/initial", Auth as any, eventController.GetEventInitialData as any);
router.post("/create", Auth as any, eventController.CreateEvent as any);
router.get("/list", Auth as any, eventController.GetEvents as any);
router.get("/:id/detail", Auth as any, eventController.GetEventDetailById as any);
router.patch("/:id/update", Auth as any, eventController.UpdateEventById as any);
router.post("/:id/contacts", Auth as any, eventController.AddContactByEventId as any);
router.get("/:id/contacts/list", Auth as any, eventController.GetEventContactListById as any);
router.delete("/:id/contacts/:contactId", Auth as any, eventController.DeleteEventContactById as any);
router.get("/:id/notes/list", Auth as any, eventController.GetEventNoteListByEventId as any);
router.post("/:id/notes", Auth as any, eventController.AddEventNoteByEventId as any);
router.delete("/:id/notes/:noteId", Auth as any, eventController.DeleteEventNoteById as any);
router.patch("/:id/notes/:noteId", Auth as any, eventController.UpdateEventNoteById as any);
router.post("/upload-file", Auth as any, eventController.UploadAttachment as any);
router.post("/upload-file/delete", Auth as any, eventController.DeleteUploadedFile as any);
router.post("/:id/attachments", Auth as any, eventController.AddEventAttachmentById as any);
router.delete("/:id/attachments/:attachmentId", Auth as any, eventController.DeleteEventAttachmentById as any);
router.get("/:id/attachments/list", Auth as any, eventController.GetEventAttachmentsList as any);
router.get("/:id/history/list", Auth as any, eventController.GetEventHistoryListById as any);
router.post('/send-email', Auth as any, eventController.SendEventEmail as any);
router.post('/send-note-email', Auth as any, eventController.SendEventNoteEmail as any);

export default router;