export function FlowMLLogo({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Gradient Definitions */}
            <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Background Circle */}
            <circle cx="50" cy="50" r="48" fill="url(#gradient1)" opacity="0.1" />

            {/* Flow Lines - Neural Network Pattern */}
            <g filter="url(#glow)">
                {/* Left Nodes */}
                <circle cx="20" cy="30" r="4" fill="url(#gradient2)" />
                <circle cx="20" cy="50" r="4" fill="url(#gradient2)" />
                <circle cx="20" cy="70" r="4" fill="url(#gradient2)" />

                {/* Middle Nodes */}
                <circle cx="50" cy="25" r="5" fill="url(#gradient1)" />
                <circle cx="50" cy="50" r="6" fill="url(#gradient1)" />
                <circle cx="50" cy="75" r="5" fill="url(#gradient1)" />

                {/* Right Nodes */}
                <circle cx="80" cy="35" r="4" fill="url(#gradient2)" />
                <circle cx="80" cy="50" r="4" fill="url(#gradient2)" />
                <circle cx="80" cy="65" r="4" fill="url(#gradient2)" />

                {/* Connecting Lines */}
                <path
                    d="M 24 30 Q 37 27 45 25"
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.6"
                />
                <path
                    d="M 24 30 Q 37 40 44 48"
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.4"
                />
                <path
                    d="M 24 50 Q 37 37 45 27"
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.4"
                />
                <path
                    d="M 24 50 Q 37 50 44 50"
                    stroke="url(#gradient1)"
                    strokeWidth="2.5"
                    fill="none"
                    opacity="0.7"
                />
                <path
                    d="M 24 50 Q 37 63 44 73"
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.4"
                />
                <path
                    d="M 24 70 Q 37 60 44 52"
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.4"
                />
                <path
                    d="M 24 70 Q 37 73 45 75"
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.6"
                />

                {/* Right connections */}
                <path
                    d="M 55 25 Q 67 30 76 35"
                    stroke="url(#gradient2)"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.6"
                />
                <path
                    d="M 56 50 Q 68 50 76 50"
                    stroke="url(#gradient2)"
                    strokeWidth="2.5"
                    fill="none"
                    opacity="0.7"
                />
                <path
                    d="M 55 75 Q 67 70 76 65"
                    stroke="url(#gradient2)"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.6"
                />
                <path
                    d="M 56 50 Q 68 42 76 35"
                    stroke="url(#gradient2)"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.4"
                />
                <path
                    d="M 56 50 Q 68 58 76 65"
                    stroke="url(#gradient2)"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.4"
                />
            </g>

            {/* Center Pulse Circle */}
            <circle cx="50" cy="50" r="8" fill="url(#gradient1)" opacity="0.8">
                <animate
                    attributeName="r"
                    values="6;10;6"
                    dur="2s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="opacity"
                    values="0.8;0.4;0.8"
                    dur="2s"
                    repeatCount="indefinite"
                />
            </circle>

            {/* Outer Ring */}
            <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#gradient1)"
                strokeWidth="1.5"
                fill="none"
                opacity="0.3"
                strokeDasharray="10 5"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    dur="20s"
                    repeatCount="indefinite"
                />
            </circle>
        </svg>
    )
}
