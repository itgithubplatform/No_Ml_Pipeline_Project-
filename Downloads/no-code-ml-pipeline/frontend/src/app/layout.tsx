import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
})

export const metadata: Metadata = {
    title: 'FlowML Studio - Visual ML Pipeline Builder',
    description: 'Build machine learning pipelines without code. Built with Next.js 15 + FastAPI',
    keywords: ['machine learning', 'no-code', 'ML pipeline', 'data science', 'AI'],
    authors: [{ name: 'FlowML Studio Team' }],
    creator: 'FlowML Studio',
    openGraph: {
        type: 'website',
        title: 'FlowML Studio - Visual ML Pipeline Builder',
        description: 'Build machine learning pipelines without code',
        siteName: 'FlowML Studio',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'FlowML Studio',
        description: 'Visual ML Pipeline Builder - No Code Required',
    },
    metadataBase: process.env.NEXT_PUBLIC_APP_URL
        ? new URL(process.env.NEXT_PUBLIC_APP_URL)
        : undefined,
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#0f172a',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className={`${inter.variable} ${inter.className} antialiased`}>
                {children}
            </body>
        </html>
    )
}
