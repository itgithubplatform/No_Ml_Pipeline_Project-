'use client'

import { useState } from 'react'
import { HelpCircle, X, ChevronDown, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function HelpPanel() {
    const [isOpen, setIsOpen] = useState(true)
    const [expandedSection, setExpandedSection] = useState<string | null>('getting-started')

    const sections = [
        {
            id: 'getting-started',
            title: '🚀 Getting Started',
            content: [
                { step: '1', text: 'Upload your dataset (CSV or Excel file)' },
                { step: '2', text: 'Select the target column you want to predict' },
                { step: '3', text: '(Optional) Apply preprocessing like scaling' },
                { step: '4', text: 'Data is automatically split and model trains with best parameters' },
                { step: '5', text: 'View your model results and metrics!' },
            ]
        },
        {
            id: 'dataset',
            title: '📊 Dataset Requirements',
            content: [
                { text: '✓ Supported formats: CSV, Excel (.xlsx, .xls)' },
                { text: '✓ Maximum size: 10MB' },
                { text: '✓ Should have labeled columns' },
                { text: '✓ Can contain both numeric and text data' },
            ]
        },
        {
            id: 'pipeline',
            title: '🔄 Pipeline Flow',
            content: [
                { icon: '📤', text: 'Upload: Load your dataset' },
                { icon: '🔧', text: 'Preprocess: Clean and prepare data (optional)' },
                { icon: '✂️', text: 'Split: Automatically split into train/test (70/30)' },
                { icon: '🧠', text: 'Train: Model finds best parameters automatically' },
                { icon: '📈', text: 'Results: View accuracy and metrics' },
            ]
        },
        {
            id: 'tips',
            title: '💡 Pro Tips',
            content: [
                { text: '• Preprocessing is optional - models can train on raw data' },
                { text: '• Train-test split happens automatically' },
                { text: '• Hyperparameter tuning finds best settings for you' },
                { text: '• Both classification & regression are supported' },
                { text: '• Hover over metrics for explanations' },
            ]
        }
    ]

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 animate-pulse"
                title="Show Help"
            >
                <HelpCircle className="w-6 h-6" />
            </button>
        )
    }

    return (
        <div className="fixed bottom-6 right-6 z-40 w-96 max-h-[70vh] overflow-hidden">
            <Card className="bg-slate-900/95 backdrop-blur border-2 border-blue-500/30 shadow-2xl">
                <CardHeader className="pb-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
                    <CardTitle className="flex items-center justify-between text-base">
                        <div className="flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-blue-400" />
                            <span className="text-blue-400">Quick Help Guide</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-slate-800 rounded transition"
                        >
                            <X className="w-4 h-4 text-slate-400" />
                        </button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
                    <div className="space-y-3">
                        {sections.map((section) => (
                            <div key={section.id} className="border border-slate-700 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                                    className="w-full p-3 bg-slate-800/50 hover:bg-slate-800 flex items-center justify-between transition text-left"
                                >
                                    <span className="text-sm font-medium text-slate-200">{section.title}</span>
                                    {expandedSection === section.id ? (
                                        <ChevronDown className="w-4 h-4 text-slate-400" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 text-slate-400" />
                                    )}
                                </button>
                                {expandedSection === section.id && (
                                    <div className="p-3 bg-slate-900/50 space-y-2">
                                        {section.content.map((item, idx) => (
                                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                                                {item.step && (
                                                    <span className="flex-shrink-0 w-5 h-5 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-[10px] font-bold">
                                                        {item.step}
                                                    </span>
                                                )}
                                                {item.icon && (
                                                    <span className="flex-shrink-0 text-base">{item.icon}</span>
                                                )}
                                                <span className="flex-1">{item.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Quick Action Note */}
                    <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <p className="text-xs text-green-400 font-medium mb-1">✨ No Coding Required!</p>
                        <p className="text-xs text-slate-400">
                            Everything happens automatically. Just upload your data and follow the visual flow!
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
