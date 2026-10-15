import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Engel Curves & Industry Growth',
  description:
    'Evidence-led research on how household spending shifts with income and the implications for industry growth and equity prices across major economies.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
