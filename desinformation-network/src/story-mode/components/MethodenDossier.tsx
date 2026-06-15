/**
 * MethodenDossier (P1-5) — diegetischer „Atlas" der realen Desinfo-Muster (Taste I).
 * Ersetzt die alte Pro-Mode-`Encyclopedia` (englisch, Web-Look, aus `persuasion/taxonomy.json`),
 * die stilfremd und vom Spiel entkoppelt war. Speist sich aus DERSELBEN deutschen Datenquelle
 * wie der End-Report (`disinfo_methods.json` / DisinfoMethodAtlas) → Bildungs-Kern aus einem Guss.
 */
import { useState } from 'react';
import { StoryModeColors } from '../theme';
import { Icon } from './Icon';
import { PixelModal } from './PixelModal';
import methodsData from '../data/disinfo_methods.json';

interface DisinfoMethod {
  id: string;
  label_de: string;
  real_method_de: string;
  what_de: string;
  real_case_de: string;
  severity: string;
  counter_de: string;
}

const METHODS = (methodsData as { methods: DisinfoMethod[] }).methods;

const SEVERITY_COLOR: Record<string, string> = {
  hoch: StoryModeColors.danger,
  mittel: StoryModeColors.warning,
  niedrig: StoryModeColors.success,
};

interface MethodenDossierProps {
  isOpen: boolean;
  onClose: () => void;
  /** Optional: eine Methode vorausgewählt öffnen (z. B. aus dem End-Report verlinkt). */
  highlightMethodId?: string;
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div
        className="text-[10px] uppercase mb-1"
        style={{ color: StoryModeColors.textSecondary, letterSpacing: '0.08em' }}
      >
        {title}
      </div>
      <div className="text-xs" style={{ color: StoryModeColors.textPrimary, lineHeight: 1.6 }}>
        {children}
      </div>
    </div>
  );
}

export function MethodenDossier({ isOpen, onClose, highlightMethodId }: MethodenDossierProps): React.JSX.Element | null {
  const [selectedId, setSelectedId] = useState<string | null>(highlightMethodId ?? METHODS[0]?.id ?? null);
  if (!isOpen) return null;

  const selected = METHODS.find((m) => m.id === selectedId) ?? METHODS[0];

  return (
    <PixelModal
      open
      onClose={onClose}
      variant="standard"
      maxWidthClass="max-w-4xl"
      title={<span><Icon name="stats" size={14} title="Dossier" /> METHODEN-DOSSIER — reale Desinfo-Muster</span>}
    >
      <div className="flex" style={{ height: '64vh' }}>
        {/* Liste der Methoden */}
        <div className="w-1/3 overflow-y-auto border-r-2" style={{ borderColor: StoryModeColors.border }}>
          {METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedId(m.id)}
              className="w-full text-left p-2 border-b"
              style={{
                borderColor: StoryModeColors.borderLight,
                backgroundColor: m.id === selected.id ? StoryModeColors.surface : 'transparent',
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  style={{
                    width: 8, height: 8, flexShrink: 0,
                    backgroundColor: SEVERITY_COLOR[m.severity] ?? StoryModeColors.textMuted,
                    display: 'inline-block',
                  }}
                />
                <span className="text-[11px]" style={{ color: StoryModeColors.textPrimary }}>{m.label_de}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Detail der ausgewählten Methode */}
        <div className="w-2/3 overflow-y-auto p-3">
          <div className="text-sm font-bold mb-1" style={{ color: StoryModeColors.textPrimary }}>
            {selected.label_de}
          </div>
          <div className="text-[11px] mb-3" style={{ color: StoryModeColors.textSecondary }}>
            Reale Methode: <span style={{ color: StoryModeColors.textPrimary }}>{selected.real_method_de}</span>
            {' · '}Schwere:{' '}
            <span style={{ color: SEVERITY_COLOR[selected.severity] ?? StoryModeColors.textMuted }}>
              {selected.severity}
            </span>
          </div>
          <DetailSection title="Was es ist">{selected.what_de}</DetailSection>
          <DetailSection title="Realer Fall">{selected.real_case_de}</DetailSection>
          <DetailSection title="Gegenmaßnahme">{selected.counter_de}</DetailSection>
        </div>
      </div>

      <div className="mt-2 text-[10px] text-center" style={{ color: StoryModeColors.textMuted }}>
        Bildungs-Kern: Dieselben Muster wertet der Abschluss-Bericht anhand Ihres Spielverhaltens aus. (Taste I schließt)
      </div>
    </PixelModal>
  );
}

export default MethodenDossier;
