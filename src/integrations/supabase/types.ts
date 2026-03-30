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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admin_permissions: {
        Row: {
          created_at: string
          email: string
          has_admin_access: boolean
          id: string
          provider_name: string
          role: string
          staffing_assignable: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          has_admin_access?: boolean
          id?: string
          provider_name: string
          role?: string
          staffing_assignable?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          has_admin_access?: boolean
          id?: string
          provider_name?: string
          role?: string
          staffing_assignable?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_staffing: {
        Row: {
          admin_name: string | null
          alert_sent: boolean
          alert_sent_at: string | null
          booking_id: string
          created_at: string
          id: string
          is_staffed: boolean
          staffed_at: string | null
          staffed_by: string | null
          updated_at: string
        }
        Insert: {
          admin_name?: string | null
          alert_sent?: boolean
          alert_sent_at?: string | null
          booking_id: string
          created_at?: string
          id?: string
          is_staffed?: boolean
          staffed_at?: string | null
          staffed_by?: string | null
          updated_at?: string
        }
        Update: {
          admin_name?: string | null
          alert_sent?: boolean
          alert_sent_at?: string | null
          booking_id?: string
          created_at?: string
          id?: string
          is_staffed?: boolean
          staffed_at?: string | null
          staffed_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_staffing_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "office_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          id: string
          updated_at: string
          zapier_webhook_url: string | null
        }
        Insert: {
          id?: string
          updated_at?: string
          zapier_webhook_url?: string | null
        }
        Update: {
          id?: string
          updated_at?: string
          zapier_webhook_url?: string | null
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          active: boolean
          address: string
          city: string
          created_at: string
          id: string
          instructions: string | null
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          address: string
          city: string
          created_at?: string
          id?: string
          instructions?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          address?: string
          city?: string
          created_at?: string
          id?: string
          instructions?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      office_bookings: {
        Row: {
          addendum_signature_name: string | null
          addendum_signed: boolean
          addendum_signed_at: string | null
          booking_date: string
          created_at: string
          id: string
          notes: string | null
          office_location: Database["public"]["Enums"]["office_location"]
          provider_email: string
          provider_name: string
          provider_phone: string | null
          status: Database["public"]["Enums"]["booking_status"]
          time_block: Database["public"]["Enums"]["time_block"]
          updated_at: string
          visit_type: Database["public"]["Enums"]["visit_type"]
          visit_type_other: string | null
        }
        Insert: {
          addendum_signature_name?: string | null
          addendum_signed?: boolean
          addendum_signed_at?: string | null
          booking_date: string
          created_at?: string
          id?: string
          notes?: string | null
          office_location?: Database["public"]["Enums"]["office_location"]
          provider_email: string
          provider_name: string
          provider_phone?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          time_block: Database["public"]["Enums"]["time_block"]
          updated_at?: string
          visit_type: Database["public"]["Enums"]["visit_type"]
          visit_type_other?: string | null
        }
        Update: {
          addendum_signature_name?: string | null
          addendum_signed?: boolean
          addendum_signed_at?: string | null
          booking_date?: string
          created_at?: string
          id?: string
          notes?: string | null
          office_location?: Database["public"]["Enums"]["office_location"]
          provider_email?: string
          provider_name?: string
          provider_phone?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          time_block?: Database["public"]["Enums"]["time_block"]
          updated_at?: string
          visit_type?: Database["public"]["Enums"]["visit_type"]
          visit_type_other?: string | null
        }
        Relationships: []
      }
      patient_appointments: {
        Row: {
          appointment_date: string
          appointment_status: Database["public"]["Enums"]["appointment_status"]
          booking_source: string
          checked_in: boolean
          checked_in_at: string | null
          confirmation_code: string
          created_at: string
          id: string
          location_id: string
          notes: string | null
          patient_email: string
          patient_first_name: string
          patient_last_name: string
          patient_phone: string | null
          provider_availability_id: string
          provider_name: string
          slot_end: string
          slot_start: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_status?: Database["public"]["Enums"]["appointment_status"]
          booking_source?: string
          checked_in?: boolean
          checked_in_at?: string | null
          confirmation_code: string
          created_at?: string
          id?: string
          location_id: string
          notes?: string | null
          patient_email: string
          patient_first_name: string
          patient_last_name: string
          patient_phone?: string | null
          provider_availability_id: string
          provider_name: string
          slot_end: string
          slot_start: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_status?: Database["public"]["Enums"]["appointment_status"]
          booking_source?: string
          checked_in?: boolean
          checked_in_at?: string | null
          confirmation_code?: string
          created_at?: string
          id?: string
          location_id?: string
          notes?: string | null
          patient_email?: string
          patient_first_name?: string
          patient_last_name?: string
          patient_phone?: string | null
          provider_availability_id?: string
          provider_name?: string
          slot_end?: string
          slot_start?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_appointments_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_appointments_provider_availability_id_fkey"
            columns: ["provider_availability_id"]
            isOneToOne: false
            referencedRelation: "provider_office_availability"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          phone: string | null
          provider_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          phone?: string | null
          provider_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          phone?: string | null
          provider_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      provider_office_availability: {
        Row: {
          appointment_duration_minutes: number
          created_at: string
          end_time: string
          id: string
          location_id: string
          office_date: string
          provider_email: string
          provider_name: string
          slot_capacity: number
          start_time: string
          status: string
          updated_at: string
        }
        Insert: {
          appointment_duration_minutes?: number
          created_at?: string
          end_time?: string
          id?: string
          location_id: string
          office_date: string
          provider_email: string
          provider_name: string
          slot_capacity?: number
          start_time?: string
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_duration_minutes?: number
          created_at?: string
          end_time?: string
          id?: string
          location_id?: string
          office_date?: string
          provider_email?: string
          provider_name?: string
          slot_capacity?: number
          start_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_office_availability_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          accepts_new: boolean
          created_at: string
          credentials: string
          id: string
          insurers: string[]
          location: string
          photo_url: string | null
          provider_name: string
          rating: number | null
          specialties: string[]
          title: string
          updated_at: string
        }
        Insert: {
          accepts_new?: boolean
          created_at?: string
          credentials?: string
          id?: string
          insurers?: string[]
          location?: string
          photo_url?: string | null
          provider_name: string
          rating?: number | null
          specialties?: string[]
          title?: string
          updated_at?: string
        }
        Update: {
          accepts_new?: boolean
          created_at?: string
          credentials?: string
          id?: string
          insurers?: string[]
          location?: string
          photo_url?: string | null
          provider_name?: string
          rating?: number | null
          specialties?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      tour_votes: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          question_key: string
          reviewer_name: string | null
          session_id: string | null
          vote_value: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          question_key: string
          reviewer_name?: string | null
          session_id?: string | null
          vote_value: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          question_key?: string
          reviewer_name?: string | null
          session_id?: string | null
          vote_value?: string
        }
        Relationships: []
      }
      unmatched_checkins: {
        Row: {
          appointment_date: string
          appointment_time: string | null
          checked_in_at: string
          created_at: string
          full_name: string
          id: string
          location: string | null
          notes: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time?: string | null
          checked_in_at?: string
          created_at?: string
          full_name: string
          id?: string
          location?: string | null
          notes?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string | null
          checked_in_at?: string
          created_at?: string
          full_name?: string
          id?: string
          location?: string | null
          notes?: string | null
        }
        Relationships: []
      }
      walkthrough_feedback: {
        Row: {
          additional_comments: string | null
          checkin_preference: string | null
          created_at: string
          id: string
          issues_spotted: string | null
          overall_thoughts: string | null
          reviewer_name: string
          scheduling_feedback: string | null
          session_id: string | null
        }
        Insert: {
          additional_comments?: string | null
          checkin_preference?: string | null
          created_at?: string
          id?: string
          issues_spotted?: string | null
          overall_thoughts?: string | null
          reviewer_name: string
          scheduling_feedback?: string | null
          session_id?: string | null
        }
        Update: {
          additional_comments?: string | null
          checkin_preference?: string | null
          created_at?: string
          id?: string
          issues_spotted?: string | null
          overall_thoughts?: string | null
          reviewer_name?: string
          scheduling_feedback?: string | null
          session_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      book_patient_appointment: {
        Args: {
          p_availability_id: string
          p_notes?: string
          p_patient_email: string
          p_patient_first_name: string
          p_patient_last_name: string
          p_patient_phone?: string
          p_slot_end: string
          p_slot_start: string
        }
        Returns: Json
      }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      appointment_status:
        | "booked"
        | "confirmed"
        | "cancelled"
        | "completed"
        | "no_show"
      booking_status: "confirmed" | "cancelled"
      office_location: "hoboken" | "edison"
      time_block: "morning" | "afternoon" | "full_day"
      visit_type: "quarterly_adhd" | "initial_evaluation" | "other"
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
      appointment_status: [
        "booked",
        "confirmed",
        "cancelled",
        "completed",
        "no_show",
      ],
      booking_status: ["confirmed", "cancelled"],
      office_location: ["hoboken", "edison"],
      time_block: ["morning", "afternoon", "full_day"],
      visit_type: ["quarterly_adhd", "initial_evaluation", "other"],
    },
  },
} as const
