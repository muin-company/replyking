'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('comments');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [pendingReplies, setPendingReplies] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch accounts on mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Fetch data when account changes
  useEffect(() => {
    if (selectedAccount) {
      fetchComments();
      fetchPendingReplies();
      fetchAnalytics();
      fetchTemplates();
    }
  }, [selectedAccount]);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API_URL}/accounts`);
      setAccounts(response.data);
      if (response.data.length > 0 && !selectedAccount) {
        setSelectedAccount(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchComments = async () => {
    if (!selectedAccount) return;
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/accounts/${selectedAccount}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingReplies = async () => {
    if (!selectedAccount) return;
    try {
      const response = await axios.get(`${API_URL}/accounts/${selectedAccount}/pending-replies`);
      setPendingReplies(response.data);
    } catch (error) {
      console.error('Error fetching pending replies:', error);
    }
  };

  const fetchAnalytics = async () => {
    if (!selectedAccount) return;
    try {
      const response = await axios.get(`${API_URL}/accounts/${selectedAccount}/analytics?days=7`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchTemplates = async () => {
    if (!selectedAccount) return;
    try {
      const response = await axios.get(`${API_URL}/accounts/${selectedAccount}/templates`);
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const processComments = async () => {
    if (!selectedAccount) return;
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/accounts/${selectedAccount}/process`);
      alert(`${response.data.newCommentsCount}개의 새 댓글을 처리했습니다!`);
      fetchComments();
      fetchPendingReplies();
    } catch (error: any) {
      alert(`오류: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const approveReply = async (replyId: number) => {
    try {
      await axios.post(`${API_URL}/replies/${replyId}/approve`);
      alert('답변이 승인되었습니다!');
      fetchPendingReplies();
      fetchComments();
    } catch (error: any) {
      alert(`오류: ${error.response?.data?.error || error.message}`);
    }
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      default: return '😐';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const totalComments = analytics.reduce((sum, day) => sum + (day.comments_received || 0), 0);
  const totalReplies = analytics.reduce((sum, day) => sum + (day.replies_sent || 0), 0);
  const totalPositive = analytics.reduce((sum, day) => sum + (day.sentiment_positive || 0), 0);
  const totalNegative = analytics.reduce((sum, day) => sum + (day.sentiment_negative || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-purple-600">💬 댓글왕AI</Link>
            <div className="flex items-center space-x-4">
              <select
                value={selectedAccount || ''}
                onChange={(e) => setSelectedAccount(Number(e.target.value))}
                className="border rounded-lg px-4 py-2"
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    @{account.username}
                  </option>
                ))}
              </select>
              <button
                onClick={processComments}
                disabled={loading}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? '처리 중...' : '댓글 확인'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-600 text-sm mb-1">총 댓글</div>
            <div className="text-3xl font-bold text-purple-600">{totalComments}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-600 text-sm mb-1">자동 응답</div>
            <div className="text-3xl font-bold text-blue-600">{totalReplies}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-600 text-sm mb-1">긍정 댓글</div>
            <div className="text-3xl font-bold text-green-600">{totalPositive}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-600 text-sm mb-1">대기 중</div>
            <div className="text-3xl font-bold text-orange-600">{pendingReplies.length}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('comments')}
                className={`px-6 py-4 font-semibold ${activeTab === 'comments' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-600'}`}
              >
                댓글 ({comments.length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-4 font-semibold ${activeTab === 'pending' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-600'}`}
              >
                대기 중 ({pendingReplies.length})
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`px-6 py-4 font-semibold ${activeTab === 'templates' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-600'}`}
              >
                템플릿 ({templates.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    아직 댓글이 없습니다. "댓글 확인" 버튼을 눌러 최신 댓글을 가져오세요.
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">@{comment.username}</span>
                          <span className={`px-2 py-1 rounded text-sm ${getSentimentColor(comment.sentiment)}`}>
                            {getSentimentEmoji(comment.sentiment)} {comment.sentiment}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.timestamp * 1000).toLocaleString('ko-KR')}
                        </span>
                      </div>
                      <p className="text-gray-800 mb-3">{comment.text}</p>
                      {comment.reply_text && (
                        <div className="bg-purple-50 border-l-4 border-purple-600 p-3 rounded">
                          <div className="text-sm text-purple-600 font-semibold mb-1">
                            AI 답변 {comment.reply_status === 'posted' && '✓ 게시됨'}
                          </div>
                          <p className="text-gray-700">{comment.reply_text}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Pending Replies Tab */}
            {activeTab === 'pending' && (
              <div className="space-y-4">
                {pendingReplies.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    대기 중인 답변이 없습니다.
                  </div>
                ) : (
                  pendingReplies.map((reply) => (
                    <div key={reply.id} className="border rounded-lg p-4">
                      <div className="mb-3">
                        <span className="font-semibold">@{reply.username}</span>
                        <p className="text-gray-600 mt-1">{reply.comment_text}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded mb-3">
                        <div className="text-sm text-blue-600 font-semibold mb-1">AI 생성 답변</div>
                        <p className="text-gray-800">{reply.reply_text}</p>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                          수정
                        </button>
                        <button
                          onClick={() => approveReply(reply.id)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                          승인 및 게시
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Templates Tab */}
            {activeTab === 'templates' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">응답 템플릿</h3>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    + 템플릿 추가
                  </button>
                </div>
                {templates.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    템플릿이 없습니다. 자주 사용하는 답변을 템플릿으로 저장하세요.
                  </div>
                ) : (
                  templates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold">
                          {template.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          사용: {template.usage_count}회
                        </span>
                      </div>
                      <p className="text-gray-800">{template.template}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
