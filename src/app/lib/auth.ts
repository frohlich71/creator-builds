import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { refreshAccessToken } from "@/app/service/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          })

          console.log('Auth response status:', res.status) // Debug

          // Se a resposta não é ok, retorna null (credenciais inválidas)
          if (!res.ok) {
            console.log('Authentication failed - invalid credentials')
            return null
          }

          const user = await res.json()
          console.log('User data received:', user) // Debug

          // Verifica se temos dados válidos do usuário
          if (!user || !user._doc || !user.access_token) {
            console.log('Invalid user data structure')
            return null
          }

          // Sucesso - retorna dados do usuário
          return {
            ...user._doc, 
            accessToken: user.access_token, 
            refreshToken: user.refresh_token, 
            expiresIn: user.expires_in
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Novo login
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + user.expiresIn * 1000,
        }
      }

      // Se não existe accessTokenExpires, força refresh
      if (!token.accessTokenExpires) {
        const refreshedToken = await refreshAccessToken(token)
        return refreshedToken
      }

      // Token ainda válido
      if (Date.now() < token.accessTokenExpires) {
        return token
      }

      // Token expirado, tenta refresh
      const refreshedToken = await refreshAccessToken(token)
      return refreshedToken
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      session.accessTokenExpires = token.accessTokenExpires
      session.error = token.error
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
}
