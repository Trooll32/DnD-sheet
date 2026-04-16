import { initStore, importCharacter } from '../engine/commands.js';
import { createBuilderDraft, BUILDER_STEPS } from '../builder/builderState.js';
import { setDraftField, changeDraftScore, toggleDraftSave, cycleDraftSkill, applyClassDefaults } from '../builder/builderActions.js';
import { validateBuilderStep } from '../builder/builderValidators.js';
import { finalizeBuilderDraft } from '../builder/finalizeCharacter.js';
import { renderBuilderView } from './builderView.js';

const appState = {
  draft: createBuilderDraft(),
  preview: finalizeBuilderDraft(createBuilderDraft()),
};

export function mountBuilderApp(root) {
  function getErrors() {
    const step = BUILDER_STEPS[appState.draft.step];
    return validateBuilderStep(step.id, appState.draft);
  }

  function syncPreview() {
    appState.preview = finalizeBuilderDraft(appState.draft);
  }

  function render() {
    syncPreview();
    const errors = getErrors();
    const step = BUILDER_STEPS[appState.draft.step];
    const isLast = appState.draft.step === BUILDER_STEPS.length - 1;

    root.innerHTML = `
      <div class="builder-shell">
        <header class="builder-top">
          <div>
            <div class="eyebrow">Pocket Builder</div>
            <h1>DnD Character Builder</h1>
            <p>Builder поверх твоего engine state.</p>
          </div>
          <div class="progress-meta">Шаг ${appState.draft.step + 1} / ${BUILDER_STEPS.length} · ${step.title}</div>
          <div class="progress-track"><div class="progress-fill" style="width:${((appState.draft.step + 1) / BUILDER_STEPS.length) * 100}%"></div></div>
        </header>

        <section class="builder-mini">
          <div><span>Class</span><strong>${appState.draft.className || '—'}</strong></div>
          <div><span>HP</span><strong>${appState.preview.state.combat.hp.max}</strong></div>
          <div><span>AC</span><strong>${appState.preview.derived.ac}</strong></div>
          <div><span>Init</span><strong>${appState.preview.derived.initiative >= 0 ? '+' : ''}${appState.preview.derived.initiative}</strong></div>
        </section>

        <section class="builder-panel">
          ${renderBuilderView({ draft: appState.draft, errors, preview: appState.preview })}
        </section>

        <footer class="builder-footer">
          <button class="btn secondary" id="backBtn" ${appState.draft.step === 0 ? 'disabled' : ''}>Назад</button>
          <button class="btn primary" id="nextBtn">${isLast ? 'Импортировать в store' : 'Далее'}</button>
        </footer>
      </div>
    `;

    root.querySelectorAll('[data-class]').forEach(node => {
      node.addEventListener('click', () => {
        appState.draft = applyClassDefaults(setDraftField(appState.draft, 'className', node.dataset.class));
        render();
      });
    });

    root.querySelectorAll('[data-input]').forEach(node => {
      node.addEventListener('input', (e) => {
        appState.draft = setDraftField(appState.draft, node.dataset.input, e.target.value);
      });
      node.addEventListener('change', (e) => {
        appState.draft = setDraftField(appState.draft, node.dataset.input, e.target.value);
        render();
      });
    });

    root.querySelectorAll('[data-action="score-minus"]').forEach(node => {
      node.addEventListener('click', () => {
        appState.draft = changeDraftScore(appState.draft, node.dataset.ability, -1);
        render();
      });
    });

    root.querySelectorAll('[data-action="score-plus"]').forEach(node => {
      node.addEventListener('click', () => {
        appState.draft = changeDraftScore(appState.draft, node.dataset.ability, 1);
        render();
      });
    });

    root.querySelectorAll('[data-action="toggle-save"]').forEach(node => {
      node.addEventListener('click', () => {
        appState.draft = toggleDraftSave(appState.draft, node.dataset.ability);
        render();
      });
    });

    root.querySelectorAll('[data-action="cycle-skill"]').forEach(node => {
      node.addEventListener('click', () => {
        appState.draft = cycleDraftSkill(appState.draft, node.dataset.skill);
        render();
      });
    });

    root.querySelector('#backBtn')?.addEventListener('click', () => {
      if (appState.draft.step === 0) return;
      appState.draft = setDraftField(appState.draft, 'step', appState.draft.step - 1);
      render();
    });

    root.querySelector('#nextBtn')?.addEventListener('click', () => {
      const errors = getErrors();
      if (Object.keys(errors).length) {
        render();
        return;
      }

      if (!isLast) {
        appState.draft = setDraftField(appState.draft, 'step', appState.draft.step + 1);
        render();
        return;
      }

      initStore(appState.preview.state);
      importCharacter(JSON.stringify(appState.preview.state));
      alert('Character imported into store');
    });
  }

  render();
}
