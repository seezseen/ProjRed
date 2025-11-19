export type BroadcastType = "info" | "warning" | "urgent";

export interface Broadcast {
  _id: string;
  title: string;
  message: string;
  type: BroadcastType;
  createdBy: string; // User ID or name
  createdAt: Date;
  expiresAt: Date | null; // null means never expires
  isActive: boolean;
  dismissible: boolean; // Can users dismiss this?
}

export interface CreateBroadcastInput {
  title: string;
  message: string;
  type: BroadcastType;
  expiresAt: Date | null;
  dismissible?: boolean;
}
