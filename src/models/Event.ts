import { DB } from "@config/db";

export class EventModel {
  #pool: any;
  #rPool: any;

  constructor() {
    this.#InitializeDB();
  }

  #InitializeDB = async () => {
    const poolPromise = await DB.writePoolPromise;
    const rPoolPromise = await DB.readPoolPromise;
    this.#pool = poolPromise;
    this.#rPool = rPoolPromise;
  };

  GetEvents = async () => {
    try {
      const request = this.#pool.request();
      const result = await request.query(`
        SELECT e.*, et.[Type] AS EventType, es.[Status] AS EventStatus, ep.[Priority] AS EventPriority, contact_list.Contacts, u.UserName, u.UserEmail
        FROM [Event] AS e 
        LEFT JOIN [EventType] AS et ON e.[Type] = et.[ETypeId]
        LEFT JOIN [EventStatus] AS es ON e.[Status] = es.[EStatusId]
        LEFT JOIN [EventPriority] AS ep ON e.[Priority] = ep.[EPriorityId]
        LEFT JOIN [User] u ON e.[User] = u.[UserId]
        OUTER APPLY
          (
            SELECT 
                  STUFF(( 
                      SELECT ',' + CAST(c.[ContactId] AS NVARCHAR(MAX)) 
                      FROM [EventContacts] c 
                      WHERE c.[EventId] = e.[EventId] 
                      FOR XML PATH(''), TYPE 
                  ).value('.', 'NVARCHAR(MAX)'), 1, 1, '') AS Contacts
          ) AS contact_list
      `);

      return result.recordset;
    } catch (err) {
      throw err;
    }
  };

  CreateEvent = async (eventData: any) => {
    try {
      const request = this.#pool.request();
      const result = await request
        .input("User", eventData.User)
        .input("Title", eventData.Title)
        .input("Source", eventData.Source)
        .input("CreateDate", DB.sql.DateTime, eventData.CreateDate)
        .input("Code", eventData.Code).query(`
          INSERT INTO [Event] ([Title], [Source], [Code], [CreateDate], [User])
          OUTPUT INSERTED.EventId
          VALUES (@Title, @Source, @Code, @CreateDate, @User)
      `);

      return result.recordset[0].EventId;
    } catch (err) {
      throw err;
    }
  };

  UpdateEventById = async (id: string, eventData: any) => {
    try {
      const request = this.#pool.request();
      const setClauses = [];
      if (eventData.Priority) {
        request.input("Priority", DB.sql.Int, eventData.Priority);
        setClauses.push("[Priority] = @Priority");
      }
      if (eventData.Status) {
        request.input("Status", DB.sql.Int, eventData.Status);
        setClauses.push("[Status] = @Status");
      }
      if (eventData.Type) {
        request.input("Type", DB.sql.Int, eventData.Type);
        setClauses.push("[Type] = @Type");
      }
      if (eventData.DueDate) {
        request.input("DueDate", DB.sql.DateTime, eventData.DueDate);
        setClauses.push("[DueDate] = @DueDate");
      }
      if (eventData.Description) {
        request.input("Description", DB.sql.VarChar, eventData.Description);
        setClauses.push("[Description] = @Description");
      }
      if (eventData.IsRecurring !== undefined) {
        request.input("IsRecurring", DB.sql.TinyInt, eventData.IsRecurring);
        setClauses.push("[IsRecurring] = @IsRecurring");
      }
      if (eventData.IntervalY) {
        request.input("IntervalY", DB.sql.Int, eventData.IntervalY);
        setClauses.push("[IntervalY] = @IntervalY");
      }
      if (eventData.IntervalM) {
        request.input("IntervalM", DB.sql.Int, eventData.IntervalM);
        setClauses.push("[IntervalM] = @IntervalM");
      }
      if (eventData.IntervalD) {
        request.input("IntervalD", DB.sql.Int, eventData.IntervalD);
        setClauses.push("[IntervalD] = @IntervalD");
      }
      request.input("id", DB.sql.Int, id);
      request.input("LastUpdate", DB.sql.DateTime, new Date());
      setClauses.push("[LastUpdate] = @LastUpdate");

      const setClause = setClauses.join(", ");
      await request.query(`
          UPDATE [Event]
          SET ${setClause}
          WHERE EventId = @id
      `);
    } catch (err) {
      throw err;
    }
  };

  GetEventDetailById = async (id: string) => {
    try {
      const request = this.#pool.request();
      const result = await request.input("id", DB.sql.Int, Number(id)).query(`
          SELECT e.*, u.UserName, u.UserEmail FROM [Event] e
          JOIN [User] u ON e.[User] = u.[UserId]
          WHERE e.EventId = @id
      `);

      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (err) {
      throw err;
    }
  };

  GetEventPriority = async () => {
    try {
      const request = this.#pool.request();
      const result = await request.query(`SELECT * FROM [EventPriority]`);

      return result.recordset;
    } catch (err) {
      throw err;
    }
  };

  GetEventStatus = async () => {
    try {
      const request = this.#pool.request();
      const result = await request.query(`SELECT * FROM [EventStatus]`);

      return result.recordset;
    } catch (err) {
      throw err;
    }
  };

  GetEventType = async () => {
    try {
      const request = this.#pool.request();
      const result = await request.query(`SELECT * FROM [EventType]`);

      return result.recordset;
    } catch (err) {
      throw err;
    }
  };

  GetAllContacts = async () => {
    try {
      const request = this.#rPool.request();
      const result = await request.query(`
        SELECT con.[ContactName], con.[Email], con.[ContactId], con.[MobilePhoneNumber], org.[OrgName]
        FROM [Contact] AS con
        JOIN [Organisation] AS org ON con.[OrgId] = org.[OrgId]
        `);

      return result.recordset;
    } catch (err) {
      throw err;
    }
  };

  GetContactsById = async (id: number) => {
    try {
      const request = this.#rPool.request();
      const result = await request.input("contactId", DB.sql.Int, id).query(`
        SELECT con.[ContactName], con.[Email], con.[ContactId], con.[MobilePhoneNumber], org.[OrgName]
        FROM [Contact] AS con
        JOIN [Organisation] AS org ON con.[OrgId] = org.[OrgId]
        WHERE con.[ContactId] = @contactId
        `);

      return result.recordset;
    } catch (err) {
      throw err;
    }
  };

  AddContactByEventId = async (eventId: number, contactId: number) => {
    try {
      const request = this.#pool.request();
      await request
        .input("eventId", DB.sql.Int, eventId)
        .input("ContactId", DB.sql.Int, contactId).query(`
          INSERT INTO [EventContacts] ([EventId], [ContactId])
          VALUES (@eventId, @ContactId)
      `);
    } catch (err) {
      throw err;
    }
  };

  GetContactListById = async (id: number) => {
    try {
      const request = this.#pool.request();
      const result = await request.input("eventId", DB.sql.Int, id).query(`
          SELECT [EventContactId], [ContactId]
          FROM [EventContacts]
          WHERE [EventId] = @eventId
      `);
      return result.recordset;
    } catch (err) {
      throw err;
    }
  };

  DeleteEventContactById = async (id: number) => {
    try {
      const request = this.#pool.request();
      await request.input("contactId", DB.sql.Int, id)
        .query(`DELETE FROM [EventContacts] WHERE [EventContactId] = @contactId
      `);
    } catch (err) {
      throw err;
    }
  };

  AddEventNoteById = async (id: number, noteData: any) => {
    try {
      const request = this.#pool.request();
      await request
        .input("EventId", DB.sql.Int, id)
        .input("NoteText", DB.sql.Text, noteData.note)
        .input("UserId", DB.sql.Int, Number(noteData.userId))
        .input("NoteDate", DB.sql.DateTime, new Date())
        .query(`INSERT INTO [EventNotes] ([NoteText], [NoteUser], [NoteDate], [EventId]) 
          VALUES (@NoteText, @UserId, @NoteDate, @EventId)
      `);
    } catch (err) {
      throw err;
    }
  };

  GetEventNoteListByEventId = async (id: number) => {
    try {
      const requset = this.#pool.request();
      const result = await requset.input("EventId", DB.sql.Int, id).query(`
        SELECT en.[EventNoteId], en.[NoteText], en.[NoteDate], u.[UserName], u.[UserEmail]
        FROM [EventNotes] AS en
        JOIN [User] as u ON u.[UserId] = en.[NoteUser]
        WHERE [EventId] = @EventId
        ORDER BY en.[NoteDate] DESC
        `);
      return result.recordset;
    } catch (err) {
      throw err;
    }
  };

  UpdateEventNoteByEventId = async (noteId: number, noteText: string) => {
    try {
      const requset = this.#pool.request();
      await requset
        .input("EventNoteId", DB.sql.Int, noteId)
        .input("NoteText", DB.sql.Text, noteText).query(`
        UPDATE [EventNotes]
        SET [NoteText] = @NoteText
        WHERE [EventNoteId] = @EventNoteId
        `);
    } catch (err) {
      throw err;
    }
  };

  DeleteEventNoteById = async (noteId: number) => {
    try {
      const requset = this.#pool.request();
      await requset.input("EventNoteId", DB.sql.Int, noteId).query(`
        DELETE FROM [EventNotes]
        WHERE [EventNoteId] = @EventNoteId
        `);
    } catch (err) {
      throw err;
    }
  };

  GetAttachmentType = async () => {
    try {
      const request = this.#pool.request();
      const result = await request.query(`SELECT * FROM [EventAttachmentType]`);

      return result.recordset;
    } catch (err) {
      throw err;
    }
  };

  AddEventAttachmentById = async (id: number, data: any) => {
    try {
      const request = this.#pool.request();
      await request
        .input("EventId", DB.sql.Int, id)
        .input("Title", DB.sql.VarChar, data.Title)
        .input("UserId", DB.sql.Int, Number(data.userId))
        .input("Type", DB.sql.Int, data.Type)
        .input("FilePath", DB.sql.VarChar, data.FilePath)
        .input("FileName", DB.sql.VarChar, data.FileName)
        .input("Details", DB.sql.Text, data.Details)
        .input("UploadedAt", DB.sql.DateTime, new Date())
        .query(`INSERT INTO [EventAttachments] ([EventId], [Title], [UserId], [TypeId], [FileName], [FilePath], [UploadedAt], [Details]) 
          VALUES (@EventId, @Title, @UserId, @Type, @FileName, @FilePath, @UploadedAt, @Details)
      `);
    } catch (err) {
      throw err;
    }
  };

  GetEventAttachmentList = async (id: number) => {
    try {
      const request = this.#pool.request();
      const result = await request.input("EventId", DB.sql.Int, id).query(`
        SELECT ea.[EventAttachmentId], ea.[Title], ea.[UploadedAt], eat.[AttachmentTypeName], ea.[FilePath], ea.[FileName], u.[UserName], u.[UserEmail] 
        FROM [EventAttachments] AS ea
        JOIN [User] AS u ON u.[UserId] = ea.[UserId]
        JOIN [EventAttachmentType] AS eat ON eat.[EventAttachmentTypeId] = ea.[TypeId] 
        WHERE ea.[EventId] = @EventId
        ORDER BY ea.[UploadedAt] DESC
      `);
      return result.recordset;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  DeleteEventAttachmentById = async (id: number) => {
    try {
      const requset = this.#pool.request();
      requset.input("EventAttachmentId", DB.sql.Int, id);

      const result = await requset.query(
        `SELECT * FROM [EventAttachments] WHERE [EventAttachmentId] = @EventAttachmentId`
      );
      const path =
        result.recordset.length > 0 ? result.recordset[0].FilePath : null;

      await requset.query(`
        DELETE FROM [EventAttachments]
        WHERE [EventAttachmentId] = @EventAttachmentId
        `);

      return path;
    } catch (err) {
      throw err;
    }
  };

  AddEventHistory = async (id: number, userId: number, actionName: string) => {
    try {
      const request = this.#pool.request();
      await request
        .input("EventId", DB.sql.Int, id)
        .input("UserId", DB.sql.Int, userId)
        .input("ActionName", DB.sql.VarChar, actionName)
        .input("CreatedAt", DB.sql.DateTime, new Date())
        .query(`INSERT INTO [EventHistory] ([EventId], [UserId], [ActionName], [CreatedAt]) 
          VALUES (@EventId, @UserId, @ActionName, @CreatedAt)
      `);
    } catch (err) {
      throw err;
    }
  };

  GetHistoryListByEventId = async (id: number) => {
    try {
      const request = this.#pool.request();
      const result = await request.input("EventId", DB.sql.Int, id).query(`
        SELECT eh.[EventHistoryId], eh.[ActionName], eh.[CreatedAt], u.[UserName], u.[UserEmail] 
        FROM [EventHistory] AS eh
        JOIN [User] AS u ON u.[UserId] = eh.[UserId]
        WHERE eh.[EventId] = @EventId
        ORDER BY eh.[CreatedAt] DESC
      `);
      return result.recordset;
    } catch (err) {
      throw err;
    }
  };
}
