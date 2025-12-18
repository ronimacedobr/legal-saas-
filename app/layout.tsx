import type { Metadata } from 'next'
import { Hedvig_Letters_Sans } from 'next/font/google'
import './globals.css'

const hedvig = Hedvig_Letters_Sans({ 
  subsets: ['latin'],
  variable: '--font-hedvig-letters-sans',
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
      <body className={`${hedvig.variable} font-sans`}>{children}</body>
    </html>
  )
}
