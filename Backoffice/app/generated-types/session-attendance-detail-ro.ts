/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { SessionType } from './session-type';
import type { ParticipantAttendanceRo } from './participant-attendance-ro';

export interface SessionAttendanceDetailRo {
  sessionId: string;
  sessionTitle: string;
  sessionType: SessionType;
  roomName: string;
  startDateTime: string;
  endDateTime: string;
  labels: string[];
  enrollmentCount: number;
  presentCount: number;
  absentCount: number;
  unknownCount: number;
  participants: ParticipantAttendanceRo[];
}
