// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth"
import { Setup } from "./setup"

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number;
    error?: string
  }

  interface User extends DefaultUser {
    accessToken?: string
    refreshToken: string
    expiresIn: number
    _id: string
    telephone: string
    nickname: string
    setups: Setup[]
    website?: string
    profileImage?: string
    x?: string
    youtube?: string
    instagram?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken: string
    accessTokenExpires: number
    error?: string
  }
}