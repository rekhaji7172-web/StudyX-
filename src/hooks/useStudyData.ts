/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { Note, Flashcard, Task, StudySession, MindMapNode, MindMapEdge, MindMap, StudyPlan, PlannerSession, Achievement, Reward, Notification, UserProfile } from '../types';

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_session', title: 'First Steps', description: 'Complete your first study session', icon: '🌱', requirement: { type: 'sessions', value: 1 } },
  { id: 'ten_sessions', title: 'Focus Master', description: 'Complete 10 focus sessions', icon: '🎯', requirement: { type: 'sessions', value: 10 } },
  { id: 'seven_day_streak', title: 'Unstoppable', description: 'Maintain a 7-day study streak', icon: '🔥', requirement: { type: 'streak', value: 7 } },
  { id: 'thousand_xp', title: 'XP Titan', description: 'Earn 1,000 XP', icon: '👑', requirement: { type: 'xp', value: 1000 } },
];

const REWARDS: Reward[] = [
  { id: 'theme_dark', title: 'Midnight Theme', description: 'Unlock a sleek dark mode dashboard', cost: 500, type: 'theme', preview: '🌙' },
  { id: 'timer_retro', title: 'Retro Timer', description: 'Classic digital clock style', cost: 300, type: 'timer', preview: '📟' },
  { id: 'frame_gold', title: 'Golden Frame', description: 'A shiny gold border for your profile', cost: 1000, type: 'frame', preview: '✨' },
  { id: 'bg_stars', title: 'Starry Night', description: 'Animated stars background', cost: 1500, type: 'background', preview: '⭐' },
  { id: 'frame_neon', title: 'Neon Pulse', description: 'Glowing neon frame for your avatar', cost: 800, type: 'frame', preview: '🌈' },
  { id: 'bg_forest', title: 'Deep Forest', description: 'Calming forest background', cost: 1200, type: 'background', preview: '🌲' },
];

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

export function useNotes() {
  const [notes, setNotes] = useLocalStorage<Note[]>('studyx_notes', []);
  const { awardXP } = useStudyStats();

  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    awardXP(5, 'Created a new note');
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n))
    );
    if (updates.content) {
      awardXP(2, 'Revised a note');
    }
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return { notes, addNote, updateNote, deleteNote };
}

export function useFlashcards() {
  const [flashcards, setFlashcards] = useLocalStorage<Flashcard[]>('studyx_flashcards', []);
  const { awardXP } = useStudyStats();

  const addFlashcard = (card: Omit<Flashcard, 'id' | 'lastReviewed'>) => {
    const newCard: Flashcard = {
      ...card,
      id: crypto.randomUUID(),
      lastReviewed: Date.now(),
    };
    setFlashcards((prev) => [newCard, ...prev]);
    awardXP(2, 'Created a flashcard');
  };

  const addFlashcards = (cards: Omit<Flashcard, 'id' | 'lastReviewed'>[]) => {
    const newCards: Flashcard[] = cards.map(card => ({
      ...card,
      id: crypto.randomUUID(),
      lastReviewed: Date.now(),
    }));
    setFlashcards((prev) => [...newCards, ...prev]);
    awardXP(cards.length * 2, 'Generated flashcards');
  };

  const updateFlashcard = (id: string, updates: Partial<Flashcard>) => {
    setFlashcards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, lastReviewed: Date.now() } : c))
    );
    if (updates.masteryLevel !== undefined) {
      awardXP(5, 'Reviewed a flashcard');
    }
  };

  const deleteFlashcard = (id: string) => {
    setFlashcards((prev) => prev.filter((c) => c.id !== id));
  };

  return { flashcards, addFlashcard, addFlashcards, updateFlashcard, deleteFlashcard };
}

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('studyx_tasks', []);
  const { awardXP } = useStudyStats();

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = { ...task, id: crypto.randomUUID() };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newCompleted = !t.completed;
          if (newCompleted) awardXP(15, 'Completed a task');
          return { ...t, completed: newCompleted };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  return { tasks, addTask, toggleTask, deleteTask, updateTask };
}

