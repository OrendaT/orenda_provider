import NJNavbar from "@/components/NJNavbar";
import NJFooter from "@/components/NJFooter";
import { motion } from "framer-motion";
import { format, addMinutes, subMinutes } from "date-fns";
import {
  CheckCircle2, Clock, Calendar, AlertCircle, MapPin, User, Activity
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

const formatTime12 = (date: Date) => format(date, "h:mm a");

export default function NJCheckInDemo() {
  const now = new Date();

  // Mock data — simulates a realistic day
  const mockAppointments = [
    {
      id: "1",
      patient_first_name: "Sarah",
      patient_last_name: "Mitchell",
      provider_name: "Dr. Patel",
      slot_start: format(subMinutes(now, 45), "HH:mm"),
      location: "Hoboken",
      checked_in: true,
      checked_in_at: subMinutes(now, 50).toISOString(),
      appointment_status: "booked",
    },
    {
      id: "2",
      patient_first_name: "James",
      patient_last_name: "Rodriguez",
      provider_name: "Dr. Kim",
      slot_start: format(subMinutes(now, 20), "HH:mm"),
      location: "Hoboken",
      checked_in: true,
      checked_in_at: subMinutes(now, 25).toISOString(),
      appointment_status: "booked",
    },
    {
      id: "3",
      patient_first_name: "Emily",
      patient_last_name: "Chen",
      provider_name: "Dr. Patel",
      slot_start: format(subMinutes(now, 5), "HH:mm"),
      location: "Edison",
      checked_in: false,
      checked_in_at: null,
      appointment_status: "booked",
    },
    {
      id: "4",
      patient_first_name: "Michael",
      patient_last_name: "Thompson",
      provider_name: "Dr. Kim",
      slot_start: format(addMinutes(now, 8), "HH:mm"),
      location: "Hoboken",
      checked_in: false,
      checked_in_at: null,
      appointment_status: "booked",
    },
    {
      id: "5",
      patient_first_name: "Olivia",
      patient_last_name: "Williams",
      provider_name: "Dr. Patel",
      slot_start: format(addMinutes(now, 12), "HH:mm"),
      location: "Edison",
      checked_in: false,
      checked_in_at: null,
      appointment_status: "booked",
    },
    {
      id: "6",
      patient_first_name: "David",
      patient_last_name: "Martinez",
      provider_name: "Dr. Kim",
      slot_start: format(addMinutes(now, 35), "HH:mm"),
      location: "Hoboken",
      checked_in: false,
      checked_in_at: null,
      appointment_status: "booked",
    },
    {
      id: "7",
      patient_first_name: "Sophia",
      patient_last_name: "Lee",
      provider_name: "Dr. Patel",
      slot_start: format(addMinutes(now, 60), "HH:mm"),
      location: "Edison",
      checked_in: false,
      checked_in_at: null,
      appointment_status: "booked",
    },
    {
      id: "8",
      patient_first_name: "Daniel",
      patient_last_name: "Brown",
      provider_name: "Dr. Kim",
      slot_start: format(addMinutes(now, 90), "HH:mm"),
      location: "Hoboken",
      checked_in: false,
      checked_in_at: null,
      appointment_status: "booked",
    },
  ];

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const getApptMinutes = (a: any) => {
    const [h, m] = a.slot_start.split(":").map(Number);
    return h * 60 + m;
  };

  const fmtTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  const checkedIn = mockAppointments.filter(a => a.checked_in);
  const notCheckedIn = mockAppointments.filter(a => !a.checked_in);

  const dueSoon = notCheckedIn.filter(a => {
    const apptMin = getApptMinutes(a);
    return apptMin > currentMinutes && apptMin - currentMinutes <= 15;
  });

  const late = notCheckedIn.filter(a => {
    const apptMin = getApptMinutes(a);
    return apptMin <= currentMinutes;
  });

  const upcoming = notCheckedIn.filter(a => {
    const apptMin = getApptMinutes(a);
    return apptMin - currentMinutes > 15;
  });

  const StatusRow = ({ appt, status }: { appt: any; status: string }) => {
    const statusColors: Record<string, string> = {
      "Checked In": "bg-green-100 text-green-700 border-green-200",
      "Due Soon": "bg-amber-100 text-amber-700 border-amber-200",
      "Late": "bg-red-100 text-red-700 border-red-200",
      "Upcoming": "bg-blue-50 text-blue-600 border-blue-200",
    };
    return (
      <div className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-white border border-border/50 hover:border-primary/15 transition-colors">
        <div className="flex items-center gap-3">
          <div className="text-center min-w-[48px]">
            <p className="text-xs font-bold text-foreground">{fmtTime(appt.slot_start)}</p>
          </div>
          <div className="w-px h-7 bg-border" />
          <div>
            <p className="text-sm font-bold text-foreground">{appt.patient_first_name} {appt.patient_last_name}</p>
            <p className="text-[10px] text-muted-foreground">
              w/ {appt.provider_name} · {appt.location}
              {appt.checked_in_at && ` · Checked in ${format(new Date(appt.checked_in_at), "h:mm a")}`}
            </p>
          </div>
        </div>
        <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusColors[status] || ""}`}>
          {status}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <NJNavbar isAdmin />

      {/* Hero */}
      <section
        className="pt-10 pb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, hsl(270, 100%, 20%) 0%, hsl(270, 80%, 35%) 60%, hsl(270, 40%, 80%) 100%)' }}
      >
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <p className="text-[10px] tracking-[0.4em] uppercase text-white/90 font-semibold">Demo Preview</p>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-white leading-[0.95] mb-2">
              Check-In Status <em style={{ fontStyle: 'italic' }} className="text-white/70">Widget</em>
            </h1>
            <p className="text-white/60 text-sm">This is a preview of how the patient check-in status appears in the Admin Console with sample data.</p>
          </motion.div>
        </div>
      </section>

      {/* Demo Widget */}
      <section className="py-8 sm:py-12" style={{ background: 'linear-gradient(180deg, hsl(270, 30%, 95%) 0%, hsl(0, 0%, 100%) 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
            <div className="rounded-2xl border-2 border-primary/15 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-foreground font-bold">Patient Check-In Status</h3>
                    <p className="text-[10px] text-muted-foreground font-medium">Real-time arrival tracking — {format(now, "EEEE, MMMM d, yyyy")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[9px] text-green-600 font-bold uppercase tracking-wider">Live</span>
                </div>
              </div>

              {/* Summary strip */}
              <div className="grid grid-cols-4 gap-2 mb-5">
                {[
                  { label: "Checked In", count: checkedIn.length, color: "bg-green-500" },
                  { label: "Due Soon", count: dueSoon.length, color: "bg-amber-500" },
                  { label: "Late", count: late.length, color: "bg-red-500" },
                  { label: "Upcoming", count: upcoming.length, color: "bg-blue-500" },
                ].map(s => (
                  <div key={s.label} className="text-center py-3 rounded-xl bg-secondary/30 border border-border/20">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <div className={`w-2 h-2 rounded-full ${s.color}`} />
                      <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                    </div>
                    <p className="font-display text-2xl font-bold text-foreground">{s.count}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {/* Late */}
                {late.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                      <p className="text-[9px] font-bold uppercase tracking-wider text-red-600">Late / Not Checked In</p>
                    </div>
                    <div className="space-y-1.5">
                      {late.map(a => <StatusRow key={a.id} appt={a} status="Late" />)}
                    </div>
                  </div>
                )}

                {/* Due Soon */}
                {dueSoon.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <p className="text-[9px] font-bold uppercase tracking-wider text-amber-600">Due Soon (next 15 min)</p>
                    </div>
                    <div className="space-y-1.5">
                      {dueSoon.map(a => <StatusRow key={a.id} appt={a} status="Due Soon" />)}
                    </div>
                  </div>
                )}

                {/* Checked In */}
                {checkedIn.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      <p className="text-[9px] font-bold uppercase tracking-wider text-green-600">Checked In</p>
                    </div>
                    <div className="space-y-1.5">
                      {checkedIn.map(a => <StatusRow key={a.id} appt={a} status="Checked In" />)}
                    </div>
                  </div>
                )}

                {/* Upcoming */}
                {upcoming.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      <p className="text-[9px] font-bold uppercase tracking-wider text-blue-600">Upcoming</p>
                    </div>
                    <div className="space-y-1.5">
                      {upcoming.map(a => <StatusRow key={a.id} appt={a} status="Upcoming" />)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Legend */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="mt-6">
            <div className="rounded-2xl border border-border/30 bg-white p-5">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Status Legend</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { status: "Checked In", desc: "Patient has arrived and completed check-in", color: "bg-green-100 text-green-700 border-green-200" },
                  { status: "Due Soon", desc: "Appointment within next 15 minutes, not yet checked in", color: "bg-amber-100 text-amber-700 border-amber-200" },
                  { status: "Late", desc: "Appointment time has passed, patient has not checked in", color: "bg-red-100 text-red-700 border-red-200" },
                  { status: "Upcoming", desc: "Appointment more than 15 minutes away", color: "bg-blue-50 text-blue-600 border-blue-200" },
                ].map(s => (
                  <div key={s.status} className="text-center">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border inline-block mb-1.5 ${s.color}`}>{s.status}</span>
                    <p className="text-[10px] text-muted-foreground leading-tight">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <NJFooter />
    </div>
  );
}
