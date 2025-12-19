'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { isAuthenticated, checkAuth } = useAuthStore()

    useEffect(() => {
        checkAuth()

        if (!isAuthenticated) {
            router.push('/signin')
        }
    }, [isAuthenticated, router, checkAuth])

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="inline-block mb-4"
                    >
                        <Sparkles className="w-12 h-12 text-blue-400" />
                    </motion.div>
                    <p className="text-slate-400 text-lg">Checking authentication...</p>
                </motion.div>
            </div>
        )
    }

    return <>{children}</>
}
