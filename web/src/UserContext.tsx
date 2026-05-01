// src/UserContext.tsx
import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react"   // <-- type-only import fixes ts(1484)

export type User = { id: string; name: string; email: string } | null

const Ctx = createContext<{
  user: User
  login: (name: string, email: string) => void
  logout: () => void
}>({ user: null, login: () => {}, logout: () => {} })

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const login = (name: string, email: string) => setUser({ id: email, name, email })
  const logout = () => setUser(null)
  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>
}

export const useUser = () => useContext(Ctx)
