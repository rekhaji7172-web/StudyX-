/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Subject = 'Math' | 'Science' | 'History' | 'Languages' | 'General' | string;

export interface Note {
  id: string;
  title: string;
  content: string;
  subject: Subject;
  createdAt: number;
  updatedAt: number;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subject: Subject;
  masteryLevel: number; // 0 to 5
  lastReviewed: number;
}

export interface Task {
  id: string;
  title: string;
  deadline?: string;
  completed: boolean;
  subject: Subject;
  priority: 'low' | 'medium' | 'high';
}

export interface StudySession {
  id: string;
  duration: number; // minutes
  timestamp: number;
  type: 'pomodoro' | 'custom' | 'battle';
  xpEarned: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  requirement: {
    type: 'xp' | 'sessions' | 'streak' | 'tasks';
    value: number;
  };
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  type: 'theme' | 'timer' | 'frame' | 'background';
  preview: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'achievement' | 'streak' | 'system';
  timestamp: number;
  read: boolean;
}

export interface UserProfile {
  name: string;
  avatar: string;
  bio: string;
  selectedFrame?: string;
  selectedBackground?: string;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  totalStudyTime: number;
  lastStudyDate: string;
  achievements: string[]; // IDs
  unlockedRewards: string[]; // IDs
  notifications: Notification[];
}

export interface AmbientSound {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export interface MindMapNode {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  icon?: string;
}

export interface MindMapEdge {
  id: string;
  from: string;
  to: string;
}

export interface MindMap {
  id: string;
  title: string;
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  updatedAt: number;
  createdAt: number;
}

export interface PlannerSession {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  topic: string;
  duration: number; // hours
  completed: boolean;
}

export interface StudyPlan {
  id: string;
  subject: string;
  examDate: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  dailyHours: number;
  sessions: PlannerSession[];
  createdAt: number;
}
