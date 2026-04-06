/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { UserRo } from './user-ro';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserRo;
}
