import type { 
  UserProfile, 
  PracticeSession, 
  Attempt, 
  EvaluationRubric, 
  ReflectionData, 
  DrillResult, 
  ProgressSummary,
  CommunicationGoal
} from '../types/index.ts';

const STORAGE_KEYS = {
  PROFILE: 'product_one_user_profile',
  SESSIONS: 'product_one_sessions',
  DRAFTS: 'product_one_drafts',
};

// Sequential Curriculum Progression & Status Helpers
export function isSessionCompleted(session?: PracticeSession | null): boolean {
  if (!session) return false;
  // Strictly completed only when all 3 attempts are finished
  if (session.attempts && session.attempts.length >= 3) return true;
  // Or when daily reflection is saved after finishing practice
  if (session.reflection && (session.attempts?.length ?? 0) >= 2) return true;
  // If explicitly completed and all 3 attempts recorded
  if (session.status === 'completed' && (session.attempts?.length ?? 0) >= 3) return true;
  return false;
}

export function isSessionInProgress(session?: PracticeSession | null): boolean {
  if (!session) return false;
  if (isSessionCompleted(session)) return false;
  return (session.attempts && session.attempts.length > 0) || 
         Boolean(session.originalAttempt) || 
         session.status === 'in-progress' ||
         session.status === 'original-completed';
}

