export function validateBuilderStep(stepId, draft) {
  const errors = {};

  if (stepId === 'class' && !draft.className) {
    errors.className = 'Выбери класс';
  }

  if (stepId === 'species' && !draft.species.trim()) {
    errors.species = 'Укажи species';
  }

  if (stepId === 'details') {
    if (!draft.name.trim()) errors.name = 'Укажи имя персонажа';
    if (!draft.background.trim()) errors.background = 'Укажи background';
  }

  return errors;
}
