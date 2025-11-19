// MongoDB GridFS for file storage instead of R2
import clientPromise from "@/lib/client"
import { GridFSBucket, ObjectId } from "mongodb"

let gridFSBucket: GridFSBucket | null = null

export async function getGridFSBucket(): Promise<GridFSBucket> {
  if (gridFSBucket) {
    return gridFSBucket
  }

  const client = await clientPromise
  const db = client.db()
  gridFSBucket = new GridFSBucket(db, { bucketName: "uploads" })
  return gridFSBucket
}

export async function uploadFile(
  buffer: Buffer,
  filename: string,
  metadata?: Record<string, any>
): Promise<{ fileId: string; filename: string }> {
  const bucket = await getGridFSBucket()
  
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, { metadata })
    
    uploadStream.on("finish", () => {
      resolve({
        fileId: uploadStream.id.toString(),
        filename: filename,
      })
    })
    
    uploadStream.on("error", reject)
    uploadStream.end(buffer)
  })
}

export async function getFileUrl(fileId: string): Promise<string> {
  // Return a local URL that will be served by our API
  return `/api/files/${fileId}`
}

export async function deleteFile(fileId: string): Promise<void> {
  const bucket = await getGridFSBucket()
  await bucket.delete(new ObjectId(fileId))
}

export async function downloadFile(fileId: string): Promise<Buffer> {
  const bucket = await getGridFSBucket()
  
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId))
    
    downloadStream.on("data", (chunk) => chunks.push(chunk))
    downloadStream.on("end", () => resolve(Buffer.concat(chunks)))
    downloadStream.on("error", reject)
  })
}

