export interface Service {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  details: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface AboutUs {
  id: string;
  history: string;
  history_image: string | null;
  mission: string;
  vision: string;
  core_values: string;
  management: string;
  achievements: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  category: string;
  sort_order: number;
  created_at: string;
}

export interface NewsItem {
  id: string;
  title: string;
  featured_image: string | null;
  content: string;
  published_at: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  created_at: string;
}

export interface ContactInfo {
  id: string;
  address: string;
  phone: string;
  email: string;
  emergency_phone: string;
  map_embed_url: string | null;
  social_facebook: string | null;
  social_twitter: string | null;
  social_instagram: string | null;
  social_linkedin: string | null;
  updated_at: string;
}

export interface CKMTVVideo {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomepageContent {
  id: string;
  site_name: string;
  site_logo_url: string | null;
  welcome_title: string;
  welcome_title_line2: string | null;
  welcome_text: string;
  hero_image_url: string | null;
  hero_cta_text: string;
  hero_cta_link: string;
  announcement_title: string | null;
  announcement_text: string | null;
  announcement_active: boolean;
  director_name: string | null;
  director_title: string | null;
  director_statement: string | null;
  director_photo_url: string | null;
  updated_at: string;
}

export interface TopBar {
  id: string;
  emergency_phone: string;
  working_hours: string;
  announcements: string[];
  marquee_speed: number;
  is_active: boolean;
  updated_at: string;
}

export interface HeroSlide {
  id: string;
  image_url: string;
  title: string | null;
  subtitle: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string | null;
  department: string | null;
  service: string | null;
  preferred_date: string;
  preferred_time: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

export interface DownloadableForm {
  id: string;
  name: string;
  description: string | null;
  file_url: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ServicePrice {
  id: string;
  service_name: string;
  category: string | null;
  price: number;
  currency: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface SpecialistDoctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string | null;
  photo_url: string | null;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface DoctorSchedule {
  id: string;
  doctor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room_number: string | null;
  notes: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface DeveloperServiceAccount {
  id: string;
  provider_name: string;
  display_label: string;
  category: 'api' | 'database' | 'hosting' | 'ai';
  status: 'active' | 'inactive' | 'error';
  has_sync_error: boolean;
  sync_error_message: string | null;
  last_sync_at: string | null;
  available_quota: string | null;
  rate_limit_info: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InfrastructureUsage {
  id: string;
  service_account_id: string | null;
  provider_name: string;
  metric_type: string;
  metric_value: number;
  unit: string | null;
  billing_period_start: string;
  billing_period_end: string;
  is_estimated: boolean;
  recorded_at: string;
  created_at: string;
}

export interface InfrastructureInvoice {
  id: string;
  provider_name: string;
  service_category: string;
  invoice_number: string | null;
  amount: number;
  currency: string;
  amount_usd: number | null;
  billing_period_start: string;
  billing_period_end: string;
  due_date: string | null;
  payment_status: 'unpaid' | 'paid' | 'overdue' | 'cancelled';
  paid_at: string | null;
  invoice_document_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InfrastructureBudget {
  id: string;
  category: string;
  monthly_limit_usd: number;
  alert_threshold_pct: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InfrastructureAlert {
  id: string;
  alert_type: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  related_provider: string | null;
  related_category: string | null;
  is_resolved: boolean;
  resolved_at: string | null;
  triggered_at: string;
  created_at: string;
}

export interface InfrastructureAuditLog {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}
