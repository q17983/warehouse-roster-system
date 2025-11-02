import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Warehouse Roster System',
  description: 'Simple staff roster planning system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

