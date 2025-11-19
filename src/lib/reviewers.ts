import clientPromise from "./client";
import { Reviewer } from "@/app/types";

let db: any;
let reviewers: any;

async function init() {
  if (db) return;
  
  // Runtime validation
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured. Please add it to your .env.local file.');
  }
  
  try {
    const client = await clientPromise;
    db = client.db();
    reviewers = db.collection("reviewers");
  } catch (error) {
    throw new Error("Failed to connect to the database. Please check your MONGODB_URI.");
  }
}

// Don't initialize during build time
if (process.env.NODE_ENV !== 'production' || process.env.MONGODB_URI) {
  (async () => {
    try {
      await init();
    } catch (error) {
      // Silently fail during build if no MongoDB URI
      console.error('Database initialization skipped:', error);
    }
  })();
}

export async function getReviewers() {
  try {
    if (!reviewers) await init();
    const result = await reviewers
      .find({})
      .map((reviewer: Reviewer) => ({ ...reviewer, _id: reviewer._id.toString() }))
      .toArray();
    return { reviewers: result };
  } catch (error) {
    return { error: "Failed to fetch reviewers." };
  }
}

export async function createReviewer(reviewer: Omit<Reviewer, "_id">) {
  try {
    if (!reviewers) await init();
    const result = await reviewers.insertOne(reviewer);
    return { reviewer: { ...reviewer, _id: result.insertedId.toString() } };
  } catch (error) {
    return { error: "Failed to create reviewer." };
  }
}

export async function searchReviewers(query: string) {
  try {
    if (!reviewers) await init();
    const q = query.trim();
    if (!q) return { reviewers: [] };
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const result = await reviewers
      .find({
        $or: [
          { title: regex },
          { description: regex },
          { subject: regex },
          { tags: { $elemMatch: { $regex: regex } } },
        ],
      })
      .limit(50)
      .toArray();
    return { reviewers: result.map((r: Reviewer) => ({ ...r, _id: (r as any)._id.toString() })) };
  } catch (error) {
    return { error: "Failed to search reviewers." };
  }
}

export async function incrementHelpful(reviewerId: string) {
  try {
    if (!reviewers) await init();
    const { ObjectId } = await import("mongodb");
    const _id = new ObjectId(reviewerId);
    const res = await reviewers.findOneAndUpdate(
      { _id },
      { $inc: { helpfulCount: 1 } },
      { returnDocument: "after", upsert: false }
    );
    if (!res.value) return { error: "Reviewer not found" };
    const doc = res.value as Reviewer as any;
    return { reviewer: { ...doc, _id: doc._id.toString() } };
  } catch (error) {
    return { error: "Failed to update helpful count." };
  }
}

export async function getReviewersByIds(ids: string[]) {
  try {
    if (!reviewers) await init();
    if (ids.length === 0) return { reviewers: [] };
    const { ObjectId } = await import("mongodb");
    const objIds = ids.filter(Boolean).map((id) => new ObjectId(id));
    const result = await reviewers.find({ _id: { $in: objIds } }).toArray();
    return { reviewers: result.map((r: any) => ({ ...r, _id: r._id.toString() })) };
  } catch (error) {
    return { error: "Failed to fetch favorites." };
  }
}
