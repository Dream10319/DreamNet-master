import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { EventModel } from "@models/Event";
import { RentalModel } from "@models/Rental";
import { OrganisationModel } from "@models/Organisation";
import { ProjectModel } from "@models/Project";
import nodemailer from 'nodemailer';
export class EventController {
  #eventModel: EventModel;
  #rentalModel: RentalModel;
  #projectModel: ProjectModel;
  #organisationModel: OrganisationModel;

  constructor() {
    this.#eventModel = new EventModel();
    this.#rentalModel = new RentalModel();
    this.#organisationModel = new OrganisationModel();
    this.#projectModel = new ProjectModel();
  }

  GetEvents = async (req: Request, res: Response) => {
    try {
      const events = await this.#eventModel.GetEvents();
      return res.status(200).json({
        status: true,
        payload: {
          events: events,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later.",
        error: String(err),
      });
    }
  };

  CreateEvent = async (req: Request, res: Response) => {
    try {
      const { title, eventType, eventId, userId } = req.body;

      let newEvent: any = {
        User: userId,
        Title: title,
      };
      if (eventType === "rental") {
        const rentalDetail =
          await this.#rentalModel.GetRentalDetailById(eventId);
        newEvent = {
          ...newEvent,
          Source: rentalDetail["RentalName"],
          Code: rentalDetail["RentalCode"],
          CreateDate: new Date(),
        };
      } else if (eventType === "project") {
        const projectDetail =
          await this.#projectModel.GetProjectDetailById(eventId);
        newEvent = {
          ...newEvent,
          Source: projectDetail["ProjectName"],
          Code: projectDetail["ProjectCode"],
          CreateDate: new Date(),
        };
      } else if (eventType === "organisation") {
        const organisationDetail =
          await this.#organisationModel.GetOrganisationDetailById(eventId);
        newEvent = {
          ...newEvent,
          Source: organisationDetail["OrgName"],
          Code: organisationDetail["OrgCode"],
          CreateDate: new Date(),
        };
      }

      const id = await this.#eventModel.CreateEvent(newEvent);
      this.#eventModel.AddEventHistory(id, Number(userId), "Event Logged");
      return res.status(200).json({
        status: true,
        payload: {
          id: id,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later.",
        error: String(err),
      });
    }
  };

  GetEventDetailById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const event = await this.#eventModel.GetEventDetailById(id);
      return res.status(200).json({
        status: true,
        payload: {
          event: event,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later.",
        error: String(err),
      });
    }
  };

  GetEventInitialData = async (req: Request, res: Response) => {
    try {
      const funcs: Array<any> = [];
      funcs.push(this.#eventModel.GetEventPriority());
      funcs.push(this.#eventModel.GetEventStatus());
      funcs.push(this.#eventModel.GetEventType());
      funcs.push(this.#eventModel.GetAllContacts());
      funcs.push(this.#eventModel.GetAttachmentType());
      const results = await Promise.all(funcs);

      return res.status(200).json({
        status: true,
        payload: {
          eventPriority: results[0],
          eventStatus: results[1],
          eventType: results[2],
          contacts: results[3],
          attachmentType: results[4],
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later.",
        error: String(err),
      });
    }
  };

  UpdateEventById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const eventData = req.body;

      await this.#eventModel.UpdateEventById(id, eventData);
      this.#eventModel.AddEventHistory(
        Number(id),
        Number(eventData.userId),
        "Event Updated"
      );
      return res.status(200).json({
        status: true,
        message: "Event Data has been saved successfully!",
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later.",
        error: String(err),
      });
    }
  };

  AddContactByEventId = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { contactId, userId } = req.body;
      await this.#eventModel.AddContactByEventId(Number(id), Number(contactId));
      const contacts = await this.#eventModel.GetContactsById(Number(contactId));
      const contactName = contacts?.[0].ContactName || "Unknown";
      this.#eventModel.AddEventHistory(
        Number(id),
        Number(userId),
        `Event Contact "${contactName}" Added`
      );
      return res.status(200).json({
        status: true,
        message: "Contact added successfully",
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later.",
        error: String(err),
      });
    }
  };

  GetEventContactListById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const contacts = await this.#eventModel.GetContactListById(Number(id));
      return res.status(200).json({
        status: true,
        message: "Contact list fetched successfully",
        payload: {
          contacts: contacts,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later.",
        error: String(err),
      });
    }
  };

