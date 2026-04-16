// ============================================================
// ROLL ENGINE — unified dice rolling API
// ============================================================

import { appendRollResult } from './commands.js';

function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

export function rollFormula(formula) {
  const results = [];
  let total = 0;
  const parts = formula.replace(/\s/g, '').split(/(?=[+-])/);
  for (const part of parts) {
    const diceMatch = part.match(/([+-]?\d*)d(\d+)/i);
    if (diceMatch) {
      const count = parseInt(diceMatch[1]) || 1;
      const sides = parseInt(diceMatch[2]);
      const sign = count < 0 ? -1 : 1;
      for (let i = 0; i < Math.abs(count); i++) {
        const r = rollDie(sides);
        results.push({ sides, result: r });
        total += r * sign;
      }
    } else {
      const mod = parseInt(part);
      if (!isNaN(mod)) total += mod;
    }
  }
  return { dice: results, total, formula };
}

function rollD20(rollMode) {
  const r1 = rollDie(20);
  const r2 = rollDie(20);
  let used;
  if (rollMode === 'advantage') used = Math.max(r1, r2);
  else if (rollMode === 'disadvantage') used = Math.min(r1, r2);
  else { used = r1; }
  return { roll1: r1, roll2: r2, used, isCrit: used === 20, isFumble: used === 1 };
}

export function executeRoll(params) {
  const {
    rollType, label, sourceEntityId = null,
    bonus = 0, damageFormula = null,
    rollMode = 'normal', globalMod = 0
  } = params;

  let result;

  if (rollType === 'damage') {
    const formula = damageFormula + (globalMod !== 0 ? `+${globalMod}` : '');
    const rolled = rollFormula(formula);
    result = {
      rollType, label, sourceEntityId, formula,
      dice: rolled.dice, modifiers: [],
      finalTotal: rolled.total,
      isCrit: false, isFumble: false, rollMode: 'normal',
      timestamp: Date.now(), id: crypto.randomUUID(),
    };
  } else {
    const d20Result = rollD20(rollMode);
    const totalBonus = bonus + globalMod;
    const finalTotal = d20Result.used + totalBonus;
    result = {
      rollType, label, sourceEntityId,
      formula: `d20${totalBonus >= 0 ? '+' : ''}${totalBonus}`,
      dice: [{ sides: 20, result: d20Result.used, roll1: d20Result.roll1, roll2: d20Result.roll2, rollMode }],
      modifiers: [{ label: 'bonus', value: totalBonus }],
      finalTotal,
      isCrit: d20Result.isCrit, isFumble: d20Result.isFumble, rollMode,
      timestamp: Date.now(), id: crypto.randomUUID(),
    };
  }

  appendRollResult(result);
  return result;
}

export function rollAbilityCheck(ability, modifier, rollMode, label) {
  return executeRoll({ rollType: 'ability-check', label: label || ability.toUpperCase(), bonus: modifier, rollMode });
}

export function rollSave(ability, total, rollMode) {
  return executeRoll({ rollType: 'save', label: `${ability.toUpperCase()} Save`, bonus: total, rollMode });
}

export function rollSkill(skillId, total, rollMode) {
  const label = skillId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return executeRoll({ rollType: 'skill', label, bonus: total, rollMode });
}

export function rollAttack(weapon, attackBonus, rollMode) {
  return executeRoll({
    rollType: 'attack', label: `${weapon.name} Attack`,
    sourceEntityId: weapon.id, bonus: attackBonus, rollMode,
  });
}

export function rollDamage(weapon, damageBonus, formula, versatileMode = false) {
  const baseFormula = versatileMode && weapon.versatileDamage ? weapon.versatileDamage : formula;
  const fullFormula = damageBonus !== 0 ? `${baseFormula}+${damageBonus}` : baseFormula;
  return executeRoll({
    rollType: 'damage', label: `${weapon.name} Damage`,
    sourceEntityId: weapon.id, damageFormula: fullFormula,
  });
}

export function rollDeathSave(rollMode) {
  return executeRoll({ rollType: 'death-save', label: 'Death Save', bonus: 0, rollMode });
}

export function rollHitDie(dieType, conMod) {
  return executeRoll({
    rollType: 'hit-die', label: `Hit Die (${dieType})`,
    damageFormula: `1${dieType}+${conMod}`,
  });
}
