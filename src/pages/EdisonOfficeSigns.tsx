import { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { exportEdisonDocx } from "@/utils/edisonDocxExport";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";
import {
  Download, Wifi, Clock, Key, Trash2, AlertTriangle,
  Phone, Stethoscope, Mail, Shield, Building2,
  Pencil, PencilOff, Bold, Italic, AlignLeft, AlignCenter, AlignRight,
  Plus, Underline, Strikethrough, List, ListOrdered, Undo2, Redo2, Type, Palette,
  Copy, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import buildingImg from "@/assets/edison-building-glass.png";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

const crossPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

const TEXT_COLORS = [
  { label: "White", value: "#ffffff" },
  { label: "Purple Dark", value: "hsl(270, 60%, 15%)" },
  { label: "Purple", value: "hsl(270, 100%, 25%)" },
  { label: "Purple Mid", value: "hsl(270, 80%, 40%)" },
  { label: "Lavender", value: "hsl(270, 60%, 72%)" },
  { label: "Black", value: "#000000" },
  { label: "Gray", value: "#6b7280" },
];

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
    <div className="sticky top-[57px] z-40 bg-amber-50 border-b border-amber-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-1 flex-wrap">
        <span className="text-amber-700 text-xs font-semibold mr-3 flex items-center gap-1.5">
          <Pencil className="w-3.5 h-3.5" /> EDITING
        </span>
        <div className="h-5 w-px bg-amber-300 mx-1" />

        {/* Text style */}
        <ToolBtn onClick={() => exec('bold')} title="Bold"><Bold className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('italic')} title="Italic"><Italic className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('underline')} title="Underline"><Underline className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('strikeThrough')} title="Strikethrough"><Strikethrough className="w-4 h-4" /></ToolBtn>
        <div className="h-5 w-px bg-amber-300 mx-1" />

        {/* Alignment */}
        <ToolBtn onClick={() => exec('justifyLeft')} title="Align Left"><AlignLeft className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('justifyCenter')} title="Align Center"><AlignCenter className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('justifyRight')} title="Align Right"><AlignRight className="w-4 h-4" /></ToolBtn>
        <div className="h-5 w-px bg-amber-300 mx-1" />

        {/* Lists */}
        <ToolBtn onClick={() => exec('insertUnorderedList')} title="Bullet List"><List className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('insertOrderedList')} title="Numbered List"><ListOrdered className="w-4 h-4" /></ToolBtn>
        <div className="h-5 w-px bg-amber-300 mx-1" />

        {/* Undo / Redo */}
        <ToolBtn onClick={() => exec('undo')} title="Undo"><Undo2 className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('redo')} title="Redo"><Redo2 className="w-4 h-4" /></ToolBtn>
        <div className="h-5 w-px bg-amber-300 mx-1" />

        {/* Font size */}
        <select
          onChange={(e) => exec('fontSize', e.target.value)}
          defaultValue=""
          className="text-xs bg-white border border-amber-300 rounded px-2 py-1 text-amber-800 cursor-pointer"
        >
          <option value="" disabled>Size</option>
          <option value="1">XS</option>
          <option value="2">Small</option>
          <option value="3">Normal</option>
          <option value="4">Medium</option>
          <option value="5">Large</option>
          <option value="6">XL</option>
          <option value="7">XXL</option>
        </select>

        {/* Font family */}
        <select
          onChange={(e) => exec('fontName', e.target.value)}
          defaultValue=""
          className="text-xs bg-white border border-amber-300 rounded px-2 py-1 text-amber-800 cursor-pointer"
        >
          <option value="" disabled>Font</option>
          <option value="Cormorant Garamond">Cormorant Garamond</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Playfair Display">Playfair Display</option>
          <option value="Lora">Lora</option>
          <option value="DM Sans">DM Sans</option>
          <option value="Outfit">Outfit</option>
          <option value="Inter">Inter</option>
          <option value="Georgia">Georgia</option>
          <option value="Arial">Arial</option>
        </select>

        {/* Text color */}
        <select
          onChange={(e) => exec('foreColor', e.target.value)}
          defaultValue=""
          className="text-xs bg-white border border-amber-300 rounded px-2 py-1 text-amber-800 cursor-pointer"
        >
          <option value="" disabled>Color</option>
          {TEXT_COLORS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <div className="h-5 w-px bg-amber-300 mx-1" />

        {/* Add text block */}
        <button
          onClick={onInsertBlock}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-amber-200 hover:bg-amber-300 text-amber-900 transition-colors"
          title="Add a new text block"
        >
          <Plus className="w-3.5 h-3.5" /> Add Text
        </button>

        <span className="text-amber-600 text-xs ml-2">Click anywhere to type · Select text to format</span>
      </div>
    </div>
  );
}

