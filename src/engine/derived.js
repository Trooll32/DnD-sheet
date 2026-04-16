// ============================================================
// DERIVED STATS CALCULATOR
// Computes all derived values from base state + effects
// ============================================================

export const ABILITY_NAMES = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

export const SKILLS = [
  { id: 'acrobatics',      ability: 'dex' },
  { id: 'animal-handling', ability: 'wis' },
  { id: 'arcana',          ability: 'int' },
  { id: 'athletics',       ability: 'str' },
  { id: 'deception',       ability: 'cha' },
  { id: 'history',         ability: 'int' },
  { id: 'insight',         ability: 'wis' },
  { id: 'intimidation',    ability: 'cha' },
  { id: 'investigation',   ability: 'int' },
  { id: 'medicine',        ability: 'wis' },
  { id: 'nature',          ability: 'int' },
  { id: 'perception',      ability: 'wis' },
  { id: 'performance',     ability: 'cha' },
  { id: 'persuasion',      ability: 'cha' },
  { id: 'religion',        ability: 'int' },
  { id: 'sleight-of-hand', ability: 'dex' },
  { id: 'stealth',         ability: 'dex' },
  { id: 'survival',        ability: 'wis' },
];

/** mod from ability score */
export function abilityMod(score) {
  return Math.floor((score - 10) / 2);
}

/** proficiency bonus from total character level */
export function proficiencyBonus(totalLevel) {
  return Math.ceil(totalLevel / 4) + 1;
}

/** total level across all classes */
export function totalLevel(classes) {
  return classes.reduce((sum, c) => sum + (c.level || 0), 0);
}

function collectEffectModifiers(effects) {
  const map = {};
  for (const effect of effects) {
    if (!effect.active) continue;
    for (const mod of (effect.modifiers || [])) {
      if (!map[mod.target]) map[mod.target] = [];
      map[mod.target].push({ source: effect.sourceLabel, value: mod.value, type: mod.type || 'add' });
    }
  }
  return map;
}

function applyMods(base, mods = []) {
  let total = base;
  const breakdown = [{ source: 'base', value: base }];
  const overrides = mods.filter(m => m.type === 'override');
  if (overrides.length > 0) {
    const best = overrides.reduce((a, b) => a.value > b.value ? a : b);
    return { total: best.value, breakdown: [{ source: best.source, value: best.value, note: 'override' }] };
  }
  for (const mod of mods) {
    total += mod.value;
    breakdown.push({ source: mod.source, value: mod.value });
  }
  return { total, breakdown };
}

export function recalculate(state) {
  const { abilities, characterCore, combat, skills, effects, weapons, spells } = state;
  const lvl = totalLevel(characterCore.classes);
  const pb = proficiencyBonus(lvl);
  const mods = collectEffectModifiers(effects);

  const abilityResults = {};
  for (const ab of ABILITY_NAMES) {
    const baseScore = abilities.overrides[ab] ?? abilities.scores[ab];
    const { total: score, breakdown } = applyMods(baseScore, mods[`ability.${ab}.score`]);
    const modifier = abilityMod(score);
    abilityResults[ab] = { score, modifier, breakdown };
  }

  const saveResults = {};
  for (const ab of ABILITY_NAMES) {
    const abMod = abilityResults[ab].modifier;
    const profBonus = abilities.saveProficiencies[ab] ? pb : 0;
    const base = abMod + profBonus;
    const { total, breakdown } = applyMods(base, mods[`save.${ab}`]);
    saveResults[ab] = { total, breakdown, proficient: abilities.saveProficiencies[ab] };
  }

  const skillResults = {};
  for (const skill of SKILLS) {
    const abMod = abilityResults[skill.ability].modifier;
    const profState = skills.proficiencies[skill.id] || 'none';
    let profBonus = 0;
    if (profState === 'proficient') profBonus = pb;
    else if (profState === 'expertise') profBonus = pb * 2;
    else if (profState === 'half') profBonus = Math.floor(pb / 2);
    const customBonus = skills.customBonuses[skill.id] || 0;
    const base = abMod + profBonus + customBonus;
    const { total, breakdown } = applyMods(base, mods[`skill.${skill.id}`]);
    skillResults[skill.id] = { total, breakdown, profState, ability: skill.ability };
  }

  const passivePerception = 10 + skillResults['perception'].total;
  const passiveInvestigation = 10 + skillResults['investigation'].total;
  const passiveInsight = 10 + skillResults['insight'].total;

  const initBase = combat.initiative.override ?? abilityResults['dex'].modifier;
  const { total: initiative } = applyMods(initBase, mods['initiative']);

  const acBase = combat.ac.override ?? combat.ac.base;
  const { total: ac, breakdown: acBreakdown } = applyMods(acBase, mods['ac']);

  const speedBase = combat.speed.override ?? combat.speed.base;
  const { total: speed } = applyMods(speedBase, mods['speed']);

  const spellAbility = spells.spellcastingAbility;
  const spellAbMod = abilityResults[spellAbility]?.modifier ?? 0;
  const spellAttackBonus = spellAbMod + pb;
  const spellSaveDC = 8 + spellAbMod + pb;

  const weaponAttacks = weapons.map(w => {
    if (!w.equipped) return { ...w, attackBonus: null, damageBonus: null };
    const govAbility = resolveWeaponAbility(w, abilityResults);
    const abMod = abilityResults[govAbility]?.modifier ?? 0;
    const profBonus = w.proficient ? pb : 0;
    const magicBonus = w.magicBonus || 0;
    const customBonus = w.customAttackBonus || 0;
    const attackBonus = abMod + profBonus + magicBonus + customBonus;
    const dmgBonus = abMod + (w.customDamageBonus || 0) + magicBonus;
    return { ...w, attackBonus, damageBonus: dmgBonus, govAbility };
  });

  return {
    proficiencyBonus: pb,
    totalLevel: lvl,
    abilities: abilityResults,
    saves: saveResults,
    skills: skillResults,
    passive: { perception: passivePerception, investigation: passiveInvestigation, insight: passiveInsight },
    initiative,
    ac,
    acBreakdown,
    speed,
    spellAttackBonus,
    spellSaveDC,
    weaponAttacks,
  };
}

function resolveWeaponAbility(weapon, abilityResults) {
  if (weapon.abilityOverride) return weapon.abilityOverride;
  if (weapon.properties?.includes('finesse')) {
    const strMod = abilityResults['str'].modifier;
    const dexMod = abilityResults['dex'].modifier;
    return dexMod >= strMod ? 'dex' : 'str';
  }
  if (weapon.weaponCategory === 'ranged') return 'dex';
  return 'str';
}
