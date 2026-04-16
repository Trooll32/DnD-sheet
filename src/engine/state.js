// ============================================================
// STATE ENGINE — single source of truth
// ============================================================

export const SCHEMA_VERSION = 1;

/**
 * Default empty character state
 */
export function createEmptyState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    ui: {
      activeTab: 'combat',    // combat | skills | spells | inventory | features | sheet
      openDrawer: null,       // entityId or null
      rollMode: 'normal',     // normal | advantage | disadvantage | ask
    },
    settings: {
      rulesetMode: '2024',    // 2014 | 2024 | mixed
      autoDamage: false,
      critHandling: 'double-dice',
      globalAttackMod: 0,
      globalDamageMod: 0,
    },
    characterCore: {
      characterId: crypto.randomUUID(),
      name: '',
      classes: [{ name: '', subclass: '', level: 1 }],
      species: '',
      background: '',
      alignment: '',
      experience: 0,
      milestoneFlag: false,
      portrait: null,
      notes: '',
    },
    abilities: {
      scores: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      saveProficiencies: { str: false, dex: false, con: false, int: false, wis: false, cha: false },
      overrides: {},          // { 'str': 14 } — manual override
    },
    combat: {
      hp: { current: 0, max: 0, temp: 0 },
      hitDice: { total: 1, remaining: 1, dieType: 'd8' },
      initiative: { override: null },
      speed: { base: 30, override: null },
      ac: { base: 10, override: null },
      deathSaves: { successes: 0, failures: 0 },
      concentration: false,
      exhaustion: 0,
      conditions: [],         // array of condition ids
    },
    skills: {
      proficiencies: {},      // { 'athletics': 'proficient' } — none|proficient|expertise|half
      customBonuses: {},      // { 'athletics': 2 }
    },
    inventory: [],            // array of item entities
    actions: [],              // array of action entities
    weapons: [],              // array of weapon entities
    spells: {
      spellcastingAbility: 'int',
      slots: {},              // { '1': { total: 2, used: 0 }, ... }
      pactSlots: null,
      list: [],               // array of spell entities
    },
    features: [],             // array of feature entities
    effects: [],              // array of active effect objects
    compendiumCache: {},      // { [entryId]: sourceObject }
    rollHistory: [],          // array of roll result objects
    eventLog: [],             // array of domain events
  };
}
