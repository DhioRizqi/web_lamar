import { type ApplicationStatus } from "@/types";

export const APPLICATION_STATUSES: {
  value: ApplicationStatus;
  label: string;
  emoji: string;
}[] = [
  { value: "saved", label: "Saved", emoji: "🔖" },
  { value: "applied", label: "Applied", emoji: "📤" },
  { value: "review", label: "Under Review", emoji: "🔍" },
  { value: "interview", label: "Interview", emoji: "🎤" },
  { value: "offer", label: "Offer", emoji: "🎉" },
  { value: "rejected", label: "Rejected", emoji: "❌" },
  { value: "ghosted", label: "Ghosted", emoji: "👻" },
  { value: "withdrawn", label: "Withdrawn", emoji: "↩️" },
];

export const STATUS_CLASS_MAP: Record<ApplicationStatus, string> = {
  applied: "status-applied",
  review: "status-review",
  interview: "status-interview",
  offer: "status-offer",
  rejected: "status-rejected",
  ghosted: "status-ghosted",
  withdrawn: "status-withdrawn",
  saved: "status-saved",
};

export const KANBAN_COLUMNS: ApplicationStatus[] = [
  "saved",
  "applied",
  "review",
  "interview",
  "offer",
  "rejected",
];

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/applications", label: "Lamaran", icon: "Briefcase" },
  { href: "/calendar", label: "Kalender", icon: "CalendarDays" },
  { href: "/statistics", label: "Statistik", icon: "BarChart3" },
  { href: "/notifications", label: "Notifikasi", icon: "Bell" },
];
