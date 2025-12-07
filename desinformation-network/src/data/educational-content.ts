import type { EducationalInsight, ReflectionQuestion } from '@/game-logic/types';

// ============================================
// EDUCATIONAL INSIGHTS
// ============================================

export const educationalInsights: EducationalInsight[] = [
  {
    id: 'emotional_manipulation',
    title: 'Emotionale Manipulation',
    description: 'Emotionen umgehen den rationalen Teil des Gehirns. Wenn wir emotional reagieren, sind wir weniger kritisch.',
    technique: 'emotional_appeal',
    realWorldConnection: 'Skandal-Schlagzeilen nutzen gezielt Empörung, Angst oder Wut, um Klicks zu generieren.',
    counterStrategy: 'Pause einlegen. Fragen Sie sich: "Versucht dieser Inhalt, mich emotional aufzuwühlen?"',
  },
  {
    id: 'social_proof',
    title: 'Soziale Bewährtheit',
    description: 'Wir orientieren uns an dem, was andere tun. Wenn etwas "viral" geht, erscheint es wichtiger.',
    technique: 'social_proof',
    realWorldConnection: 'Bot-Armeen erzeugen künstliche Popularität. Likes und Shares können massenhaft gefälscht werden.',
    counterStrategy: 'Popularität bedeutet nicht Wahrheit. Prüfen Sie die Quelle, nicht nur die Reichweite.',
  },
  {
    id: 'authority_laundering',
    title: 'Autoritäts-Laundering',
    description: 'Falsche Experten oder gefälschte Institute verleihen Desinformation einen Anstrich von Glaubwürdigkeit.',
    technique: 'authority_laundering',
    realWorldConnection: 'Think-Tank-Fassaden werden von Industrien finanziert, um ihre Agenda als "Forschung" zu tarnen.',
    counterStrategy: 'Recherchieren Sie Experten und Institute. Wer finanziert sie? Was ist ihre Agenda?',
  },
  {
    id: 'information_laundering',
    title: 'Informations-Laundering',
    description: 'Falschinformationen werden durch "Zitierketten" gewaschen: Blog → Boulevardpresse → Mainstream.',
    technique: 'information_laundering',
    realWorldConnection: 'Russische Desinformationskampagnen nutzen diese Technik systematisch seit Jahren.',
    counterStrategy: 'Verfolgen Sie Behauptungen zur Originalquelle zurück. Wie seriös ist die Primärquelle?',
  },
  {
    id: 'coordinated_inauthentic',
    title: 'Koordinierte Inauthentizität',
    description: 'Bot-Netzwerke und Trollfarmen simulieren organische Bewegungen und erzeugen künstliche Trends.',
    technique: 'coordinated_inauthentic_behavior',
    realWorldConnection: '2024: Über 51% des Web-Traffics stammt von Bots. KI macht Fälschungen noch überzeugender.',
    counterStrategy: 'Seien Sie skeptisch bei plötzlichen "Trends". Echte Bewegungen brauchen Zeit.',
  },
  {
    id: 'framing_effect',
    title: 'Framing-Effekte',
    description: 'Dieselbe Information kann durch unterschiedliche Rahmung völlig anders wahrgenommen werden.',
    technique: 'framing',
    realWorldConnection: '"95% Erfolgsquote" vs. "5% versagen" - dieselbe Statistik, andere Wirkung.',
    counterStrategy: 'Fragen Sie sich: "Wie würde diese Information anders klingen, wenn sie anders formuliert wäre?"',
  },
  {
    id: 'agenda_setting',
    title: 'Agenda-Setting',
    description: 'Medien bestimmen nicht nur, WAS wir denken, sondern WORÜBER wir nachdenken.',
    technique: 'agenda_setting',
    realWorldConnection: '24/7-Berichterstattung über Nebensächlichkeiten lenkt von wichtigeren Themen ab.',
    counterStrategy: 'Diversifizieren Sie Ihre Nachrichtenquellen. Fragen Sie: "Worüber wird NICHT berichtet?"',
  },
  {
    id: 'prebunking_works',
    title: 'Prebunking funktioniert',
    description: 'Vorwarnung über Manipulationstechniken macht Menschen widerstandsfähiger gegen sie.',
    realWorldConnection: 'Studien zeigen: Prebunking ist bis zu 72% effektiv bei der Immunisierung gegen Desinformation.',
    counterStrategy: 'Teilen Sie Wissen über Manipulationstechniken mit Familie und Freunden.',
    learnMoreUrl: 'https://inoculation.science/',
  },
];

// ============================================
// REFLECTION QUESTIONS
// ============================================

