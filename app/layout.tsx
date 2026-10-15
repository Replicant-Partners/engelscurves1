import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Engel Curves & Industry Growth',
  description: 'Evidence-led research on household spending shifts and equity price implications.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#fff' }}>{children}</body>
    </html>
  )
}
