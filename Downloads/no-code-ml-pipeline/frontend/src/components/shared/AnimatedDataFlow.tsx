import { useEffect, useState } from 'react'
import { usePipelineStore } from '@/lib/store'

interface Particle {
    id: number
    x: number
    y: number
    targetX: number
    targetY: number
}

export function AnimatedDataFlow() {
    const {
        uploadStatus,
        preprocessStatus,
        splitStatus,
        modelStatus,
    } = usePipelineStore()

    const [particles, setParticles] = useState<Particle[]>([])
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        // Trigger animation when any step is processing
        const isProcessing =
            uploadStatus === 'uploading' ||
            preprocessStatus === 'processing' ||
            splitStatus === 'splitting' ||
            modelStatus === 'training'

        setIsAnimating(isProcessing)

        if (isProcessing) {
            // Create particles
            const newParticles: Particle[] = Array.from({ length: 5 }, (_, i) => ({
                id: Date.now() + i,
                x: Math.random() * 100,
                y: 0,
                targetX: Math.random() * 100,
                targetY: 100,
            }))
            setParticles(newParticles)
        }
    }, [uploadStatus, preprocessStatus, splitStatus, modelStatus])

    if (!isAnimating) return null

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-60 animate-pulse"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        animation: 'flowDown 3s ease-in-out infinite',
                    }}
                />
            ))}
            <style jsx>{`
                @keyframes flowDown {
                    0% {
                        transform: translateY(0) scale(1);
                        opacity: 0.6;
                    }
                    50% {
                        transform: translateY(50vh) scale(1.2);
                        opacity: 0.8;
                    }
                    100% {
                        transform: translateY(100vh) scale(0.8);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    )
}
