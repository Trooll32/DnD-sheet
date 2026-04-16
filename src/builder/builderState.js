export const BUILDER_STEPS = [
  { id: 'class', title: 'Class' },
  { id: 'species', title: 'Species' },
  { id: 'abilities', title: 'Abilities' },
  { id: 'details', title: 'Details' },
  { id: 'review', title: 'Review' },
];

export const ABILITIES = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
export const ABILITY_LABELS = {
  str: 'STR',
  dex: 'DEX',
  con: 'CON',
  int: 'INT',
  wis: 'WIS',
  cha: 'CHA',
};

export function createBuilderDraft() {
  return {
    step: 0,
    className: '',
    species: '',
    background: '',
    name: '',
    alignment: '',
    notes: '',
    spellcastingAbility: 'int',
    scores: {
      str: 15,
      dex: 14,
      con: 13,
      int: 12,
      wis: 10,
      cha: 8,
    },
    saveProficiencies: {
      str: false,
      dex: false,
      con: false,
      int: false,
      wis: false,
      cha: false,
    },
    skillProficiencies: {},
  };
}
