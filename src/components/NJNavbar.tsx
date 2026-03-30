import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ArrowRight, ArrowLeft, ChevronDown, ChevronUp, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/orenda-logo-purple.png";


interface NavChild {
  to: string;
  label: string;
}

interface NavItem {
  label: string;
  to: string;
  children?: NavChild[];
}

const getNavItems = (hasAdminAccess: boolean, isPublic: boolean): NavItem[] => {
  const prefix = isPublic ? "/public" : "/nj-office";
  const items: NavItem[] = [
    {
      label: "Offices",
      to: "",
      children: [
        { to: `${prefix}/hoboken`, label: "Hoboken" },
        { to: `${prefix}/edison`, label: "Edison" },
      ],
    },
    { label: "Schedule Office Time", to: `${prefix}/book` },
    { label: "FAQs", to: `${prefix}/faq` },
    { label: "NJ Admin Support", to: "/nj-admin-overview" },
  ];
  
  if (hasAdminAccess) {
    items.push({ label: "Admin Console", to: "/admin-v2" });
  }
  return items;
};

export default function NJNavbar({ isAdmin = false }: { isAdmin?: boolean }) {
  const location = useLocation();
  const isPublic = location.pathname.startsWith("/public");
  const [open, setOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async (userId: string) => {
      const { data } = await supabase
        .from("admin_permissions")
        .select("has_admin_access, role")
        .eq("user_id", userId)
        .maybeSingle();
      // Grant admin console access to Admin, Operations, Billing roles or has_admin_access flag
      const role = data?.role || "Provider";
      setHasAdminAccess(!!data?.has_admin_access || role === "Admin" || role === "Operations" || role === "Billing");
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      if (session?.user) checkAdmin(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session?.user) {
        checkAdmin(session.user.id);
      } else {
        setHasAdminAccess(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const navItems = getNavItems(hasAdminAccess, isPublic);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    setOpen(false);
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;
  const isHome = location.pathname === "/" || location.pathname === "/admin" || location.pathname === "/public";

  return (
    <>
      <nav
        className="sticky top-0 z-50 border-b border-primary/10 shadow-sm"
        style={{ background: 'linear-gradient(180deg, hsl(270, 40%, 96%), hsl(0, 0%, 100%))' }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-2 sm:py-3">
          <div className="flex items-center justify-between rounded-2xl border border-primary/10 bg-white/90 px-3 py-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {!isHome && (
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-primary/15 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/25 transition-all"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                </button>
              )}
              <button
                onClick={() => { setOpen(true); }}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl border-2 border-primary/20 bg-primary/5 text-foreground hover:bg-primary/10 hover:border-primary/30 transition-all"
                aria-label="Open navigation menu"
              >
                <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-primary" strokeWidth={2.5} />
                <span className="hidden sm:inline text-xs font-semibold tracking-[0.1em] uppercase text-primary">Menu</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              {isLoggedIn && (
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/10 transition-all text-xs font-medium"
                  aria-label="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              )}
              <Link to={isPublic ? "/public" : "/"}>
                <img src={logo} alt="Orenda" className="h-5 sm:h-6 md:h-7" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Full-screen navigation overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] flex flex-col"
            style={{ background: 'linear-gradient(180deg, hsl(270, 30%, 96%), hsl(0, 0%, 100%))' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-primary/10">
              <Link to={isPublic ? "/public" : "/"} onClick={() => setOpen(false)}>
                <img src={logo} alt="Orenda" className="h-7 md:h-8" />
              </Link>
              <button
                onClick={() => { setOpen(false); setExpandedGroup(null); }}
                className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-primary/5 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav items */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-6 md:px-10 py-6 sm:py-8">
              <div className="max-w-2xl mx-auto space-y-0">
                {navItems.map((item, idx) => {
                  const isGroupOpen = expandedGroup === item.label;

                  return (
                    <div key={idx} className="border-b border-foreground/5 last:border-b-0">
                      {item.children ? (
                        <>
                          <button
                            onClick={() => setExpandedGroup(isGroupOpen ? null : item.label)}
                            className="group flex items-center justify-between w-full py-3 sm:py-4"
                          >
                            <div className="flex items-center gap-3 sm:gap-4">
                              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary/40 group-hover:text-primary transition-colors" />
                              <span className="font-display text-lg sm:text-2xl md:text-3xl text-foreground/80 group-hover:text-foreground transition-colors leading-tight">
                                {item.label}
                              </span>
                            </div>
                            {isGroupOpen ? (
                              <ChevronUp className="w-5 h-5 text-primary/40" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-primary/40" />
                            )}
                          </button>
                          <AnimatePresence>
                            {isGroupOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden pl-8"
                              >
                                {item.children.map((child) => (
                                  <Link
                                    key={child.to}
                                    to={child.to}
                                    onClick={() => { setOpen(false); setExpandedGroup(null); }}
                                    className={`group flex items-center gap-3 py-2.5 transition-colors ${
                                      isActive(child.to) ? "text-primary" : "text-foreground/60 hover:text-foreground"
                                    }`}
                                  >
                                    <div className={`w-1.5 h-1.5 rounded-full ${isActive(child.to) ? "bg-primary" : "bg-foreground/20"}`} />
                                    <span className="font-display text-base sm:text-xl md:text-2xl">{child.label}</span>
                                    {isActive(child.to) && (
                                      <span className="text-[10px] tracking-[0.15em] uppercase text-primary/60 ml-2">Current</span>
                                    )}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          to={item.to}
                          onClick={() => { setOpen(false); setExpandedGroup(null); }}
                          className={`group flex items-center gap-3 sm:gap-4 py-3 sm:py-4 transition-colors ${
                            isActive(item.to) ? "text-primary" : ""
                          }`}
                        >
                          <ArrowRight className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                            isActive(item.to) ? "text-primary" : "text-primary/40 group-hover:text-primary"
                          }`} />
                          <span className={`font-display text-lg sm:text-2xl md:text-3xl transition-colors leading-tight ${
                            isActive(item.to) ? "text-primary" : "text-foreground/80 group-hover:text-foreground"
                          }`}>
                            {item.label}
                          </span>
                          {isActive(item.to) && (
                            <span className="text-[10px] tracking-[0.15em] uppercase text-primary/60 ml-2">Current</span>
                          )}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
              {isLoggedIn && (
                <div className="border-t border-foreground/10 pt-4 mt-4">
                  <button
                    onClick={handleSignOut}
                    className="group flex items-center gap-3 sm:gap-4 py-3 sm:py-4 w-full text-left transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-destructive/60 group-hover:text-destructive transition-colors" />
                    <span className="font-display text-lg sm:text-2xl md:text-3xl text-destructive/70 group-hover:text-destructive transition-colors leading-tight">
                      Sign Out
                    </span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
