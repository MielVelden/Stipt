/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { SessionType } from './session-type';
import type { SessionRoomRo } from './session-room-ro';
import type { SessionEnrollmentStatus } from './session-enrollment-status';

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
  effectiveCapacity: number;
  enrolledCount: number;
  waitlistCount: number;
  hasAvailableSpots: boolean;
  myEnrollmentStatus: SessionEnrollmentStatus | undefined;
  myWaitlistPosition: number | undefined;
  coverImageId: string | undefined;
}
