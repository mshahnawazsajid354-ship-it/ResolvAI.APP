import React, { useState } from 'react';
import { 
  Topic, 
  PracticeSession 
} from '../types';
import { 
  Dumbbell, 
  Search, 
  CheckCircle2, 
  Clock, 
  Lock, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { isSessionCompleted, isSessionInProgress } from '../services/storage';

interface GymViewProps {
  topics: Topic[];
  sessions: PracticeSession[];
  onSelectTopic: (topic: Topic) => void;
  onReviewSession: (session: PracticeSession) => void;
}

export const GymView: React.FC<GymViewProps> = ({
  topics,
  sessions,
  onSelectTopic,
  onReviewSession,
}) => {
  const [activeStage, setActiveStage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const sessionMap = new Map<string, PracticeSession>();
  sessions.forEach((s) => sessionMap.set(s.topicId, s));

  const filteredTopics = topics.filter((t) => {
    if (activeStage !== 'all' && t.stage !== activeStage) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchObj = t.objective.toLowerCase().includes(q);
      if (!matchTitle && !matchObj) return false;
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* Title & Filter Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Curriculum Ladder
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            The full 30-day progression across Foundations, Complexity, and Pressure.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Stage Filter Buttons */}
          <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl shrink-0 overflow-x-auto border border-slate-300 dark:border-slate-800">
            <button
              onClick={() => setActiveStage('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeStage === 'all' 
                  ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100'
              }`}
            >
              All (30)
            </button>
            <button
              onClick={() => setActiveStage('stage-a')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeStage === 'stage-a' 
                  ? 'bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100'
              }`}
            >
              Stage A (1-10)
            </button>
            <button
              onClick={() => setActiveStage('stage-b')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeStage === 'stage-b' 
                  ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100'
              }`}
            >
              Stage B (11-20)
            </button>
            <button
              onClick={() => setActiveStage('stage-c')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeStage === 'stage-c' 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100'
              }`}
            >
              Stage C (21-30)
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 dark:text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics..."
              className="w-full sm:w-60 pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 bg-white dark:bg-slate-900 placeholder:text-slate-500 dark:placeholder:text-slate-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Topics Grid / List with Sequential Progression */}
      <div className="space-y-2.5">
        {filteredTopics.map((topic) => {
          const session = sessionMap.get(topic.id);
          const isCompleted = isSessionCompleted(session);
          const isInProgress = isSessionInProgress(session);

          // Sequential unlock: Day 1 unlocked. Day N requires Day N-1 completed
          const topicIndex = topics.findIndex(t => t.id === topic.id);
          const prevTopic = topicIndex > 0 ? topics[topicIndex - 1] : null;
          const prevSession = prevTopic ? sessionMap.get(prevTopic.id) : null;
          const isUnlocked = topicIndex === 0 || isSessionCompleted(prevSession);

          const score = session?.revisedAttempt?.evaluation?.overallScore ?? session?.originalAttempt?.evaluation?.overallScore;
          const attemptCount = session?.attempts?.length || (session?.originalAttempt ? 1 : 0);

          return (
            <div
              key={topic.id}
              onClick={() => {
                if (!isUnlocked) return;
                if (isCompleted || isInProgress) {
                  if (session) onReviewSession(session);
                } else {
                  onSelectTopic(topic);
                }
              }}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                !isUnlocked
                  ? 'border-slate-200 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-950/40 opacity-60 cursor-not-allowed'
                  : isInProgress
                    ? 'border-amber-300 dark:border-amber-600 bg-amber-50/30 dark:bg-amber-950/30 hover:border-amber-400 dark:hover:border-amber-500 cursor-pointer shadow-xs'
                    : isCompleted
                      ? 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-700 hover:shadow-xs cursor-pointer'
                      : 'border-blue-300 dark:border-blue-800 bg-blue-50/20 dark:bg-blue-950/30 hover:border-blue-400 dark:hover:border-blue-700 cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  !isUnlocked
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500'
                    : isCompleted
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : isInProgress
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                        : 'bg-blue-600 text-white'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isInProgress ? (
                    <Clock className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                  ) : !isUnlocked ? (
                    <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  ) : (
                    topic.dayNumber
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${
                      !isUnlocked 
                        ? 'text-slate-400 dark:text-slate-600' 
                        : isInProgress 
                          ? 'text-amber-950 dark:text-amber-200' 
                          : 'text-slate-950 dark:text-white'
                    }`}>
                      {topic.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      {topic.stageTitle.split(':')[0]}
                    </span>
                    {isCompleted ? (
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.2 rounded-full uppercase font-mono">
                        Completed
                      </span>
                    ) : isInProgress ? (
                      <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 px-2 py-0.2 rounded-full uppercase font-mono">
                        In Progress ({attemptCount}/3)
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/70 px-2 py-0.2 rounded-full uppercase font-mono">
                        Up Next
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 font-mono">
                        Locked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                    {topic.objective}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {score !== undefined && (
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                    {score}/100
                  </span>
                )}
                <div className={`text-xs font-semibold flex items-center gap-1 ${
                  !isUnlocked 
                    ? 'text-slate-300 dark:text-slate-600' 
                    : isInProgress 
                      ? 'text-amber-700 dark:text-amber-400' 
                      : isCompleted 
                        ? 'text-emerald-700 dark:text-emerald-400' 
                        : 'text-blue-600 dark:text-blue-400'
                }`}>
                  <span>
                    {!isUnlocked ? 'Locked' : isCompleted ? 'Review' : isInProgress ? 'Resume' : 'Practise'}
                  </span>
                  {isUnlocked && <ArrowRight className="w-3.5 h-3.5" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
