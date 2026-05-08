/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { SessionEnrollmentStatus } from './session-enrollment-status';

export interface UserSessionEnrollmentStatusMessage {
  sessionId: string;
  enrollmentStatus: SessionEnrollmentStatus | undefined;
  waitlistPosition: number | undefined;
}
