import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
    id: string
    email: string
    name: string
    createdAt: string
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<boolean>
    register: (name: string, email: string, password: string) => Promise<boolean>
    logout: () => void
    checkAuth: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (email: string, password: string) => {
                set({ isLoading: true })

                // Simulate API call - Replace with actual backend API
                await new Promise(resolve => setTimeout(resolve, 1000))

                // For demo: Get user from localStorage
                const users = JSON.parse(localStorage.getItem('flowml_users') || '[]')
                const user = users.find((u: any) => u.email === email && u.password === password)

                if (user) {
                    const { password: _, ...userWithoutPassword } = user
                    set({
                        user: userWithoutPassword,
                        isAuthenticated: true,
                        isLoading: false
                    })
                    return true
                }

                set({ isLoading: false })
                return false
            },

            register: async (name: string, email: string, password: string) => {
                set({ isLoading: true })

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000))

                // For demo: Store in localStorage - Replace with actual backend API
                const users = JSON.parse(localStorage.getItem('flowml_users') || '[]')

                // Check if user already exists
                if (users.some((u: any) => u.email === email)) {
                    set({ isLoading: false })
                    return false
                }

                const newUser = {
                    id: Math.random().toString(36).substr(2, 9),
                    name,
                    email,
                    password, // In production, this should be hashed on backend
                    createdAt: new Date().toISOString()
                }

                users.push(newUser)
                localStorage.setItem('flowml_users', JSON.stringify(users))

                const { password: _, ...userWithoutPassword } = newUser
                set({
                    user: userWithoutPassword,
                    isAuthenticated: true,
                    isLoading: false
                })
                return true
            },

            logout: () => {
                set({ user: null, isAuthenticated: false })
            },

            checkAuth: () => {
                const state = get()
                if (state.user) {
                    set({ isAuthenticated: true })
                }
            }
        }),
        {
            name: 'flowml-auth',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
)