export function useStudyStats() {
  const [sessions, setSessions] = useLocalStorage<StudySession[]>('studyx_sessions', []);
  const [xp, setXp] = useLocalStorage<number>('studyx_xp', 0);
  const [streak, setStreak] = useLocalStorage<number>('studyx_streak', 0);
  const [lastStudyDate, setLastStudyDate] = useLocalStorage<string>('studyx_last_date', '');
  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorage<string[]>('studyx_achievements', []);
  const [unlockedRewards, setUnlockedRewards] = useLocalStorage<string[]>('studyx_rewards', []);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('studyx_notifications', []);
  const [profile, setProfile] = useLocalStorage<UserProfile>('studyx_profile', {
    name: 'John Doe',
    avatar: 'JD',
    bio: 'Premium Scholar • Member since March 2026',
  });

  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const xpForNextLevel = Math.pow(level, 2) * 100;
  const xpProgress = ((xp - Math.pow(level - 1, 2) * 100) / (xpForNextLevel - Math.pow(level - 1, 2) * 100)) * 100;

  const addNotification = useCallback((title: string, message: string, type: Notification['type']) => {
    const newNotif: Notification = {
      id: crypto.randomUUID(),
      title,
      message,
      type,
      timestamp: Date.now(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, [setNotifications]);

  const checkAchievements = useCallback((currentXp: number, currentSessions: number, currentStreak: number) => {
    ACHIEVEMENTS.forEach(achievement => {
      if (unlockedAchievements.includes(achievement.id)) return;

      let unlocked = false;
      if (achievement.requirement.type === 'xp' && currentXp >= achievement.requirement.value) unlocked = true;
      if (achievement.requirement.type === 'sessions' && currentSessions >= achievement.requirement.value) unlocked = true;
      if (achievement.requirement.type === 'streak' && currentStreak >= achievement.requirement.value) unlocked = true;

      if (unlocked) {
        setUnlockedAchievements(prev => [...prev, achievement.id]);
        addNotification('Achievement Unlocked!', `You've earned the "${achievement.title}" badge!`, 'achievement');
      }
    });
  }, [unlockedAchievements, setUnlockedAchievements, addNotification]);

  const awardXP = useCallback((amount: number, reason: string) => {
    setXp(prev => {
      const newXp = prev + amount;
      checkAchievements(newXp, sessions.length, streak);
      return newXp;
    });
    // Optional: add notification for XP gain if it's significant
  }, [setXp, checkAchievements, sessions.length, streak]);

  const addSession = (duration: number, type: 'pomodoro' | 'custom' | 'battle') => {
    let xpEarned = 0;
    if (type === 'pomodoro') xpEarned = 25; // Increased XP
    else if (type === 'battle') xpEarned = duration * 5;
    else xpEarned = duration * 2;

    const newSession: StudySession = {
      id: crypto.randomUUID(),
      duration,
      timestamp: Date.now(),
      type,
      xpEarned,
    };
    setSessions((prev) => {
      const newSessions = [...prev, newSession];
      checkAchievements(xp + xpEarned, newSessions.length, streak);
      return newSessions;
    });
    setXp((prev) => prev + xpEarned);

    // Streak logic
    const today = new Date().toISOString().split('T')[0];
    if (lastStudyDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = streak;
      if (lastStudyDate === yesterdayStr) {
        newStreak = streak + 1;
        setStreak(newStreak);
      } else {
        newStreak = 1;
        setStreak(1);
      }
      setLastStudyDate(today);
      checkAchievements(xp + xpEarned, sessions.length + 1, newStreak);
    }
  };

  const spendXP = (amount: number, rewardId: string) => {
    if (xp >= amount) {
      setXp(prev => prev - amount);
      setUnlockedRewards(prev => [...prev, rewardId]);
      addNotification('Reward Unlocked!', `You've unlocked a new item!`, 'system');
      return true;
    }
    return false;
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const checkReminders = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastReminderDate = window.localStorage.getItem('studyx_last_reminder_date');
    
    if (lastReminderDate === today) return;

    // Streak warning
    if (streak > 0) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastStudyDate === yesterdayStr) {
        addNotification('Streak Warning!', 'Study today to keep your streak alive!', 'streak');
      }
    }

    // General reminder
    addNotification('Daily Goal', 'Ready for a focus session? Let\'s hit your daily goal!', 'reminder');

    window.localStorage.setItem('studyx_last_reminder_date', today);
  }, [streak, lastStudyDate, addNotification]);

  return { 
    sessions, streak, xp, level, xpProgress, xpForNextLevel, 
    addSession, awardXP, 
    achievements: ACHIEVEMENTS, unlockedAchievements, 
    rewards: REWARDS, unlockedRewards, spendXP,
    notifications, markNotificationRead, clearNotifications,
    checkReminders,
    profile, updateProfile
  };
}

