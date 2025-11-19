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
