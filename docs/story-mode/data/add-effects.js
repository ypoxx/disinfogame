#!/usr/bin/env node
/**
 * Fügt effects zu allen Aktionen in actions_continued.json hinzu
 * basierend auf Tags, Legalität und Kosten
 */

const fs = require('fs');

// Lade Datei
const continued = JSON.parse(fs.readFileSync('./actions_continued.json', 'utf8'));

// Effect-Generator basierend auf Tags und Eigenschaften
function generateEffects(action) {
  const effects = {};
  const tags = action.tags || [];
  const costs = action.costs || {};
  const legality = action.legality;

  // Basis-Effekte basierend auf Tags
  if (tags.includes('content')) {
    effects.content_quality = 0.1 + Math.random() * 0.15;
  }

  if (tags.includes('viral')) {
    effects.virality_boost = 0.2 + Math.random() * 0.2;
  }

  if (tags.includes('emotional')) {
    effects.emotional_impact = 0.3 + Math.random() * 0.2;
  }

  if (tags.includes('ai') || tags.includes('deepfake')) {
    effects.detection_difficulty = 0.2 + Math.random() * 0.3;
  }

  if (tags.includes('infrastructure')) {
    effects.infrastructure_boost = 1;
  }

  if (tags.includes('network')) {
    effects.network_reach = 0.15 + Math.random() * 0.15;
  }

  if (tags.includes('amplification')) {
    effects.reach_multiplier = 1.2 + Math.random() * 0.5;
  }

  if (tags.includes('bot') || tags.includes('automation')) {
    effects.automation_level = 0.3 + Math.random() * 0.4;
  }

  if (tags.includes('targeting')) {
    effects.targeting_precision = 0.2 + Math.random() * 0.2;
  }

  if (tags.includes('disinformation')) {
    effects.trust_erosion = 0.1 + Math.random() * 0.2;
  }

  if (tags.includes('conspiracy')) {
    effects.polarization = 0.15 + Math.random() * 0.15;
  }

  if (tags.includes('influence')) {
    effects.influence_gain = 0.2 + Math.random() * 0.2;
  }

  if (tags.includes('politics') || tags.includes('lobbying')) {
    effects.political_leverage = 0.1 + Math.random() * 0.2;
  }

  if (tags.includes('recruitment')) {
    effects.asset_acquisition = true;
  }

  if (tags.includes('division') || tags.includes('polarization')) {
    effects.social_division = 0.15 + Math.random() * 0.15;
  }

  if (tags.includes('economic')) {
    effects.economic_impact = 0.1 + Math.random() * 0.2;
  }

  if (tags.includes('attack') || tags.includes('harassment')) {
    effects.target_damage = 0.2 + Math.random() * 0.3;
  }

  if (tags.includes('impersonation')) {
    effects.credibility_theft = 0.25 + Math.random() * 0.2;
  }

  if (tags.includes('platform')) {
    effects.platform_presence = true;
  }

  // Legalitäts-basierte Effekte
  if (legality === 'illegal') {
    effects.effectiveness_boost = 0.15 + Math.random() * 0.15;
    effects.backlash_risk = 0.1 + Math.random() * 0.2;
  } else if (legality === 'grey') {
    effects.deniability = 0.3 + Math.random() * 0.2;
  } else {
    effects.sustainability = 0.4 + Math.random() * 0.2;
  }

  // Kosten-basierte Effekte (höhere Kosten = stärkere Effekte)
  const totalCost = (costs.budget || 0) + (costs.capacity || 0) * 2 + (costs.risk || 0);
  if (totalCost > 10) {
    effects.impact_scale = 'high';
  } else if (totalCost > 5) {
    effects.impact_scale = 'medium';
  } else {
    effects.impact_scale = 'low';
  }

  // Runden aller Zahlen auf 2 Dezimalstellen
  Object.keys(effects).forEach(key => {
    if (typeof effects[key] === 'number') {
      effects[key] = Math.round(effects[key] * 100) / 100;
    }
  });

  return effects;
}

// Alle Phasen durchgehen
const phases = [
  'actions_phase3',
  'actions_phase4',
  'actions_phase5',
  'actions_phase6_politics',
  'actions_phase7_society',
  'actions_phase8_targeting'
];

let added = 0;
let skipped = 0;

phases.forEach(phaseName => {
  const actions = continued[phaseName];
  if (!actions) return;

  actions.forEach(action => {
    if (!action.effects) {
      action.effects = generateEffects(action);
      added++;
    } else {
      skipped++;
    }
  });
});

// Speichern
fs.writeFileSync('./actions_continued.json', JSON.stringify(continued, null, 2), 'utf8');

console.log('Effects hinzugefügt: ' + added);
console.log('Bereits vorhanden (übersprungen): ' + skipped);
console.log('Datei aktualisiert: actions_continued.json');
