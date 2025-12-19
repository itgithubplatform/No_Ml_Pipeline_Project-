'use client'

import { PipelineCanvas } from '@/components/pipeline/PipelineCanvas'
import { PipelineProgress } from '@/components/shared/PipelineProgress'
import { PipelineActions } from '@/components/shared/PipelineActions'
import { AnimatedDataFlow } from '@/components/shared/AnimatedDataFlow'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuthStore } from '@/store/authStore'
import { LogOut, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FlowMLLogo } from '@/components/shared/FlowMLLogo'

export default function PipelinePage() {
    const { user, logout } = useAuthStore()
    const router = useRouter()

    const handleLogout = () => {
        logout()
        router.push('/')
    }

    return (
        <ProtectedRoute>
            <div className="h-screen flex flex-col bg-slate-950">
                {/* Top Header Bar - Clean and Simple */}
                <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
                    {/* Left - Logo and Title */}
                    <div className="flex items-center gap-3">
                        <FlowMLLogo className="w-8 h-8" />
                        <div>
                            <h1 className="text-xl font-bold text-white">ML Pipeline Builder</h1>
                            <p className="text-xs text-slate-400">Build ML workflows visually</p>
                        </div>
                    </div>

                    {/* Right - User and Actions */}
                    <div className="flex items-center gap-3">
                        {/* User Profile */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700">
                            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">{user?.name}</p>
                                <p className="text-xs text-slate-400">{user?.email}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <PipelineActions />

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-red-400 hover:text-red-300 text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </header>

                {/* Progress Bar Section - Dedicated Row */}
                <div className="bg-slate-900/50 border-b border-slate-800 px-6 py-3 mt-4">
                    <PipelineProgress />
                </div>

                {/* Main Canvas Area - Full Remaining Space */}
                <div className="flex-1 relative overflow-hidden">
                    <PipelineCanvas />
                </div>

                {/* Animated Background Effect */}
                <AnimatedDataFlow />
            </div>
        </ProtectedRoute>
    )
}
