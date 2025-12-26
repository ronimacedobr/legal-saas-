import type { Metadata } from 'next'
import { Hedvig_Letters_Serif } from 'next/font/google'
import './globals.css'

const hedvigSerif = Hedvig_Letters_Serif({ 
  subsets: ['latin'],
  variable: '--font-hedvig-letters-serif',
  weight: '400',
})

export const metadata: Metadata = {
  title: 'Legal SaaS Dashboard',
  description: 'Financial management dashboard for legal professionals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={hedvigSerif.variable}>{children}</body>
    </html>
  )
}

