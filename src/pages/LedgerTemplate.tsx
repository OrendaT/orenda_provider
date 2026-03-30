import { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import {
  Download, Pencil, PencilOff, Bold, Italic, AlignLeft, AlignCenter, AlignRight,
  Plus, Underline, Strikethrough, List, ListOrdered, Undo2, Redo2,
  Phone, Mail, MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import buildingImg from "@/assets/edison-building-glass.png";

const TEXT_COLORS = [
  { label: "White", value: "#ffffff" },
  { label: "Purple Dark", value: "hsl(270, 60%, 15%)" },
  { label: "Purple", value: "hsl(270, 100%, 25%)" },
  { label: "Purple Mid", value: "hsl(270, 80%, 40%)" },
  { label: "Lavender", value: "hsl(270, 60%, 72%)" },
  { label: "Black", value: "#000000" },
  { label: "Gray", value: "#6b7280" },
];

const crossPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

/* ── Formatting Toolbar ─────────────────────────────────────────────── */
function FormattingToolbar({ onInsertBlock }: { onInsertBlock: () => void }) {
  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
  };

  const ToolBtn = ({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) => (
    <button onClick={onClick} className="p-1.5 rounded hover:bg-amber-200 text-amber-800 transition-colors" title={title}>
      {children}
    </button>
  );

  return (
    <div className="sticky top-0 z-40 bg-amber-50 border-b border-amber-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-1 flex-wrap">
        <span className="text-amber-700 text-xs font-semibold mr-3 flex items-center gap-1.5">
          <Pencil className="w-3.5 h-3.5" /> EDITING
        </span>
        <div className="h-5 w-px bg-amber-300 mx-1" />
        <ToolBtn onClick={() => exec('bold')} title="Bold"><Bold className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('italic')} title="Italic"><Italic className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('underline')} title="Underline"><Underline className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('strikeThrough')} title="Strikethrough"><Strikethrough className="w-4 h-4" /></ToolBtn>
        <div className="h-5 w-px bg-amber-300 mx-1" />
        <ToolBtn onClick={() => exec('justifyLeft')} title="Align Left"><AlignLeft className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('justifyCenter')} title="Align Center"><AlignCenter className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('justifyRight')} title="Align Right"><AlignRight className="w-4 h-4" /></ToolBtn>
        <div className="h-5 w-px bg-amber-300 mx-1" />
        <ToolBtn onClick={() => exec('insertUnorderedList')} title="Bullet List"><List className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('insertOrderedList')} title="Numbered List"><ListOrdered className="w-4 h-4" /></ToolBtn>
        <div className="h-5 w-px bg-amber-300 mx-1" />
        <ToolBtn onClick={() => exec('undo')} title="Undo"><Undo2 className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('redo')} title="Redo"><Redo2 className="w-4 h-4" /></ToolBtn>
        <div className="h-5 w-px bg-amber-300 mx-1" />
        <select onChange={(e) => exec('fontSize', e.target.value)} defaultValue="" className="text-xs bg-white border border-amber-300 rounded px-2 py-1 text-amber-800 cursor-pointer">
          <option value="" disabled>Size</option>
          <option value="1">XS</option><option value="2">Small</option><option value="3">Normal</option>
          <option value="4">Medium</option><option value="5">Large</option><option value="6">XL</option><option value="7">XXL</option>
        </select>
        <select onChange={(e) => exec('fontName', e.target.value)} defaultValue="" className="text-xs bg-white border border-amber-300 rounded px-2 py-1 text-amber-800 cursor-pointer">
          <option value="" disabled>Font</option>
          <option value="Montserrat">Montserrat</option><option value="Playfair Display">Playfair Display</option>
          <option value="DM Sans">DM Sans</option><option value="Outfit">Outfit</option><option value="Inter">Inter</option>
          <option value="Georgia">Georgia</option><option value="Arial">Arial</option>
        </select>
        <select onChange={(e) => exec('foreColor', e.target.value)} defaultValue="" className="text-xs bg-white border border-amber-300 rounded px-2 py-1 text-amber-800 cursor-pointer">
          <option value="" disabled>Color</option>
          {TEXT_COLORS.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
        </select>
        <div className="h-5 w-px bg-amber-300 mx-1" />
        <button onClick={onInsertBlock} className="flex items-center gap-1 px-2 py-1 rounded bg-amber-200 hover:bg-amber-300 text-amber-900 text-xs font-semibold transition-colors" title="Add Text Block">
          <Plus className="w-3.5 h-3.5" /> Add Text
        </button>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────── */
const LedgerTemplate = () => {
  const exportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [addedBlocks, setAddedBlocks] = useState<string[]>([]);

  const handleExport = async () => {
    if (!exportRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(exportRef.current, { pixelRatio: 4 });
      const link = document.createElement("a");
      link.download = "orenda-patient-arrival-sign-11x17.png";
      link.href = dataUrl;
      link.click();
    } finally {
      setExporting(false);
    }
  };

  const handleInsertBlock = useCallback(() => {
    setAddedBlocks((prev) => [...prev, "Click to edit this text block"]);
    setTimeout(() => {
      if (!exportRef.current) return;
      const blocks = exportRef.current.querySelectorAll("[data-added-block]");
      const last = blocks[blocks.length - 1] as HTMLElement;
      if (last) {
        last.focus();
        const range = document.createRange();
        range.selectNodeContents(last);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }, 50);
  }, []);

  // 11" x 17" at 96 DPI
  const LEDGER_W = 1056;
  const LEDGER_H = 1632;

  return (
    <div className="min-h-screen bg-muted">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">Patient Arrival Sign — 11″ × 17″</h1>
            <p className="text-xs text-muted-foreground">Ledger size · edit text then download</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant={editMode ? "default" : "outline"} onClick={() => setEditMode(!editMode)}>
              {editMode ? <PencilOff className="w-4 h-4 mr-1.5" /> : <Pencil className="w-4 h-4 mr-1.5" />}
              {editMode ? "Done Editing" : "Edit Text"}
            </Button>
            <Button size="sm" onClick={handleExport} disabled={exporting}>
              <Download className="w-4 h-4 mr-1.5" />
              {exporting ? "Exporting…" : "Download PNG"}
            </Button>
          </div>
        </div>
      </div>

      {editMode && <FormattingToolbar onInsertBlock={handleInsertBlock} />}

      {/* Canvas */}
      <div className="py-8 px-4 flex justify-center">
        <div className="overflow-auto">
          <div
            ref={exportRef}
            contentEditable={editMode}
            suppressContentEditableWarning
            style={{
              width: LEDGER_W,
              height: LEDGER_H,
              background: "linear-gradient(160deg, #7c3aed 0%, #6d28d9 35%, #5b21b6 65%, #4c1d95 100%)",
              position: "relative",
              fontFamily: "'Segoe UI', system-ui, sans-serif",
              boxSizing: "border-box",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Pattern overlay */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: crossPattern, opacity: 0.03, pointerEvents: "none" }} />

            {/* Decorative orbs */}
            <div style={{ position: "absolute", top: -100, right: -100, width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.07), transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -60, left: -60, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)", pointerEvents: "none" }} />

            {/* ─── Building Image Hero ─── */}
            <div style={{ position: "relative", width: "100%", height: 420, overflow: "hidden", flexShrink: 0 }}>
              <img
                src={buildingImg}
                alt="Edison office building"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 40%",
                  display: "block",
                }}
              />
              {/* Gradient fade into purple */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 160,
                background: "linear-gradient(to top, #6d28d9 0%, transparent 100%)",
              }} />
              {/* Logo badge */}
              <div style={{
                position: "absolute",
                top: 28,
                left: 40,
                background: "rgba(255,255,255,0.95)",
                borderRadius: 12,
                padding: "10px 20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              }}>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#5b21b6", letterSpacing: "-0.3px" }}>
                  ORENDA PSYCHIATRY
                </p>
              </div>
            </div>

            {/* ─── Main Content ─── */}
            <div style={{ position: "relative", flex: 1, padding: "0 56px 40px", display: "flex", flexDirection: "column" }}>

              {/* Welcome question */}
              <div style={{ textAlign: "center", marginTop: -20 }}>
                <h1 style={{
                  color: "#fff",
                  fontSize: 52,
                  fontWeight: 800,
                  letterSpacing: "-1px",
                  margin: 0,
                  lineHeight: 1.15,
                  textShadow: "0 2px 20px rgba(0,0,0,0.2)",
                }}>
                  Here for Orenda Psychiatry?
                </h1>
              </div>

              {/* Divider */}
              <div style={{ width: 80, height: 4, background: "rgba(255,255,255,0.35)", margin: "28px auto", borderRadius: 2 }} />

              {/* Instruction card */}
              <div style={{
                background: "rgba(255,255,255,0.97)",
                borderRadius: 20,
                padding: "36px 44px",
                maxWidth: 820,
                margin: "0 auto",
                width: "100%",
                boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
              }}>
                {/* Text us CTA */}
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 12,
                    background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
                    borderRadius: 14,
                    padding: "14px 28px",
                    marginBottom: 20,
                  }}>
                    <MessageSquare size={28} color="#fff" />
                    <span style={{ color: "#fff", fontSize: 20, fontWeight: 700, letterSpacing: "0.5px" }}>TEXT US</span>
                  </div>

                  <p style={{
                    color: "#1e1b4b",
                    fontSize: 22,
                    fontWeight: 600,
                    lineHeight: 1.5,
                    margin: "0 0 16px",
                  }}>
                    Please text
                  </p>

                  {/* Phone number highlight */}
                  <div style={{
                    background: "linear-gradient(135deg, #f3f0ff, #ede9fe)",
                    borderRadius: 16,
                    padding: "20px 32px",
                    display: "inline-block",
                    marginBottom: 20,
                    border: "2px solid #ddd6fe",
                  }}>
                    <p style={{
                      margin: 0,
                      fontSize: 48,
                      fontWeight: 800,
                      color: "#5b21b6",
                      letterSpacing: "2px",
                      lineHeight: 1,
                    }}>
                      (201) 685-4863
                    </p>
                  </div>

                  <p style={{
                    color: "#374151",
                    fontSize: 22,
                    fontWeight: 500,
                    lineHeight: 1.6,
                    margin: 0,
                    maxWidth: 600,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}>
                    to let us know you've arrived.<br />
                    Our team will be with you shortly.
                  </p>
                </div>
              </div>

              {/* Spacer */}
              <div style={{ flex: 1, minHeight: 30 }} />

              {/* Contact footer section */}
              <div style={{
                background: "rgba(255,255,255,0.12)",
                borderRadius: 16,
                padding: "28px 36px",
                display: "flex",
                justifyContent: "center",
                gap: 60,
                backdropFilter: "blur(8px)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Phone size={24} color="#fff" />
                  </div>
                  <div>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, margin: 0, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                      Phone
                    </p>
                    <p style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "2px 0 0" }}>
                      (201) 685-4863
                    </p>
                  </div>
                </div>

                <div style={{ width: 1, background: "rgba(255,255,255,0.2)", alignSelf: "stretch" }} />

                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Mail size={24} color="#fff" />
                  </div>
                  <div>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, margin: 0, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                      Email
                    </p>
                    <p style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "2px 0 0" }}>
                      offices@orendapsych.com
                    </p>
                  </div>
                </div>
              </div>

              {/* Brand footer */}
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0, fontWeight: 600, letterSpacing: 1.5 }}>
                  ORENDA PSYCHIATRY &nbsp;·&nbsp; orendapsych.com
                </p>
              </div>
            </div>

            {/* Added text blocks */}
            {addedBlocks.map((text, i) => (
              <div
                key={i}
                data-added-block
                style={{
                  position: "relative",
                  margin: "0 56px 20px",
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: 12,
                  padding: "20px 24px",
                  color: "#fff",
                  fontSize: 18,
                  lineHeight: 1.6,
                  border: editMode ? "2px dashed rgba(255,255,255,0.3)" : "none",
                }}
              >
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LedgerTemplate;
