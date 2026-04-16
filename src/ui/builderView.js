import { CLASSES } from '../engine/compendium.js';
import { SKILLS, abilityMod } from '../engine/derived.js';
import { BUILDER_STEPS, ABILITIES, ABILITY_LABELS } from '../builder/builderState.js';
import { formatBonus } from '../utils/format.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function skillStateLabel(state) {
  if (state === 'proficient') return 'Prof';
  if (state === 'expertise') return 'Exp';
  if (state === 'half') return 'Half';
  return '—';
}

export function renderBuilderView({ draft, errors, preview }) {
  const step = BUILDER_STEPS[draft.step];

  if (step.id === 'class') {
    return `
      <section class="panel-head">
        <h2>Выбор класса</h2>
        <p>Берём class defaults из compendium и сразу подставляем saving throws и spellcasting ability.</p>
      </section>
      <div class="choice-grid">
        ${CLASSES.map(cls => `
          <button class="choice ${draft.className === cls.name ? 'active' : ''}" data-action="choose-class" data-class="${escapeHtml(cls.name)}">
            <div class="choice-title">${escapeHtml(cls.name)}</div>
            <div class="choice-meta">${escapeHtml(cls.hitDie)} · saves: ${escapeHtml((cls.saveProficiencies || []).join(', '))}</div>
          </button>
        `).join('')}
      </div>
      ${errors.className ? `<div class="error">${errors.className}</div>` : ''}
    `;
  }

  if (step.id === 'species') {
    return `
      <section class="panel-head">
        <h2>Species</h2>
        <p>В твоём текущем engine нет species compendium, поэтому это обычное текстовое поле в canonical state.</p>
      </section>
      <div class="field">
        <label for="speciesInput">Species</label>
        <input id="speciesInput" data-input="species" value="${escapeHtml(draft.species)}" placeholder="Например, Elf" />
      </div>
      ${errors.species ? `<div class="error">${errors.species}</div>` : ''}
    `;
  }

  if (step.id === 'abilities') {
    return `
      <section class="panel-head">
        <h2>Ability scores</h2>
        <p>Редактируются base scores. derived модификаторы будут пересчитаны через recalculate().</p>
      </section>
      <div class="ability-list">
        ${ABILITIES.map(ability => `
          <div class="ability-row">
            <div class="ability-tag">${ABILITY_LABELS[ability]}</div>
            <button class="step-btn" data-action="score-minus" data-ability="${ability}">−</button>
            <div class="score-box">${draft.scores[ability]}</div>
            <button class="step-btn" data-action="score-plus" data-ability="${ability}">+</button>
            <div class="mod-box">${formatBonus(abilityMod(draft.scores[ability]))}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (step.id === 'details') {
    return `
      <section class="panel-head">
        <h2>Character details</h2>
        <p>Эти поля напрямую лягут в characterCore, abilities.saveProficiencies и skills.proficiencies.</p>
      </section>
      <div class="grid two">
        <div class="field">
          <label for="nameInput">Name</label>
          <input id="nameInput" data-input="name" value="${escapeHtml(draft.name)}" placeholder="Aelar" />
          ${errors.name ? `<div class="error">${errors.name}</div>` : ''}
        </div>
        <div class="field">
          <label for="backgroundInput">Background</label>
          <input id="backgroundInput" data-input="background" value="${escapeHtml(draft.background)}" placeholder="Sage" />
          ${errors.background ? `<div class="error">${errors.background}</div>` : ''}
        </div>
        <div class="field">
          <label for="alignmentInput">Alignment</label>
          <input id="alignmentInput" data-input="alignment" value="${escapeHtml(draft.alignment)}" placeholder="Neutral Good" />
        </div>
        <div class="field">
          <label for="notesInput">Notes</label>
          <input id="notesInput" data-input="notes" value="${escapeHtml(draft.notes)}" placeholder="Short note" />
        </div>
      </div>

      <section class="subhead"><h3>Saving throws</h3></section>
      <div class="save-grid">
        ${ABILITIES.map(ability => `
          <button class="toggle ${draft.saveProficiencies[ability] ? 'active' : ''}" data-action="toggle-save" data-ability="${ability}">
            <span>${ABILITY_LABELS[ability]}</span>
            <strong>${draft.saveProficiencies[ability] ? 'Prof' : '—'}</strong>
          </button>
        `).join('')}
      </div>

      <section class="subhead"><h3>Skills</h3></section>
      <div class="skill-list">
        ${SKILLS.map(skill => {
          const current = draft.skillProficiencies[skill.id] || 'none';
          return `
            <button class="skill-row" data-action="cycle-skill" data-skill="${skill.id}">
              <span>${escapeHtml(skill.id)}</span>
              <strong>${skillStateLabel(current)}</strong>
            </button>
          `;
        }).join('')}
      </div>
    `;
  }

  return `
    <section class="panel-head">
      <h2>Review</h2>
      <p>Ниже preview canonical state и derived values, уже в форме твоего engine.</p>
    </section>
    <div class="review-grid">
      <div class="review-card"><span>Class</span><strong>${escapeHtml(draft.className || '—')}</strong></div>
      <div class="review-card"><span>Species</span><strong>${escapeHtml(draft.species || '—')}</strong></div>
      <div class="review-card"><span>HP</span><strong>${preview?.state?.combat?.hp?.max ?? 0}</strong></div>
      <div class="review-card"><span>AC</span><strong>${preview?.derived?.ac ?? 0}</strong></div>
      <div class="review-card"><span>Init</span><strong>${formatBonus(preview?.derived?.initiative ?? 0)}</strong></div>
      <div class="review-card"><span>PB</span><strong>${formatBonus(preview?.derived?.proficiencyBonus ?? 0)}</strong></div>
    </div>
    <pre class="json-preview">${escapeHtml(JSON.stringify(preview, null, 2))}</pre>
  `;
}
