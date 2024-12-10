export interface IToken {
  sub: string;
  name: string;
  email: string;
  issuer: string;
  audience: string;
  iat: number;
  exp: number;
}
export interface IGeneretedToken {
  userId: string;
  accessToken: string;
  accessTokenExpiration: number;
  refreshToken: string;
  refreshTokenExpiration: number;
  userAgent: string;
  ipAddress: string;
  platform?: string;
}
export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type GenerateTokenParams = {
  userId: string;
  name: string;
  email: string;
  oldRefreshToken?: string | null;
};
