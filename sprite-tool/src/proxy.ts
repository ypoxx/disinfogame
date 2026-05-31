import { NextRequest, NextResponse } from 'next/server';

// ===========================================
// APP-WEITER PASSWORTSCHUTZ (Basic Auth, Edge)
// ===========================================
// Next.js 16 "proxy"-Konvention (früher "middleware"). Schützt Seiten UND
// /api/* gleichermaßen — damit niemand sonst die KI-Endpunkte (= deine
// API-Kosten) nutzen kann.
//
// Passwort kommt aus der Host-Umgebung (SITE_PASSWORD), NIE aus dem Repo.
// - Lokal (npm run dev) ohne SITE_PASSWORD: offen (kein Gate beim Entwickeln).
// - In Produktion ohne SITE_PASSWORD: bewusst blockiert (kein offenes Deploy).

export const config = {
  // Alles außer Next-internen, ohnehin öffentlichen Static-Assets.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

function unauthorized() {
  return new NextResponse('Authentifizierung erforderlich.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Asset Studio", charset="UTF-8"' },
  });
}

// Konstantzeit-Vergleich (vermeidet Timing-Seitenkanäle).
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function proxy(req: NextRequest): NextResponse {
  const password = process.env.SITE_PASSWORD;
  const user = process.env.SITE_USER || 'admin';

  if (!password) {
    if (process.env.NODE_ENV === 'production') {
      return new NextResponse(
        'SITE_PASSWORD ist nicht gesetzt. Bitte in den Umgebungsvariablen des Hosts eintragen.',
        { status: 503 }
      );
    }
    return NextResponse.next(); // lokal offen
  }

  const header = req.headers.get('authorization');
  if (header?.startsWith('Basic ')) {
    try {
      const decoded = atob(header.slice(6)); // "user:pass"
      const idx = decoded.indexOf(':');
      if (idx >= 0) {
        const u = decoded.slice(0, idx);
        const p = decoded.slice(idx + 1);
        if (safeEqual(u, user) && safeEqual(p, password)) {
          return NextResponse.next();
        }
      }
    } catch {
      // ungültiger Header → unten 401
    }
  }
  return unauthorized();
}
