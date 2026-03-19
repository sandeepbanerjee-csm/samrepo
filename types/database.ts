export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          role: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name?: string | null;
          email?: string | null;
          role?: string | null;
          created_at?: string | null;
        };
        Update: {
          name?: string | null;
          email?: string | null;
          role?: string | null;
          created_at?: string | null;
        };
      };
      accounts: {
        Row: {
          id: string;
          name: string;
          industry: string | null;
          account_tier: string | null;
          arr: number | null;
          start_date: string | null;
          renewal_date: string | null;
          engagement_model: string | null;
          delivery_manager: string | null;
          tech_stack: string[] | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          industry?: string | null;
          account_tier?: string | null;
          arr?: number | null;
          start_date?: string | null;
          renewal_date?: string | null;
          engagement_model?: string | null;
          delivery_manager?: string | null;
          tech_stack?: string[] | null;
          created_at?: string | null;
        };
        Update: {
          name?: string;
          industry?: string | null;
          account_tier?: string | null;
          arr?: number | null;
          start_date?: string | null;
          renewal_date?: string | null;
          engagement_model?: string | null;
          delivery_manager?: string | null;
          tech_stack?: string[] | null;
        };
      };
      contacts: {
        Row: {
          id: string;
          account_id: string | null;
          name: string | null;
          email: string | null;
          role: string | null;
          sentiment: string | null;
          influence_score: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          account_id?: string | null;
          name?: string | null;
          email?: string | null;
          role?: string | null;
          sentiment?: string | null;
          influence_score?: number | null;
          created_at?: string | null;
        };
        Update: {
          account_id?: string | null;
          name?: string | null;
          email?: string | null;
          role?: string | null;
          sentiment?: string | null;
          influence_score?: number | null;
        };
      };
      interactions: {
        Row: {
          id: string;
          account_id: string | null;
          type: string | null;
          summary: string | null;
          sentiment: string | null;
          interaction_date: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          account_id?: string | null;
          type?: string | null;
          summary?: string | null;
          sentiment?: string | null;
          interaction_date?: string | null;
          created_at?: string | null;
        };
        Update: {
          account_id?: string | null;
          type?: string | null;
          summary?: string | null;
          sentiment?: string | null;
          interaction_date?: string | null;
        };
      };
      action_items: {
        Row: {
          id: string;
          account_id: string | null;
          interaction_id: string | null;
          description: string | null;
          owner: string | null;
          due_date: string | null;
          priority: string | null;
          status: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          account_id?: string | null;
          interaction_id?: string | null;
          description?: string | null;
          owner?: string | null;
          due_date?: string | null;
          priority?: string | null;
          status?: string | null;
          created_at?: string | null;
        };
        Update: {
          account_id?: string | null;
          interaction_id?: string | null;
          description?: string | null;
          owner?: string | null;
          due_date?: string | null;
          priority?: string | null;
          status?: string | null;
        };
      };
      health_scores: {
        Row: {
          id: string;
          account_id: string | null;
          score: number | null;
          status: string | null;
          calculated_at: string | null;
        };
        Insert: {
          id?: string;
          account_id?: string | null;
          score?: number | null;
          status?: string | null;
          calculated_at?: string | null;
        };
        Update: {
          account_id?: string | null;
          score?: number | null;
          status?: string | null;
          calculated_at?: string | null;
        };
      };
      risks: {
        Row: {
          id: string;
          account_id: string | null;
          type: string | null;
          description: string | null;
          mitigation: string | null;
          status: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          account_id?: string | null;
          type?: string | null;
          description?: string | null;
          mitigation?: string | null;
          status?: string | null;
          created_at?: string | null;
        };
        Update: {
          account_id?: string | null;
          type?: string | null;
          description?: string | null;
          mitigation?: string | null;
          status?: string | null;
        };
      };
      opportunities: {
        Row: {
          id: string;
          account_id: string | null;
          title: string | null;
          value: number | null;
          probability: number | null;
          stage: string | null;
          expected_close_date: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          account_id?: string | null;
          title?: string | null;
          value?: number | null;
          probability?: number | null;
          stage?: string | null;
          expected_close_date?: string | null;
          created_at?: string | null;
        };
        Update: {
          account_id?: string | null;
          title?: string | null;
          value?: number | null;
          probability?: number | null;
          stage?: string | null;
          expected_close_date?: string | null;
        };
      };
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
