export interface GoogleLoginInitiateRequest {
  email: string;
  fingerprint?: any;
  browserMode?: string;
}

export interface GoogleLoginPasswordRequest {
  sessionId: string;
  password: string;
}

export interface GoogleLogin2FARequest {
  sessionId: string;
  code: string;
}

export interface AuthResponse {
  success: boolean;
  sessionId?: string;
  status?: string;
  message?: string;
  error?: string;
}
