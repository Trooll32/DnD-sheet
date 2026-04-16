import { createEmptyState } from '../engine/state.js';
import { recalculate } from '../engine/derived.js';
import { CLASSES } from '../engine/compendium.js';

export function finalizeBuilderDraft(draft) {
  const state = createEmptyState();
  const selectedClass = CLASSES.find(c => c.name === draft.className);
  const hitDie = selectedClass?.hitDie || 'd8';
  const hitDieValue = Number(String(hitDie).replace('d', '')) || 8;
  const conMod = Math.floor(((draft.scores.con || 10) - 10) / 2);
  const dexMod = Math.floor(((draft.scores.dex || 10) - 10) / 2);

  state.characterCore.name = draft.name;
  state.characterCore.species = draft.species;
  state.characterCore.background = draft.background;
  state.characterCore.alignment = draft.alignment;
  state.characterCore.notes = draft.notes;
  state.characterCore.classes = [{
    name: draft.className,
    subclass: '',
    level: 1,
  }];

  state.abilities.scores = { ...draft.scores };
  state.abilities.saveProficiencies = { ...draft.saveProficiencies };

  state.skills.proficiencies = Object.fromEntries(
    Object.entries(draft.skillProficiencies).filter(([, value]) => value && value !== 'none')
  );

  state.combat.hitDice = {
    total: 1,
    remaining: 1,
    dieType: hitDie,
  };

  state.combat.hp.max = Math.max(1, hitDieValue + conMod);
  state.combat.hp.current = state.combat.hp.max;
  state.combat.hp.temp = 0;
  state.combat.ac.base = 10 + dexMod;
  state.combat.speed.base = 30;

  state.spells.spellcastingAbility = selectedClass?.spellcastingAbility || draft.spellcastingAbility || 'int';

  const derived = recalculate(state);
  return { state, derived };
}
