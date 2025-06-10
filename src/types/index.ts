
// Legacy types - kept for compatibility but recommend using database types instead
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'rep';
  assigned_case_ids?: string[];
}

// Note: Use Database['public']['Tables']['cases']['Row'] from src/types/database.ts instead
export interface Case {
  id: string;
  date: string; // Changed from Date to string to match database
  doctor_name: string;
  hospital_name: string;
  city: string;
  state: string;
  assigned_rep_id: string;
  assigned_tray_serial: string;
  check_in_status: 'not_checked_in' | 'matched' | 'mismatched';
  check_in_time?: string; // Changed from Date to string
  workflow_status: 'pending_checkin' | 'checked_in' | 'invoice_submitted' | 'case_completed';
  invoice_submitted?: boolean;
  invoice_submitted_time?: string; // Changed from Date to string
  case_completed?: boolean;
  case_completed_time?: string; // Changed from Date to string
  completion_notes?: string;
}

export interface TrayScans {
  id: string;
  case_id: string;
  scanned_by: string;
  scanned_serial: string;
  result: 'matched' | 'mismatched';
  scanned_at: string; // Changed from Date to string
}
