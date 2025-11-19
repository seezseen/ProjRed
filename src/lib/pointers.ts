import clientPromise from "./client";

let db: any;
let pointers: any;

async function init() {
  if (db) return;
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }
  const client = await clientPromise;
  db = client.db();
  pointers = db.collection("pointers");
}

if (process.env.NODE_ENV !== "production" || process.env.MONGODB_URI) {
  (async () => {
    try { await init(); } catch (e) { console.error("DB init skipped:", e); }
  })();
}

export async function getPointers(filters?: { grade?: string; subject?: string; q?: string }) {
  try {
    if (!pointers) await init();
    const query: any = {};
    if (filters?.grade) {
      query.gradeLevel = { $regex: new RegExp(`(^|,)${filters.grade}(,|$)`) };
    }
    if (filters?.subject) {
      query.subject = filters.subject;
    }
    if (filters?.q) {
      const regex = new RegExp(filters.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [
        { title: regex },
        { description: regex },
        { subject: regex },
        { tags: { $elemMatch: { $regex: regex } } },
      ];
    }
    const result = await pointers
      .find(query)
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();
    return { pointers: result.map((p: any) => ({ ...p, _id: p._id.toString() })) };
  } catch (error) {
    return { error: "Failed to fetch pointers." };
  }
}

export async function createPointer(pointer: any) {
  try {
    if (!pointers) await init();
    const res = await pointers.insertOne(pointer);
    return { pointer: { ...pointer, _id: res.insertedId.toString() } };
  } catch (error) {
    return { error: "Failed to create pointer." };
  }
}
