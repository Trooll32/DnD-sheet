// ============================================================
// COMMAND BUS — all state mutations go through here
// Pattern: command -> validate -> reduce -> recalc -> log
// ============================================================

import { recalculate } from './derived.js';
import { SCHEMA_VERSION } from './state.js';

let _state = null;
let _derived = null;
const _listeners = [];

export function initStore(initialState) {
  _state = initialState;
  _derived = recalculate(_state);
}

export function getState() { return _state; }
export function getDerived() { return _derived; }

export function subscribe(fn) {
  _listeners.push(fn);
  return () => { const i = _listeners.indexOf(fn); if (i > -1) _listeners.splice(i, 1); };
}

function commit(newState, event) {
  _state = newState;
  _derived = recalculate(_state);
  if (event) {
    _state = {
      ..._state,
      eventLog: [...(_state.eventLog || []).slice(-199), {
        ...event, timestamp: Date.now(), id: crypto.randomUUID()
      }]
    };
  }
  _listeners.forEach(fn => fn(_state, _derived));
}

export function setCharacterName(name) {
  commit({ ..._state, characterCore: { ..._state.characterCore, name } });
}

export function setCharacterField(field, value) {
  commit({ ..._state, characterCore: { ..._state.characterCore, [field]: value } });
}

export function setClassLevel(index, level) {
  const classes = [..._state.characterCore.classes];
  classes[index] = { ...classes[index], level: Math.max(1, Math.min(20, level)) };
  commit({ ..._state, characterCore: { ..._state.characterCore, classes } },
    { type: 'CLASS_LEVEL_CHANGE', source: 'character-core', delta: { index, level } });
}

export function setClassName(index, name) {
  const classes = [..._state.characterCore.classes];
  classes[index] = { ...classes[index], name };
  commit({ ..._state, characterCore: { ..._state.characterCore, classes } });
}

export function setAbilityScore(ability, score) {
  const scores = { ..._state.abilities.scores, [ability]: Math.max(1, Math.min(30, score)) };
  commit({ ..._state, abilities: { ..._state.abilities, scores } },
    { type: 'ABILITY_SCORE_CHANGE', source: 'abilities', delta: { ability, score } });
}

export function toggleSaveProficiency(ability) {
  const saveProficiencies = { ..._state.abilities.saveProficiencies,
    [ability]: !_state.abilities.saveProficiencies[ability] };
  commit({ ..._state, abilities: { ..._state.abilities, saveProficiencies } });
}

export function setSkillProficiency(skillId, state) {
  const proficiencies = { ..._state.skills.proficiencies, [skillId]: state };
  commit({ ..._state, skills: { ..._state.skills, proficiencies } });
}

export function applyDamage(amount) {
  const { current, temp } = _state.combat.hp;
  let newTemp = temp;
  let newCurrent = current;
  if (temp > 0) {
    const tempUsed = Math.min(temp, amount);
    newTemp = temp - tempUsed;
    amount -= tempUsed;
  }
  newCurrent = Math.max(0, current - amount);
  const hp = { ..._state.combat.hp, current: newCurrent, temp: newTemp };
  commit({ ..._state, combat: { ..._state.combat, hp } },
    { type: 'HP_CHANGE', source: 'combat', delta: { before: current, after: newCurrent, tempBefore: temp, tempAfter: newTemp } });
}

export function applyHealing(amount) {
  const { current, max } = _state.combat.hp;
  const newCurrent = Math.min(max, current + amount);
  const hp = { ..._state.combat.hp, current: newCurrent };
  commit({ ..._state, combat: { ..._state.combat, hp } },
    { type: 'HP_CHANGE', source: 'heal', delta: { before: current, after: newCurrent } });
}

export function applyTempHP(amount) {
  const newTemp = Math.max(_state.combat.hp.temp, amount);
  const hp = { ..._state.combat.hp, temp: newTemp };
  commit({ ..._state, combat: { ..._state.combat, hp } });
}

export function setMaxHP(max) {
  const hp = { ..._state.combat.hp, max, current: Math.min(_state.combat.hp.current, max) };
  commit({ ..._state, combat: { ..._state.combat, hp } });
}

export function toggleConcentration() {
  commit({ ..._state, combat: { ..._state.combat, concentration: !_state.combat.concentration } });
}

export function toggleCondition(conditionId) {
  const conditions = _state.combat.conditions.includes(conditionId)
    ? _state.combat.conditions.filter(c => c !== conditionId)
    : [..._state.combat.conditions, conditionId];
  commit({ ..._state, combat: { ..._state.combat, conditions } },
    { type: 'CONDITION_TOGGLE', source: 'combat', delta: { conditionId, active: conditions.includes(conditionId) } });
}

export function tickDeathSave(type) {
  const ds = { ..._state.combat.deathSaves };
  if (type === 'success') ds.successes = Math.min(3, ds.successes + 1);
  else ds.failures = Math.min(3, ds.failures + 1);
  commit({ ..._state, combat: { ..._state.combat, deathSaves: ds } });
}

export function resetDeathSaves() {
  commit({ ..._state, combat: { ..._state.combat, deathSaves: { successes: 0, failures: 0 } } });
}

export function addWeapon(weapon) {
  const entry = { ...weapon, id: weapon.id || crypto.randomUUID(), equipped: weapon.equipped ?? true };
  commit({ ..._state, weapons: [..._state.weapons, entry] },
    { type: 'WEAPON_ADDED', source: 'weapons', delta: { id: entry.id, name: entry.name } });
}

export function updateWeapon(id, patch) {
  const weapons = _state.weapons.map(w => w.id === id ? { ...w, ...patch } : w);
  commit({ ..._state, weapons },
    { type: 'WEAPON_UPDATED', source: 'weapons', delta: { id } });
}

export function removeWeapon(id) {
  commit({ ..._state, weapons: _state.weapons.filter(w => w.id !== id) },
    { type: 'WEAPON_REMOVED', source: 'weapons', delta: { id } });
}

export function toggleEquipped(id) {
  const weapons = _state.weapons.map(w => w.id === id ? { ...w, equipped: !w.equipped } : w);
  commit({ ..._state, weapons },
    { type: 'WEAPON_EQUIPPED_TOGGLE', source: 'weapons', delta: { id } });
}

export function appendRollResult(result) {
  const rollHistory = [...(_state.rollHistory || []).slice(-99), result];
  commit({ ..._state, rollHistory });
}

export function setActiveTab(tab) {
  commit({ ..._state, ui: { ..._state.ui, activeTab: tab } });
}

export function setRollMode(mode) {
  commit({ ..._state, ui: { ..._state.ui, rollMode: mode } });
}

export function exportCharacter() {
  return JSON.stringify(_state, null, 2);
}

export function importCharacter(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.schemaVersion) throw new Error('Missing schemaVersion');
    if (parsed.schemaVersion !== SCHEMA_VERSION) {
      console.warn(`Schema mismatch: file v${parsed.schemaVersion}, app v${SCHEMA_VERSION}`);
    }
    commit(parsed, { type: 'CHARACTER_IMPORTED', source: 'persistence' });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export function saveToLocalStorage() {
  try { localStorage.setItem('dnd-sheet-state', exportCharacter()); } catch {}
}

export function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem('dnd-sheet-state');
    if (!raw) return false;
    const result = importCharacter(raw);
    return result.ok;
  } catch { return false; }
}
