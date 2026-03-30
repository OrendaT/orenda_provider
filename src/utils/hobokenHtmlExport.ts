import { saveAs } from "file-saver";

// Use the published URL so images resolve correctly when HTML is opened standalone
const PUBLISHED_BASE = "https://orenda-njoffice-guide.lovable.app";

function resolveUrl(src: string): string {
  if (src.startsWith("http")) return src;
  if (src.startsWith("/")) return `${PUBLISHED_BASE}${src}`;
  // Vite imports like "/assets/hoboken-riverfront-abc123.png" — already absolute
  return `${PUBLISHED_BASE}/${src}`;
}

export async function downloadHobokenHtml(images: { building: string; reception: string; lounge: string; lounge2: string; kitchen: string; coworking: string; brandedMap: string; logo: string }) {
  // Pre-resolve all image URLs
  const img = {
    building: resolveUrl(images.building),
    reception: resolveUrl(images.reception),
    lounge: resolveUrl(images.lounge),
    lounge2: resolveUrl(images.lounge2),
    kitchen: resolveUrl(images.kitchen),
    coworking: resolveUrl(images.coworking),
    brandedMap: resolveUrl(images.brandedMap),
    logo: resolveUrl(images.logo),
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Orenda Psychiatry — Hoboken Riverfront Center</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Montserrat', sans-serif; color: #2d1550; background: #fff; font-size: 18px; line-height: 1.7; }
img { max-width: 100%; height: auto; display: block; }
.display { font-family: 'Cormorant Garamond', serif; }
.italic-accent { color: #a78bdb; font-style: italic; }

/* Header */
.header { background: #fff; border-bottom: 2px solid #f0e8f8; padding: 24px 48px; display: flex; align-items: center; justify-content: flex-end; }
.header img { height: 48px; }

/* Hero */
.hero { display: grid; grid-template-columns: 1fr 1fr; min-height: 600px; }
.hero-text { display: flex; align-items: center; padding: 80px 64px; background: linear-gradient(135deg, hsl(270, 60%, 92%), #fff); }
.hero-text .tag { font-size: 14px; letter-spacing: 0.5em; text-transform: uppercase; color: rgba(45,21,80,0.5); margin-bottom: 24px; font-weight: 500; }
.hero-text h1 { font-family: 'Cormorant Garamond', serif; font-size: 96px; font-weight: 300; line-height: 0.95; margin-bottom: 24px; color: #2d1550; }
.hero-text .line { width: 64px; height: 3px; background: rgba(167,139,219,0.5); margin-bottom: 24px; }
.hero-text .addr { color: rgba(45,21,80,0.65); font-size: 20px; font-weight: 400; line-height: 1.8; }
.hero-img { overflow: hidden; }
.hero-img img { width: 100%; height: 100%; object-fit: cover; min-height: 600px; }

/* Sections */
.section { padding: 80px 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 48px; }
.section-tag { font-size: 13px; letter-spacing: 0.4em; text-transform: uppercase; color: #a78bdb; font-weight: 600; margin-bottom: 20px; }
.section-title { font-family: 'Cormorant Garamond', serif; font-size: 56px; font-weight: 300; line-height: 1.1; margin-bottom: 36px; color: #2d1550; }
.about-text { color: #5a5a6a; font-size: 20px; line-height: 1.9; margin-bottom: 56px; }

/* Map + Address */
.map-grid { display: grid; grid-template-columns: 1fr 1fr; border-radius: 20px; overflow: hidden; border: 2px solid #f0e8f8; background: #fff; margin-bottom: 48px; }
.map-grid img { width: 100%; height: 100%; object-fit: cover; min-height: 500px; }
.info-panel { display: flex; flex-direction: column; }
.info-block { padding: 48px; flex: 1; display: flex; flex-direction: column; justify-content: center; }
.info-block + .info-block { border-top: 2px solid #f0e8f8; }
.info-block h3 { font-family: 'Cormorant Garamond', serif; font-size: 32px; margin-bottom: 20px; color: #2d1550; }
.info-block p { font-size: 18px; color: #5a5a6a; line-height: 1.7; margin-bottom: 6px; }
.info-block .bold { color: #2d1550; font-weight: 600; font-size: 19px; }
.step { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 16px; }
.step-num { width: 28px; height: 28px; border-radius: 50%; background: rgba(63,0,128,0.1); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: #3f0080; flex-shrink: 0; margin-top: 4px; }
.step p { font-size: 18px; color: #5a5a6a; line-height: 1.7; }
.step .hl { color: #2d1550; font-weight: 600; }

/* Dark Key Info */
.key-info { background: #2d1550; border-radius: 20px; padding: 72px; color: #fff; }
.key-info .section-tag { color: rgba(255,255,255,0.4); }
.key-info .section-title { color: #fff; font-size: 52px; margin-bottom: 56px; }
.key-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 64px; }
.key-col h4 { font-family: 'Cormorant Garamond', serif; font-size: 32px; margin-bottom: 28px; color: #fff; }
.key-item { margin-bottom: 24px; }
.key-item .label { font-size: 15px; color: rgba(255,255,255,0.5); margin-bottom: 6px; font-weight: 500; }
.key-item .value { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: #fff; }
.key-divider { width: 40px; height: 2px; background: rgba(255,255,255,0.15); margin: 24px 0; }
.key-note { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; font-size: 16px; color: rgba(255,255,255,0.65); line-height: 1.7; margin-top: 8px; }
.key-note .accent { color: #a78bdb; font-weight: 600; }

/* Private Office */
.private-office { padding: 96px 0; background: linear-gradient(180deg, hsl(270, 60%, 10%) 0%, hsl(270, 40%, 20%) 100%); text-align: center; color: #fff; }
.private-office h2 { font-family: 'Cormorant Garamond', serif; font-size: 80px; font-weight: 300; margin-bottom: 20px; }
.private-office .sub { color: rgba(255,255,255,0.4); font-size: 18px; margin-bottom: 56px; }
.amenity-grid { display: flex; justify-content: center; gap: 48px; margin-bottom: 56px; flex-wrap: wrap; }
.amenity { display: flex; flex-direction: column; align-items: center; gap: 16px; }
.amenity-circle { width: 110px; height: 110px; border-radius: 50%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 32px; }
.amenity span { font-size: 15px; color: rgba(255,255,255,0.7); font-weight: 500; }
.protocol-row { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }
.protocol-pill { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 999px; padding: 14px 28px; font-size: 16px; color: rgba(255,255,255,0.7); }

/* Gallery */
.gallery { padding: 80px 0; background: linear-gradient(160deg, hsl(270,25%,94%) 0%, hsl(270,35%,88%) 40%, hsl(270,45%,82%) 70%, hsl(270,60%,70%) 100%); }
.gallery .section-tag { color: rgba(45,21,80,0.4); }
.gallery .section-title { color: #2d1550; }
.gallery .sub { color: rgba(45,21,80,0.5); font-size: 18px; max-width: 560px; line-height: 1.8; margin-top: 16px; margin-bottom: 48px; }
.gallery-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.gallery-card { border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 8px 32px rgba(0,0,0,0.12); position: relative; }
.gallery-card img { width: 100%; aspect-ratio: 16/10; object-fit: cover; }
.gallery-card .caption { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.65), transparent); padding: 24px; }
.gallery-card .caption p { color: #fff; font-size: 17px; font-weight: 600; letter-spacing: 0.03em; }

/* Facilities */
.facilities { padding: 72px 0; background: hsl(270,15%,96%); }
.facility-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
.facility-card { background: #fff; border: 2px solid #f0e8f8; border-radius: 14px; padding: 28px; display: flex; align-items: center; gap: 18px; }
.facility-icon { width: 48px; height: 48px; border-radius: 10px; background: hsl(270,30%,93%); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px; color: #7c3aed; }
.facility-card p { font-size: 17px; font-weight: 600; color: #2d1550; }

/* Footer */
.footer { padding: 40px 0; background: #fff; border-top: 2px solid #f0e8f8; }
.footer-inner { max-width: 1200px; margin: 0 auto; padding: 0 48px; display: flex; justify-content: space-between; align-items: center; }
.footer img { height: 32px; opacity: 0.4; }
.footer p { font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(45,21,80,0.3); }

@media print {
  .hero { min-height: auto; }
  .hero-img img { min-height: auto; }
  .key-info { break-inside: avoid; }
  .private-office { break-inside: avoid; }
}
</style>
</head>
<body>

<!-- Header -->
<div class="header">
  <img src="${img.logo}" alt="Orenda Psychiatry">
</div>

<!-- Hero -->
<section class="hero">
  <div class="hero-text">
    <div>
      <p class="tag">01 — Hoboken, New Jersey</p>
      <h1 class="display">Riverfront<br><em class="italic-accent">Center</em></h1>
      <div class="line"></div>
      <p class="addr">221 River Street, 9th Floor, Unit 9076<br>Hoboken, NJ 07030</p>
    </div>
  </div>
  <div class="hero-img">
    <img src="${img.building}" alt="Hoboken Riverfront Center">
  </div>
</section>

<!-- About -->
<section class="section" style="background: linear-gradient(180deg, #fff 0%, hsl(270, 20%, 97%) 100%);">
  <div class="container">
    <p class="section-tag">About This Location</p>
    <h2 class="display section-title">A Modern Space for <em class="italic-accent">Exceptional Care</em></h2>
    <p class="about-text">Located on the Hudson River waterfront with stunning views of the Manhattan skyline, our Hoboken office offers a modern, professional setting just 15 minutes from Midtown Manhattan. The space is designed to provide a welcoming, comfortable experience for both patients and providers.</p>

    <!-- Map + Address -->
    <div class="map-grid">
      <img src="${img.brandedMap}" alt="Hoboken Office Location — 221 River Street">
      <div class="info-panel">
        <div class="info-block">
          <h3 class="display">Address</h3>
          <p class="bold">Regus — Riverfront Center</p>
          <p>221 River Street, 9th Floor, Unit 9076</p>
          <p>Hoboken, NJ 07030</p>
        </div>
        <div class="info-block">
          <h3 class="display">Finding the Building</h3>
          <div class="step"><div class="step-num">1</div><p>Look for <span class="hl">Wonder Cafe</span> — use it as your landmark</p></div>
          <div class="step"><div class="step-num">2</div><p>The building entrance is on <span class="hl">River Street</span> with the Riverfront Center signage</p></div>
          <div class="step"><div class="step-num">3</div><p>Take the elevator to the <span class="hl">9th floor</span>. Reception is staffed <span class="hl">9 AM – 5 PM</span>. After hours, the floor entrance is locked and a swipe card is required.</p></div>
        </div>
      </div>
    </div>

    <!-- Key Information -->
    <div class="key-info">
      <p class="section-tag">Key Information</p>
      <h3 class="display section-title">At Your <em class="italic-accent">Fingertips</em></h3>
      <div class="key-grid">
        <!-- Access -->
        <div class="key-col">
          <h4 class="display">Access</h4>
          <div class="key-item">
            <p class="value">24/7 Security &amp; Access</p>
            <p class="label">Building access available around the clock</p>
          </div>
          <div class="key-divider"></div>
          <div class="key-item">
            <p class="value">Regus Front Desk</p>
            <p class="label">9th Floor · Mon–Fri, 9 AM – 5 PM</p>
          </div>
          <div class="key-divider"></div>
          <div class="key-note"><span class="accent">Note:</span> After hours, the Regus front desk &amp; entrance are closed. Ensure our team registers your access for after-hours entry.</div>
        </div>
        <!-- Contact -->
        <div class="key-col">
          <h4 class="display">Contact</h4>
          <div class="key-item">
            <p class="label">Phone</p>
            <p class="value">(201) 721-8500</p>
          </div>
          <div class="key-divider"></div>
          <div class="key-item">
            <p class="label">Email</p>
            <p class="value">Hoboken.Riverfront@regus.com</p>
          </div>
        </div>
        <!-- Wi-Fi -->
        <div class="key-col">
          <h4 class="display">Wi-Fi</h4>
          <div class="key-item">
            <p class="label">Network</p>
            <p class="value">Regus Net Wi-Fi</p>
          </div>
          <div class="key-divider"></div>
          <div class="key-item">
            <p class="label">Password</p>
            <p class="value" style="letter-spacing: 0.12em;">167845630</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Private Office -->
<section class="private-office">
  <div class="container">
    <h2 class="display">Our Private <em class="italic-accent">Office</em></h2>
    <p class="sub">Fully equipped. Reserved for you.</p>
    <div class="amenity-grid">
      <div class="amenity"><div class="amenity-circle">🪑</div><span>Patient Seating</span></div>
      <div class="amenity"><div class="amenity-circle">⚖️</div><span>Weight Scale</span></div>
      <div class="amenity"><div class="amenity-circle">❤️‍🩹</div><span>BP Cuff</span></div>
      <div class="amenity"><div class="amenity-circle">☕</div><span>Water &amp; Coffee</span></div>
      <div class="amenity"><div class="amenity-circle">📶</div><span>Wi-Fi</span></div>
    </div>
    <div class="protocol-row">
      <div class="protocol-pill">🛡️ Escort patients at all times</div>
      <div class="protocol-pill">☕ Use in-office beverages only</div>
      <div class="protocol-pill">🔑 Return key to lockbox after visit</div>
      <div class="protocol-pill">🚪 Leave office clean &amp; reset</div>
    </div>
  </div>
</section>

<!-- Gallery -->
<section class="gallery">
  <div class="container">
    <p class="section-tag">The Space</p>
    <h2 class="display section-title">Workspace <em style="color:#3f0080; font-style:italic;">Environment</em></h2>
    <p class="sub">Our office is situated within a premium shared workspace featuring modern amenities, professional common areas, and a welcoming atmosphere suited for healthcare professionals.</p>
    <div class="gallery-grid">
      <div class="gallery-card"><img src="${img.building}" alt="Building Exterior"><div class="caption"><p>Building Exterior</p></div></div>
      <div class="gallery-card"><img src="${img.reception}" alt="Reception"><div class="caption"><p>Reception</p></div></div>
      <div class="gallery-card"><img src="${img.lounge}" alt="Lounge"><div class="caption"><p>Lounge</p></div></div>
      <div class="gallery-card"><img src="${img.lounge2}" alt="Business Lounge"><div class="caption"><p>Business Lounge</p></div></div>
      <div class="gallery-card"><img src="${img.kitchen}" alt="Kitchen"><div class="caption"><p>Kitchen</p></div></div>
      <div class="gallery-card"><img src="${img.coworking}" alt="Coworking Space"><div class="caption"><p>Coworking Space</p></div></div>
    </div>
  </div>
</section>

<!-- Facilities -->
<section class="facilities">
  <div class="container">
    <p class="section-tag" style="color:#5a5a6a;">Amenities</p>
    <h2 class="display section-title">Building <em class="italic-accent">Facilities</em></h2>
    <div class="facility-grid">
      <div class="facility-card"><div class="facility-icon">🛡️</div><p>24/7 Building Security</p></div>
      <div class="facility-card"><div class="facility-icon">🕐</div><p>24/7 Access</p></div>
      <div class="facility-card"><div class="facility-icon">☕</div><p>Lounge &amp; Kitchen</p></div>
      <div class="facility-card"><div class="facility-icon">🚗</div><p>Parking Available</p></div>
      <div class="facility-card"><div class="facility-icon">🚆</div><p>Major Transport Links</p></div>
      <div class="facility-card"><div class="facility-icon">👥</div><p>Meeting Rooms</p></div>
      <div class="facility-card"><div class="facility-icon">📹</div><p>24/7 CCTV</p></div>
      <div class="facility-card"><div class="facility-icon">🚲</div><p>Bicycle Storage</p></div>
      <div class="facility-card"><div class="facility-icon">💼</div><p>Business Lounge</p></div>
      <div class="facility-card"><div class="facility-icon">📍</div><p>City/Town Center</p></div>
      <div class="facility-card"><div class="facility-icon">♿</div><p>Wheelchair Accessible</p></div>
    </div>
  </div>
</section>

<!-- Footer -->
<footer class="footer">
  <div class="footer-inner">
    <img src="${img.logo}" alt="Orenda Psychiatry">
    <p>© ${new Date().getFullYear()} Orenda Psychiatry</p>
  </div>
</footer>

</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  saveAs(blob, "Orenda_Hoboken_Riverfront_Center.html");
}