// Default User Profile for Day 0 / New User
export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'user_default',
  displayName: 'Practitioner',
  goals: ['express-thoughts', 'improve-professional'],
  preferences: {
    preferredFormat: 'text',
    sessionLengthMinutes: 5,
    dailyReminder: false,
    initialConfidenceRating: 5,
    experienceLevel: 'intermediate',
    directCritiqueMode: true, // Default ON (High-standard critique)
    aiProvider: 'offline-heuristic',
  },
  onboardingCompleted: false,
  roadmapDays: 30,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const storageService = {
  // ================= USER PROFILE =================
  getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) {
        const parsed = JSON.parse(data);
        let changed = false;

        // Purge any legacy API key from localStorage on load
        if (parsed.preferences && parsed.preferences.apiKey) {
          delete parsed.preferences.apiKey;
          changed = true;
        }

        // Ensure Direct Critique has a valid boolean state
        if (parsed.preferences && parsed.preferences.directCritiqueMode === undefined) {
          parsed.preferences.directCritiqueMode = false;
          changed = true;
        }

        if (changed) {
          try {
            localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(parsed));
          } catch {}
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse user profile from localStorage:', e);
    }
    return DEFAULT_USER_PROFILE;
  },

  saveUserProfile(profile: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile();
    const updated: UserProfile = {
      ...current,
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save profile to localStorage:', e);
    }
    return updated;
  },

  resetUserProfile(): UserProfile {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    return DEFAULT_USER_PROFILE;
  },

  // ================= PRACTICE SESSIONS =================
  getAllSessions(): PracticeSession[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (raw) {
        const list: PracticeSession[] = JSON.parse(raw);
        return list.map(session => {
          if (!session.attempts) session.attempts = [];
          
          // Reconstitute from backward compatibility fields if missing
          if (session.originalAttempt && !session.attempts.some(a => a.attemptNumber === 1)) {
            session.attempts.push({ ...session.originalAttempt, attemptNumber: 1 });
          }
          if (session.revisedAttempt && !session.attempts.some(a => a.attemptNumber === 2)) {
            session.attempts.push({ ...session.revisedAttempt, attemptNumber: 2 });
          }
          if (session.attempt3 && !session.attempts.some(a => a.attemptNumber === 3)) {
            session.attempts.push({ ...session.attempt3, attemptNumber: 3 });
          }

          // Restore from Immutable Snapshot Vault if missing
          for (const num of [1, 2, 3]) {
            if (!session.attempts.some(a => a.attemptNumber === num)) {
              try {
                const vaultKey = `product_one_vault_${session.id}_att_${num}`;
                const vaultRaw = localStorage.getItem(vaultKey);
                if (vaultRaw) {
                  const vaultAttempt: Attempt = JSON.parse(vaultRaw);
                  session.attempts.push(vaultAttempt);
                }
              } catch {}
            }
          }

          session.attempts.sort((a, b) => (a.attemptNumber || 1) - (b.attemptNumber || 1));
          return session;
        });
      }
    } catch (e) {
      console.warn('Failed to load sessions:', e);
    }
    return [];
  },

  getSessionByTopicId(topicId: string): PracticeSession | undefined {
    const sessions = this.getAllSessions();
    return sessions.find(s => s.topicId === topicId);
  },

  saveSession(session: PracticeSession): void {
    const sessions = this.getAllSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.unshift(session);
    }
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save session to localStorage:', e);
    }
  },

  createSession(topicId: string, dayNumber: number, selfRating?: number): PracticeSession {
    const existing = this.getSessionByTopicId(topicId);
    if (existing) {
      return existing;
    }
    const profile = this.getUserProfile();
    const newSession: PracticeSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: profile.id,
      topicId,
      dayNumber,
      startedAt: new Date().toISOString(),
      status: 'draft',
    };
    if (selfRating !== undefined) {
      // Record initial self-rating
    }
    this.saveSession(newSession);
    return newSession;
  },

  // ================= ATTEMPTS & EVALUATIONS (Layer 9: Multi-Attempt Support up to 3) =================
  saveSessionAttempt(
    sessionId: string,
    content: string,
    evaluation: EvaluationRubric,
    attemptNumber: 1 | 2 | 3 = 1,
    preRating?: number,
    aiImprovedVersion?: any
  ): PracticeSession {
    const sessions = this.getAllSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    if (!session.attempts) {
      session.attempts = [];
      if (session.originalAttempt) session.attempts.push({ ...session.originalAttempt, attemptNumber: 1 });
      if (session.revisedAttempt) session.attempts.push({ ...session.revisedAttempt, attemptNumber: 2 });
      if (session.attempt3) session.attempts.push({ ...session.attempt3, attemptNumber: 3 });
    }

    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const sealedAiImproved = aiImprovedVersion || evaluation.aiImprovedVersion;

    const attempt: Attempt = {
      id: `att_${attemptNumber}_${Date.now()}`,
      sessionId,
      topicId: session.topicId,
      attemptType: attemptNumber === 1 ? 'original' : (attemptNumber === 2 ? 'revised' : 'attempt-3'),
      attemptNumber,
      userAuthoredContent: content,
      wordCount: words,
      characterCount: content.length,
      prePracticeSelfRating: preRating,
      timestamp: new Date().toISOString(),
      evaluation,
      evaluationStatus: 'completed',
      aiImprovedVersion: sealedAiImproved,
      isLocked: true,
      lockedAt: new Date().toISOString(),
      lockedModel: evaluation.modelIdentifier || evaluation.evaluationSource || 'local-expert-v1'
    };

    const existingIdx = session.attempts.findIndex(a => a.attemptNumber === attemptNumber);
    if (existingIdx >= 0) {
      session.attempts[existingIdx] = attempt;
    } else {
      session.attempts.push(attempt);
    }
    session.attempts.sort((a, b) => (a.attemptNumber || 1) - (b.attemptNumber || 1));

    // Backwards compatibility links & Sequential Progression Status
    if (attemptNumber === 1) {
      session.originalAttempt = attempt;
      session.status = 'in-progress';
    } else if (attemptNumber === 2) {
      session.revisedAttempt = attempt;
      session.status = 'in-progress';
    } else {
      session.attempt3 = attempt;
      if (!session.revisedAttempt) {
        session.revisedAttempt = attempt;
      }
      session.status = 'completed';
      session.completedAt = new Date().toISOString();
    }

    // Persist to session store and isolated Immutable Snapshot Vault
    this.saveSession(session);
    try {
      localStorage.setItem(`product_one_vault_${session.id}_att_${attemptNumber}`, JSON.stringify(attempt));
    } catch {}

    this.clearDraft(session.topicId);
    return session;
  },

  markSessionComplete(sessionId: string): PracticeSession {
    const sessions = this.getAllSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);
    session.status = 'completed';
    session.completedAt = new Date().toISOString();
    this.saveSession(session);
    return session;
  },

  saveOriginalAttempt(
    sessionId: string, 
    content: string, 
    evaluation: EvaluationRubric,
    preRating?: number
  ): PracticeSession {
    return this.saveSessionAttempt(sessionId, content, evaluation, 1, preRating);
  },

  saveRevisedAttempt(
    sessionId: string,
    content: string,
    evaluation: EvaluationRubric
  ): PracticeSession {
    return this.saveSessionAttempt(sessionId, content, evaluation, 2);
  },

  // ================= REFLECTION =================
  saveReflection(
    sessionId: string, 
    data: Omit<ReflectionData, 'id' | 'sessionId' | 'topicId' | 'timestamp'>
  ): PracticeSession {
    const sessions = this.getAllSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    session.reflection = {
      id: `ref_${Date.now()}`,
      sessionId,
      topicId: session.topicId,
      whatWentWell: data.whatWentWell,
      whatWasDifficult: data.whatWasDifficult,
      oneThingToChange: data.oneThingToChange,
      whatToPractiseNext: data.whatToPractiseNext,
      timestamp: new Date().toISOString()
    };

    this.saveSession(session);
    return session;
  },

  // ================= DRILL RESULT =================
  saveDrillResult(sessionId: string, result: DrillResult): PracticeSession {
    const sessions = this.getAllSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    session.drillResult = result;
    this.saveSession(session);
    return session;
  },

  // ================= DRAFTS =================
  saveDraft(topicId: string, content: string): void {
    try {
      const drafts = this.getDrafts();
      drafts[topicId] = {
        content,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
    } catch (e) {
      console.warn('Failed to save draft:', e);
    }
  },

  getDraft(topicId: string): string {
    const drafts = this.getDrafts();
    return drafts[topicId]?.content || '';
  },

  clearDraft(topicId: string): void {
    const drafts = this.getDrafts();
    delete drafts[topicId];
    try {
      localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
    } catch (e) {
      console.warn('Failed to clear draft:', e);
    }
  },

  getDrafts(): Record<string, { content: string; savedAt: string }> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DRAFTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse drafts:', e);
    }
    return {};
  },

  // ================= REAL DERIVED PROGRESS SUMMARY (Layer 12 & 15) =================
  // Never uses fabricated stats. Derived strictly from saved practice sessions.
  getProgressSummary(): ProgressSummary {
    const sessions = this.getAllSessions();
    
    // Filter completed sessions (strictly requiring full completion / 3 attempts / reflection)
    const completedSessions = sessions.filter(
      s => isSessionCompleted(s) && (s.originalAttempt?.evaluation || s.attempts?.some(a => a.evaluation))
    );

    const daysAttempted = sessions.length;
    const daysCompleted = completedSessions.length;

    let totalWords = 0;
    let sumOrigScore = 0;
    let origScoreCount = 0;
    let sumRevScore = 0;
    let revScoreCount = 0;

    let sumClarity = 0;
    let countClarity = 0;
    let sumStructure = 0;
    let countStructure = 0;
    let sumSpecificity = 0;
    let countSpecificity = 0;
    let sumLanguage = 0;
    let countLanguage = 0;

    const improvementAreaCounts: Record<string, number> = {};
    let drillCount = 0;
    let reflectionCount = 0;

    // Calculate streaks based on unique completed dates
    const dateMap = new Set<string>();

    completedSessions.forEach(s => {
      const allAtts = (s.attempts && s.attempts.length > 0)
        ? s.attempts
        : [s.originalAttempt, s.revisedAttempt].filter(Boolean) as Attempt[];

      allAtts.forEach(att => {
        totalWords += att.wordCount;
        const num = att.attemptNumber || 1;
        const ev = att.evaluation;
        if (!ev) return;

        if (num === 1) {
          if (ev.overallScore !== null) {
            sumOrigScore += ev.overallScore;
            origScoreCount++;
          }
          if (ev.dimensions.clarity.score !== null) {
            sumClarity += ev.dimensions.clarity.score;
            countClarity++;
          }
          if (ev.dimensions.structureAndFlow.score !== null) {
            sumStructure += ev.dimensions.structureAndFlow.score;
            countStructure++;
          }
          if (ev.dimensions.specificity.score !== null) {
            sumSpecificity += ev.dimensions.specificity.score;
            countSpecificity++;
          }
          if (ev.dimensions.languageEffectiveness.score !== null) {
            sumLanguage += ev.dimensions.languageEffectiveness.score;
            countLanguage++;
          }
          if (ev.mainImprovementPriority) {
            improvementAreaCounts[ev.mainImprovementPriority] = (improvementAreaCounts[ev.mainImprovementPriority] || 0) + 1;
          }
        } else {
          // Revisions (Attempt 2, 3)
          if (ev.overallScore !== null && ev.overallScore !== undefined) {
            sumRevScore += ev.overallScore;
            revScoreCount++;
          }
        }
      });

      if (s.drillResult) {
        drillCount++;
      }
      if (s.reflection) {
        reflectionCount++;
      }

      if (s.completedAt) {
        dateMap.add(new Date(s.completedAt).toISOString().split('T')[0]);
      }
    });

    // Calculate streaks
    let currentStreak = 0;
    let bestStreak = 0;
    let runningStreak = 0;
    
    // Sort completed dates ascending
    const sortedDates = Array.from(dateMap).sort();
    if (sortedDates.length > 0) {
      let prevDate: Date | null = null;
      for (const dStr of sortedDates) {
        const curDate = new Date(dStr);
        if (prevDate) {
          const diffDays = Math.round((curDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            runningStreak++;
          } else if (diffDays > 1) {
            runningStreak = 1;
          }
        } else {
          runningStreak = 1;
        }
        if (runningStreak > bestStreak) {
          bestStreak = runningStreak;
        }
        prevDate = curDate;
      }

      // Check if current streak is active (completed today or yesterday)
      const todayStr = new Date().toISOString().split('T')[0];
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

      const lastDate = sortedDates[sortedDates.length - 1];
      if (lastDate === todayStr || lastDate === yesterdayStr) {
        currentStreak = runningStreak;
      } else {
        currentStreak = 0; // No streak shame, just 0
      }
    }

    // Frequent improvement areas formatted
    const frequentImprovementAreas = Object.entries(improvementAreaCounts)
      .map(([area, count]) => ({ area, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate total attempts recorded and revision gain
    let totalAttemptsCount = 0;
    let sumRevisionGain = 0;
    let revisionGainCount = 0;
    let latestAssessmentDate: string | undefined = undefined;

    sessions.forEach(s => {
      const atts = s.attempts || [s.originalAttempt, s.revisedAttempt].filter(Boolean) as Attempt[];
      atts.forEach(a => {
        if (a && a.evaluation) {
          totalAttemptsCount++;
          if (!latestAssessmentDate || new Date(a.timestamp).getTime() > new Date(latestAssessmentDate).getTime()) {
            latestAssessmentDate = a.timestamp;
          }
        }
      });

      if (s.originalAttempt?.evaluation?.overallScore != null && s.revisedAttempt?.evaluation?.overallScore != null) {
        sumRevisionGain += (s.revisedAttempt.evaluation.overallScore - s.originalAttempt.evaluation.overallScore);
        revisionGainCount++;
      }
    });

    // Targeted practice recommendations based on lowest dimension
    const dimAverages = {
      clarity: countClarity > 0 ? Math.round(sumClarity / countClarity) : null,
      structureAndFlow: countStructure > 0 ? Math.round(sumStructure / countStructure) : null,
      specificity: countSpecificity > 0 ? Math.round(sumSpecificity / countSpecificity) : null,
      languageEffectiveness: countLanguage > 0 ? Math.round(sumLanguage / countLanguage) : null,
    };

    const targetedPracticeRecommendations: string[] = [];
    if (dimAverages.clarity !== null && dimAverages.clarity < 80) {
      targetedPracticeRecommendations.push("Eliminate conversational filler tokens (like 'basically', 'kind of') to sharpen direct clarity.");
    }
    if (dimAverages.structureAndFlow !== null && dimAverages.structureAndFlow < 80) {
      targetedPracticeRecommendations.push("Enforce sequential structure: lead with context, state your core insight, and close with a definitive next step.");
    }
    if (dimAverages.specificity !== null && dimAverages.specificity < 80) {
      targetedPracticeRecommendations.push("Ground abstract claims in concrete anchors: include specific dates, causal evidence, or measurable metrics.");
    }
    if (dimAverages.languageEffectiveness !== null && dimAverages.languageEffectiveness < 80) {
      targetedPracticeRecommendations.push("Elevate vocabulary economy: replace tentative qualifiers with declarative, assertive verbs.");
    }
    if (targetedPracticeRecommendations.length === 0) {
      targetedPracticeRecommendations.push("Maintain your high communication standard across more challenging scenarios and spontaneous prompts.");
    }

    return {
      daysAttempted,
      daysCompleted,
      currentStreak,
      bestStreak,
      totalWordsPracticed: totalWords,
      totalAttemptsRecorded: totalAttemptsCount,
      averageRevisionGain: revisionGainCount > 0 ? Math.round(sumRevisionGain / revisionGainCount) : null,
      latestAssessmentDate,
      targetedPracticeRecommendations,
      averageOriginalScore: origScoreCount > 0 ? Math.round(sumOrigScore / origScoreCount) : null,
      averageRevisedScore: revScoreCount > 0 ? Math.round(sumRevScore / revScoreCount) : null,
      dimensionAverages: dimAverages,
      frequentImprovementAreas,
      completedDrillCount: drillCount,
      savedReflectionCount: reflectionCount,
      lastPracticeDate: sortedDates[sortedDates.length - 1]
    };
  },

  // ================= EXPORT & IMPORT =================
  exportAllData(): string {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile: this.getUserProfile(),
      sessions: this.getAllSessions(),
      drafts: this.getDrafts(),
    };
    return JSON.stringify(data, null, 2);
  },

  importData(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.profile) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(parsed.profile));
      }
      if (parsed.sessions && Array.isArray(parsed.sessions)) {
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(parsed.sessions));
      }
      if (parsed.drafts) {
        localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(parsed.drafts));
      }
      return { success: true, message: 'Practice records successfully restored.' };
    } catch (e: any) {
      return { success: false, message: `Import failed: ${e.message || 'Invalid JSON format'}` };
    }
  },

  clearAllData(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('product_one') || key.startsWith('resolvai'))) {
          // Keep user's chosen light/dark theme preference intact
          if (key !== 'resolvai_theme') {
            keysToRemove.push(key);
          }
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
      localStorage.removeItem(STORAGE_KEYS.DRAFTS);
      localStorage.removeItem('product_one_active_topic_id');
      localStorage.removeItem('product_one_active_view');
      localStorage.removeItem('product_one_app_title');
    } catch (e) {
      console.error('Error clearing all practice data:', e);
    }
  }
};
