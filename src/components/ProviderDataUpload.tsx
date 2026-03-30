import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, X, Loader2, Building, Download, ImagePlus, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UploadRow {
  providerName: string;
  credentials: string;
  title: string;
  location: string;
  insurers: string[];
  specialties: string[];
  acceptsNew: boolean;
  photoUrl?: string;
}

const sampleData: UploadRow[] = [
  {
    providerName: "Dr. Sarah Mitchell",
    credentials: "MD",
    title: "Psychiatrist",
    location: "Hoboken",
    insurers: ["Aetna", "Cigna", "UnitedHealthcare", "Oscar Health"],
    specialties: ["Adult Psychiatry", "ADHD", "Anxiety"],
    acceptsNew: true,
  },
  {
    providerName: "Maria Gonzalez",
    credentials: "PMHNP-BC",
    title: "Psychiatric NP",
    location: "Edison",
    insurers: ["Aetna", "Anthem BCBS", "Oxford"],
    specialties: ["Medication Management", "Depression"],
    acceptsNew: true,
  },
];

const TEMPLATE_COLUMNS = [
  "Provider Name",
  "Credentials",
  "Title",
  "Location",
  "Insurers (comma-separated)",
  "Specialties (comma-separated)",
  "Accepts New Patients (yes/no)",
  "Rating (1-5)",
];

const TEMPLATE_SAMPLE_ROWS = [
  ["Dr. Jane Smith", "MD", "Psychiatrist", "Hoboken", "Aetna, Cigna, UnitedHealthcare", "Adult Psychiatry, ADHD, Anxiety", "yes", "4.9"],
  ["John Doe", "PMHNP-BC", "Psychiatric NP", "Edison", "Aetna, Anthem BCBS, Oxford", "Medication Management, Depression", "yes", "4.7"],
];

function generateCSV(): string {
  const header = TEMPLATE_COLUMNS.join(",");
  const rows = TEMPLATE_SAMPLE_ROWS.map(r => r.map(cell => `"${cell}"`).join(","));
  return [header, ...rows].join("\n");
}

