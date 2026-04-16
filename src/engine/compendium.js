// ============================================================
// COMPENDIUM — embedded starter data
// ============================================================

export const WEAPONS_COMPENDIUM = [
  { id: 'dagger',        name: 'Dagger',         weaponCategory: 'melee',  damageFormula: '1d4', damageType: 'piercing',    properties: ['finesse', 'light', 'thrown'], range: '20/60' },
  { id: 'shortsword',    name: 'Shortsword',      weaponCategory: 'melee',  damageFormula: '1d6', damageType: 'piercing',    properties: ['finesse', 'light'] },
  { id: 'longsword',     name: 'Longsword',       weaponCategory: 'melee',  damageFormula: '1d8', versatileDamage: '1d10',  damageType: 'slashing',   properties: ['versatile'] },
  { id: 'greatsword',    name: 'Greatsword',      weaponCategory: 'melee',  damageFormula: '2d6', damageType: 'slashing',   properties: ['heavy', 'two-handed'] },
  { id: 'handaxe',       name: 'Handaxe',         weaponCategory: 'melee',  damageFormula: '1d6', damageType: 'slashing',   properties: ['light', 'thrown'], range: '20/60' },
  { id: 'battleaxe',     name: 'Battleaxe',       weaponCategory: 'melee',  damageFormula: '1d8', versatileDamage: '1d10',  damageType: 'slashing',   properties: ['versatile'] },
  { id: 'rapier',        name: 'Rapier',          weaponCategory: 'melee',  damageFormula: '1d8', damageType: 'piercing',   properties: ['finesse'] },
  { id: 'mace',          name: 'Mace',            weaponCategory: 'melee',  damageFormula: '1d6', damageType: 'bludgeoning',properties: [] },
  { id: 'quarterstaff',  name: 'Quarterstaff',    weaponCategory: 'melee',  damageFormula: '1d6', versatileDamage: '1d8',   damageType: 'bludgeoning',properties: ['versatile'] },
  { id: 'greatclub',     name: 'Greatclub',       weaponCategory: 'melee',  damageFormula: '1d8', damageType: 'bludgeoning',properties: ['two-handed'] },
  { id: 'spear',         name: 'Spear',           weaponCategory: 'melee',  damageFormula: '1d6', versatileDamage: '1d8',   damageType: 'piercing',   properties: ['thrown', 'versatile'], range: '20/60' },
  { id: 'shortbow',      name: 'Shortbow',        weaponCategory: 'ranged', damageFormula: '1d6', damageType: 'piercing',   properties: ['two-handed'], range: '80/320' },
  { id: 'longbow',       name: 'Longbow',         weaponCategory: 'ranged', damageFormula: '1d8', damageType: 'piercing',   properties: ['heavy', 'two-handed'], range: '150/600' },
  { id: 'hand-crossbow', name: 'Hand Crossbow',   weaponCategory: 'ranged', damageFormula: '1d6', damageType: 'piercing',   properties: ['light'], range: '30/120' },
  { id: 'light-crossbow',name: 'Light Crossbow',  weaponCategory: 'ranged', damageFormula: '1d8', damageType: 'piercing',   properties: ['two-handed'], range: '80/320' },
  { id: 'unarmed',       name: 'Unarmed Strike',  weaponCategory: 'melee',  damageFormula: '1',   damageType: 'bludgeoning',properties: [] },
];

export function searchWeapons(query) {
  if (!query) return WEAPONS_COMPENDIUM;
  const q = query.toLowerCase();
  return WEAPONS_COMPENDIUM.filter(w => w.name.toLowerCase().includes(q));
}

export function getWeaponById(id) {
  return WEAPONS_COMPENDIUM.find(w => w.id === id) || null;
}

export const CLASSES = [
  { name: 'Barbarian',  hitDie: 'd12', saveProficiencies: ['str', 'con'] },
  { name: 'Bard',       hitDie: 'd8',  saveProficiencies: ['dex', 'cha'], spellcastingAbility: 'cha' },
  { name: 'Cleric',     hitDie: 'd8',  saveProficiencies: ['wis', 'cha'], spellcastingAbility: 'wis' },
  { name: 'Druid',      hitDie: 'd8',  saveProficiencies: ['int', 'wis'], spellcastingAbility: 'wis' },
  { name: 'Fighter',    hitDie: 'd10', saveProficiencies: ['str', 'con'] },
  { name: 'Monk',       hitDie: 'd8',  saveProficiencies: ['str', 'dex'] },
  { name: 'Paladin',    hitDie: 'd10', saveProficiencies: ['wis', 'cha'], spellcastingAbility: 'cha' },
  { name: 'Ranger',     hitDie: 'd10', saveProficiencies: ['str', 'dex'], spellcastingAbility: 'wis' },
  { name: 'Rogue',      hitDie: 'd8',  saveProficiencies: ['dex', 'int'] },
  { name: 'Sorcerer',   hitDie: 'd6',  saveProficiencies: ['con', 'cha'], spellcastingAbility: 'cha' },
  { name: 'Warlock',    hitDie: 'd8',  saveProficiencies: ['wis', 'cha'], spellcastingAbility: 'cha' },
  { name: 'Wizard',     hitDie: 'd6',  saveProficiencies: ['int', 'wis'], spellcastingAbility: 'int' },
  { name: 'Artificer',  hitDie: 'd8',  saveProficiencies: ['con', 'int'], spellcastingAbility: 'int' },
];

export const SPECIES = [
  { name: 'Human', size: 'M', speed: 30 },
  { name: 'Dwarf', size: 'M', speed: 30 },
  { name: 'Elf', size: 'M', speed: 30 },
  { name: 'Halfling', size: 'S', speed: 30 },
  { name: 'Dragonborn', size: 'M', speed: 30 },
  { name: 'Gnome', size: 'S', speed: 30 },
  { name: 'Half-Elf', size: 'M', speed: 30 },
  { name: 'Half-Orc', size: 'M', speed: 30 },
  { name: 'Tiefling', size: 'M', speed: 30 },
];

export const BACKGROUNDS = [
  { name: 'Acolyte' },
  { name: 'Criminal' },
  { name: 'Folk Hero' },
  { name: 'Noble' },
  { name: 'Sage' },
  { name: 'Soldier' },
];

export const SKILLS = [
  { id: 'athletics', name: 'Athletics', ability: 'str' },
  { id: 'acrobatics', name: 'Acrobatics', ability: 'dex' },
  { id: 'sleightOfHand', name: 'Sleight of Hand', ability: 'dex' },
  { id: 'stealth', name: 'Stealth', ability: 'dex' },
  { id: 'arcana', name: 'Arcana', ability: 'int' },
  { id: 'history', name: 'History', ability: 'int' },
  { id: 'investigation', name: 'Investigation', ability: 'int' },
  { id: 'nature', name: 'Nature', ability: 'int' },
  { id: 'religion', name: 'Religion', ability: 'int' },
  { id: 'animalHandling', name: 'Animal Handling', ability: 'wis' },
  { id: 'insight', name: 'Insight', ability: 'wis' },
  { id: 'medicine', name: 'Medicine', ability: 'wis' },
  { id: 'perception', name: 'Perception', ability: 'wis' },
  { id: 'survival', name: 'Survival', ability: 'wis' },
  { id: 'deception', name: 'Deception', ability: 'cha' },
  { id: 'intimidation', name: 'Intimidation', ability: 'cha' },
  { id: 'performance', name: 'Performance', ability: 'cha' },
  { id: 'persuasion', name: 'Persuasion', ability: 'cha' },
];
