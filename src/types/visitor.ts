export interface VisitorData {
    name: string;
    email?: string; //nullable 
}

export interface StoredVisitor extends VisitorData {
    visitedAt: string; // ISO date string contoh: "2024-01-15T10:30:00.000Z"
}