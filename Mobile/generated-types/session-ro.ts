/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { SessionType } from './session-type';
import type { SessionRoomRo } from './session-room-ro';

export interface SessionRo {
  id: string;
  title: string;
  description: string | undefined;
  type: SessionType;
  speaker: string;
  roomId: string;
  room: SessionRoomRo;
  eventId: string;
  startDateTime: string;
  endDateTime: string;
  capacity: number | undefined;
  labels: string[];
  createdAtUtc: string;
  updatedAtUtc: string | undefined;
  registrationCount: number | undefined;
  availability: string | undefined;
}
