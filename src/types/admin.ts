export interface AdminUserSummary {
  id: string
  email: string
  isActive: boolean
  createdAt: string
}

export type AdminLoginErrorCode =
  | 'BOOTSTRAP_PASSWORD_NOT_CONFIGURED'
  | 'INVALID_CREDENTIALS'
  | 'SESSION_CREATION_FAILED'
  | 'RATE_LIMITED'

export type AdminUserMutationErrorCode =
  | 'ADMIN_NOT_FOUND'
  | 'CANNOT_DEACTIVATE_SELF'
  | 'EMAIL_ALREADY_EXISTS'
  | 'INVALID_EMAIL'
  | 'LAST_ACTIVE_ADMIN'
  | 'PASSWORD_TOO_SHORT'
  | 'PASSWORD_TOO_LONG'
  | 'UNAUTHORIZED'
