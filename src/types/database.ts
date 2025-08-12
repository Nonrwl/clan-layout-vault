export type BaseType = 'WAR' | 'FARMING' | 'HYBRID' | 'CWL' | 'TROPHY' | 'FUN' | 'PROGRESS_BASE';
export type HallType = 'TH' | 'BH';

export interface Base {
  id: string;
  name: string;
  image_url?: string;
  layout_link: string;
  description?: string;
  stats?: string;
  tips?: string;
  hall_type: HallType;
  hall_level: number;
  base_type: BaseType;
  download_count: number;
  average_rating: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

export interface Rating {
  id: string;
  base_id: string;
  ip_address: string;
  browser_fingerprint: string;
  rating: number;
  created_at: string;
}

export interface Download {
  id: string;
  base_id: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}