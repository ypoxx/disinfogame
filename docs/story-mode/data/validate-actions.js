#!/usr/bin/env node
/**
 * Validierungs-Script für Story Mode Aktionen
 *
 * Prüft:
 * - Alle Aktionen haben erforderliche Felder
 * - Prerequisites verweisen auf existierende Aktionen
 * - Unlocks verweisen auf existierende Aktionen
 * - NPC-Affinitäten sind gültig
 * - Keine ID-Duplikate
 */

const fs = require('fs');
const path = require('path');

// Lade Dateien
const actionsFile = JSON.parse(fs.readFileSync(path.join(__dirname, 'actions.json'), 'utf8'));
const actionsContinued = JSON.parse(fs.readFileSync(path.join(__dirname, 'actions_continued.json'), 'utf8'));

// Sammle alle Aktionen
const allActions = [
  ...actionsFile.actions,
  ...actionsContinued.actions_phase3,
  ...actionsContinued.actions_phase4,
  ...actionsContinued.actions_phase5,
  ...actionsContinued.actions_phase6_politics,
  ...actionsContinued.actions_phase7_society,
  ...actionsContinued.actions_phase8_targeting,
];

// Gültige Werte
const VALID_NPCS = ['direktor', 'marina', 'volkov', 'katja', 'igor'];
const VALID_PHASES = ['ta01', 'ta02', 'ta03', 'ta04', 'ta05', 'ta06', 'ta07', 'targeting'];
const VALID_LEGALITY = ['legal', 'grey', 'illegal'];
const REQUIRED_FIELDS = ['id', 'phase', 'label_de', 'costs', 'npc_affinity', 'legality', 'tags'];

// Ergebnisse
const errors = [];
const warnings = [];
const stats = {
  total: allActions.length,
  byPhase: {},
  byLegality: {},
  withPrerequisites: 0,
  withUnlocks: 0,
  withDisarmRef: 0,
  withMoralWeight: 0,
};

// Alle IDs sammeln
const actionIds = new Set(allActions.map(a => a.id));

// Validierung
allActions.forEach((action, index) => {
  // Erforderliche Felder prüfen
  REQUIRED_FIELDS.forEach(field => {
    if (action[field] === undefined) {
      errors.push(`[${action.id || `Index ${index}`}] Fehlendes Feld: ${field}`);
    }
  });

  // ID-Format prüfen
  if (action.id && !/^\d+\.\d+$/.test(action.id)) {
    warnings.push(`[${action.id}] Ungewöhnliches ID-Format`);
  }

  // Phase prüfen
  if (action.phase && !VALID_PHASES.includes(action.phase)) {
    errors.push(`[${action.id}] Ungültige Phase: ${action.phase}`);
  } else if (action.phase) {
    stats.byPhase[action.phase] = (stats.byPhase[action.phase] || 0) + 1;
  }

  // Legalität prüfen
  if (action.legality && !VALID_LEGALITY.includes(action.legality)) {
    errors.push(`[${action.id}] Ungültige Legalität: ${action.legality}`);
  } else if (action.legality) {
    stats.byLegality[action.legality] = (stats.byLegality[action.legality] || 0) + 1;
  }

  // NPC-Affinitäten prüfen
  if (action.npc_affinity) {
    action.npc_affinity.forEach(npc => {
      if (!VALID_NPCS.includes(npc)) {
        errors.push(`[${action.id}] Ungültiger NPC: ${npc}`);
      }
    });
  }

  // Prerequisites prüfen
  if (action.prerequisites && action.prerequisites.length > 0) {
    stats.withPrerequisites++;
    action.prerequisites.forEach(prereq => {
      if (!actionIds.has(prereq)) {
        errors.push(`[${action.id}] Prerequisite verweist auf nicht-existierende Aktion: ${prereq}`);
      }
    });
  }

  // Unlocks prüfen
  if (action.unlocks && action.unlocks.length > 0) {
    stats.withUnlocks++;
    action.unlocks.forEach(unlock => {
      if (!actionIds.has(unlock)) {
        errors.push(`[${action.id}] Unlock verweist auf nicht-existierende Aktion: ${unlock}`);
      }
    });
  }

  // DISARM-Referenz prüfen
  if (action.disarm_ref) {
    stats.withDisarmRef++;
  }

  // Moralische Last prüfen
  if (action.costs && action.costs.moral_weight) {
    stats.withMoralWeight++;
  }

  // Fehlende optionale Felder (Warnungen)
  if (!action.narrative_de) {
    warnings.push(`[${action.id}] Fehlendes Feld: narrative_de`);
  }
  if (!action.effects) {
    warnings.push(`[${action.id}] Fehlendes Feld: effects`);
  }
});

// ID-Duplikate prüfen
const idCounts = {};
allActions.forEach(a => {
  idCounts[a.id] = (idCounts[a.id] || 0) + 1;
});
Object.entries(idCounts).forEach(([id, count]) => {
  if (count > 1) {
    errors.push(`ID-Duplikat: ${id} (${count}x)`);
  }
});

// Ausgabe
console.log('=== STORY MODE ACTIONS VALIDATION ===\n');

console.log('📊 STATISTIKEN:');
console.log(`   Gesamt: ${stats.total} Aktionen`);
console.log('\n   Nach Phase:');
Object.entries(stats.byPhase).sort().forEach(([phase, count]) => {
  console.log(`     ${phase}: ${count}`);
});
console.log('\n   Nach Legalität:');
Object.entries(stats.byLegality).forEach(([legality, count]) => {
  console.log(`     ${legality}: ${count}`);
});
console.log(`\n   Mit Prerequisites: ${stats.withPrerequisites}`);
console.log(`   Mit Unlocks: ${stats.withUnlocks}`);
console.log(`   Mit DISARM-Referenz: ${stats.withDisarmRef}`);
console.log(`   Mit moralischer Last: ${stats.withMoralWeight}`);

if (errors.length > 0) {
  console.log('\n❌ FEHLER:');
  errors.forEach(e => console.log(`   ${e}`));
}

if (warnings.length > 0) {
  console.log('\n⚠️  WARNUNGEN:');
  warnings.forEach(w => console.log(`   ${w}`));
}

console.log('\n=== VALIDIERUNG ABGESCHLOSSEN ===');
console.log(`${errors.length} Fehler, ${warnings.length} Warnungen`);

process.exit(errors.length > 0 ? 1 : 0);