export default function EdisonOfficeSigns() {
  const exportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyForWord = useCallback(async () => {
    if (!exportRef.current) return;

    // Inline SVG icons as base64 data URIs for Word compatibility
    const icon = (paths: string, color = "#9b6bc2") =>
      `<img src="data:image/svg+xml;base64,${btoa(`<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='${color}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>${paths}</svg>`)}" width="18" height="18" style="vertical-align: middle; margin-right: 8px;" />`;

    const icons = {
      wifi: icon(`<path d='M12 20h.01'/><path d='M2 8.82a15 15 0 0 1 20 0'/><path d='M5 12.859a10 10 0 0 1 14 0'/><path d='M8.5 16.429a5 5 0 0 1 7 0'/>`),
      clock: icon(`<circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/>`),
      stethoscope: icon(`<path d='M4.8 2.62L3 5H2a1 1 0 0 0-1 1v2a3 3 0 0 0 3 3'/><path d='M11 2.62 12.8 5H14a1 1 0 0 1 1 1v2a3 3 0 0 1-3 3'/><path d='M7 11v5a3 3 0 0 0 6 0'/><path d='M19 13v3a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2'/><circle cx='19' cy='13' r='2'/>`),
      trash: icon(`<path d='M3 6h18'/><path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6'/><path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2'/>`),
      key: icon(`<path d='m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4'/><path d='m21 2-9.6 9.6'/><circle cx='7.5' cy='15.5' r='5.5'/>`),
      shield: icon(`<path d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'/>`),
      alert: icon(`<path d='m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3'/><path d='M12 9v4'/><path d='M12 17h.01'/>`, "#c4872a"),
      building: icon(`<rect width='16' height='20' x='4' y='2' rx='2' ry='2'/><path d='M9 22v-4h6v4'/><path d='M8 6h.01'/><path d='M16 6h.01'/><path d='M12 6h.01'/><path d='M12 10h.01'/><path d='M12 14h.01'/><path d='M16 10h.01'/><path d='M16 14h.01'/><path d='M8 10h.01'/><path d='M8 14h.01'/>`),
      phone: icon(`<path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'/>`),
    };

    const purple = "#2d1054";
    const purpleMid = "#5b2d8e";
    const lavender = "#e8ddf0";
    const accent = "#9b6bc2";
    const darkBg = "#1a0a2e";
    const font = `"Cormorant Garamond", Georgia, "Times New Roman", serif`;
    const bodyFont = `"Segoe UI", Calibri, Arial, sans-serif`;

    const sectionHead = (iconHtml: string, title: string, dark = false) =>
      `<tr><td colspan="2" style="padding: 18px 16px 8px; font-family: ${font}; font-size: 22px; font-weight: 600; color: ${dark ? "#ffffff" : purple}; border-bottom: 2px solid ${dark ? "rgba(155,107,194,0.3)" : lavender};">${iconHtml}${title}</td></tr>`;

    const row = (label: string, value: string, dark = false, italic = false) =>
      `<tr><td style="padding: 5px 16px; font-family: ${bodyFont}; font-size: 12px; color: ${dark ? "rgba(255,255,255,0.5)" : "#888"}; width: 140px; vertical-align: top;">${label}</td><td style="padding: 5px 16px; font-family: ${font}; font-size: 16px; color: ${dark ? "#ffffff" : "#1a1a1a"}; font-weight: 500;${italic ? " font-style: italic; letter-spacing: 1.5px;" : ""}">${value}</td></tr>`;

    const spacerRow = (dark = false) =>
      `<tr><td colspan="2" style="padding: 0; height: 6px; border-bottom: 1px solid ${dark ? "rgba(255,255,255,0.08)" : "#f0f0f0"};"></td></tr>`;

    const html = `
<div style="font-family: ${bodyFont}; max-width: 680px; margin: 0 auto;">

  <!-- Header -->
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 8px;">
    <tr>
      <td style="padding: 24px 20px; background: linear-gradient(135deg, ${lavender}, #ffffff);">
        <p style="font-family: ${bodyFont}; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: rgba(45,16,84,0.4); margin: 0 0 8px;">ORENDA PSYCHIATRY · PROVIDER REFERENCE</p>
        <p style="font-family: ${font}; font-size: 36px; font-weight: 300; color: ${purple}; margin: 0; line-height: 1.1;">Edison <em style="color: ${accent};">Reminders</em></p>
        <p style="font-family: ${bodyFont}; font-size: 12px; color: #888; margin: 10px 0 0;">Regus — Raritan Plaza · 110 Fieldcrest Ave, 3rd Floor, Unit 328 · Edison, NJ 08837</p>
      </td>
    </tr>
  </table>

  <!-- Dark section: Wi-Fi / After-Hours / Equipment -->
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background: ${darkBg}; margin-bottom: 2px;">
    <tr><td colspan="2" style="padding: 20px 16px 4px;">
      <p style="font-family: ${bodyFont}; font-size: 9px; letter-spacing: 4px; text-transform: uppercase; color: rgba(255,255,255,0.35); margin: 0; text-align: center;">EDISON OFFICE GUIDE</p>
      <p style="font-family: ${font}; font-size: 28px; color: #ffffff; text-align: center; margin: 8px 0 4px; font-weight: 300;">Edison Office <em style="color: ${accent};">Guide</em></p>
      <hr style="border: none; border-top: 1px solid rgba(155,107,194,0.25); margin: 12px auto; width: 60px;" />
    </td></tr>

    ${sectionHead(icons.wifi, "Wi-Fi", true)}
    ${row("Network", "Regus", true)}
    ${spacerRow(true)}
    ${row("Password", "167785439", true, true)}

    ${sectionHead(icons.clock, "After-Hours", true)}
    ${row("Building Hours", "Mon – Fri, 7:30 AM – 7:00 PM", true)}
    ${spacerRow(true)}
    ${row("After-Hours Access", "P1 (Parking Level 1)", true)}
    ${spacerRow(true)}
    ${row("Building Code", "05296", true, true)}

    ${sectionHead(icons.stethoscope, "Equipment", true)}
    ${row("BP Cuffs", "Located inside the basket, with a backup cuff available", true)}
    ${spacerRow(true)}
    ${row("Scale", "Provided in the office", true)}

    <tr><td colspan="2" style="padding: 16px;"></td></tr>
  </table>

  <!-- Lavender section: Office Protocol -->
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background: ${lavender}; margin-bottom: 2px;">
    <tr><td colspan="2" style="padding: 20px 16px 4px;">
      <p style="font-family: ${bodyFont}; font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: rgba(45,16,84,0.4); margin: 0 0 4px;">BEFORE YOU LEAVE</p>
      <p style="font-family: ${font}; font-size: 28px; color: ${purple}; margin: 0; font-weight: 300;">Office <em style="color: ${accent};">Protocol</em></p>
    </td></tr>

    ${sectionHead(icons.trash, "Office Reset")}
    <tr><td colspan="2" style="padding: 6px 16px; font-family: ${bodyFont}; font-size: 13px; color: #444;">
      <table cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
        <tr><td style="padding: 4px 10px 4px 0; vertical-align: top; color: ${accent}; font-weight: 700; font-size: 13px;">1.</td><td style="padding: 4px 0; font-family: ${bodyFont}; font-size: 13px; color: #555;">Push chairs back under the desk</td></tr>
        <tr><td style="padding: 4px 10px 4px 0; vertical-align: top; color: ${accent}; font-weight: 700; font-size: 13px;">2.</td><td style="padding: 4px 0; font-family: ${bodyFont}; font-size: 13px; color: #555;">Leave equipment and office in a neat and clean order as you found it</td></tr>
      </table>
    </td></tr>

    ${sectionHead(icons.key, "Lockbox")}
    <tr><td colspan="2" style="padding: 6px 16px 20px; font-family: ${bodyFont}; font-size: 13px; color: #555;">Remember to return the swipe card &amp; key to the lockbox after use.</td></tr>
  </table>

  <!-- Dark section: Important + Contact -->
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background: ${darkBg};">

    <!-- Key reminders pills -->
    <tr><td colspan="2" style="padding: 20px 16px 10px; text-align: center;">
      <span style="display: inline-block; border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; padding: 6px 14px; margin: 3px; font-family: ${bodyFont}; font-size: 11px; color: rgba(255,255,255,0.7);">${icons.shield} Escort patients at all times</span>
      <span style="display: inline-block; border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; padding: 6px 14px; margin: 3px; font-family: ${bodyFont}; font-size: 11px; color: rgba(255,255,255,0.7);">${icons.key} Return key to lockbox</span>
      <span style="display: inline-block; border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; padding: 6px 14px; margin: 3px; font-family: ${bodyFont}; font-size: 11px; color: rgba(255,255,255,0.7);">${icons.trash} Leave office clean</span>
    </td></tr>

    <!-- Important callout -->
    <tr><td colspan="2" style="padding: 12px 16px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; background: rgba(255,255,255,0.05);">
        <tr><td style="padding: 16px; vertical-align: top; width: 40px;">${icons.alert}</td>
        <td style="padding: 16px 16px 16px 0;">
          <p style="font-family: ${font}; font-size: 20px; color: #ffffff; margin: 0 0 4px; font-weight: 600;">Important</p>
          <p style="font-family: ${bodyFont}; font-size: 13px; color: rgba(255,255,255,0.6); margin: 0; line-height: 1.6;">Escort patients at all times within the building. Patients should never be unaccompanied in hallways, elevators, or common areas.</p>
        </td></tr>
      </table>
    </td></tr>

    <!-- Contact header -->
    <tr><td colspan="2" style="padding: 16px 16px 6px;">
      <p style="font-family: ${bodyFont}; font-size: 9px; letter-spacing: 4px; text-transform: uppercase; color: rgba(255,255,255,0.35); margin: 0;">CONTACT</p>
    </td></tr>

    <!-- Orenda Admin -->
    <tr><td colspan="2" style="padding: 6px 16px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; background: rgba(255,255,255,0.05);">
        <tr><td style="padding: 14px 16px;" colspan="2">${icons.building}<span style="font-family: ${font}; font-size: 18px; color: #ffffff; font-weight: 500;">Orenda Psychiatry Admin</span></td></tr>
        <tr><td style="padding: 4px 16px; font-family: ${bodyFont}; font-size: 11px; color: rgba(255,255,255,0.45); width: 60px;">Email</td><td style="padding: 4px 16px; font-family: ${font}; font-size: 15px; color: #ffffff;">offices@orendapsych.com</td></tr>
        <tr><td style="padding: 4px 16px 14px; font-family: ${bodyFont}; font-size: 11px; color: rgba(255,255,255,0.45);">Phone</td><td style="padding: 4px 16px 14px; font-family: ${font}; font-size: 15px; color: #ffffff;">(201) 685-4863</td></tr>
      </table>
    </td></tr>

    <!-- Regus -->
    <tr><td colspan="2" style="padding: 6px 16px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; background: rgba(255,255,255,0.05);">
        <tr><td style="padding: 14px 16px;" colspan="2">${icons.phone}<span style="font-family: ${font}; font-size: 18px; color: #ffffff; font-weight: 500;">Regus Edison</span></td></tr>
        <tr><td style="padding: 4px 16px; font-family: ${bodyFont}; font-size: 11px; color: rgba(255,255,255,0.45); width: 60px;">Email</td><td style="padding: 4px 16px; font-family: ${font}; font-size: 15px; color: #ffffff;">edison.fieldcrestave@regus.com</td></tr>
        <tr><td style="padding: 4px 16px 14px; font-family: ${bodyFont}; font-size: 11px; color: rgba(255,255,255,0.45);">Phone</td><td style="padding: 4px 16px 14px; font-family: ${font}; font-size: 15px; color: #ffffff;">(732) 782-0328</td></tr>
      </table>
    </td></tr>

  </table>

  <p style="font-family: ${bodyFont}; font-size: 10px; color: #bbb; text-align: center; margin: 16px 0;">Orenda Psychiatry · Edison Office Guide · For internal use only</p>
</div>`;

    try {
      const blob = new Blob([html], { type: "text/html" });
      const plainText = exportRef.current.innerText;
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": blob,
          "text/plain": new Blob([plainText], { type: "text/plain" }),
        }),
      ]);
      setCopied(true);
      toast.success("Copied! Paste into Word to see the formatted content.");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Copy failed — try using a Chromium-based browser.");
    }
  }, []);
  const [editMode, setEditMode] = useState(false);
  const [addedBlocks, setAddedBlocks] = useState<string[]>([]);

  const handleInsertBlock = useCallback(() => {
    setAddedBlocks((prev) => [...prev, `New text block — click to edit`]);
    // Also focus into the export area so the user can start typing
    setTimeout(() => {
      const blocks = exportRef.current?.querySelectorAll('[data-added-block]');
      if (blocks && blocks.length > 0) {
        const last = blocks[blocks.length - 1] as HTMLElement;
        last.focus();
        // Place cursor at end
        const range = document.createRange();
        range.selectNodeContents(last);
        range.collapse(false);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }, 50);
  }, []);

  const handleExport = async () => {
    if (!exportRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(exportRef.current, { pixelRatio: 4 });
      const link = document.createElement("a");
      link.download = "edison-provider-reminders.png";
      link.href = dataUrl;
      link.click();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-body">

      {/* Sticky toolbar */}
      <div className="sticky top-0 z-50 bg-white border-b border-border/40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <p className="text-muted-foreground text-xs">Edison Provider Reminders</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditMode(!editMode)}
              className={`inline-flex items-center gap-2 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors shadow-sm border ${editMode ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-border/50 text-muted-foreground hover:text-foreground'}`}
            >
              {editMode ? <PencilOff className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
              {editMode ? "Editing ON" : "Edit Text"}
            </button>
            <Button onClick={() => { exportEdisonDocx(); toast.success("Downloading Word document…"); }} size="sm" variant="outline" className="rounded-lg px-5">
              <FileText className="w-4 h-4 mr-2" />
              Download Word
            </Button>
            <Button onClick={handleCopyForWord} size="sm" variant="outline" className="rounded-lg px-5">
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Copied!" : "Copy for Word"}
            </Button>
            <Button onClick={handleExport} disabled={exporting} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-5">
              <Download className="w-4 h-4 mr-2" />
              {exporting ? "Exporting…" : "Download PNG"}
            </Button>
          </div>
        </div>
      </div>

      {/* Formatting toolbar when editing */}
      {editMode && <FormattingToolbar onInsertBlock={handleInsertBlock} />}

      {/* Hero — split layout */}
      <section className="relative overflow-hidden">
        <div className="grid md:grid-cols-2 min-h-[40vh] sm:min-h-[55vh] md:min-h-[65vh]">
          <div
            className="flex items-end md:items-center px-5 sm:px-8 md:px-14 py-8 sm:py-14 md:py-20 order-2 md:order-1"
            style={{ background: "linear-gradient(135deg, hsl(270, 60%, 92%), hsl(0, 0%, 100%))" }}
          >
            <div>
              <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={0}
                className="text-foreground/50 text-xs md:text-sm tracking-[0.5em] uppercase mb-5 font-body">
                Provider Reference
              </motion.p>
              <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={0.5}
                className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-light text-foreground leading-[1] mb-3 sm:mb-5">
                Edison
                <br />
                <em className="text-italic-accent" style={{ fontStyle: "italic" }}>Reminders</em>
              </motion.h1>
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
                className="w-14 h-[2px] bg-italic-accent/40 mb-5" />
              <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={1.5}
                className="text-foreground/70 text-sm md:text-base tracking-wide font-light">
                Regus — Raritan Plaza · 110 Fieldcrest Ave, 3rd Floor, Unit 328
                <br />
                Edison, NJ 08837
              </motion.p>
              <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
                className="text-muted-foreground text-xs mt-4">
                💡 Click <strong>"Edit Text"</strong> to modify any text directly. Use the formatting toolbar to bold, italicize, resize, and change fonts.
              </motion.p>
            </div>
          </div>
          <div className="overflow-hidden order-1 md:order-2">
            <img src={buildingImg} alt="Edison Raritan Plaza" className="w-full h-full object-cover min-h-[280px]" />
          </div>
        </div>
      </section>

      {/* Exportable infographic area */}
      <div ref={exportRef} className={`bg-white ${editMode ? 'ring-2 ring-amber-300' : ''}`} contentEditable={editMode} suppressContentEditableWarning>

        {/* Key Information — dark editorial block */}
        <section className="py-16 md:py-24" style={{ background: "linear-gradient(180deg, hsl(270, 60%, 10%) 0%, hsl(270, 40%, 18%) 100%)" }}>
          <div className="relative">
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: crossPattern }} />
            <div className="max-w-6xl mx-auto px-6 sm:px-10 relative z-10">

              {/* Section header */}
              <div className="text-center mb-14">
                <p className="text-[10px] tracking-[0.5em] uppercase text-white/40 font-medium mb-3">Orenda Psychiatry</p>
                <h2 className="font-display text-4xl md:text-6xl font-light text-white leading-tight">
                  Edison Office{" "}
                  <em className="text-italic-accent" style={{ fontStyle: "italic" }}>Guide</em>
                </h2>
                <p className="text-white/40 text-sm mt-3">For Orenda Psychiatry use only</p>
                <div className="w-14 h-[2px] bg-italic-accent/40 mx-auto mt-5" />
              </div>

              {/* 3-column grid */}
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10 md:gap-14">

                {/* Wi-Fi */}
                <div>
                  <Wifi className="w-5 h-5 text-italic-accent mb-6" />
                  <h4 className="font-display text-2xl text-white mb-6">Wi-Fi</h4>
                  <div className="space-y-5">
                    <div>
                      <p className="font-body text-white/50 text-sm mb-1">Network</p>
                      <p className="font-display text-lg text-white">Regus</p>
                    </div>
                    <div className="w-8 h-px bg-white/15" />
                    <div>
                      <p className="font-body text-white/50 text-sm mb-1">Password</p>
                      <p className="font-display text-lg text-white tracking-wider italic">167785439</p>
                    </div>
                  </div>
                </div>

                {/* After-Hours Protocol */}
                <div>
                  <Clock className="w-5 h-5 text-italic-accent mb-6" />
                  <h4 className="font-display text-2xl text-white mb-6">After-Hours</h4>
                  <div className="space-y-5">
                    <div>
                      <p className="font-display text-lg text-white">Building Hours</p>
                      <p className="font-body text-white/50 text-sm mt-1">Mon – Fri, 7:30 AM – 7:00 PM</p>
                    </div>
                    <div className="w-8 h-px bg-white/15" />
                    <div>
                      <p className="font-display text-lg text-white">After-Hours Access</p>
                      <p className="font-body text-white/50 text-sm mt-1">P1 (Parking Level 1)</p>
                    </div>
                    <div className="w-8 h-px bg-white/15" />
                    <div>
                      <p className="font-body text-white/50 text-sm mb-1">Building Code</p>
                      <p className="font-display text-lg text-white tracking-wider italic">05296</p>
                    </div>
                  </div>
                </div>

                {/* Equipment */}
                <div>
                  <Stethoscope className="w-5 h-5 text-italic-accent mb-6" />
                  <h4 className="font-display text-2xl text-white mb-6">Equipment</h4>
                  <div className="space-y-5">
                    <div>
                      <p className="font-display text-lg text-white">BP Cuffs</p>
                      <p className="font-body text-white/50 text-sm mt-1">Located inside the basket, with a backup cuff available</p>
                    </div>
                    <div className="w-8 h-px bg-white/15" />
                    <div>
                      <p className="font-display text-lg text-white">Scale</p>
                      <p className="font-body text-white/50 text-sm mt-1">Provided in the office</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Office Reset + Lockbox — lavender editorial section */}
        <section className="py-16 md:py-24" style={{ background: "linear-gradient(180deg, hsl(270, 25%, 94%) 0%, hsl(270, 35%, 88%) 100%)" }}>
          <div className="relative">
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />
            <div className="max-w-6xl mx-auto px-6 sm:px-10 relative z-10">

              <div className="mb-12">
                <p className="text-[10px] tracking-[0.4em] uppercase text-foreground/40 font-medium mb-4">Before You Leave</p>
                <h2 className="font-display text-4xl md:text-6xl font-light text-foreground leading-[1.1]">
                  Office{" "}
                  <em className="text-italic-accent" style={{ fontStyle: "italic" }}>Protocol</em>
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-border/30 bg-white">
                {/* Office Reset */}
                <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-border/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Trash2 className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display text-2xl text-foreground">Office Reset</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-primary">1</span>
                      </span>
                      <p className="font-body text-muted-foreground text-sm leading-relaxed">
                        Push chairs back under the desk
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-primary">2</span>
                      </span>
                      <p className="font-body text-muted-foreground text-sm leading-relaxed">
                        Leave equipment and office in a neat and clean order as you found it
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lockbox */}
                <div className="p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Key className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-display text-2xl text-foreground">Lockbox</h3>
                  </div>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">
                    Remember to return the swipe card &amp; key to the lockbox after use.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Important callout + Contact — deep purple editorial */}
        <section className="py-16 md:py-24 relative overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(270, 60%, 10%) 0%, hsl(270, 40%, 20%) 100%)" }}>
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: crossPattern }} />
          <div className="max-w-6xl mx-auto px-6 sm:px-10 relative z-10">

            {/* Escort patients callout */}
            <div className="mb-14">
              <div className="inline-flex flex-wrap justify-center gap-3 w-full">
                {[
                  { icon: Shield, label: "Escort patients at all times" },
                  { icon: Key, label: "Return key to lockbox after visit" },
                  { icon: Trash2, label: "Leave office clean & reset" },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-full px-5 py-2.5">
                    <p.icon className="w-3.5 h-3.5 text-italic-accent" />
                    <span className="text-white/70 text-xs">{p.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Important */}
            <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-8 md:p-10 mb-14">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-italic-accent" />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-white mb-2">Important</h3>
                  <p className="font-body text-white/60 text-sm leading-relaxed">
                    Escort patients at all times within the building. Patients should never be unaccompanied in hallways, elevators, or common areas.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <p className="text-[10px] tracking-[0.5em] uppercase text-white/40 font-medium mb-8">Contact</p>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Orenda Admin */}
                <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-italic-accent" />
                    </div>
                    <h4 className="font-display text-xl text-white">Orenda Psychiatry Admin</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="font-body text-white/50 text-sm mb-1">Email</p>
                      <p className="font-display text-lg text-white">offices@orendapsych.com</p>
                    </div>
                    <div className="w-8 h-px bg-white/15" />
                    <div>
                      <p className="font-body text-white/50 text-sm mb-1">Phone</p>
                      <p className="font-display text-lg text-white">(201) 685-4863</p>
                    </div>
                  </div>
                </div>

                {/* Regus Edison */}
                <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-italic-accent" />
                    </div>
                    <h4 className="font-display text-xl text-white">Regus Edison</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="font-body text-white/50 text-sm mb-1">Email</p>
                      <p className="font-display text-lg text-white break-all">edison.fieldcrestave@regus.com</p>
                    </div>
                    <div className="w-8 h-px bg-white/15" />
                    <div>
                      <p className="font-body text-white/50 text-sm mb-1">Phone</p>
                      <p className="font-display text-lg text-white">(732) 782-0328</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Added text blocks */}
        {addedBlocks.length > 0 && (
          <section className="py-10 md:py-16" style={{ background: "linear-gradient(180deg, hsl(270, 25%, 94%) 0%, hsl(0, 0%, 100%) 100%)" }}>
            <div className="max-w-6xl mx-auto px-6 sm:px-10 space-y-4">
              {addedBlocks.map((text, i) => (
                <div
                  key={i}
                  data-added-block
                  className={`font-body text-foreground text-base leading-relaxed p-4 rounded-xl ${editMode ? 'border-2 border-dashed border-amber-300 bg-amber-50/30 min-h-[60px]' : ''}`}
                  contentEditable={editMode}
                  suppressContentEditableWarning
                >
                  {text}
                </div>
              ))}
            </div>
          </section>
        )}

      </div>{/* end exportRef */}
    </div>
  );
}
