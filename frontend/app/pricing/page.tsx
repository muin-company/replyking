'use client';

import Link from 'next/link';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-purple-600">💬 댓글왕AI</Link>
          <Link href="/dashboard" className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700">
            대시보드
          </Link>
        </nav>
      </header>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">간단한 요금제</h1>
          <p className="text-xl text-gray-600">필요한 만큼만 사용하세요</p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-200">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">무료 체험</h3>
              <div className="text-4xl font-bold text-gray-800 mb-2">₩0</div>
              <p className="text-gray-600">30일 무료</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                인스타그램 계정 1개
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                월 100개 댓글 자동 응답
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                기본 감정 분석
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                응답 템플릿 5개
              </li>
            </ul>
            <Link href="/dashboard" className="block w-full text-center bg-gray-200 text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-300">
              무료로 시작하기
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-8 rounded-3xl shadow-2xl border-4 border-purple-400 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-purple-900 px-4 py-1 rounded-full text-sm font-bold">
              추천
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">프로</h3>
              <div className="text-5xl font-bold mb-2">₩19,900</div>
              <p className="opacity-90">월 구독</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="text-yellow-300 mr-2">✓</span>
                인스타그램 계정 3개
              </li>
              <li className="flex items-center">
                <span className="text-yellow-300 mr-2">✓</span>
                <strong>무제한</strong> 댓글 자동 응답
              </li>
              <li className="flex items-center">
                <span className="text-yellow-300 mr-2">✓</span>
                고급 감정 분석 + 카테고리 분류
              </li>
              <li className="flex items-center">
                <span className="text-yellow-300 mr-2">✓</span>
                무제한 응답 템플릿
              </li>
              <li className="flex items-center">
                <span className="text-yellow-300 mr-2">✓</span>
                상세 분석 대시보드
              </li>
              <li className="flex items-center">
                <span className="text-yellow-300 mr-2">✓</span>
                우선 고객 지원
              </li>
            </ul>
            <Link href="/dashboard" className="block w-full text-center bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100">
              지금 시작하기
            </Link>
          </div>
        </div>

        {/* Enterprise */}
        <div className="max-w-2xl mx-auto mt-12 text-center bg-white p-8 rounded-3xl shadow-lg">
          <h3 className="text-2xl font-bold mb-3">🏢 Enterprise</h3>
          <p className="text-gray-600 mb-6">
            대규모 팀이나 에이전시를 위한 맞춤형 플랜
          </p>
          <Link href="mailto:contact@muin.company" className="inline-block border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-50">
            문의하기
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">자주 묻는 질문</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <details className="bg-white p-6 rounded-2xl shadow-lg">
            <summary className="font-bold cursor-pointer">무료 체험 후 자동으로 결제되나요?</summary>
            <p className="mt-4 text-gray-600">
              아니요. 30일 무료 체험 기간이 끝나도 자동으로 결제되지 않습니다. 계속 사용하시려면 직접 플랜을 선택하셔야 합니다.
            </p>
          </details>
          <details className="bg-white p-6 rounded-2xl shadow-lg">
            <summary className="font-bold cursor-pointer">언제든 해지할 수 있나요?</summary>
            <p className="mt-4 text-gray-600">
              네, 언제든 구독을 해지할 수 있습니다. 해지 후에도 결제한 기간까지는 계속 사용할 수 있습니다.
            </p>
          </details>
          <details className="bg-white p-6 rounded-2xl shadow-lg">
            <summary className="font-bold cursor-pointer">TikTok도 지원하나요?</summary>
            <p className="mt-4 text-gray-600">
              현재는 Instagram만 지원합니다. TikTok 지원은 2026년 상반기 중 추가될 예정입니다.
            </p>
          </details>
          <details className="bg-white p-6 rounded-2xl shadow-lg">
            <summary className="font-bold cursor-pointer">AI가 생성한 답변을 수정할 수 있나요?</summary>
            <p className="mt-4 text-gray-600">
              네, 대시보드에서 AI가 생성한 답변을 확인하고 수정한 후 게시할 수 있습니다. 자동 게시도 설정 가능합니다.
            </p>
          </details>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>© 2026 댓글왕AI by MUIN Company. All rights reserved.</p>
      </footer>
    </div>
  );
}
