export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      artists: {
        Row: {
          id: string
          name: string
          bio: string
          profile_image: string
          total_blessings: number
          total_plays: number
          stripe_account_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          bio?: string
          profile_image?: string
          total_blessings?: number
          total_plays?: number
          stripe_account_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          bio?: string
          profile_image?: string
          total_blessings?: number
          total_plays?: number
          stripe_account_id?: string | null
          created_at?: string
        }
      }
      tracks: {
        Row: {
          id: string
          title: string
          artist_id: string
          album: string
          duration: number
          file_url: string
          cover_image_url: string
          genre: string
          release_date: string
          plays_count: number
          is_premium: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          artist_id: string
          album?: string
          duration: number
          file_url: string
          cover_image_url?: string
          genre?: string
          release_date?: string
          plays_count?: number
          is_premium?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          artist_id?: string
          album?: string
          duration?: number
          file_url?: string
          cover_image_url?: string
          genre?: string
          release_date?: string
          plays_count?: number
          is_premium?: boolean
          created_at?: string
        }
      }
      playlists: {
        Row: {
          id: string
          title: string
          description: string
          cover_image: string
          artist_id: string | null
          category: string
          is_featured: boolean
          play_count: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          cover_image?: string
          artist_id?: string | null
          category?: string
          is_featured?: boolean
          play_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          cover_image?: string
          artist_id?: string | null
          category?: string
          is_featured?: boolean
          play_count?: number
          created_at?: string
        }
      }
      playlist_tracks: {
        Row: {
          playlist_id: string
          track_id: string
          position: number
          added_at: string
        }
        Insert: {
          playlist_id: string
          track_id: string
          position: number
          added_at?: string
        }
        Update: {
          playlist_id?: string
          track_id?: string
          position?: number
          added_at?: string
        }
      }
      users: {
        Row: {
          id: string
          username: string | null
          profile_image: string
          subscription_status: string
          subscription_end_date: string
          stripe_customer_id: string | null
          created_at: string
        }
        Insert: {
          id: string
          username?: string | null
          profile_image?: string
          subscription_status?: string
          subscription_end_date?: string
          stripe_customer_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          profile_image?: string
          subscription_status?: string
          subscription_end_date?: string
          stripe_customer_id?: string | null
          created_at?: string
        }
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          favoritable_type: string
          favoritable_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          favoritable_type: string
          favoritable_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          favoritable_type?: string
          favoritable_id?: string
          created_at?: string
        }
      }
      listening_history: {
        Row: {
          id: string
          user_id: string
          track_id: string
          played_at: string
          duration_listened: number
        }
        Insert: {
          id?: string
          user_id: string
          track_id: string
          played_at?: string
          duration_listened?: number
        }
        Update: {
          id?: string
          user_id?: string
          track_id?: string
          played_at?: string
          duration_listened?: number
        }
      }
      blessings: {
        Row: {
          id: string
          user_id: string | null
          artist_id: string
          track_id: string | null
          amount: number
          stripe_payment_id: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          artist_id: string
          track_id?: string | null
          amount: number
          stripe_payment_id: string
          message?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          artist_id?: string
          track_id?: string | null
          amount?: number
          stripe_payment_id?: string
          message?: string
          created_at?: string
        }
      }
      artist_earnings: {
        Row: {
          id: string
          artist_id: string
          blessing_amount: number
          platform_fee: number
          stripe_fee: number
          net_amount: number
          payout_status: string
          stripe_payout_id: string | null
          payout_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          artist_id: string
          blessing_amount: number
          platform_fee: number
          stripe_fee: number
          net_amount: number
          payout_status?: string
          stripe_payout_id?: string | null
          payout_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          artist_id?: string
          blessing_amount?: number
          platform_fee?: number
          stripe_fee?: number
          net_amount?: number
          payout_status?: string
          stripe_payout_id?: string | null
          payout_date?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_track_plays: {
        Args: { track_uuid: string }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
