import clientPromise from "./client";
import { Broadcast, CreateBroadcastInput } from "@/app/types/broadcast";
import { ObjectId } from "mongodb";

export async function getBroadcasts() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const broadcasts = await db
      .collection("broadcasts")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return broadcasts.map((broadcast) => ({
      ...broadcast,
      _id: broadcast._id.toString(),
    })) as Broadcast[];
  } catch (error) {
    console.error("Error fetching broadcasts:", error);
    return [];
  }
}

export async function getActiveBroadcasts() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const now = new Date();

    const broadcasts = await db
      .collection("broadcasts")
      .find({
        isActive: true,
        $or: [
          { expiresAt: null },
          { expiresAt: { $gt: now } }
        ]
      })
      .sort({ createdAt: -1 })
      .toArray();

    return broadcasts.map((broadcast) => ({
      ...broadcast,
      _id: broadcast._id.toString(),
    })) as Broadcast[];
  } catch (error) {
    console.error("Error fetching active broadcasts:", error);
    return [];
  }
}

export async function createBroadcast(
  input: CreateBroadcastInput,
  createdBy: string
): Promise<Broadcast | null> {
  try {
    const client = await clientPromise;
    const db = client.db();

    const broadcast = {
      title: input.title,
      message: input.message,
      type: input.type,
      createdBy,
      createdAt: new Date(),
      expiresAt: input.expiresAt,
      isActive: true,
      dismissible: input.dismissible ?? true,
    };

    const result = await db.collection("broadcasts").insertOne(broadcast);

    return {
      ...broadcast,
      _id: result.insertedId.toString(),
    } as Broadcast;
  } catch (error) {
    console.error("Error creating broadcast:", error);
    return null;
  }
}

export async function deleteBroadcast(id: string): Promise<boolean> {
  try {
    const client = await clientPromise;
    const db = client.db();

    const result = await db
      .collection("broadcasts")
      .deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount === 1;
  } catch (error) {
    console.error("Error deleting broadcast:", error);
    return false;
  }
}

export async function toggleBroadcastActive(id: string): Promise<boolean> {
  try {
    const client = await clientPromise;
    const db = client.db();

    const broadcast = await db
      .collection("broadcasts")
      .findOne({ _id: new ObjectId(id) });

    if (!broadcast) return false;

    const result = await db
      .collection("broadcasts")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { isActive: !broadcast.isActive } }
      );

    return result.modifiedCount === 1;
  } catch (error) {
    console.error("Error toggling broadcast:", error);
    return false;
  }
}
