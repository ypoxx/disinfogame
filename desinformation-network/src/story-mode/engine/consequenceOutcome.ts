/**
 * Lesbare Ausgänge für Konsequenz-Wahlen.
 *
 * `consequences.json` führt zu jeder Wahl ein `outcome` — aber als Bezeichner
 * (`restores_capability`), nicht als Text. Das Konsequenz-Modal rendert an
 * dieser Stelle `outcome_de`, ein Feld, das es in den Daten nie gab: Der
 * Spieler sah dort also eine leere Zeile und entschied ohne zu wissen, worauf
 * die Option hinausläuft.
 *
 * Die Texte stehen hier statt in der JSON, damit sie an einer Stelle liegen und
 * redaktionell überarbeitet werden können, ohne die Spieldaten anzufassen.
 * Sie beschreiben die **Absicht** der Wahl, nicht ihr garantiertes Ergebnis —
 * mehrere davon können scheitern, und genau das soll der Ton mittragen.
 *
 * `consequenceData.test.ts` hält fest, dass jeder in den Daten vorkommende
 * Bezeichner hier einen Text hat.
 */

const AUSGANG: Record<string, string> = {
  // — Wiederaufbau und Ersatz —
  restores_capability: 'Die verlorene Fähigkeit steht wieder zur Verfügung.',
  rebuild_infrastructure: 'Die Infrastruktur wird neu aufgebaut — teurer als beim ersten Mal.',
  sustainable_rebuild: 'Ein langsamerer Aufbau, dafür schwerer zu enttarnen.',
  quick_replacement: 'Schneller Ersatz, in der Eile nachlässig zusammengesetzt.',
  fresh_start: 'Ein sauberer Neuanfang ohne Altlasten.',
  fresh_staff: 'Neue Leute rücken nach, unverbraucht und noch ohne Spur.',
  new_asset: 'Ein neuer Zugang wird erschlossen.',
  new_voice: 'Eine neue Stimme übernimmt die Rolle.',
  preserved_asset: 'Der Zugang bleibt erhalten.',
  reduced_but_functional: 'Deutlich kleiner, aber weiter einsatzfähig.',
  reduced_output: 'Die Ausbringung sinkt, der Betrieb läuft weiter.',
  reduced_human_dependency: 'Weniger Abhängigkeit von einzelnen Personen.',
  better_protection: 'Besser abgeschirmt als zuvor.',
  restored_control: 'Die Kontrolle über den Kanal ist zurück.',
  morale_restored: 'Die Stimmung im Team erholt sich.',
  loyalty_maintained: 'Die Loyalität hält — vorerst.',
  temporary_loyalty: 'Gekaufte Loyalität, die nur so lange trägt wie die Zahlung.',

  // — Ausweichen und Umsteuern —
  alternative_method: 'Der Weg wird auf ein anderes Verfahren umgelenkt.',
  pivot_audience: 'Die Ansprache wechselt zu einem anderen Milieu.',
  abandon_deepfakes: 'Das Verfahren wird aufgegeben, bevor es weiteren Schaden anrichtet.',
  quality_upgrade: 'Höhere Qualität senkt das Entdeckungsrisiko.',
  clean_break: 'Ein sauberer Schnitt — die Verbindung wird gekappt.',
  cut_losses: 'Verluste begrenzen und weitergehen.',
  evolved_message: 'Die Botschaft wird angepasst statt verteidigt.',
  controlled_narrative: 'Die Deutung bleibt in eigener Hand.',
  narrative_reframed: 'Der Rahmen der Erzählung wird verschoben.',
  survival_mode: 'Alles Nicht-Nötige wird heruntergefahren.',
  temporary_restraint: 'Vorerst Zurückhaltung, um Aufmerksamkeit abklingen zu lassen.',
  heat_reduction: 'Die Aufmerksamkeit lässt nach, wenn nichts nachgelegt wird.',
  attention_fades: 'Ohne neues Futter verliert die Geschichte an Zugkraft.',

  // — Leugnen, Ablenken, Vertuschen —
  standard_denial: 'Die übliche Linie: nichts bestätigen, nichts dementieren.',
  plausible_deniability: 'Die Verbindung bleibt bestreitbar.',
  temporary_cover: 'Die Deckung hält — eine Weile.',
  blame_third_party: 'Der Verdacht wird auf einen Dritten gelenkt.',
  misdirection: 'Die Aufmerksamkeit wandert woanders hin.',
  damage_control: 'Der Schaden wird eingedämmt, nicht behoben.',
  may_reduce_damage: 'Könnte den Schaden dämpfen — sicher ist das nicht.',
  preemptive_discredit: 'Die Quelle wird unglaubwürdig gemacht, bevor sie spricht.',
  reputation_attack: 'Ein Angriff auf den Ruf statt auf die Sache.',
  intimidation_attempt: 'Ein Einschüchterungsversuch — mit offenem Ausgang.',
  fear_compliance: 'Furcht erzwingt Folgsamkeit, nicht Überzeugung.',
  meta_conspiracy: 'Die Fälschung wird selbst zur Verschwörungserzählung umgedeutet.',
  meta_manipulation: 'Die Gegenbewegung wird von innen gesteuert.',
  buys_time: 'Gewinnt Zeit, löst nichts.',
  prepare_for_fallout: 'Vorbereitung auf das, was ohnehin kommt.',

  // — Verstärken und Riskieren —
  double_down: 'Nachlegen statt zurückziehen.',
  double_or_nothing: 'Alles auf eine Karte — Gewinn oder Totalverlust.',
  all_in_gamble: 'Die Maximaloffensive. Danach gibt es kein Zurück.',
  risky_escalation: 'Eskalation mit schwer kalkulierbarem Rückschlag.',
  desperate_measure: 'Ein Verzweiflungsschritt, der auch nach hinten losgehen kann.',
  escalation_accepted: 'Die Eskalation wird in Kauf genommen.',
  boosted_reach: 'Die Reichweite schnellt nach oben.',
  massive_amplification: 'Massive Verstärkung über alle Kanäle.',
  momentum_maintained: 'Der Schwung bleibt erhalten.',
  energizes_base: 'Die eigene Anhängerschaft wird mobilisiert.',
  organic_growth: 'Das Wachstum trägt sich von selbst.',
  unpredictable_but_organic: 'Nicht mehr steuerbar — aber gerade deshalb glaubwürdig.',

  // — Scheitern und Folgen —
  may_backfire: 'Kann nach hinten losgehen.',
  may_fail: 'Der Versuch kann misslingen.',
  may_work: 'Könnte funktionieren.',
  may_weaken_response: 'Könnte die Gegenreaktion abschwächen.',
  public_sees_through: 'Die Öffentlichkeit durchschaut das Manöver.',
  survive_but_enemies: 'Der Posten bleibt — die Gegnerschaft auch.',
  works_for_believers: 'Überzeugt die Überzeugten, sonst niemanden.',
  negotiated_de_escalation: 'Ein ausgehandelter Rückzug auf beiden Seiten.',
  redemption_arc: 'Ein Erfolg, der die eigene Stellung wiederherstellt.',

  // — Enden —
  escape_ending: 'Führt zum Ende: Flucht, bevor der Zugriff kommt.',
  damage_control_ending: 'Führt zum Ende: das Geständnis zu eigenen Bedingungen.',
  scapegoat_ending: 'Führt zum Ende: ein anderer trägt die Schuld.',
};

/**
 * Liefert den lesbaren Ausgang zu einem Bezeichner.
 * Unbekannte Bezeichner geben `undefined` — das Modal lässt die Zeile dann weg,
 * statt einen rohen Bezeichner wie `restores_capability` anzuzeigen.
 */
export function ausgangText(outcome?: string): string | undefined {
  if (!outcome) return undefined;
  return AUSGANG[outcome];
}

/** Alle bekannten Bezeichner — für die Datenwache. */
export const BEKANNTE_AUSGAENGE = Object.keys(AUSGANG);
