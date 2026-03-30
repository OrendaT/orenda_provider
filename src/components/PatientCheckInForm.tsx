import { useState, useMemo, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2, MapPin, Clock, Calendar, User, Shield } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface PatientCheckInFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Generate time slots from 8:00 AM to 7:00 PM in 30-min increments
const TIME_SLOTS: string[] = [];
for (let h = 8; h <= 19; h++) {
  for (let m = 0; m < 60; m += 30) {
    if (h === 19 && m > 0) break; // stop at 7:00 PM
    const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
    const ampm = h >= 12 ? "PM" : "AM";
    const min = m.toString().padStart(2, "0");
    TIME_SLOTS.push(`${hour12}:${min} ${ampm}`);
  }
}

function getNearestSlot(): string {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  let closest = TIME_SLOTS[0];
  let closestDiff = Infinity;
  for (const slot of TIME_SLOTS) {
    const [time, ampm] = slot.split(" ");
    const [hStr, mStr] = time.split(":");
    let h = parseInt(hStr);
    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    const slotMin = h * 60 + parseInt(mStr);
    const diff = Math.abs(slotMin - currentMinutes);
    if (diff < closestDiff) { closestDiff = diff; closest = slot; }
  }
  return closest;
}

export default function PatientCheckInForm({ open, onOpenChange }: PatientCheckInFormProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [location, setLocation] = useState("");
  const [selectedTime, setSelectedTime] = useState(getNearestSlot);
  const [notes, setNotes] = useState("");
  const timeGridRef = useRef<HTMLDivElement>(null);

  const appointmentTime = selectedTime;

  // Auto-scroll to selected time slot when step 2 mounts
  useEffect(() => {
    if (step === 2 && timeGridRef.current) {
      const selected = timeGridRef.current.querySelector(`[data-slot="${selectedTime}"]`);
      if (selected) {
        setTimeout(() => selected.scrollIntoView({ block: "center", behavior: "smooth" }), 100);
      }
    }
  }, [step]);

  const handleSubmit = async () => {
    if (!fullName.trim() || !location || !appointmentTime) {
      toast({ title: "Please complete all required fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const now = new Date().toISOString();

      // Always insert as unmatched — admin will reconcile on backend
      // NEVER query patient_appointments from the patient-facing form
      const { error } = await supabase.from("unmatched_checkins").insert({
        full_name: fullName.trim(),
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        location: location || null,
        notes: notes || null,
        checked_in_at: now,
      });

      if (error) throw error;

      // Notify provider (best-effort)
      try {
        await supabase.functions.invoke("notify-provider-checkin", {
          body: {
            patientName: fullName.trim(),
            appointmentDate,
            appointmentTime,
            location: location || "NJ Office",
            providerName: "Provider",
          },
        });
      } catch {
        // Notification failure shouldn't block check-in
      }

      setStep(3);
      toast({ title: "✓ You're checked in!", description: "Your provider has been notified." });
    } catch (err: any) {
      toast({ title: "Check-in failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setFullName("");
      setAppointmentDate(format(new Date(), "yyyy-MM-dd"));
      setLocation("");
      setSelectedTime(getNearestSlot());
      setNotes("");
    }, 300);
  };

  const canProceedStep1 = fullName.trim().length > 0;
  const canProceedStep2 = location && selectedTime;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto border-primary/15 p-0">
        <AnimatePresence mode="wait">
          {/* ─── STEP 1: Name ─── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="p-6 sm:p-8"
            >
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 20%) 0%, hsl(270, 80%, 45%) 100%)' }}>
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground">Patient Check-In</h2>
                    <p className="text-xs text-muted-foreground">Let your provider know you've arrived</p>
                  </div>
                </div>

                {/* Step indicator */}
                <div className="flex items-center gap-2">
                  {[1, 2].map(s => (
                    <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? 'bg-primary' : 'bg-border'}`} />
                  ))}
                </div>
              </div>

              {/* Privacy notice */}
              <div className="rounded-xl bg-primary/5 border border-primary/10 p-3.5 flex items-start gap-3 mb-6">
                <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-foreground">Your privacy is protected</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Your information is sent directly to our admin team and is never displayed publicly.
                  </p>
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <Label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> What is your full name?
                </Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="First and Last Name"
                  className="h-14 text-base border-2 border-border focus:border-primary/40 rounded-xl px-4"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === "Enter" && canProceedStep1) setStep(2); }}
                />
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className="w-full h-13 text-sm font-bold tracking-wider uppercase rounded-xl mt-6"
              >
                Continue
              </Button>
            </motion.div>
          )}

          {/* ─── STEP 2: Location & Time ─── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="p-6 sm:p-8"
            >
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 20%) 0%, hsl(270, 80%, 45%) 100%)' }}>
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground">Appointment Details</h2>
                    <p className="text-xs text-muted-foreground">Hi {fullName.split(" ")[0]}, select your location and time</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2].map(s => (
                    <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? 'bg-primary' : 'bg-border'}`} />
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                {/* Location */}
                <div>
                  <Label className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-primary" /> Which office are you at?
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "Hoboken", address: "221 River St, 9th Floor" },
                      { name: "Edison", address: "110 Fieldcrest Ave, 3rd Floor" },
                    ].map((loc) => (
                      <button
                        key={loc.name}
                        type="button"
                        onClick={() => setLocation(loc.name)}
                        className={`py-4 px-4 rounded-2xl border-2 text-left transition-all ${
                          location === loc.name
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <p className={`text-base font-bold ${location === loc.name ? 'text-primary' : 'text-foreground'}`}>{loc.name}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{loc.address}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Appointment Date */}
                <div>
                  <Label className="text-sm font-bold text-foreground flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" /> Appointment Date
                  </Label>
                  <Input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="h-12 border-2 border-border focus:border-primary/40 rounded-xl"
                  />
                </div>

                {/* Time Slots */}
                <div>
                  <Label className="text-sm font-bold text-foreground flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-primary" /> Appointment Time
                  </Label>
                  <div
                    ref={timeGridRef}
                    className="max-h-[140px] overflow-y-auto rounded-xl border-2 border-border p-2"
                  >
                    <div className="grid grid-cols-4 gap-1.5">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          data-slot={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                            selectedTime === slot
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-secondary/30 text-foreground hover:bg-secondary/60"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <Label className="text-sm font-bold text-foreground mb-2 block">
                    Notes for your provider <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Anything you'd like your provider to know"
                    rows={2}
                    className="border-2 border-border focus:border-primary/40 rounded-xl resize-none"
                  />
                </div>

                {/* Check-in timestamp */}
                <div className="rounded-xl bg-secondary/30 border border-border p-3.5 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Check-In Time</p>
                    <p className="text-sm font-bold text-foreground">{format(new Date(), "h:mm a")} — {format(new Date(), "MMMM d, yyyy")}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-13 rounded-xl font-bold"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !canProceedStep2}
                  className="flex-[2] h-13 text-sm font-bold tracking-wider uppercase rounded-xl"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Checking In...</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4 mr-2" /> Check In</>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 3: Success ─── */}
          {step === 3 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12 px-8"
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, hsl(160, 70%, 30%) 0%, hsl(160, 60%, 45%) 100%)' }}>
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-display text-2xl text-foreground font-bold mb-2">You're Checked In!</h3>
              <p className="text-muted-foreground text-sm mb-1">
                Your provider has been notified that you've arrived.
              </p>
              <p className="text-muted-foreground text-xs mb-8">
                Please have a seat — your provider will come greet you shortly.
              </p>
              <Button onClick={handleClose} variant="outline" className="rounded-xl px-8">
                Close
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
