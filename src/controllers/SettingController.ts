import { Request, Response } from "express";
import { SettingModel } from "@models/Setting";

export class SettingController {
    #settingModel: SettingModel;

    constructor() {
        this.#settingModel = new SettingModel();
    }

    // --- Priorities ---
    GetPriorities = async (req: Request, res: Response) => {
        try {
            const priorities = await this.#settingModel.GetPriorities();
            return res.status(200).json({ status: true, payload: { priorities } });
        } catch (err) {
            return this.#handleError(res, err);
        }
    };

    AddPriority = async (req: Request, res: Response) => {
        try {
            const { Priority } = req.body;
            if (!Priority) return res.status(400).json({ status: false, message: "Priority is required" });

            await this.#settingModel.AddPriority(Priority);
            return res.status(201).json({ status: true, message: "Priority added successfully" });
        } catch (err) {
            return this.#handleError(res, err);
        }
    };

    RemovePriority = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (!id) return res.status(400).json({ status: false, message: "Invalid ID" });

            await this.#settingModel.RemovePriority(id);
            return res.status(200).json({ status: true, message: "Priority removed successfully" });
        } catch (err) {
            return this.#handleError(res, err);
        }
    };

    // --- Statuses ---
    GetStatuses = async (req: Request, res: Response) => {
        try {
            const statuses = await this.#settingModel.GetStatuses();
            return res.status(200).json({ status: true, payload: { statuses } });
        } catch (err) {
            return this.#handleError(res, err);
        }
    };

    AddStatus = async (req: Request, res: Response) => {
        try {
            const { Status } = req.body;
            if (!Status) return res.status(400).json({ status: false, message: "Status is required" });

            await this.#settingModel.AddStatus(Status);
            return res.status(201).json({ status: true, message: "Status added successfully" });
        } catch (err) {
            return this.#handleError(res, err);
        }
    };

    RemoveStatus = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (!id) return res.status(400).json({ status: false, message: "Invalid ID" });

            await this.#settingModel.RemoveStatus(id);
            return res.status(200).json({ status: true, message: "Status removed successfully" });
        } catch (err) {
            return this.#handleError(res, err);
        }
    };

    // --- Types ---
    GetTypes = async (req: Request, res: Response) => {
        try {
            const types = await this.#settingModel.GetTypes();
            return res.status(200).json({ status: true, payload: { types } });
        } catch (err) {
            return this.#handleError(res, err);
        }
    };

    AddType = async (req: Request, res: Response) => {
        try {
            const { Type } = req.body;
            if (!Type) return res.status(400).json({ status: false, message: "Type is required" });

            await this.#settingModel.AddType(Type);
            return res.status(201).json({ status: true, message: "Type added successfully" });
        } catch (err) {
            return this.#handleError(res, err);
        }
    };

    RemoveType = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (!id) return res.status(400).json({ status: false, message: "Invalid ID" });

            await this.#settingModel.RemoveType(id);
            return res.status(200).json({ status: true, message: "Type removed successfully" });
        } catch (err) {
            return this.#handleError(res, err);
        }
    };

    // --- Error handler ---
    #handleError = (res: Response, err: any) => {
        return res.status(500).json({
            status: false,
            message: "Server error, please try again later.",
            error: String(err),
        });
    };
}
