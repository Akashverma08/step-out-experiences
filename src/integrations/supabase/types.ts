export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          admin_note: string | null
          age: number | null
          amount_inr: number
          billing_address: string | null
          billing_pincode: string | null
          billing_state: string | null
          booking_number: string | null
          city: string | null
          contact_email: string
          contact_name: string
          contact_phone: string
          coupon_code: string | null
          created_at: string
          date_of_birth: string | null
          discount_inr: number
          emergency_contact: string | null
          experience_id: string
          gender: string | null
          gst_inr: number
          id: string
          paid_at: string | null
          payment_method: string | null
          payment_screenshot_url: string | null
          platform_fee_inr: number
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          refund_id: string | null
          refunded_at: string | null
          seats: number
          special_requests: string | null
          status: Database["public"]["Enums"]["booking_status"]
          terms_accepted: boolean
          updated_at: string
          upi_txn_id: string | null
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          age?: number | null
          amount_inr: number
          billing_address?: string | null
          billing_pincode?: string | null
          billing_state?: string | null
          booking_number?: string | null
          city?: string | null
          contact_email: string
          contact_name: string
          contact_phone: string
          coupon_code?: string | null
          created_at?: string
          date_of_birth?: string | null
          discount_inr?: number
          emergency_contact?: string | null
          experience_id: string
          gender?: string | null
          gst_inr?: number
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_screenshot_url?: string | null
          platform_fee_inr?: number
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          refund_id?: string | null
          refunded_at?: string | null
          seats?: number
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          terms_accepted?: boolean
          updated_at?: string
          upi_txn_id?: string | null
          user_id: string
        }
        Update: {
          admin_note?: string | null
          age?: number | null
          amount_inr?: number
          billing_address?: string | null
          billing_pincode?: string | null
          billing_state?: string | null
          booking_number?: string | null
          city?: string | null
          contact_email?: string
          contact_name?: string
          contact_phone?: string
          coupon_code?: string | null
          created_at?: string
          date_of_birth?: string | null
          discount_inr?: number
          emergency_contact?: string | null
          experience_id?: string
          gender?: string | null
          gst_inr?: number
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_screenshot_url?: string | null
          platform_fee_inr?: number
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          refund_id?: string | null
          refunded_at?: string | null
          seats?: number
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          terms_accepted?: boolean
          updated_at?: string
          upi_txn_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string
          experience_id: string
          id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          experience_id: string
          id?: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          experience_id?: string
          id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_queries: {
        Row: {
          admin_reply: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          preferred_contact: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          admin_reply?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          preferred_contact?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          admin_reply?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          preferred_contact?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          age_requirement: string | null
          cancellation_policy: string | null
          capacity: number
          category: string
          city: string
          created_at: string
          date: string
          description: string
          dress_code: string | null
          duration_minutes: number | null
          faqs: Json | null
          gallery: Json | null
          highlights: Json | null
          host_bio: string | null
          host_name: string | null
          id: string
          image_url: string | null
          is_published: boolean
          location: string
          map_url: string | null
          materials: Json | null
          price_inr: number
          slug: string
          subtitle: string | null
          title: string
          updated_at: string
          whats_included: Json | null
        }
        Insert: {
          age_requirement?: string | null
          cancellation_policy?: string | null
          capacity?: number
          category: string
          city: string
          created_at?: string
          date: string
          description: string
          dress_code?: string | null
          duration_minutes?: number | null
          faqs?: Json | null
          gallery?: Json | null
          highlights?: Json | null
          host_bio?: string | null
          host_name?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          location: string
          map_url?: string | null
          materials?: Json | null
          price_inr: number
          slug: string
          subtitle?: string | null
          title: string
          updated_at?: string
          whats_included?: Json | null
        }
        Update: {
          age_requirement?: string | null
          cancellation_policy?: string | null
          capacity?: number
          category?: string
          city?: string
          created_at?: string
          date?: string
          description?: string
          dress_code?: string | null
          duration_minutes?: number | null
          faqs?: Json | null
          gallery?: Json | null
          highlights?: Json | null
          host_bio?: string | null
          host_name?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          location?: string
          map_url?: string | null
          materials?: Json | null
          price_inr?: number
          slug?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
          whats_included?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          phone?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_admin_if_first: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      seats_left: { Args: { _experience_id: string }; Returns: number }
    }
    Enums: {
      app_role: "admin" | "user"
      booking_status:
        | "pending"
        | "approved"
        | "rejected"
        | "refunded"
        | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      booking_status: ["pending", "approved", "rejected", "refunded", "failed"],
    },
  },
} as const