  DeleteEventContactById = async (req: Request, res: Response) => {
    try {
      const { id, contactId } = req.params;
      const { userId } = req.body;
      await this.#eventModel.DeleteEventContactById(Number(contactId));
      const contacts = await this.#eventModel.GetContactsById(Number(contactId));
      const contactName = contacts?.[0].ContactName || "Unknown";
      this.#eventModel.AddEventHistory(
        Number(id),
        Number(userId),
        `Event Contact "${contactName}" Deleted`
      );
      return res.status(200).json({
        status: true,
        message: "Contact deleted successfully",
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later.",
        error: String(err),
      });
    }
  };

  AddEventNoteByEventId = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { note, userId } = req.body;
      const result = await this.#eventModel.AddEventNoteById(Number(id), {
        note: note,
        userId: userId,
      });
      this.#eventModel.AddEventHistory(
        Number(id),
        Number(userId),
        "Event Note Added"
      );
      return res.status(200).json({
        status: true,
        message: "Event Note added successfully",
        payload: result,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later.",
        error: String(err),
      });
    }
  };

  DeleteEventNoteById = async (req: Request, res: Response) => {
    try {
      const { id, noteId } = req.params;
      const { userId } = req.body;
      await this.#eventModel.DeleteEventNoteById(Number(noteId));
      this.#eventModel.AddEventHistory(
        Number(id),
        Number(userId),
        "Event Note Deleted"
      );
      return res.status(200).json({
        status: true,
        message: "Event Note deleted successfully",
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later.",
        error: String(err),
      });
    }
  };

  UpdateEventNoteById = async (req: Request, res: Response) => {
    try {
      const { id, noteId } = req.params;
      const { note, userId } = req.body;
      const result = await this.#eventModel.UpdateEventNoteByEventId(Number(noteId), note);
      this.#eventModel.AddEventHistory(
        Number(id),
        Number(userId),
        "Event Note Updated"
      );
      return res.status(200).json({
        status: true,
        message: "Event Note updated successfully",
        payload: result,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later.",
        error: String(err),
      });
    }
  };

  GetEventNoteListByEventId = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const notes = await this.#eventModel.GetEventNoteListByEventId(
        Number(id)
      );
      return res.status(200).json({
        status: true,
        message: "Event Note List fetched successfully",
        payload: {
          notes: notes,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later.",
        error: String(err),
      });
    }
  };

  fileStorage = multer.diskStorage({
    destination: "./public/attachments/",
    filename: (req: any, file: any, cb: any) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  UploadFile = multer({
    storage: this.fileStorage,
    limits: { fileSize: 100 * 1024 * 1024 },
  }).single("file");

  UploadAttachment = async (req: Request, res: Response) => {
    this.UploadFile(req, res, async (err: any) => {
      if (err) {
        return res.status(400).json({
          status: false,
          message: "File upload failed.",
        });
      }
      try {
        return res.status(200).json({
          status: true,
          payload: {
            path: "attachments/" + req.file?.filename,
          },
        });
      } catch (error) {
        return res.status(500).json({
          status: false,
          message: "Server error, please try again later.",
        });
      }
    });
  };

  DeleteUploadedFile = (req: Request, res: Response) => {
    try {
      const { path } = req.body;
      const filePath = `./public/${path}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.status(200).json({
        status: true,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later.",
      });
    }
  };

  GetEventAttachmentsList = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const attachments = await this.#eventModel.GetEventAttachmentList(
        Number(id)
      );
      return res.status(200).json({
        status: true,
        message: "Event Attachment List fetched successfully",
        payload: {
          attachments: attachments,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later.",
      });
    }
  };

  DeleteEventAttachmentById = async (req: Request, res: Response) => {
    try {
      const { id, attachmentId } = req.params;
      const { userId } = req.body;
      const path = await this.#eventModel.DeleteEventAttachmentById(
        Number(attachmentId)
      );

      if (path) {
        const filePath = `./public/${path}`;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      this.#eventModel.AddEventHistory(
        Number(id),
        Number(userId),
        "Event Attachment Deleted"
      );
      return res.status(200).json({
        status: true,
        message: "Event Attachment deleted successfully",
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later.",
      });
    }
  };

  AddEventAttachmentById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = req.body;
      await this.#eventModel.AddEventAttachmentById(Number(id), data);
      this.#eventModel.AddEventHistory(
        Number(id),
        Number(data.userId),
        "Event Attachment Added"
      );
      return res.status(200).json({
        status: true,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later.",
      });
    }
  };

  GetEventHistoryListById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const history = await this.#eventModel.GetHistoryListByEventId(
        Number(id)
      );
      return res.status(200).json({
        status: true,
        payload: {
          history: history,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later.",
      });
    }
  };

  transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EVENT_EMAIL,
      pass: process.env.EVENT_EMAIL_PASS, // Use env vars in production
    },
    tls: {
      ciphers: 'SSLv3',
    },
  });

  SendEventEmail = async (req: Request, res: Response) => {
    try {
      const {
        contacts,
        eventName,
        eventDescription,
        sourceCode,
        sourceName,
        IsUpdate,
      } = req.body;

      const subjectPrefix = IsUpdate ? 'KTS ISSUE UPDATE' : 'KTS NEW ISSUE';
      const subject = `${subjectPrefix} ${sourceCode} ${sourceName}`;

      for (const contact of contacts) {
        if (!contact.Email || contact.Email.trim() === '') {
          continue;
        }
        const emailBody = `
          Dear ${contact.Name},
  
          ${IsUpdate
            ? `Please see below updates on an issue which has been assigned to you. Please contact us for clarification if necessary:`
            : `Please see below details of an issue which has been assigned to you. Please contact us for clarification if necessary:`}
  
          ${eventName}
  
          ${eventDescription}
  
          On behalf of KTS Group Ltd
        `;

        await this.transporter.sendMail({
          from: process.env.EVENT_EMAIL,
          to: contact.Email,
          subject,
          text: emailBody,
        });
      }

      return res.status(200).json({
        status: true,
        message: 'Emails sent successfully',
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: 'Email sending failed. Please try again later.',
        error: String(err),
      });
    }
  };

  SendEventNoteEmail = async (req: Request, res: Response) => {
    try {
      const {
        contacts,
        eventDetail,
        note,
        userName,
        updateTime,
      } = req.body;

      const subject = `KTS EVENT UPDATE ${eventDetail.payload.event.Code} ${eventDetail.payload.event.Source}`;
      const date = new Date(updateTime);
      const pad = (n: number) => n.toString().padStart(2, '0');
      const formatted =
        `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear().toString().slice(-2)} ` +
        `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;

      for (const contact of contacts) {
        if (!contact.Email || contact.Email.trim() === '') {
          continue;
        }
        const emailBody = `
          ${eventDetail.payload.event.Title}

          Note added by ${userName} ${formatted}:

          ${note}
        `;

        await this.transporter.sendMail({
          from: process.env.EVENT_EMAIL,
          to: contact.Email,
          subject,
          text: emailBody,
        });
      }

      return res.status(200).json({
        status: true,
        message: 'Emails sent successfully',
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: 'Email sending failed. Please try again later.',
        error: String(err),
      });
    }
  };

}
