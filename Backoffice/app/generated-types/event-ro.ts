/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { EventStyleRo } from './event-style-ro';

export interface EventRo {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  style: EventStyleRo;
  isArchived: boolean;
  createdAtUtc: string;
  updatedAtUtc: string | undefined;
}
