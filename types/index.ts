export type ApplicationStatus =
  | "applied"
  | "review"
  | "interview"
  | "offer"
  | "rejected"
  | "ghosted"
  | "withdrawn"
  | "saved";

export interface Application {
  id: string;
  user_id: string;
  company: string;
  position: string;
  apply_date: string;
  job_url: string | null;
  notes: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  application_id: string | null;
  message: string;
  is_read: boolean;
  scheduled_at: string;
  created_at: string;
  application?: Pick<Application, "company" | "position">;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface DashboardStats {
  total: number;
  in_process: number;
  offers: number;
  rejected: number;
}
