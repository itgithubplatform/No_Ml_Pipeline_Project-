export function AuthLogo({ className = "w-12 h-12" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Gradient Definitions */}
            <defs>
                <linearGradient id="auth-grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <linearGradient id="auth-grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
            </defs>

            {/* Outer Circle with Gradient */}
            <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#auth-grad1)"
                strokeWidth="3"
                fill="none"
                opacity="0.6"
            />

            {/* Inner Hexagon Shield */}
            <path
                d="M 50 15 L 70 28 L 70 54 L 50 67 L 30 54 L 30 28 Z"
                fill="url(#auth-grad2)"
                opacity="0.3"
            />
            <path
                d="M 50 15 L 70 28 L 70 54 L 50 67 L 30 54 L 30 28 Z"
                stroke="url(#auth-grad1)"
                strokeWidth="2.5"
                fill="none"
            />

            {/* Lock Icon Inside */}
            <g transform="translate(50, 50)">
                {/* Lock Body */}
                <rect
                    x="-10"
                    y="0"
                    width="20"
                    height="15"
                    rx="2"
                    fill="url(#auth-grad1)"
                />

                {/* Lock Shackle */}
                <path
                    d="M -7 0 L -7 -8 A 7 7 0 0 1 7 -8 L 7 0"
                    stroke="url(#auth-grad1)"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Keyhole */}
                <circle cx="0" cy="5" r="2" fill="#1e293b" />
                <rect x="-1" y="6" width="2" height="4" fill="#1e293b" />
            </g>

            {/* Sparkle Effects */}
            <circle cx="20" cy="25" r="2" fill="#3b82f6" opacity="0.8">
                <animate
                    attributeName="opacity"
                    values="0.8;0.3;0.8"
                    dur="2s"
                    repeatCount="indefinite"
                />
            </circle>
            <circle cx="80" cy="35" r="1.5" fill="#ec4899" opacity="0.8">
                <animate
                    attributeName="opacity"
                    values="0.8;0.3;0.8"
                    dur="2.5s"
                    repeatCount="indefinite"
                />
            </circle>
            <circle cx="75" cy="70" r="2" fill="#8b5cf6" opacity="0.8">
                <animate
                    attributeName="opacity"
                    values="0.8;0.3;0.8"
                    dur="3s"
                    repeatCount="indefinite"
                />
            </circle>
        </svg>
    )
}
