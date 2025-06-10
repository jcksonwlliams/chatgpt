export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'admin' | 'rep';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          role?: 'admin' | 'rep';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: 'admin' | 'rep';
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'admin' | 'rep';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          role?: 'admin' | 'rep';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: 'admin' | 'rep';
          created_at?: string;
          updated_at?: string;
        };
      };
      cases: {
        Row: {
          id: string;
          doctor_name: string;
          hospital_name: string;
          city: string;
          state: string;
          assigned_rep_id: string;
          assigned_tray_serial: string;
          date: string;
          check_in_status: 'not_checked_in' | 'matched' | 'mismatched';
          check_in_time?: string;
          workflow_status: 'pending_checkin' | 'checked_in' | 'invoice_submitted' | 'case_completed';
          invoice_submitted?: boolean;
          invoice_submitted_time?: string;
          case_completed?: boolean;
          case_completed_time?: string;
          completion_notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          doctor_name: string;
          hospital_name: string;
          city: string;
          state: string;
          assigned_rep_id: string;
          assigned_tray_serial: string;
          date: string;
          check_in_status?: 'not_checked_in' | 'matched' | 'mismatched';
          check_in_time?: string;
          workflow_status?: 'pending_checkin' | 'checked_in' | 'invoice_submitted' | 'case_completed';
          invoice_submitted?: boolean;
          invoice_submitted_time?: string;
          case_completed?: boolean;
          case_completed_time?: string;
          completion_notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          doctor_name?: string;
          hospital_name?: string;
          city?: string;
          state?: string;
          assigned_rep_id?: string;
          assigned_tray_serial?: string;
          date?: string;
          check_in_status?: 'not_checked_in' | 'matched' | 'mismatched';
          check_in_time?: string;
          workflow_status?: 'pending_checkin' | 'checked_in' | 'invoice_submitted' | 'case_completed';
          invoice_submitted?: boolean;
          invoice_submitted_time?: string;
          case_completed?: boolean;
          case_completed_time?: string;
          completion_notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          case_id: string;
          type: 'case_assigned' | 'status_changed' | 'case_completed';
          title: string;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          case_id: string;
          type: 'case_assigned' | 'status_changed' | 'case_completed';
          title: string;
          message: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          case_id?: string;
          type?: 'case_assigned' | 'status_changed' | 'case_completed';
          title?: string;
          message?: string;
          read?: boolean;
          created_at?: string;
        };
      };
    };
  };
}
