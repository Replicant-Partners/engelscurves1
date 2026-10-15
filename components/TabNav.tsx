'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const TABS = [
  { href: '/',          label: 'Emerging Markets',  sub: 'Observable notebook updated' },
  { href: '/global',    label: 'Global Analysis',   sub: 'Academic cross-economy pass' },
  { href: '/research',  label: 'Deep Research',     sub: 'Analyze any company · AI pipeline' },
]

export default function TabNav() {
  const path = usePathname()
  return (
    <div style={{ borderBottom: '1px solid #d0d7de', marginBottom: 40, paddingBottom: 0 }}>
      <div style={{ display: 'flex', gap: 0 }}>
        {TABS.map((t) => {
          const active = path === t.href
          return (
            <Link key={t.href} href={t.href} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '12px 24px 14px',
                borderBottom: active ? '2px solid #0969da' : '2px solid transparent',
                marginBottom: -1,
                cursor: 'pointer',
              }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: active ? 600 : 400, color: active ? '#0969da' : '#57606a' }}>
                  {t.label}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: '#6e7681' }}>{t.sub}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
