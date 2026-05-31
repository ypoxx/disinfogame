# 🗺️ Roadmap (kanonisch)

> **Status:** Aktiv — die EINE gültige Roadmap
> **Aktualisiert:** 2026-05-31
> **Scope:** Beide (Schwerpunkt Story Mode)
> **Supersedes:** alle Pläne in `archive/docs/` (alte ROADMAP, DEVELOPMENT_ROADMAP_2026, PLATINUM_ROADMAP, UI/UX- und Redesign-Pläne)
> **Kanonisch für:** Reihenfolge & Schwerpunkte der Entwicklung

Verbindliche Projektwahrheit (Figuren, Zahlen, Stil, Modus-Rollen): **[`docs/VISION_LOCK.md`](docs/VISION_LOCK.md)**.

## Worauf wir hinarbeiten
Story Mode ist das Hauptspiel: eine Erzählung, in der deine moralischen Entscheidungen echtes
Gewicht haben — deine Mitarbeiter reagieren, leiden, oder verraten dich. Pro Mode (das abstrakte
Netzwerk-/Vertrauens-Spiel) ist eingefroren und als Spezifikation in `archive/pro-mode/` abgelegt;
es wird vorerst nicht weiterentwickelt.

## Reihenfolge (mit Begründung)

### 1. Fundament — *läuft*
**Was:** Die eine verbindliche Wahrheit festhalten (`docs/VISION_LOCK.md`), die alten/widersprüchlichen
Dokumente ausmisten (erledigt), und ein Sicherungsnetz aus automatischen Tests um den Story-Kern legen.
**Warum:** Solange sich Dokumente widersprechen und kein Sicherungsnetz da ist, ist jeder Umbau ein
Blindflug. Das hier macht alles Weitere erst sicher steuerbar.

### 2. Story-Kern fühlbar machen
**Was:** Die Kette „fragwürdige Entscheidung → Mitarbeiter merkt es → Moral sinkt → Krise/Verrat"
sauber verbinden, sodass man sie beim Spielen wirklich spürt. Dazu den Wert „öffentliches Aufsehen"
entwirren, der aktuell an zu vielem gleichzeitig hängt.
**Warum:** Das ist das emotionale Herz des Spiels. Vieles ist schon eingebaut, aber nicht spürbar
verbunden — hier holen wir den größten Effekt für die wenigste Arbeit.

### 3. Gebäude-Basis (klickbar)
**Was:** Ein anklickbarer Querschnitt der Agentur (Büros = Klickflächen auf einem Hintergrundbild),
aufgebaut über editierbare Listen statt fest einprogrammiert.
**Warum:** Gibt der Geschichte einen sichtbaren Ort. Diese Variante läuft im Ansatz schon und ist
günstig. Sie ist so gebaut, dass eine Figur später leicht dazukommt.

### 4. Optionale Figur (Avatar)
**Was:** Eine kleine laufende Pixel-Figur, die zwischen den Büros geht.
**Warum / Bedingung:** Technisch klein — die einzige echte Hürde ist EIN sauberes Bewegungsbild
(ein kurzer Lauf-Zyklus). Kommt erst, wenn dieses Bild existiert. Bis dahin reicht Schritt 3 voll aus.

### 5. Pro Mode — eingefroren
**Was:** Bleibt als Spezifikation und Code liegen, wird nicht weiterentwickelt; eine spätere saubere
Heraustrennung des Codes ist möglich, aber kein aktuelles Ziel.
**Warum:** Fokus auf ein gutes Spiel (Story) statt zwei halbe.

## Was bewusst NICHT jetzt entschieden ist
- Genaue Länge von Story Mode (in „Phasen").
- Endgültige Sieg-/Verlust-Regeln von Pro Mode (eingefroren, siehe `archive/pro-mode/SPEC.md`).
- Woher das Avatar-Bewegungsbild kommt (eigenes Sprite-Werkzeug vs. einfache 2-Bild-Animation).

*Details je Schritt werden vor Beginn mit dem Projektinhaber abgestimmt.*
