import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ProviderDataUpload from "@/components/ProviderDataUpload";
import logo from "@/assets/orenda-logo-purple.png";

export default function AdminV2Providers() {
  return (
    <div className="min-h-screen bg-[hsl(270,15%,97%)] font-body">
      <Helmet>
        <title>Admin — Provider & Credentialing Upload</title>
      </Helmet>

      <header className="bg-white border-b border-border px-6 py-4 flex items-center gap-4">
        <Link to="/admin-v2" className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <img src={logo} alt="Orenda" className="h-6" />
        <div>
          <h1 className="text-foreground font-bold text-lg">Provider & Credentialing</h1>
          <p className="text-muted-foreground text-xs">Upload and manage provider data for the patient booking platform</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <ProviderDataUpload />
      </main>
    </div>
  );
}
