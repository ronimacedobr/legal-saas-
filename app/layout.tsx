import type { Metadata } from 'next'
import { Hedvig_Letters_Serif, Hedvig_Letters_Sans } from 'next/font/google'
import './globals.css'
import PasswordProtection from './components/PasswordProtection'

const hedvigSerif = Hedvig_Letters_Serif({ 
  subsets: ['latin'],
  variable: '--font-hedvig-letters-serif',
  weight: '400',
})

const hedvigSans = Hedvig_Letters_Sans({
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
      <body className={`${hedvigSerif.variable} ${hedvigSans.variable} font-sans`}>
        <PasswordProtection>
          {children}
        </PasswordProtection>
      </body>
    </html>
  )
}