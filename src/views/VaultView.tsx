import React, { useState } from 'react';
import { PracticeSession, Topic } from '../types';
import { 
  Archive, 
  Search, 
  Download, 
  FileText, 
  BookOpen, 
  Calendar,
  Sparkles
} from 'lucide-react';

interface VaultViewProps {
  sessions: PracticeSession[];
  topics: Topic[];
  onOpenSession: (session: PracticeSession) => void;
  onExportJSON: () => void;
}

export const VaultView: React.FC<VaultViewProps> = ({
  sessions,
  topics,
  onOpenSession,
  onExportJSON,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const topicMap = new Map<string, Topic>();
  topics.forEach((t) => topicMap.set(t.id, t));

  const vaultSessions = sessions.filter(
    (s) => s.originalAttempt || s.revisedAttempt || s.reflection
  );

  const filteredSessions = vaultSessions.filter((s) => {
    const topic = topicMap.get(s.topicId);
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = topic?.title.toLowerCase().includes(q);
    const contentMatch = s.originalAttempt?.userAuthoredContent.toLowerCase().includes(q) ||
      s.revisedAttempt?.userAuthoredContent.toLowerCase().includes(q);
    return titleMatch || contentMatch;
  });

  const handleExportMarkdown = () => {
    let md = `# ResolvAI - Practice Archive\n\n`;
    vaultSessions.forEach((s) => {
      const topic = topicMap.get(s.topicId);
      md += `## Day ${s.dayNumber}: ${topic?.title || 'Practice'}\n`;
      if (s.originalAttempt) {
        md += `### Original Attempt (Score: ${s.originalAttempt.evaluation?.overallScore ?? 'N/A'}/100)\n`;
        md += `> ${s.originalAttempt.userAuthoredContent}\n\n`;
      }
      if (s.revisedAttempt) {
        md += `### Revised Attempt (Score: ${s.revisedAttempt.evaluation?.overallScore ?? 'N/A'}/100)\n`;
        md += `> ${s.revisedAttempt.userAuthoredContent}\n\n`;
      }
      if (s.reflection) {
        md += `### Reflection\n`;
        md += `- What went well: ${s.reflection.whatWentWell}\n`;
        md += `- Difficult: ${s.reflection.whatWasDifficult}\n`;
        md += `- One change: ${s.reflection.oneThingToChange}\n\n`;
      }
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resolvai-practice-export-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Reflection Vault
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Searchable historical archive of your attempts, feedback, and mindful reflections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportMarkdown}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Export Markdown</span>
          </button>

          <button
            onClick={onExportJSON}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 dark:text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search past attempts, topics or keywords..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 dark:focus:border-blue-500 bg-white dark:bg-slate-900 placeholder:text-slate-500 dark:placeholder:text-slate-500 font-medium"
        />
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {filteredSessions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl p-12 text-center space-y-2">
            <Archive className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No practice records found</p>
            <p className="text-xs text-slate-500 dark:text-slate-500">Complete your first exercise to start building your vault.</p>
          </div>
        ) : (
          filteredSessions.map((session) => {
            const topic = topicMap.get(session.topicId);
            const score = session.revisedAttempt?.evaluation?.overallScore ?? session.originalAttempt?.evaluation?.overallScore;

            return (
              <div
                key={session.id}
                onClick={() => onOpenSession(session)}
                className="p-5 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-700 hover:shadow-xs transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.2 rounded-full font-mono border border-blue-200 dark:border-blue-900/60">
                      Day {session.dayNumber}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {topic?.title || 'Daily Practice'}
                    </span>
                  </div>

                  {score !== undefined && (
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-transparent px-2.5 py-1 rounded-lg">
                      {score}/100
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  "{session.originalAttempt?.userAuthoredContent}"
                </p>

                {session.reflection && (
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="line-clamp-1">Reflection: {session.reflection.whatWentWell}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
