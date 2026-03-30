import lockboxLabel from "@/assets/hoboken-lockbox-label.jpg";
import paintNotice from "@/assets/paint-notice-sign.jpg";
import ProviderRemindersSign from "@/components/ProviderRemindersSign";
import TextUsSign from "@/components/TextUsSign";

const signs = [
  { src: lockboxLabel, title: "Hoboken Lockbox Label", desc: "2\" × 1.5\" — attach to swipe card & key" },
  { src: paintNotice, title: "Paint Notice Sign", desc: "8.5\" × 11\" — post on office door" },
];

const OfficeSigns = () => (
  <div className="min-h-screen bg-background py-12 px-4">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-2">Office Signs & Labels</h1>
      <p className="text-muted-foreground mb-8">Right-click any image → "Save image as" to download.</p>
      <div className="space-y-10">
        {signs.map((sign) => (
          <div key={sign.title} className="bg-white rounded-2xl border border-border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-1">{sign.title}</h2>
            <p className="text-sm text-muted-foreground mb-4">{sign.desc}</p>
            <img src={sign.src} alt={sign.title} className="w-full max-w-md mx-auto rounded-lg" />
          </div>
        ))}

        {/* Provider Reminders — rendered as HTML for perfect text */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <ProviderRemindersSign />
        </div>

        {/* Text Us Sign */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <TextUsSign />
        </div>
      </div>
    </div>
  </div>
);

export default OfficeSigns;
