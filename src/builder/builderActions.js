import { CLASSES } from '../engine/compendium.js';

export function setDraftField(draft, field, value) {
  return { ...draft, [field]: value };
}

export function setDraftScore(draft, ability, score) {
  return {
    ...draft,
    scores: {
      ...draft.scores,
      [ability]: Math.max(1, Math.min(30, score)),
    },
  };
}

export function changeDraftScore(draft, ability, delta) {
  return setDraftScore(draft, ability, (draft.scores[ability] || 10) + delta);
}

export function toggleDraftSave(draft, ability) {
  return {
    ...draft,
    saveProficiencies: {
      ...draft.saveProficiencies,
      [ability]: !draft.saveProficiencies[ability],
    },
  };
}

export function cycleSkillState(current = 'none') {
  if (current === 'none') return 'proficient';
  if (current === 'proficient') return 'expertise';
  if (current === 'expertise') return 'half';
  return 'none';
}

export function cycleDraftSkill(draft, skillId) {
  return {
    ...draft,
    skillProficiencies: {
      ...draft.skillProficiencies,
      [skillId]: cycleSkillState(draft.skillProficiencies[skillId] || 'none'),
    },
  };
}

export function applyClassDefaults(draft) {
  const cls = CLASSES.find(c => c.name === draft.className);
  if (!cls) return draft;

  const hitDieValue = Number(String(cls.hitDie || 'd8').replace('d', '')) || 8;
  const spellcastingAbility = cls.spellcastingAbility || draft.spellcastingAbility;

  const saveProficiencies = { str: false, dex: false, con: false, int: false, wis: false, cha: false };
  for (const ability of cls.saveProficiencies || []) saveProficiencies[ability] = true;

  return {
    ...draft,
    saveProficiencies,
    spellcastingAbility,
    hitDieValue,
  };
}
