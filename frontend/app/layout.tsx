import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '댓글왕AI - Instagram 댓글 자동 응답',
  description: '24/7 인스타그램 댓글 자동 응답 서비스',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
