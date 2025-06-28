import { JWT } from "next-auth/jwt"

export async function refreshAccessToken(token: JWT) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    })

    const refreshedTokens = await res.json()

    if (!res.ok) throw refreshedTokens

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    console.error('Erro ao atualizar o token:', error)
    return {
      ...token,
      error: 'RefreshTokenError',
    }
  }
}