import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, MapPin, Clock, Users, AlertTriangle, Send, Timer, Bell, Copy, Mail, MessageSquare, X } from "lucide-react";
import { format, differenceInMinutes } from "date-fns";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/orenda-logo-purple.png";
import AdminBoardTour from "@/components/AdminBoardTour";

const ORENDA_PHONE = "(347) 707-7735";

type PatientStatus = "checked_in" | "due_soon" | "late" | "upcoming";
type MockPatient = { name: string; apptTime: Date; provider: string; location: string; status: PatientStatus; checkedInAt: Date | null };

const DemoAdminBoard = () => {
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [reminderPatient, setReminderPatient] = useState<MockPatient | null>(null);
  const [reminderTab, setReminderTab] = useState<"email" | "sms">("email");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const now = currentTime;
  const today = new Date();
  const makeTime = (h: number, m: number) => {
    const d = new Date(today);
    d.setHours(h, m, 0, 0);
    return d;
  };

  const mockCheckins: MockPatient[] = [
    { name: "Sarah Johnson", apptTime: makeTime(8, 30), provider: "Dr. Martinez", location: "Hoboken", status: "checked_in", checkedInAt: makeTime(8, 22) },
    { name: "Michael Chen", apptTime: makeTime(9, 0), provider: "Dr. Patel", location: "Edison", status: "checked_in", checkedInAt: makeTime(8, 50) },
    { name: "Emily Rodriguez", apptTime: makeTime(9, 30), provider: "Dr. Kim", location: "Hoboken", status: "due_soon", checkedInAt: null },
    { name: "James Williams", apptTime: makeTime(10, 0), provider: "Dr. Martinez", location: "Hoboken", status: "upcoming", checkedInAt: null },
    { name: "Aisha Patel", apptTime: makeTime(7, 50), provider: "Dr. Lee", location: "Edison", status: "late", checkedInAt: null },
    { name: "David Kim", apptTime: makeTime(10, 30), provider: "Dr. Patel", location: "Edison", status: "upcoming", checkedInAt: null },
  ];

  const statusConfig = {
    checked_in: { label: "Checked In", color: "bg-primary/10 text-primary border-primary/20", dot: "bg-primary", headerBg: "hsl(270 100% 25%)", colBg: "hsl(270 30% 97%)" },
    due_soon: { label: "Due Soon", color: "bg-accent/10 text-accent border-accent/20", dot: "bg-accent", headerBg: "hsl(270 80% 40%)", colBg: "hsl(270 25% 96%)" },
    late: { label: "Late", color: "bg-foreground/10 text-foreground border-foreground/20", dot: "bg-foreground", headerBg: "hsl(270 60% 15%)", colBg: "hsl(270 15% 95%)" },
    upcoming: { label: "Upcoming", color: "bg-secondary text-secondary-foreground border-border", dot: "bg-muted-foreground", headerBg: "hsl(270 20% 60%)", colBg: "hsl(270 20% 98%)" },
  };

  const generateReminderEmail = (patient: MockPatient) => {
    const firstName = patient.name.split(" ")[0];
    const isLate = patient.status === "late";

    if (isLate) {
      return {
        subject: `Checking In — Your Appointment with ${patient.provider}`,
        body: `Hi ${firstName},

We hope everything is okay! We wanted to reach out because your appointment with ${patient.provider} was scheduled for ${format(patient.apptTime, "h:mm a")} today, and we haven't seen you check in yet.

If you're on your way or experiencing any issues getting to the office, please don't hesitate to let us know — we're happy to help.

If you're unable to make your appointment today, please give us a call so we can get you rescheduled at a time that works best for you.

You can reach us at ${ORENDA_PHONE}.

We look forward to seeing you!

Warm regards,
Orenda Psychiatry
${ORENDA_PHONE}
admin@orendapsych.com`,
      };
    }

    return {
      subject: `Reminder: Check In for Your Appointment — ${patient.provider}`,
      body: `Hi ${firstName},

This is a friendly reminder that your appointment with ${patient.provider} is coming up at ${format(patient.apptTime, "h:mm a")} today at our ${patient.location} office.

When you arrive, please check in using our digital check-in system so your provider knows you're here.

If you have any questions or need assistance, please contact us at ${ORENDA_PHONE}.

See you soon!

Warm regards,
Orenda Psychiatry
${ORENDA_PHONE}
admin@orendapsych.com`,
    };
  };

  const generateReminderSMS = (patient: MockPatient) => {
    const firstName = patient.name.split(" ")[0];
    const isLate = patient.status === "late";

    if (isLate) {
      return `Hi ${firstName}, this is Orenda Psychiatry. Your appointment with ${patient.provider} was at ${format(patient.apptTime, "h:mm a")} and we haven't seen you check in yet. If you're having any issues getting to the office, please let us know. You can reach us at ${ORENDA_PHONE}.`;
    }

    return `Hi ${firstName}, this is Orenda Psychiatry. Reminder: your appointment with ${patient.provider} is at ${format(patient.apptTime, "h:mm a")} today at ${patient.location}. Please check in when you arrive! Questions? Call us at ${ORENDA_PHONE}.`;
  };

  const handleCopySMS = () => {
    if (!reminderPatient) return;
    navigator.clipboard.writeText(generateReminderSMS(reminderPatient));
    toast({ title: "Copied!", description: "SMS text copied to clipboard" });
  };

  const handleSendEmail = () => {
    if (!reminderPatient) return;
    toast({ title: "Email sent!", description: `Reminder email sent to ${reminderPatient.name}` });
    setReminderPatient(null);
  };

  const dotPattern = `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='rgba(255,255,255,0.08)'/%3E%3C/svg%3E")`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* ═══ HERO HEADER ═══ */}
      <div
        className="w-full py-10 px-4 text-center"
        style={{
          background: `${dotPattern}, linear-gradient(135deg, hsl(270 100% 10%) 0%, hsl(270 60% 25%) 50%, hsl(270 50% 35%) 100%)`,
        }}
      >
        <img src={logo} alt="Orenda Psychiatry" className="h-8 mx-auto mb-4 brightness-0 invert" />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">Admin Arrival Board</h1>
        <p className="text-white/60 text-sm">Real-time patient check-in status · Demo View</p>
      </div>

      {/* ═══ ARRIVAL BOARD ═══ */}
      <div className="flex-1 w-full" style={{ background: "linear-gradient(180deg, hsl(270 20% 95%) 0%, hsl(0 0% 100%) 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="bg-white rounded-2xl shadow-2xl border overflow-hidden" style={{ borderColor: "hsl(270 20% 85%)" }}>
            {/* Board header — white with pattern, black/purple text */}
            <div
              className="px-6 py-5 flex items-center justify-between"
              style={{
                background: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='rgba(100,50,150,0.06)'/%3E%3C/svg%3E"), linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(270 30% 97%) 100%)`,
                borderBottom: "2px solid hsl(270 30% 88%)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, hsl(270 100% 20%), hsl(270 60% 40%))" }}
                >
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-foreground font-bold text-xl">Patient Arrivals</h2>
                  <p className="text-muted-foreground text-xs mt-0.5">{format(now, "EEEE, MMMM d, yyyy")}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="px-5 py-3 rounded-2xl border-2"
                  style={{
                    background: "linear-gradient(135deg, hsl(270 100% 20%) 0%, hsl(270 60% 35%) 100%)",
                    borderColor: "hsl(270 60% 50%)",
                    boxShadow: "0 4px 20px hsl(270 60% 30% / 0.3), 0 0 40px hsl(270 80% 50% / 0.15)",
                  }}
                >
                  <p className="text-white text-4xl font-bold font-mono tracking-tighter leading-none">{format(now, "h:mm")}</p>
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <p className="text-white/70 text-[10px] font-bold uppercase">{format(now, "a")}</p>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/80 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                    </span>
                    <p className="text-white text-[10px] font-bold uppercase">Live</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Kanban columns */}
            <div className="grid grid-cols-4 gap-0 min-h-[320px]">
              {(["late", "due_soon", "checked_in", "upcoming"] as const).map((status) => {
                const config = statusConfig[status];
                const patients = mockCheckins.filter(p => p.status === status);
                return (
                  <div key={status} className="border-r border-border last:border-r-0" style={{ background: config.colBg }}>
                    <div className="px-3 py-3 text-center" style={{ background: config.headerBg }}>
                      <p className="text-white text-xs font-bold uppercase tracking-wider">{config.label}</p>
                      <p className="text-white/90 text-2xl font-bold">{patients.length}</p>
                    </div>
                    <div className="p-2.5 space-y-2.5">
                      {patients.map((patient, i) => {
                        const minsLate = status === "late" ? differenceInMinutes(now, patient.apptTime) : 0;
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            className="bg-white rounded-xl p-3 shadow-sm border"
                            style={{ borderColor: "hsl(270 15% 90%)" }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ background: "linear-gradient(135deg, hsl(270 50% 30%), hsl(270 40% 50%))" }}
                              >
                                <span className="text-[10px] font-bold text-white">{patient.name.split(" ").map(n => n[0]).join("")}</span>
                              </div>
                              <p className="text-sm font-bold text-foreground truncate">{patient.name}</p>
                            </div>
                            <div className="space-y-1.5 ml-10">
                              <p className="text-xs font-bold text-foreground">{patient.provider}</p>
                              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {patient.location}
                              </p>
                              <p className="text-[11px] text-foreground font-semibold flex items-center gap-1">
                                <Clock className="w-3 h-3 text-muted-foreground" /> {format(patient.apptTime, "h:mm a")}
                              </p>
                              {patient.checkedInAt && (
                                <p className="text-[11px] font-semibold flex items-center gap-1 text-primary">
                                  <CheckCircle2 className="w-3 h-3" /> Arrived {format(patient.checkedInAt, "h:mm a")}
                                </p>
                              )}
                            </div>
                            {minsLate > 0 && (
                              <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-foreground/5 border border-foreground/15 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-foreground" />
                                <span className="text-[11px] font-bold text-foreground">{minsLate} min late — no check-in</span>
                              </div>
                            )}
                            {!patient.checkedInAt && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full mt-2.5 h-8 text-[11px] gap-1.5 font-bold border-primary/30 text-primary hover:bg-primary/5"
                                onClick={() => {
                                  setReminderPatient(patient);
                                  setReminderTab("email");
                                }}
                              >
                                <Send className="w-3 h-3" /> Send Reminder
                              </Button>
                            )}
                          </motion.div>
                        );
                      })}
                      {patients.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-8 opacity-50">No patients</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div
              className="px-6 py-3 flex items-center justify-between"
              style={{ background: "hsl(270 20% 96%)", borderTop: "1px solid hsl(270 15% 90%)" }}
            >
              <p className="text-xs text-muted-foreground"><span className="font-bold">{mockCheckins.length} patients</span> · Board auto-refreshes</p>
              <p className="text-xs text-muted-foreground font-medium">Admin Console · Board View</p>
            </div>
          </div>
        </div>
      </div>

      {/* Branding footer */}
      <div className="py-6 text-center" style={{ background: "hsl(270 20% 96%)" }}>
        <img src={logo} alt="Orenda Psychiatry" className="h-7 mx-auto opacity-60 mb-2" />
        <p className="text-xs text-muted-foreground opacity-50">{ORENDA_PHONE} · admin@orendapsych.com</p>
      </div>

      {/* ═══ REMINDER MODAL ═══ */}
      <Dialog open={!!reminderPatient} onOpenChange={(open) => !open && setReminderPatient(null)}>
        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl relative">
          {reminderPatient && (() => {
            const emailContent = generateReminderEmail(reminderPatient);
            const smsContent = generateReminderSMS(reminderPatient);
            const isLate = reminderPatient.status === "late";
            const minsLate = isLate ? differenceInMinutes(now, reminderPatient.apptTime) : 0;

            return (
              <>
                <div
                  className="px-6 py-4"
                  style={{
                    background: `${dotPattern}, linear-gradient(135deg, hsl(270 50% 15%) 0%, hsl(270 45% 28%) 100%)`,
                  }}
                >
                  <DialogHeader>
                    <DialogTitle className="text-white text-lg font-bold flex items-center gap-2">
                      <Bell className="w-5 h-5" /> Send Reminder to {reminderPatient.name}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-white/60 text-xs">{reminderPatient.provider} · {reminderPatient.location}</span>
                    {isLate && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-white/10 text-white/80 border border-white/20">
                        <Timer className="w-3 h-3" /> {minsLate}m late
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex border-b border-border">
                  <button
                    onClick={() => setReminderTab("email")}
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                      reminderTab === "email"
                        ? "text-primary border-b-2 border-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Mail className="w-4 h-4" /> Email
                  </button>
                  <button
                    onClick={() => setReminderTab("sms")}
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                      reminderTab === "sms"
                        ? "text-primary border-b-2 border-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" /> Text Message
                  </button>
                </div>

                <div className="p-6">
                  {reminderTab === "email" ? (
                    <div>
                      <div className="mb-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Subject</p>
                        <p className="text-sm font-semibold text-foreground bg-secondary/30 rounded-lg px-3 py-2 border border-border">
                          {emailContent.subject}
                        </p>
                      </div>
                      <div className="mb-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Body</p>
                        <div className="bg-secondary/20 rounded-lg px-4 py-3 border border-border max-h-64 overflow-y-auto">
                          <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                            {emailContent.body}
                          </pre>
                        </div>
                      </div>
                      <Button
                        onClick={handleSendEmail}
                        className="w-full h-11 font-bold text-sm gap-2"
                        style={{
                          background: "linear-gradient(135deg, hsl(270 100% 20%) 0%, hsl(270 60% 40%) 100%)",
                        }}
                      >
                        <Send className="w-4 h-4" /> Send Email
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Text Message</p>
                        <div className="bg-secondary/20 rounded-lg px-4 py-3 border border-border">
                          <p className="text-sm text-foreground leading-relaxed">{smsContent}</p>
                        </div>
                      </div>
                      <Button
                        onClick={handleCopySMS}
                        variant="outline"
                        className="w-full h-11 font-bold text-sm gap-2 border-primary/40 text-primary hover:bg-primary/5"
                      >
                        <Copy className="w-4 h-4" /> Copy Text Message
                      </Button>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ═══ GUIDED TOUR ═══ */}
      <AdminBoardTour
        onTriggerReminder={() => {
          // Open reminder for the first late patient, or first non-checked-in patient
          const latePatient = mockCheckins.find(p => p.status === "late");
          const target = latePatient || mockCheckins.find(p => !p.checkedInAt);
          if (target) {
            setReminderPatient(target);
            setReminderTab("email");
          }
        }}
      />
    </div>
  );
};

export default DemoAdminBoard;
