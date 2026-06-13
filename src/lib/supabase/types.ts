export type SupabaseTask = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  start_time: string | null; // HH:MM
  end_time: string | null; // HH:MM
  status: string; // pending, in-progress, delegated, done, delayed
  priority: string; // low, medium, high, urgent
  is_published: boolean;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
};

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: SupabaseTask;
        Insert: Omit<SupabaseTask, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<SupabaseTask, 'id' | 'created_at' | 'updated_at'>> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
}
