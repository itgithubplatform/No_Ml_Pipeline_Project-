'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    Sparkles, ArrowRight, Zap, Brain, Workflow,
    ChevronRight, Play, Code2,
    TrendingUp, Target, Rocket
} from 'lucide-react'
import { FlowMLLogo } from '@/components/shared/FlowMLLogo'

export default function LandingPage() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    const features = [
        {
            icon: Workflow,
            title: 'Visual Pipeline Builder',
            description: 'Drag-and-drop ML workflows with zero code',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Zap,
            title: 'Auto ML Intelligence',
            description: 'Automatic hyperparameter tuning & optimization',
            gradient: 'from-purple-500 to-pink-500'
        },
        {
            icon: Brain,
            title: 'Smart Preprocessing',
            description: 'Automatic data cleaning and feature engineering',
            gradient: 'from-orange-500 to-red-500'
        },
        {
            icon: TrendingUp,
            title: 'Real-time Analytics',
            description: 'Live model performance metrics and visualizations',
            gradient: 'from-green-500 to-emerald-500'
        }
    ]

    const techStack = [
        { name: 'Next.js 14', color: 'text-white', bg: 'bg-black' },
        { name: 'FastAPI', color: 'text-emerald-400', bg: 'bg-emerald-950' },
        { name: 'Python ML', color: 'text-blue-400', bg: 'bg-blue-950' },
        { name: 'TypeScript', color: 'text-blue-500', bg: 'bg-blue-900' },
    ]

    const stats = [
        { value: '100%', label: 'No Code Required', icon: Code2 },
        { value: '5 min', label: 'To First Model', icon: Rocket },
        { value: 'Auto', label: 'ML Optimization', icon: Target },
        { value: '∞', label: 'Possibilities', icon: Sparkles }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
            {/* Animated Background */}
            {isClient && (
                <>
                    {/* 3D Grid Effect */}
                    <div className="fixed inset-0 pointer-events-none">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
                    </div>

                    {/* Floating Gradient Orbs */}
                    <motion.div
                        className="fixed w-96 h-96 rounded-full opacity-20 blur-3xl"
                        style={{
                            background: 'radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)',
                            left: mousePosition.x - 192,
                            top: mousePosition.y - 192,
                        }}
                        animate={{
                            x: [0, 50, 0],
                            y: [0, -50, 0],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className="fixed w-96 h-96 rounded-full opacity-20 blur-3xl"
                        style={{
                            background: 'radial-gradient(circle, rgba(168,85,247,0.5) 0%, transparent 70%)',
                            right: 0,
                            top: 0,
                        }}
                        animate={{
                            x: [0, -50, 0],
                            y: [0, 50, 0],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </>
            )}

            {/* Content */}
            <div className="relative z-10">
                {/* Navigation */}
                <nav className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <motion.div
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="w-10 h-10 flex items-center justify-center">
                                <FlowMLLogo className="w-10 h-10" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    FlowML Studio
                                </h1>
                                <p className="text-xs text-slate-400">Visual ML Pipeline Builder</p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="flex items-center gap-4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >

                            <Link
                                href="/register"
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-2"
                            >
                                Register
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="container mx-auto px-6 py-20">
                    <div className="text-center max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >


                            {/* Main Heading */}
                            <h2 className="text-7xl font-black mb-6 leading-tight">
                                Build ML Pipelines
                                <br />
                                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Without Code
                                </span>
                            </h2>

                            <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                                Visual drag-and-drop interface for creating machine learning workflows.
                                From data upload to model deployment—all in your browser, no coding required.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex items-center justify-center gap-4 mb-16">
                                <Link
                                    href="/register"
                                    className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-3"
                                >
                                    <Play className="w-5 h-5" />
                                    Start Building
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="/signin"
                                    className="px-8 py-4 bg-slate-800/50 backdrop-blur border-2 border-slate-700 rounded-2xl font-bold text-lg hover:border-slate-600 transition-all duration-300"
                                >
                                    Sign In
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-4 gap-6 mb-20">
                                {stats.map((stat, i) => {
                                    const Icon = stat.icon
                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="p-6 bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl hover:border-blue-500/50 transition-all duration-300"
                                        >
                                            <Icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                                            <div className="text-3xl font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent mb-1">
                                                {stat.value}
                                            </div>
                                            <div className="text-sm text-slate-400">{stat.label}</div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="container mx-auto px-6 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h3 className="text-5xl font-black mb-4">
                            Powerful Features
                        </h3>
                        <p className="text-xl text-slate-400">
                            Everything you need for ML workflows, built-in
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-8">
                        {features.map((feature, i) => {
                            const Icon = feature.icon
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group p-8 bg-slate-800/30 backdrop-blur border-2 border-slate-700 rounded-3xl hover:border-slate-600 transition-all duration-300"
                                >
                                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-2xl font-bold mb-3">{feature.title}</h4>
                                    <p className="text-slate-400 text-lg">{feature.description}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </section>

                {/* Tech Stack */}
                <section className="container mx-auto px-6 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h3 className="text-4xl font-black mb-4">
                            Built with Modern Stack
                        </h3>
                        <p className="text-lg text-slate-400">
                            Powered by cutting-edge technologies
                        </p>
                    </motion.div>

                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        {techStack.map((tech, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`px-6 py-3 ${tech.bg} ${tech.color} rounded-xl font-bold text-lg border-2 border-slate-700 hover:scale-105 transition-transform`}
                            >
                                {tech.name}
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="container mx-auto px-6 py-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-20" />
                        <div className="relative bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur border-2 border-blue-500/50 rounded-3xl p-16 text-center">
                            <h3 className="text-5xl font-black mb-6">
                                Ready to Build?
                            </h3>
                            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                                Start creating ML pipelines in minutes. No installation, no setup—just pure ML magic.
                            </p>
                            <Link
                                href="/pipeline"
                                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-2xl font-black text-xl hover:shadow-2xl hover:shadow-white/50 transition-all duration-300"
                            >
                                <Rocket className="w-6 h-6" />
                                Launch FlowML Studio
                                <ArrowRight className="w-6 h-6" />
                            </Link>
                        </div>
                    </motion.div>
                </section>

                {/* Footer */}
                <footer className="container mx-auto px-6 py-12 border-t border-slate-800">
                    <div className="text-center text-slate-500">
                        <p>© 2024 FlowML Studio. Built with Next.js 14 + FastAPI + Python ML</p>
                        <p className="mt-2">Open Source • No Code Required • 100% Free</p>
                    </div>
                </footer>
            </div>
        </div>
    )
}
