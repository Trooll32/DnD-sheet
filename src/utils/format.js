// ============================================================
// FORMAT UTILS
// ============================================================

export function formatBonus(n) {
  return n >= 0 ? `+${n}` : `${n}`;
}

export function formatSkillName(id) {
  return id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function formatAbilityName(id) {
  const map = { str: 'Strength', dex: 'Dexterity', con: 'Constitution', int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma' };
  return map[id] || id.toUpperCase();
}

export function formatAbilityShort(id) {
  return id.toUpperCase();
}

export function formatRollType(type) {
  const map = {
    'ability-check': 'Ability Check', 'save': 'Saving Throw', 'skill': 'Skill Check',
    'attack': 'Attack Roll', 'spell-attack': 'Spell Attack', 'damage': 'Damage',
    'death-save': 'Death Save', 'hit-die': 'Hit Die', 'custom': 'Custom Roll'
  };
  return map[type] || type;
}

export function timeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return `${Math.floor(diff / 3600000)}h ago`;
}
