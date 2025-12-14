// Node status animation styles
export const nodeStatusStyles = {
    idle: {
        border: 'border-slate-700',
        glow: '',
        bg: 'bg-slate-900/95',
    },
    processing: {
        border: 'border-blue-500',
        glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-pulse',
        bg: 'bg-blue-500/5',
    },
    success: {
        border: 'border-green-500',
        glow: 'shadow-[0_0_15px_rgba(34,197,94,0.3)]',
        bg: 'bg-green-500/5',
    },
    error: {
        border: 'border-red-500',
        glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]',
        bg: 'bg-red-500/5',
    },
}

export type NodeStatus = keyof typeof nodeStatusStyles

export const getNodeClasses = (status: NodeStatus) => {
    const styles = nodeStatusStyles[status]
    return `${styles.border} ${styles.glow} ${styles.bg}`
}
