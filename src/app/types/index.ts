export interface User {
    _id: string;
    name: string;
    username: string;
    email: string;
    password?: string;
    role: 'student' | 'admin' | 'founder';
}

export interface Reviewer {
    _id: string;
    title: string;
    description: string;
    subject: string;
    gradeLevel: string; // Can be single grade or comma-separated (e.g., "7" or "7,8,9,10")
    fileName: string;
    fileKey: string;
    fileSize: number;
    uploadedBy: string;
    createdAt?: Date;
    updatedAt?: Date;
}
