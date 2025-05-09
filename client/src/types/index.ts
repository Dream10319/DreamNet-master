export type IAuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type InitialDataType = {
  eventStatus: Array<any>;
  eventPriority: Array<any>;
  eventType: Array<any>;
  contacts: Array<any>;
};

export type EventDetailType = {
  Source: string;
  Code: string;
  CreateDate: string;
  UserEmail: string;
  UserName: string;
  DueDate?: string;
  Type?: number;
  Status?: number;
  Priority?: number;
  IsRecurring?: boolean;
  IntervalY?: number;
  IntervalM?: number;
  IntervalD?: number;
  Description?: string;
};