export function useMindMaps() {
  const [mindMaps, setMindMaps] = useLocalStorage<MindMap[]>('studyx_mindmaps', []);

  const addMindMap = (title: string, nodes: MindMapNode[] = [], edges: MindMapEdge[] = []) => {
    const newMap: MindMap = {
      id: crypto.randomUUID(),
      title,
      nodes,
      edges,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setMindMaps((prev) => [newMap, ...prev]);
    return newMap;
  };

  const updateMindMap = (id: string, updates: Partial<MindMap>) => {
    setMindMaps((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates, updatedAt: Date.now() } : m))
    );
  };

  const deleteMindMap = (id: string) => {
    setMindMaps((prev) => prev.filter((m) => m.id !== id));
  };

  return { mindMaps, addMindMap, updateMindMap, deleteMindMap };
}

export function useStudyPlanner() {
  const [plans, setPlans] = useLocalStorage<StudyPlan[]>('studyx_plans', []);
  const { awardXP } = useStudyStats();

  const addPlan = (plan: Omit<StudyPlan, 'id' | 'createdAt'>) => {
    const newPlan: StudyPlan = {
      ...plan,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setPlans((prev) => [newPlan, ...prev]);
    return newPlan;
  };

  const updatePlan = (id: string, updates: Partial<StudyPlan>) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deletePlan = (id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleSession = (planId: string, sessionId: string) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id === planId) {
          return {
            ...p,
            sessions: p.sessions.map((s) => {
              if (s.id === sessionId) {
                const newCompleted = !s.completed;
                if (newCompleted) awardXP(20, 'Completed a study session');
                return { ...s, completed: newCompleted };
              }
              return s;
            }),
          };
        }
        return p;
      })
    );
  };

  return { plans, addPlan, updatePlan, deletePlan, toggleSession };
}

export function useRevisionRadar() {
  const { notes } = useNotes();
  const { flashcards } = useFlashcards();

  const getRadarData = () => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const threeDays = 3 * oneDay;
    const sevenDays = 7 * oneDay;

    const notesStatus = notes.map(n => {
      const diff = now - n.updatedAt;
      if (diff < threeDays) return 'green';
      if (diff < sevenDays) return 'yellow';
      return 'red';
    });

    const flashcardsStatus = flashcards.map(f => {
      const diff = now - f.lastReviewed;
      if (diff < oneDay) return 'green';
      if (diff < threeDays) return 'yellow';
      return 'red';
    });

    const total = notesStatus.length + flashcardsStatus.length;
    const redCount = notesStatus.filter(s => s === 'red').length + flashcardsStatus.filter(s => s === 'red').length;
    const yellowCount = notesStatus.filter(s => s === 'yellow').length + flashcardsStatus.filter(s => s === 'yellow').length;

    return {
      redCount,
      yellowCount,
      total,
      needsReview: redCount > 0 || yellowCount > 5,
      flashcardsStatus: flashcards.map(f => {
        const diff = now - f.lastReviewed;
        if (diff < oneDay) return 'green';
        if (diff < threeDays) return 'yellow';
        return 'red';
      })
    };
  };

  const getFlashcardStatus = (lastReviewed: number) => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const threeDays = 3 * oneDay;
    const diff = now - lastReviewed;
    if (diff < oneDay) return 'green';
    if (diff < threeDays) return 'yellow';
    return 'red';
  };

  return { getRadarData, getFlashcardStatus };
}
