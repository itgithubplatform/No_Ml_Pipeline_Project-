import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Brain } from 'lucide-react'

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="text-center space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
                        <Sparkles className="w-4 h-4" />
                        No-Code Machine Learning
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
                        Build ML Pipelines
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                            Without Code
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Create, train, and evaluate machine learning models with an intuitive
                        drag-and-drop interface. No coding required.
                    </p>

                    {/* CTA Button */}
                    <div className="flex gap-4 justify-center pt-4">
                        <Link
                            href="/pipeline"
                            className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-blue-500/50"
                        >
                            Start Building
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Features */}
                    <div className="grid md:grid-cols-3 gap-6 pt-16 max-w-4xl mx-auto">
                        {/* Feature 1 */}
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/50 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Visual Pipeline Builder
                            </h3>
                            <p className="text-slate-400 text-sm">
                                Drag and drop components to create your ML workflow visually
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/50 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
                                <Brain className="w-6 h-6 text-cyan-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Powered by Scikit-Learn
                            </h3>
                            <p className="text-slate-400 text-sm">
                                Industry-standard ML algorithms with optimized performance
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/50 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                                <Sparkles className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Instant Results
                            </h3>
                            <p className="text-slate-400 text-sm">
                                Get accuracy metrics and visualizations in real-time
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 left-0 right-0 text-center text-slate-500 text-sm">
                Built with Next.js + FastAPI
            </div>
        </div>
    )
}
