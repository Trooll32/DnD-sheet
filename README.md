# ⚔️ DnD Sheet

A mobile-first D&D 5e/2024 character sheet — your character in your pocket.

> **Last updated:** April 2026 · [Live Demo →](https://trooll32.github.io/DnD-sheet/)

## Architecture

```
src/
  engine/
    state.js       — createEmptyState(), SCHEMA_VERSION
    derived.js     — recalculate(state) → all computed stats
    commands.js    — command bus, store, subscribe(), all mutations
    roll.js        — dice engine: rollFormula, executeRoll, convenience fns
    conditions.js  — CONDITIONS map, getActiveConditionFlags()
    compendium.js  — WEAPONS_COMPENDIUM, CLASSES, searchWeapons()
  utils/
    format.js      — formatBonus, formatSkillName, timeAgo, etc.
  modules/         — UI modules (coming next)
  ui/              — shell, tabs, components (coming next)
```

## Engine Concepts

- **Single source of truth** — all state in one immutable object
- **Command bus** — every mutation goes through `commands.js`, never direct state mutation
- **Reactive** — `subscribe(fn)` called after every commit with `(state, derived)`
- **Derived stats** — `recalculate()` recomputes all derived values (mods, saves, skills, spell DC) on every commit
- **Effect system** — active effects inject modifiers into derived calculator
- **Roll history** — last 100 rolls persisted in state
- **localStorage** — auto-save on every commit

## Roadmap

- [x] Phase 0.1 — Engine core (state, derived, commands, roll, conditions, compendium)
- [ ] Phase 0.2 — Combat Hub UI (HP tracker, AC/Speed/Initiative, conditions, death saves)
- [ ] Phase 0.3 — Skills & Abilities tab
- [ ] Phase 0.4 — Weapons tab with attack/damage rolls
- [ ] Phase 0.5 — Character Sheet tab
- [ ] Phase 1.0 — Spells tab + slot tracker
- [ ] Phase 1.1 — Inventory
- [ ] Phase 1.2 — Roll history drawer + dice log

## Getting Started

Открой `index.html` в браузере или перейди по [ссылке на GitHub Pages](https://trooll32.github.io/DnD-sheet/).
