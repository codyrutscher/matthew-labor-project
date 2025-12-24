export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'staff' | 'client' | 'vendor'
          phone: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'admin' | 'staff' | 'client' | 'vendor'
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'staff' | 'client' | 'vendor'
          phone?: string | null
          created_at?: string
        }
      }
      staff_profiles: {
        Row: {
          id: string
          staff_roles: ('bartender' | 'server' | 'kitchen' | 'coordinator' | 'security')[]
          city: string
          status: 'available' | 'assigned' | 'unavailable'
        }
        Insert: {
          id: string
          staff_roles?: ('bartender' | 'server' | 'kitchen' | 'coordinator' | 'security')[]
          city: string
          status?: 'available' | 'assigned' | 'unavailable'
        }
        Update: {
          id?: string
          staff_roles?: ('bartender' | 'server' | 'kitchen' | 'coordinator' | 'security')[]
          city?: string
          status?: 'available' | 'assigned' | 'unavailable'
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          start_time: string
          end_time: string
          location: string
          city: string
          client_id: string | null
          vendor_id: string | null
          created_by: string
          status: 'draft' | 'open' | 'live' | 'completed'
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date: string
          start_time: string
          end_time: string
          location: string
          city: string
          client_id?: string | null
          vendor_id?: string | null
          created_by: string
          status?: 'draft' | 'open' | 'live' | 'completed'
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string
          start_time?: string
          end_time?: string
          location?: string
          city?: string
          client_id?: string | null
          vendor_id?: string | null
          created_by?: string
          status?: 'draft' | 'open' | 'live' | 'completed'
          created_at?: string
        }
      }
      event_role_requirements: {
        Row: {
          id: string
          event_id: string
          role: 'bartender' | 'server' | 'kitchen' | 'coordinator' | 'security'
          quantity: number
        }
        Insert: {
          id?: string
          event_id: string
          role: 'bartender' | 'server' | 'kitchen' | 'coordinator' | 'security'
          quantity?: number
        }
        Update: {
          id?: string
          event_id?: string
          role?: 'bartender' | 'server' | 'kitchen' | 'coordinator' | 'security'
          quantity?: number
        }
      }
      dispatch_requests: {
        Row: {
          id: string
          event_id: string
          staff_id: string
          staff_role: 'bartender' | 'server' | 'kitchen' | 'coordinator' | 'security'
          status: 'pending' | 'accepted' | 'declined'
          sent_at: string
          responded_at: string | null
        }
        Insert: {
          id?: string
          event_id: string
          staff_id: string
          staff_role: 'bartender' | 'server' | 'kitchen' | 'coordinator' | 'security'
          status?: 'pending' | 'accepted' | 'declined'
          sent_at?: string
          responded_at?: string | null
        }
        Update: {
          id?: string
          event_id?: string
          staff_id?: string
          staff_role?: 'bartender' | 'server' | 'kitchen' | 'coordinator' | 'security'
          status?: 'pending' | 'accepted' | 'declined'
          sent_at?: string
          responded_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          event_id: string
          sender_id: string
          content: string
          is_private: boolean
          private_recipient_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          sender_id: string
          content: string
          is_private?: boolean
          private_recipient_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          sender_id?: string
          content?: string
          is_private?: boolean
          private_recipient_id?: string | null
          created_at?: string
        }
      }
      staff_invites: {
        Row: {
          id: string
          email: string
          invited_by: string
          token: string
          accepted: boolean
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          email: string
          invited_by: string
          token: string
          accepted?: boolean
          created_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          email?: string
          invited_by?: string
          token?: string
          accepted?: boolean
          created_at?: string
          expires_at?: string
        }
      }
    }
  }
}
