'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, AlertCircle, Bell, ChevronDown, Menu } from 'lucide-react';
import { StatsOverview } from '@/features/creators/StatsOverview';
import { CreatorQuestCard } from '@/features/creators/CreatorQuestCard';
import { ResponsePreview } from '@/features/creators/ResponsePreview';
import { DashboardSkeleton } from '@/features/creators/SkeletonLoaders';
import { NoQuestsEmptyState, NoResponsesEmptyState } from '@/features/creators/DashboardEmptyState';
import { mockQuests, mockResponses, Quest, Response } from '@/features/creators/MockData';

interface DashboardState {
  loading: boolean;
  error: string | null;
  quests: Quest[];
  responses: Response[];
  stats: {
    activeQuests: number;
    totalResponses: number;
    totalRewards: number;
  };
}

export default function CreatorDashboard() {
  const [state, setState] = useState<DashboardState>({
    loading: true,
    error: null,
    quests: [],
    responses: [],
    stats: {
      activeQuests: 0,
      totalResponses: 0,
      totalRewards: 0,
    },
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        await new Promise(resolve => setTimeout(resolve, 1500));

        setState({
          loading: false,
          error: null,
          quests: mockQuests,
          responses: mockResponses,
          stats: {
            activeQuests: 12,
            totalResponses: 48,
            totalRewards: 2150.02,
          },
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load dashboard data. Please try again.',
        }));
      }
    };

    fetchDashboardData();
  }, []);

  const handleCreateQuest = () => {
    console.log('Create new quest');
  };

  const handleRetry = () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
  };

  if (state.loading) {
    return (
      <div className="min-h-screen bg-[#0f0f1e] text-white flex flex-col">
        <DashboardHeader setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-[#0f0f1e] text-white flex flex-col">
        <DashboardHeader setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center">Error Loading Dashboard</h2>
            <p className="text-gray-400 text-center mb-6 text-sm sm:text-base">{state.error}</p>
            <button
              onClick={handleRetry}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1e] text-white flex flex-col">
      <DashboardHeader setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <StatsOverview
            activeQuests={state.stats.activeQuests}
            totalResponses={state.stats.totalResponses}
            totalRewards={state.stats.totalRewards}
            onCreateQuest={handleCreateQuest}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-6">
            <div className="lg:col-span-2 lg:border-r lg:border-purple-500/30 lg:pr-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-white">Active Quests</h2>
                <button className="flex items-center space-x-1 text-sm text-purple-400 hover:text-purple-300 transition-colors group">
                  <span>View all</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {state.quests.length === 0 ? (
                <NoQuestsEmptyState onCreateQuest={handleCreateQuest} />
              ) : (
                <div className="space-y-4">
                  {state.quests.map((quest) => (
                    <CreatorQuestCard
                      key={quest.id}
                      title={quest.title}
                      category={quest.category}
                      budget={quest.budget}
                      dueDate={quest.dueDate}
                      submissionCount={quest.submissionCount}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Recent Responses Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-white">Recent Response</h2>
                <button className="flex items-center space-x-1 text-sm text-purple-400 hover:text-purple-300 transition-colors group">
                  <span>View all</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {state.responses.length === 0 ? (
                <NoResponsesEmptyState />
              ) : (
                <div className="bg-[#1a1f37]/30 rounded-lg p-4 border border-gray-800/50">
                  <div className="space-y-3">
                    {state.responses.map((response) => (
                      <ResponsePreview
                        key={response.id}
                        id={response.id}
                        respondentName={response.respondentName}
                        respondentAvatar={response.respondentAvatar}
                        questTitle={response.questTitle}
                        timeSinceSubmission={response.timeSinceSubmission}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
  );
}

// Header Component
function DashboardHeader({ setIsSidebarOpen }: { setIsSidebarOpen: (open: boolean) => void }) {
  return (
    <header className="sticky top-0 z-30 bg-[#0f0f1e] border-b border-gray-800/50">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-400" />
          </button>
          <h1 className="text-lg sm:text-xl font-semibold text-white">Dashboard Overview</h1>
        </div>

        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gray-800/30 rounded-lg">
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-white">$0</span>
          </div>
          <button className="flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-800/50 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">R</span>
            </div>
            <span className="hidden sm:block text-sm font-medium text-white">Ruze.stellar</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
}