export const reflectionQuestions: ReflectionQuestion[] = [
  {
    id: 'strategy_reflection',
    question: 'Welche Strategie war am effektivsten? Warum glauben Sie, dass diese Technik so wirksam ist?',
    context: 'Reflection on campaign effectiveness',
  },
  {
    id: 'real_world_connection',
    question: 'Haben Sie ähnliche Taktiken in echten Nachrichten oder sozialen Medien bemerkt?',
    context: 'Connecting game to reality',
  },
  {
    id: 'emotional_reaction',
    question: 'Welche Inhalte in Ihrem echten Leben rufen starke emotionale Reaktionen hervor? Könnten diese manipulativ sein?',
    context: 'Personal awareness building',
    relatedTechnique: 'emotional_appeal',
  },
  {
    id: 'source_verification',
    question: 'Wie oft überprüfen Sie die Originalquelle einer Information, bevor Sie sie teilen?',
    context: 'Behavioral reflection',
    relatedTechnique: 'information_laundering',
  },
  {
    id: 'bot_awareness',
    question: 'Wie können Sie erkennen, ob ein Social-Media-Account echt oder ein Bot ist?',
    context: 'Technical awareness',
    relatedTechnique: 'coordinated_inauthentic_behavior',
  },
  {
    id: 'expert_verification',
    question: 'Welche Schritte unternehmen Sie, um die Qualifikationen eines "Experten" zu überprüfen?',
    context: 'Authority verification',
    relatedTechnique: 'authority_laundering',
  },
  {
    id: 'viral_skepticism',
    question: 'Warum sollten wir besonders skeptisch sein, wenn etwas sehr schnell viral geht?',
    context: 'Understanding artificial amplification',
    relatedTechnique: 'social_proof',
  },
  {
    id: 'personal_defense',
    question: 'Welche drei Maßnahmen können Sie ab heute ergreifen, um sich besser vor Desinformation zu schützen?',
    context: 'Action planning',
  },
  {
    id: 'escalation_awareness',
    question: 'Wie hat das Eskalationssystem im Spiel das Risiko-Ertrags-Verhältnis beeinflusst? Gibt es ähnliche Dynamiken in der realen Welt?',
    context: 'Understanding consequences',
  },
  {
    id: 'defensive_actors',
    question: 'Welche "defensiven Akteure" gibt es in der realen Welt? Wie effektiv sind sie?',
    context: 'Understanding countermeasures',
  },
];

// ============================================
// TECHNIQUE CATEGORIES FOR EDUCATIONAL DISPLAY
// ============================================

export const techniqueCategories = {
  media_manipulation: {
    name: 'Medienmanipulation',
    description: 'Techniken zur Beeinflussung traditioneller und sozialer Medien.',
    color: '#EF4444',
  },
  infrastructure: {
    name: 'Infrastruktur',
    description: 'Bot-Netzwerke und technische Manipulationswerkzeuge.',
    color: '#6B7280',
  },
  expert_manipulation: {
    name: 'Experten-Manipulation',
    description: 'Missbrauch von Autorität und Expertenstatus.',
    color: '#8B5CF6',
  },
  authority_laundering: {
    name: 'Autoritäts-Laundering',
    description: 'Erzeugung falscher Glaubwürdigkeit durch Fassaden.',
    color: '#EC4899',
  },
  narrative_manipulation: {
    name: 'Narrativ-Kontrolle',
    description: 'Steuerung öffentlicher Diskurse und Agenda-Setting.',
    color: '#3B82F6',
  },
  leak_operation: {
    name: 'Leak-Operationen',
    description: 'Strategische Veröffentlichung von echten oder gefälschten Dokumenten.',
    color: '#F97316',
  },
  social_media: {
    name: 'Social Media',
    description: 'Manipulation von Plattformen und Algorithmen.',
    color: '#1DA1F2',
  },
  defensive: {
    name: 'Defensive',
    description: 'Gegenmaßnahmen und Schutzstrategien.',
    color: '#22C55E',
  },
};

// ============================================
// REAL-WORLD CASE STUDIES
// ============================================

export const realWorldCases = [
  {
    id: 'russia_2024',
    title: 'Russische Desinformationskampagne 2024',
    description: 'Einsatz von über 1000 KI-generierten Profilen zur Beeinflussung der US-Wähler.',
    techniques: ['create_bot_army', 'amplify_content', 'astroturf_campaign'],
    source: 'CSIS Analysis',
    url: 'https://www.csis.org/analysis/russian-bot-farm-used-ai-lie-americans-what-now',
  },
  {
    id: 'covid_misinfo',
    title: 'COVID-19 Desinformation',
    description: 'Falsche "Experten" und ungeprüfte Studien verbreiteten gefährliche Fehlinformationen.',
    techniques: ['credential_manipulation', 'leak_study', 'emotional_appeal'],
    source: 'WHO Infodemic Report',
  },
  {
    id: 'climate_denial',
    title: 'Klimaleugnung',
    description: 'Fossile Brennstoffindustrie finanziert fake "Forschungsinstitute" seit Jahrzehnten.',
    techniques: ['think_tank_front', 'commission_report', 'agenda_setting'],
    source: 'Merchants of Doubt',
  },
];
