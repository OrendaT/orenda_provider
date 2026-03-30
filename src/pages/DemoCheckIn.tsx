import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle2, Loader2, MapPin, Clock, Calendar, User, Shield, Phone, AlertTriangle, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/orenda-logo-purple.png";

const ORENDA_PHONE = "(347) 707-7735";

const DemoCheckIn = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [location, setLocation] = useState("");
  const [appointmentTimeHour, setAppointmentTimeHour] = useState("");
  const [appointmentTimeMinute, setAppointmentTimeMinute] = useState("00");
  const [appointmentTimeAmPm, setAppointmentTimeAmPm] = useState<"AM" | "PM">(
    new Date().getHours() >= 12 ? "PM" : "AM"
  );
  const [notes, setNotes] = useState("");

  const appointmentTime = appointmentTimeHour
    ? `${appointmentTimeHour}:${appointmentTimeMinute || "00"} ${appointmentTimeAmPm}`
    : "";

  const canProceedStep1 = fullName.trim().length > 0;
  const canProceedStep2 = location && appointmentTimeHour;

  const handleCheckInClick = () => {
    if (!fullName.trim() || !location || !appointmentTime) return;
    setShowDisclaimer(true);
  };

  const handleConfirmSubmit = async () => {
    setShowDisclaimer(false);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setFullName("");
    setAppointmentDate(format(new Date(), "yyyy-MM-dd"));
    setLocation("");
    setAppointmentTimeHour("");
    setAppointmentTimeMinute("00");
    setAppointmentTimeAmPm(new Date().getHours() >= 12 ? "PM" : "AM");
    setNotes("");
  };

  const dotPattern = `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='rgba(255,255,255,0.08)'/%3E%3C/svg%3E")`;

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* ═══ HERO HEADER ═══ */}
      <div
        className="w-full py-10 px-4 text-center"
        style={{
          background: `${dotPattern}, linear-gradient(135deg, hsl(270 100% 10%) 0%, hsl(270 60% 25%) 50%, hsl(270 50% 35%) 100%)`,
        }}
      >
        <img src={logo} alt="Orenda Psychiatry" className="h-8 mx-auto mb-4 brightness-0 invert" />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">Digital Check-In</h1>
        <p className="text-white/60 text-sm">Patient-facing check-in experience · Demo</p>
      </div>

      {/* ═══ PATIENT CHECK-IN FORM ═══ */}
      <div
        className="flex-1 w-full py-12 px-4"
        style={{
          background: `${dotPattern}, linear-gradient(170deg, hsl(270 30% 97%) 0%, hsl(270 20% 93%) 100%)`,
        }}
      >
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border" style={{ borderColor: "hsl(270 20% 88%)" }}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="p-6 sm:p-8"
                >
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, hsl(270 100% 20%) 0%, hsl(270 80% 45%) 100%)" }}
                      >
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-bold text-foreground">Check In for Your Appointment</h2>
                        <p className="text-xs text-muted-foreground">Let your provider know you've arrived</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {[1, 2].map((s) => (
                        <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? "bg-primary" : "bg-border"}`} />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl bg-primary/5 border border-primary/10 p-3.5 flex items-start gap-3 mb-6">
                    <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-foreground">Your privacy is protected</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Your information is sent directly to our admin team and is never displayed publicly.
                      </p>
                    </div>
                  </div>

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
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && canProceedStep1) setStep(2);
                      }}
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
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, hsl(270 100% 20%) 0%, hsl(270 80% 45%) 100%)" }}
                      >
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-bold text-foreground">Appointment Details</h2>
                        <p className="text-xs text-muted-foreground">
                          Hi {fullName.split(" ")[0]}, select your location and time
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {[1, 2].map((s) => (
                        <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? "bg-primary" : "bg-border"}`} />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-5">
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
                              location === loc.name ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                            }`}
                          >
                            <p className={`text-base font-bold ${location === loc.name ? "text-primary" : "text-foreground"}`}>
                              {loc.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{loc.address}</p>
                          </button>
                        ))}
                      </div>
                    </div>

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

                    <div>
                      <Label className="text-sm font-bold text-foreground flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-primary" /> Appointment Time
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={1}
                          max={12}
                          value={appointmentTimeHour}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, "").slice(0, 2);
                            if (v === "" || (Number(v) >= 0 && Number(v) <= 12)) setAppointmentTimeHour(v);
                          }}
                          placeholder="HH"
                          className="w-20 h-12 text-center text-base font-bold border-2 border-border focus:border-primary/40 rounded-xl"
                        />
                        <span className="text-foreground font-bold text-xl">:</span>
                        <Input
                          type="number"
                          min={0}
                          max={59}
                          value={appointmentTimeMinute}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, "").slice(0, 2);
                            if (v === "" || (Number(v) >= 0 && Number(v) <= 59)) setAppointmentTimeMinute(v);
                          }}
                          placeholder="MM"
                          className="w-20 h-12 text-center text-base font-bold border-2 border-border focus:border-primary/40 rounded-xl"
                        />
                        <div className="flex rounded-xl border-2 border-border overflow-hidden h-12">
                          {(["AM", "PM"] as const).map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setAppointmentTimeAmPm(p)}
                              className={`px-4 h-full text-sm font-bold transition-colors ${
                                appointmentTimeAmPm === p
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-background text-foreground hover:bg-secondary/50"
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

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

                    <div className="rounded-xl bg-secondary/30 border border-border p-3.5 flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Check-In Time</p>
                        <p className="text-sm font-bold text-foreground">
                          {format(new Date(), "h:mm a")} — {format(new Date(), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-13 rounded-xl font-bold">
                      Back
                    </Button>
                    <Button
                      onClick={handleCheckInClick}
                      disabled={loading || !canProceedStep2}
                      className="flex-[2] h-13 text-sm font-bold tracking-wider uppercase rounded-xl"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" /> Checking In...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Check In
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-12 px-8"
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: "linear-gradient(135deg, hsl(270 100% 20%) 0%, hsl(270 60% 40%) 100%)" }}
                  >
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-display text-2xl text-foreground font-bold mb-2">You're Checked In!</h3>
                  <p className="text-muted-foreground text-sm mb-1">
                    Your provider has been notified that you've arrived.
                  </p>
                  <p className="text-muted-foreground text-xs mb-8">
                    Please have a seat — your provider will come greet you shortly.
                  </p>
                  <Button onClick={handleReset} variant="outline" className="rounded-xl px-8">
                    Done
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Branding footer */}
          <div className="mt-8 text-center space-y-2">
            <img src={logo} alt="Orenda Psychiatry" className="h-7 mx-auto opacity-60" />
            <div className="flex items-center justify-center gap-1.5 opacity-50">
              <Phone className="w-3 h-3 text-primary" />
              <p className="text-xs text-muted-foreground">
                {ORENDA_PHONE} · admin@orendapsych.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ DISCLAIMER DIALOG ═══ */}
      <Dialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl">
          <div className="px-5 py-4 text-center" style={{ background: "linear-gradient(135deg, hsl(270 100% 10%) 0%, hsl(270 60% 25%) 100%)" }}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <AlertTriangle className="w-5 h-5 text-amber-300" />
              <h2 className="text-lg font-bold text-white">Demonstration Only</h2>
            </div>
            <p className="text-white/50 text-[11px]">Please read before proceeding</p>
          </div>
          <div className="px-5 py-5 space-y-4">
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5">
              <p className="text-sm text-amber-900 font-semibold mb-1.5">⚠️ This is not an actual check-in</p>
              <p className="text-xs text-amber-800 leading-relaxed">
                This form is a <strong>demonstration mockup</strong> for internal review purposes only. It has not been officially launched by Orenda Psychiatry and is not intended for patient use.
              </p>
            </div>
            <div className="rounded-xl bg-primary/5 border border-primary/10 p-3.5 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-foreground">No data is saved or transmitted</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Any information entered on this page is discarded immediately. Nothing is stored in any database, sent to any server, or retained in any way.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              By proceeding, you acknowledge that: (1) this is a non-functional demonstration; (2) no real patient information should be entered; (3) this does not constitute a live check-in service; and (4) this mockup carries no clinical, legal, or operational authority until officially launched.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowDisclaimer(false)} className="flex-1 h-11 rounded-xl font-bold">
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSubmit}
                className="flex-[2] h-11 rounded-xl font-bold text-sm tracking-wider uppercase"
                style={{ background: "linear-gradient(135deg, hsl(270 100% 20%) 0%, hsl(270 60% 40%) 100%)" }}
              >
                I Understand — Continue
              </Button>
            </div>
            <p className="text-[9px] text-center text-muted-foreground">
              © {new Date().getFullYear()} Orenda Psychiatry. Unauthorized distribution prohibited.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DemoCheckIn;
