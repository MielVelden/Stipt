/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { SessionRo } from './session-ro';
import type { PersonalAgendaConflictRo } from './personal-agenda-conflict-ro';

export interface PersonalAgendaRo {
  sessions: SessionRo[];
  conflicts: PersonalAgendaConflictRo[];
  hasConflicts: boolean;
}
