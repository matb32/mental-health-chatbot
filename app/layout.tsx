import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Addapt.ai - Adult ADHD Assessment',
  description: 'Comprehensive Adult ADHD Assessment Tool with validated clinical screening instruments',
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
