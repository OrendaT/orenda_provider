import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import {
  ArrowLeft, ClipboardCheck, CheckCircle2, XCircle, Clock,
  ChevronLeft, ChevronRight, User, MapPin, AlertCircle
} from "lucide-react";
import {
  format, startOfDay, isSameDay, addDays, startOfWeek
} from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function AdminV2CheckIn() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const today = startOfDay(new Date());
  const [checkInDate, setCheckInDate] = useState<Date>(today);

  const { data: patientAppointments = [] } = useQuery({
    queryKey: ["admin-patient-appointments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("patient_appointments").select("*, locations(name)").order("appointment_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const toggleCheckIn = useMutation({
    mutationFn: async ({ id, checked_in }: { id: string; checked_in: boolean }) => {
      const { error } = await supabase.from("patient_appointments").update({
        checked_in,
        checked_in_at: checked_in ? new Date().toISOString() : null,
      } as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-patient-appointments"] }); },
  });

  const checkInDateStr = format(checkInDate, "yyyy-MM-dd");
  const isViewingToday = isSameDay(checkInDate, today);

  const todayAppts = useMemo(() => {
    return patientAppointments.filter((a: any) =>
      a.appointment_date === checkInDateStr && a.appointment_status !== "cancelled"
    ).sort((a: any, b: any) => a.slot_start.localeCompare(b.slot_start));
  }, [patientAppointments, checkInDateStr]);

  const checkedIn = todayAppts.filter((a: any) => a.checked_in);
  const notCheckedIn = todayAppts.filter((a: any) => !a.checked_in);

  function formatTime12(t: string): string {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(340, 80%, 15%) 0%, hsl(340, 70%, 30%) 50%, hsl(340, 60%, 45%) 100%)' }}>
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots-chk" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-chk)" />
        </svg>
        <div className="relative max-w-5xl mx-auto px-6 py-8 sm:py-12">
          <Link to="/admin-v2" className="inline-flex items-center gap-2 text-xs text-white/50 font-bold uppercase tracking-wider hover:text-white/80 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Console
          </Link>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight">Patient Check-In</h1>
          <p className="text-base text-white/60 mt-2 font-medium">
            {isViewingToday ? "Real-time patient arrival tracking for today." : `Viewing ${format(checkInDate, "EEEE, MMMM d, yyyy")}`}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Date Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button onClick={() => setCheckInDate(d => addDays(d, -7))}
            className="shrink-0 w-9 h-9 rounded-xl border border-border/30 flex items-center justify-center hover:bg-secondary/50 transition-colors">
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          {Array.from({ length: 7 }, (_, i) => {
            const d = addDays(startOfWeek(checkInDate, { weekStartsOn: 0 }), i);
            const isSelected = isSameDay(d, checkInDate);
            const isT = isSameDay(d, today);
            return (
              <button key={i} onClick={() => setCheckInDate(d)}
                className={`flex-1 min-w-[60px] py-3 rounded-xl text-center transition-all border-2 ${
                  isSelected ? "border-primary bg-primary/10" : isT ? "border-primary/30 bg-primary/5" : "border-transparent hover:bg-secondary/50"
                }`}>
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{format(d, "EEE")}</p>
                <p className={`text-lg font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>{format(d, "d")}</p>
                {isT && <div className="w-1.5 h-1.5 rounded-full bg-primary mx-auto mt-0.5" />}
              </button>
            );
          })}
          <button onClick={() => setCheckInDate(d => addDays(d, 7))}
            className="shrink-0 w-9 h-9 rounded-xl border border-border/30 flex items-center justify-center hover:bg-secondary/50 transition-colors">
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
          {!isViewingToday && (
            <button onClick={() => setCheckInDate(today)}
              className="shrink-0 text-[10px] font-bold text-primary uppercase tracking-wider border border-primary/30 rounded-xl px-4 py-2 hover:bg-primary/5 transition-colors">
              Today
            </button>
          )}
        </div>

        {/* Live Badge */}
        {isViewingToday && (
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Live · {todayAppts.length} appointments</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl border-2 border-border bg-card p-5 text-center">
            <p className="font-display text-3xl font-bold text-foreground">{todayAppts.length}</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mt-1">Total</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl border-2 border-green-200 bg-green-50 p-5 text-center">
            <p className="font-display text-3xl font-bold text-green-700">{checkedIn.length}</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-green-600 mt-1">Checked In</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5 text-center">
            <p className="font-display text-3xl font-bold text-amber-700">{notCheckedIn.length}</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-amber-600 mt-1">Waiting</p>
          </motion.div>
        </div>

        {/* Appointment List */}
        {todayAppts.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border bg-card p-10 text-center">
            <ClipboardCheck className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg font-bold text-foreground">No Appointments</p>
            <p className="text-sm text-muted-foreground mt-1">No patients scheduled for {format(checkInDate, "MMMM d, yyyy")}.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayAppts.map((appt: any) => (
              <motion.div key={appt.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                className={`rounded-2xl border-2 p-5 flex items-center gap-4 transition-all ${
                  appt.checked_in ? "border-green-200 bg-green-50/50" : "border-border bg-card hover:border-primary/20"
                }`}>
                {/* Check-in toggle */}
                <button onClick={() => toggleCheckIn.mutate({ id: appt.id, checked_in: !appt.checked_in })}
                  className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    appt.checked_in ? "bg-green-500 text-white" : "bg-secondary/50 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}>
                  {appt.checked_in ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                </button>

                {/* Time */}
                <div className="min-w-[75px] text-center">
                  <p className="text-base font-bold text-foreground">{formatTime12(appt.slot_start)}</p>
                  <p className="text-[10px] text-muted-foreground">{formatTime12(appt.slot_end)}</p>
                </div>

                <div className="w-px h-10 bg-border/30" />

                {/* Patient & Provider */}
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-foreground">{appt.patient_first_name} {appt.patient_last_name}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><User className="w-3 h-3" /> {appt.provider_name}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {(appt.locations as any)?.name || "—"}</span>
                  </div>
                </div>

                {/* Status badge */}
                <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${
                  appt.checked_in ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {appt.checked_in ? "Arrived" : "Waiting"}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
