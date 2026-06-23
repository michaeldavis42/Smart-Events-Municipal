export type UserRole = 'user' | 'organizer' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  bio?: string;
  company_name?: string;
  company_description?: string;
  phone?: string;
  website?: string;
  created_at: string;
}

export interface EventModel {
  id: number;
  name: string;
  location: string;
  date: string;
  slots: number;
  participants: number;
  category: 'Cultural' | 'Deportivo' | 'Educativo' | 'Social' | 'Musical';
  status: 'Próximo' | 'En curso' | 'Completado';
  description?: string;
  image?: string;
  lat?: number;
  lng?: number;
  organizer_name?: string;
  organizer_email?: string;
  organizer_phone?: string;
}

export interface ReviewModel {
  id: number;
  event_id: number;
  user_id: number;
  user_name: string;
  rating: number; // 1 to 5
  comment: string;
  created_at: string;
}

export interface SponsorModel {
  id: number;
  event_id: number;
  name: string;
  logo_url?: string;
  description?: string;
  website?: string;
}

export interface SocialPostModel {
  id: number;
  user_id: number;
  user_name: string;
  content: string;
  image?: string;
  event_id?: number;
  event_name?: string;
  like_count: number;
  comment_count: number;
  liked_by: number[]; // user IDs who liked it
  created_at: string;
}

export interface SocialCommentModel {
  id: number;
  post_id: number;
  user_id: number;
  user_name: string;
  content: string;
  created_at: string;
}

export interface ProviderProfileModel {
  business_name: string;
  responsible_name: string;
  email: string;
  phone: string;
  category: string;
  description: string;
  location: string;
  price_range: string;
  capacity: string;
  availability: string;
  social_links: string;
  logo_url: string;
}

export interface SurveyModel {
  id: number;
  event_id: number;
  satisfaction: number;
  opinion: string;
  suggestion: string;
  created_at: string;
}
