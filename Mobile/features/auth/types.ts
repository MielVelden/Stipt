export type LoginRequest = {
  email: string
  password: string
}

export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
}

export type LoginResponse = {
  accessToken: string
  refreshToken: string
  user: User
}

export type RefreshResponse = {
  accessToken: string
  refreshToken: string
}
