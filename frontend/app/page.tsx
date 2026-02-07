'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-purple-600">💬 댓글왕AI</div>
          <div className="space-x-4">
            <Link href="/pricing" className="text-gray-600 hover:text-purple-600">요금제</Link>
            <Link href="/dashboard" className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700">
              대시보드
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
          인스타그램 댓글,<br />
          <span className="text-purple-600">24시간 자동 응답</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          AI가 감정을 분석하고 맞춤형 답변을 생성합니다.<br />
          소셜커머스 셀러와 인플루언서를 위한 필수 도구
        </p>
        <div className="space-x-4">
          <Link href="/dashboard" className="inline-block bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-700">
            무료로 시작하기
          </Link>
          <Link href="/pricing" className="inline-block border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50">
            요금제 보기
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3">즉시 응답</h3>
            <p className="text-gray-600">
              새 댓글이 달리면 5분 이내 자동 응답. 고객을 기다리게 하지 마세요.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-3">감정 분석</h3>
            <p className="text-gray-600">
              AI가 댓글의 감정과 의도를 파악해 상황에 맞는 답변을 생성합니다.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-3">분석 대시보드</h3>
            <p className="text-gray-600">
              댓글 통계, 감정 분포, 응답률을 한눈에 확인하세요.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-12">왜 댓글왕AI인가?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-5xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-gray-600">쉬지 않는 자동 응답</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-purple-600 mb-2">&lt;5분</div>
            <div className="text-gray-600">평균 응답 시간</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-purple-600 mb-2">95%</div>
            <div className="text-gray-600">고객 만족도</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-purple-600 text-white p-12 rounded-3xl">
          <h2 className="text-4xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="text-xl mb-8 opacity-90">
            첫 30일 무료 체험 · 언제든 해지 가능
          </p>
          <Link href="/dashboard" className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100">
            무료 체험 시작
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>© 2026 댓글왕AI by MUIN Company. All rights reserved.</p>
      </footer>
    </div>
  );
}
