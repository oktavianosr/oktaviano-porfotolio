//form types
// State management untuk GUestGate Form

export type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export interface FormState {
    status: FormStatus;
    errorMessage: string | null;
}
