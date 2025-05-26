import { DB } from "@config/db";

export class SettingModel {
    #pool: any;

    constructor() {
        this.#InitializeDB();
    }

    #InitializeDB = async () => {
        const poolPromise = await DB.writePoolPromise;
        this.#pool = poolPromise;
    };

    // --- Priority ---
    GetPriorities = async () => {
        try {
            const request = this.#pool.request();
            const result = await request.query(`SELECT * FROM [EventPriority]`);
            return result.recordset;
        } catch (err) {
            throw err;
        }
    };

    AddPriority = async (Priority: string) => {
        try {
            const request = this.#pool.request();
            request.input("Priority", DB.sql.VarChar, Priority);
            await request.query(`INSERT INTO [EventPriority] (Priority) VALUES (@Priority)`);
        } catch (err) {
            throw err;
        }
    };

    RemovePriority = async (id: number) => {
        try {
            const request = this.#pool.request();
            request.input("Id", DB.sql.Int, id);
            await request.query(`DELETE FROM [EventPriority] WHERE [EPriorityId] = @Id`);
        } catch (err) {
            throw err;
        }
    };

    // --- Status ---
    GetStatuses = async () => {
        try {
            const request = this.#pool.request();
            const result = await request.query(`SELECT * FROM [EventStatus]`);
            return result.recordset;
        } catch (err) {
            throw err;
        }
    };

    AddStatus = async (Status: string) => {
        try {
            const request = this.#pool.request();
            request.input("Status", DB.sql.VarChar, Status);
            await request.query(`INSERT INTO [EventStatus] (Status) VALUES (@Status)`);
        } catch (err) {
            throw err;
        }
    };

    RemoveStatus = async (id: number) => {
        try {
            const request = this.#pool.request();
            request.input("Id", DB.sql.Int, id);
            await request.query(`DELETE FROM [EventStatus] WHERE [EStatusId] = @Id`);
        } catch (err) {
            throw err;
        }
    };

    // --- Type ---
    GetTypes = async () => {
        try {
            const request = this.#pool.request();
            const result = await request.query(`SELECT * FROM [EventType]`);
            return result.recordset;
        } catch (err) {
            throw err;
        }
    };

    AddType = async (Type: string) => {
        try {
            const request = this.#pool.request();
            request.input("Type", DB.sql.VarChar, Type);
            await request.query(`INSERT INTO [EventType] (Type) VALUES (@Type)`);
        } catch (err) {
            throw err;
        }
    };

    RemoveType = async (id: number) => {
        try {
            const request = this.#pool.request();
            request.input("Id", DB.sql.Int, id);
            await request.query(`DELETE FROM [EventType] WHERE [ETypeId] = @Id`);
        } catch (err) {
            throw err;
        }
    };
}