function downloadTemplate() {
  const csv = generateCSV();
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "provider-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function ProviderDataUpload() {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(false);
  const [previewData, setPreviewData] = useState<UploadRow[]>([]);
  const [providerPhotos, setProviderPhotos] = useState<Record<number, string>>({});
  const [providerPhotoFiles, setProviderPhotoFiles] = useState<Record<number, File>>({});
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const photoRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const { toast } = useToast();

  const handleConfirm = async () => {
    if (previewData.length === 0) return;
    setSaving(true);
    try {
      // Upload photos to storage first
      const photoUrls: Record<number, string> = {};
      for (const [indexStr, file] of Object.entries(providerPhotoFiles)) {
        const index = parseInt(indexStr);
        const ext = file.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${index}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("provider-photos")
          .upload(fileName, file, { upsert: true });
        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("provider-photos")
            .getPublicUrl(fileName);
          photoUrls[index] = urlData.publicUrl;
        }
      }

      // Delete existing providers and re-insert
      await (supabase as any).from("providers").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      const rows = previewData.map((row, i) => ({
        provider_name: row.providerName,
        credentials: row.credentials,
        title: row.title,
        location: row.location,
        insurers: row.insurers,
        specialties: row.specialties,
        accepts_new: row.acceptsNew,
        rating: (row as any).rating ? parseFloat((row as any).rating) : null,
        photo_url: photoUrls[i] || null,
      }));

      const { error } = await (supabase as any).from("providers").insert(rows);
      if (error) throw error;

      toast({ title: "Providers updated!", description: `${rows.length} providers saved successfully.` });
      reset();
    } catch (err: any) {
      toast({ title: "Error saving providers", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };
  const parseCSV = (text: string): UploadRow[] => {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) return [];

    // Parse a CSV line respecting quoted fields
    const parseLine = (line: string): string[] => {
      const values: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (ch === ',' && !inQuotes) {
          values.push(current.trim());
          current = "";
        } else {
          current += ch;
        }
      }
      values.push(current.trim());
      return values;
    };

    const headers = parseLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim());

    const findCol = (keywords: string[]) =>
      headers.findIndex(h => keywords.some(k => h.includes(k)));

    const nameIdx = findCol(["provider name", "name"]);
    const credIdx = findCol(["credentials", "credential"]);
    const titleIdx = findCol(["title"]);
    const locIdx = findCol(["location"]);
    const insIdx = findCol(["insurer", "insurance"]);
    const specIdx = findCol(["specialt"]);
    const newIdx = findCol(["accepts", "new patient"]);
    const ratingIdx = findCol(["rating"]);

    if (nameIdx === -1) return [];

    return lines.slice(1).map(line => {
      const cols = parseLine(line);
      const get = (idx: number) => (idx >= 0 && idx < cols.length ? cols[idx] : "");
      const acceptsRaw = get(newIdx).toLowerCase();
      return {
        providerName: get(nameIdx),
        credentials: get(credIdx),
        title: get(titleIdx),
        location: get(locIdx),
        insurers: get(insIdx) ? get(insIdx).split(",").map(s => s.trim()).filter(Boolean) : [],
        specialties: get(specIdx) ? get(specIdx).split(",").map(s => s.trim()).filter(Boolean) : [],
        acceptsNew: acceptsRaw === "yes" || acceptsRaw === "true" || acceptsRaw === "1",
        rating: ratingIdx >= 0 ? get(ratingIdx) : undefined,
      } as UploadRow;
    }).filter(r => r.providerName);
  };

  const handleFile = (file: File) => {
    if (!file.name.match(/\.(xlsx?|csv)$/i)) return;
    setUploadedFile(file.name);
    setParsing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = parseCSV(text);
      setParsing(false);
      setParsed(true);
      setPreviewData(rows.length > 0 ? rows : sampleData);
    };
    reader.onerror = () => {
      setParsing(false);
      setParsed(true);
      setPreviewData(sampleData);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handlePhotoUpload = (index: number, file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setProviderPhotos(prev => ({ ...prev, [index]: url }));
    setProviderPhotoFiles(prev => ({ ...prev, [index]: file }));
  };

  const reset = () => {
    setUploadedFile(null);
    setParsing(false);
    setParsed(false);
    setPreviewData([]);
    setProviderPhotos({});
    setProviderPhotoFiles({});
  };

  return (
    <div className="space-y-6">
      {/* Template Download Card */}
      <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <Download className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-foreground font-bold text-lg">Download Template</h3>
            <p className="text-muted-foreground text-xs">Start with our pre-formatted CSV template, fill in your provider data, then upload it below</p>
          </div>
        </div>

        <div className="bg-secondary/20 rounded-xl p-4 mb-4">
          <p className="text-xs font-bold text-foreground mb-2">Template columns:</p>
          <div className="flex flex-wrap gap-1.5">
            {TEMPLATE_COLUMNS.map(col => (
              <span key={col} className="text-[11px] bg-white border border-border rounded-lg px-2.5 py-1 text-muted-foreground font-medium">{col}</span>
            ))}
          </div>
        </div>

        <button
          onClick={downloadTemplate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-bold py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download CSV Template
        </button>
      </div>

      {/* Upload Card */}
      <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-foreground font-bold text-lg">Upload Provider Data</h3>
            <p className="text-muted-foreground text-xs">Upload your completed template to update provider profiles and credentialing</p>
          </div>
        </div>

        {!uploadedFile ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
              dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 hover:bg-secondary/20"
            }`}
          >
            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground font-semibold text-sm mb-1">Drop your completed template here</p>
            <p className="text-muted-foreground text-xs">or click to browse. Supports .xlsx, .xls, .csv</p>
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          </div>
        ) : (
          <div>
            {/* File info bar */}
            <div className="flex items-center gap-3 bg-secondary/30 rounded-xl px-4 py-3 mb-4">
              <FileSpreadsheet className="w-5 h-5 text-primary shrink-0" />
              <span className="text-sm font-medium text-foreground flex-1 truncate">{uploadedFile}</span>
              {parsing && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
              {parsed && <CheckCircle2 className="w-4 h-4 text-green-600" />}
              <button onClick={reset} className="p-1 hover:bg-secondary rounded-lg transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <AnimatePresence>
              {parsed && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="text-sm font-bold text-foreground mb-1">Preview — {previewData.length} providers found</p>
                  <p className="text-xs text-muted-foreground mb-4">Add a headshot for each provider below. You can also add photos later.</p>

                  <div className="space-y-3 mb-6">
                    {previewData.map((row, i) => (
                      <div key={i} className="border border-border rounded-xl p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Photo upload area */}
                          <div className="shrink-0 flex flex-col items-center gap-1.5">
                            <input
                              ref={el => { photoRefs.current[i] = el; }}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => { if (e.target.files?.[0]) handlePhotoUpload(i, e.target.files[0]); }}
                            />
                            {providerPhotos[i] ? (
                              <button
                                onClick={() => photoRefs.current[i]?.click()}
                                className="relative group"
                              >
                                <img
                                  src={providerPhotos[i]}
                                  alt={row.providerName}
                                  className="w-20 h-20 rounded-xl object-cover border-2 border-primary/20"
                                />
                                <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Camera className="w-5 h-5 text-white" />
                                </div>
                              </button>
                            ) : (
                              <button
                                onClick={() => photoRefs.current[i]?.click()}
                                className="w-20 h-20 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center gap-1 hover:bg-primary/10 hover:border-primary/50 transition-all cursor-pointer"
                              >
                                <ImagePlus className="w-5 h-5 text-primary/60" />
                                <span className="text-[9px] text-primary/60 font-medium">Add Photo</span>
                              </button>
                            )}
                          </div>

                          {/* Provider info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                              <div>
                                <p className="text-foreground font-bold text-sm">{row.providerName}, {row.credentials}</p>
                                <p className="text-muted-foreground text-xs">{row.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Building className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{row.location}</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {row.insurers.slice(0, 3).map(ins => (
                                  <span key={ins} className="text-[10px] bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full font-medium">{ins}</span>
                                ))}
                                {row.insurers.length > 3 && (
                                  <span className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">+{row.insurers.length - 3}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {row.specialties.map(s => (
                                <span key={s} className="text-[10px] bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded-full font-medium">{s}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleConfirm}
                      disabled={saving}
                      className="flex-1 bg-primary text-primary-foreground text-sm font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : "Confirm & Update Providers"}
                    </button>
                    <button onClick={reset} className="px-5 py-3 border border-border text-foreground text-sm font-bold rounded-xl hover:bg-secondary/30 transition-colors">
                      Cancel
                    </button>
                  </div>

                  <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>This is a preview. Confirming will update provider profiles, photos, and insurance credentialing across the patient booking platform.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!parsed && !parsing && (
              <div className="bg-secondary/20 rounded-xl p-4 text-xs text-muted-foreground">
                <p className="font-bold text-foreground mb-2">Expected columns:</p>
                <div className="flex flex-wrap gap-1.5">
                  {TEMPLATE_COLUMNS.map(col => (
                    <span key={col} className="bg-white border border-border rounded-lg px-2 py-1 text-center">{col}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
