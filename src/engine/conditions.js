// ============================================================
// CONDITIONS ENGINE
// ============================================================

export const CONDITIONS = {
  blinded:       { id: 'blinded',       label: 'Blinded',       icon: '👁️',  flags: { attackDisadvantage: true, attacksAgainstAdvantage: true },        description: 'Auto-fails sight checks. Attack rolls at disadvantage, attacks against at advantage.' },
  charmed:       { id: 'charmed',       label: 'Charmed',       icon: '💕',  flags: {},                                                                  description: "Can't attack charmer. Charmer has advantage on social checks." },
  deafened:      { id: 'deafened',      label: 'Deafened',      icon: '👂',  flags: {},                                                                  description: 'Auto-fails hearing checks.' },
  exhaustion:    { id: 'exhaustion',    label: 'Exhaustion',    icon: '💤',  flags: {},                                                                  description: 'Tracked separately via exhaustion level.' },
  frightened:    { id: 'frightened',    label: 'Frightened',    icon: '😨',  flags: { attackDisadvantage: true, checkDisadvantage: true },                description: 'Disadvantage on ability checks and attacks while source is in sight. Cannot move closer.' },
  grappled:      { id: 'grappled',      label: 'Grappled',      icon: '🤜',  flags: { speedZero: true },                                                 description: 'Speed becomes 0.' },
  incapacitated: { id: 'incapacitated', label: 'Incapacitated', icon: '🚫',  flags: { noActions: true, noReactions: true },                              description: "Can't take actions or reactions." },
  invisible:     { id: 'invisible',     label: 'Invisible',     icon: '👻',  flags: { attackAdvantage: true, attacksAgainstDisadvantage: true },          description: 'Attack rolls at advantage, attacks against at disadvantage.' },
  paralyzed:     { id: 'paralyzed',     label: 'Paralyzed',     icon: '⚡',  flags: { incapacitated: true, autoFailStrSave: true, autoFailDexSave: true, speedZero: true, attacksAgainstAdvantage: true, autoAttackCritIfClose: true }, description: 'Incapacitated. Auto-fail STR/DEX saves. Attacks against at advantage. Auto-crit if within 5ft.' },
  petrified:     { id: 'petrified',     label: 'Petrified',     icon: '🗿',  flags: { incapacitated: true, speedZero: true, autoFailStrSave: true, autoFailDexSave: true, resistAllDamage: true }, description: 'Incapacitated, speed 0. Auto-fail STR/DEX saves. Resistant to all damage.' },
  poisoned:      { id: 'poisoned',      label: 'Poisoned',      icon: '🤢',  flags: { attackDisadvantage: true, checkDisadvantage: true },                description: 'Disadvantage on attack rolls and ability checks.' },
  prone:         { id: 'prone',         label: 'Prone',         icon: '⬇️',  flags: { attackDisadvantage: true, attacksAgainstAdvantage: 'melee', attacksAgainstDisadvantage: 'ranged' }, description: 'Melee attacks against at advantage. Ranged attacks against at disadvantage.' },
  restrained:    { id: 'restrained',    label: 'Restrained',    icon: '⛓️',  flags: { speedZero: true, attackDisadvantage: true, dexSaveDisadvantage: true, attacksAgainstAdvantage: true }, description: 'Speed 0. Disadvantage on attacks and DEX saves. Attacks against at advantage.' },
  stunned:       { id: 'stunned',       label: 'Stunned',       icon: '💫',  flags: { incapacitated: true, speedZero: true, autoFailStrSave: true, autoFailDexSave: true, attacksAgainstAdvantage: true }, description: 'Incapacitated, speed 0. Auto-fail STR/DEX saves. Attacks against at advantage.' },
  unconscious:   { id: 'unconscious',   label: 'Unconscious',   icon: '😵',  flags: { incapacitated: true, speedZero: true, autoFailStrSave: true, autoFailDexSave: true, attacksAgainstAdvantage: true, autoAttackCritIfClose: true }, description: 'Incapacitated, speed 0. Auto-fail STR/DEX saves. Attacks against at advantage. Auto-crit if within 5ft.' },
  concentration: { id: 'concentration', label: 'Concentrating', icon: '🧠',  flags: {},                                                                  description: 'Maintaining concentration on a spell.' },
};

export function getActiveConditionFlags(conditions) {
  const flags = {};
  for (const condId of conditions) {
    const cond = CONDITIONS[condId];
    if (!cond) continue;
    Object.assign(flags, cond.flags);
  }
  return flags;
}
