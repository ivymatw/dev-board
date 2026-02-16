import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DevBoard - 開發任務管理看板',
  description: '本地部署的開發任務管理看板系統',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className="min-h-screen bg-background">
        {children}
      </body>
    </html>
  )
}
