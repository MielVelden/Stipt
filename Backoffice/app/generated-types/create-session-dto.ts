/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { SessionType } from './session-type';

export interface CreateSessionDto {
  title: string;
  description: string | undefined;
  type: SessionType;
  roomId: string;
  startDateTime: string;
  endDateTime: string;
  capacity: number | undefined;
  labels: string[];
  speakerIds: string[] | undefined;
  coverImageId: string | undefined;
}
