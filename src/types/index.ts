export interface VisitorData {
    name: string;
    email?: string; //nullable 
}

export interface StoredVisitor extends VisitorData {
    visitedAt: string; // ISO date string contoh: "2024-01-15T10:30:00.000Z"
}

//form types
// State management untuk GUestGate Form

export type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export interface FormState {
    status: FormStatus;
    errorMessage: string | null;
}

// API TYPES
// Untuk komunikasi dengan serverless function /api/submmit-visitor

//Request body yang dikirim ke API
export interface SubmitVisitorRequest {
    name: string;
    email?: string;
}

export interface SubmitVisitorResponse {
    success: boolean;
    message: string;
}

// Project Types
// Untuk Menampilkan project di Halaman utama

export type ProjectCategory = 'web' | 'mobile' | 'backend' | 'other';

export interface Project {
    id: string;
    title: string;
    description: string;
    techStack: string[]; //array of string
    githubUrl?:string;
    liveUrl?: string;
    category: ProjectCategory;
    year: number;
}

// Skill types

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Skill {
    name:string;
    level: SkillLevel;
    icon?: string;
}

export interface SkillCategory {
    category: string;
    skills: Skill[];
}

//Navigation Types

export interface NavLink {
    label: string;
    href: string;
    isExternal?: boolean;
}

// ============================================================
// UTILITY TYPES
// Beberapa TypeScript utility types yang berguna untuk dipelajari
// ============================================================

// Readonly<T> - semua property menjadi read-only
// contoh penggunaan : const config: Readonly<AppConfig> = { ... }

// Partial<T> - semua property menjadi opsional
// Contoh : Partial<Project> berguna untuk update form

// Required<t> - kebalikan partial. semua property wajib ada 

// Pick<T, K> - buang bebrapa property dari type
// COntoh: Omit<Project, 'id'> - semua field kecualli Id (berguna untuk form create)

// Record<K, V> - object dengan key tipe K dan Value tipe V
// Contoh: record<ProjectCategory, Project[]> - grouping category