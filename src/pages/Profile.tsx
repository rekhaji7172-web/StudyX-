/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Flame, 
  Zap, 
  Shield, 
  Lock, 
  CheckCircle2,
  ShoppingBag,
  Edit2,
  Save,
  X as CloseIcon,
  Camera,
  Layout,
  Palette,
  Clock,
  Brain,
  Sparkles,
  Settings
} from 'lucide-react';
import { useStudyStats, useFlashcards, useTasks } from '../hooks/useStudyData';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Profile() {
  const { 
    xp, 
    level, 
    streak, 
    xpProgress, 
    xpForNextLevel,
    achievements, 
    unlockedAchievements,
    rewards,
    unlockedRewards,
    spendXP,
    sessions,
    profile,
    updateProfile
  } = useStudyStats();

  const { flashcards } = useFlashcards();
  const { tasks } = useTasks();
  const completedTasks = tasks.filter(t => t.completed).length;

  const [activeTab, setActiveTab] = useState<'achievements' | 'store' | 'customize' | 'stats'>('stats');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editAvatar, setEditAvatar] = useState(profile.avatar);

  const totalSessions = sessions.length;
  const totalFocusTime = sessions.reduce((acc, s) => acc + s.duration, 0);

  const handleSaveProfile = () => {
    updateProfile({
      name: editName,
      bio: editBio,
      avatar: editAvatar
    });
    setIsEditing(false);
  };

  const handleApplyReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return;

    if (reward.type === 'frame') {
      updateProfile({ selectedFrame: rewardId });
    } else if (reward.type === 'background') {
      updateProfile({ selectedBackground: rewardId });
    }
  };

  const getFrameStyle = (frameId?: string) => {
    if (frameId === 'frame_gold') return 'border-4 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]';
    if (frameId === 'frame_neon') return 'border-4 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)] animate-pulse';
    return 'border-4 border-white';
  };

  const getBackgroundStyle = (bgId?: string) => {
    if (bgId === 'bg_stars') return 'bg-zinc-950 text-white';
    if (bgId === 'bg_forest') return 'bg-emerald-950 text-white';
    return 'bg-white text-zinc-900';
  };

  return (
    <div className="flex flex-col space-y-6 md:space-y-8 pb-24">
      {/* Profile Header */}
      <section className={`premium-card p-6 md:p-8 relative overflow-hidden transition-colors duration-500 ${getBackgroundStyle(profile.selectedBackground)}`}>
        {profile.selectedBackground === 'bg_stars' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        )}
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full -mr-32 -mt-32 opacity-20 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className={`w-32 h-32 rounded-[2.5rem] bg-brand-100 flex items-center justify-center text-brand-700 text-4xl font-black shadow-xl transition-all ${getFrameStyle(profile.selectedFrame)}`}>
              {profile.avatar}
            </div>
            {isEditing && (
              <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="text-white" size={24} />
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center font-bold border-4 border-white shadow-lg">
              {level}
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left w-full">
            {isEditing ? (
              <div className="space-y-4 max-w-md mx-auto md:mx-0">
                <input 
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-2xl font-bold focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="Your Name"
                />
                <textarea 
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                  placeholder="Your Bio or Study Goal"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleSaveProfile}
                    className="action-button flex items-center gap-2 px-4 py-2 text-sm"
                  >
                    <Save size={16} /> Save Changes
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="secondary-button flex items-center gap-2 px-4 py-2 text-sm"
                  >
                    <CloseIcon size={16} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <h1 className="text-3xl font-bold">{profile.name}</h1>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-brand-500 transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
                <p className="text-zinc-500 font-medium mt-1">{profile.bio}</p>
                
                <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
                  <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <Flame size={16} className="text-orange-500 fill-orange-500" />
                    <span className="text-xs md:text-sm font-bold">{streak} Day Streak</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <Zap size={16} className="text-brand-600 fill-brand-600" />
                    <span className="text-xs md:text-sm font-bold">{xp} Total XP</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <Trophy size={16} className="text-amber-500 fill-amber-500" />
                    <span className="text-xs md:text-sm font-bold">{unlockedAchievements.length} Badges</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="w-full md:w-64 bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Level {level} Progress</span>
              <span className="text-xs font-bold text-brand-600">{Math.round(xpProgress)}%</span>
            </div>
            <div className="h-3 bg-zinc-200/20 rounded-full overflow-hidden border border-white/10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                className="h-full bg-brand-600 rounded-full"
              />
            </div>
            <p className="text-[10px] text-zinc-400 mt-2 text-center font-bold uppercase tracking-tighter">
              {xpForNextLevel - xp} XP to Level {level + 1}
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex p-1.5 bg-slate-100 rounded-3xl gap-1 mb-8 w-fit mx-auto md:mx-0 overflow-x-auto no-scrollbar">
        {[
          { id: 'stats', label: 'Overview', icon: Trophy },
          { id: 'achievements', label: 'Achievements', icon: Sparkles },
          { id: 'store', label: 'Store', icon: ShoppingBag },
          { id: 'customize', label: 'Customize', icon: Palette },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all relative z-10",
              activeTab === tab.id 
                ? "text-brand-600" 
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <tab.icon size={18} />
            <span className="hidden sm:inline">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTabProfile"
                className="absolute inset-0 bg-white rounded-2xl -z-10 shadow-sm"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'stats' ? (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'Total Focus', value: `${Math.floor(totalFocusTime / 60)}h ${totalFocusTime % 60}m`, icon: Clock, color: 'brand' },
                { label: 'Current Streak', value: `${streak} Days`, icon: Flame, color: 'orange' },
                { label: 'Tasks Done', value: completedTasks, icon: CheckCircle2, color: 'emerald' },
                { label: 'Flashcards', value: flashcards.length, icon: Brain, color: 'blue' },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="premium-card p-6 flex flex-col items-center text-center group transition-all hover:shadow-xl"
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-inner",
                    stat.color === 'brand' ? "bg-brand-50 text-brand-600" :
                    stat.color === 'orange' ? "bg-orange-50 text-orange-600" :
                    stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                    "bg-blue-50 text-blue-600"
                  )}>
                    <stat.icon size={28} />
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                  <div className="text-xl font-black text-slate-900">{stat.value}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : activeTab === 'achievements' ? (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {achievements.map((achievement) => {
                const isUnlocked = unlockedAchievements.includes(achievement.id);
                return (
                  <div 
                    key={achievement.id}
                    className={`p-6 rounded-3xl border transition-all relative overflow-hidden group ${
                      isUnlocked 
                        ? 'bg-white border-brand-200 shadow-sm hover:shadow-md hover:border-brand-300' 
                        : 'bg-zinc-50/50 border-zinc-200 opacity-75 grayscale'
                    }`}
                  >
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{achievement.icon}</div>
                    <h3 className="font-bold text-zinc-900 mb-1">{achievement.title}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">{achievement.description}</p>
                    
                    {isUnlocked ? (
                      <div className="mt-4 flex items-center gap-1.5 text-emerald-600 text-[10px] font-bold uppercase tracking-widest">
                        <CheckCircle2 size={12} />
                        Unlocked
                      </div>
                    ) : (
                      <div className="mt-4 flex items-center gap-1.5 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                        <Lock size={12} />
                        Locked
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          ) : activeTab === 'store' ? (
            <motion.div
              key="store"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {rewards.map((reward) => {
                const isUnlocked = unlockedRewards.includes(reward.id);
                const canAfford = xp >= reward.cost;
                
                return (
                  <div 
                    key={reward.id}
                    className="premium-card p-6 flex flex-col"
                  >
                    <div className="w-full aspect-square bg-zinc-50 rounded-3xl mb-6 flex items-center justify-center text-5xl border border-zinc-100 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-brand-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                      {reward.preview}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-zinc-900">{reward.title}</h3>
                        <span className="text-[10px] font-black text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full uppercase">
                          {reward.type}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed mb-6">{reward.description}</p>
                    </div>

                    {isUnlocked ? (
                      <button 
                        disabled
                        className="w-full py-3 bg-emerald-50 text-emerald-600 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={16} />
                        Unlocked
                      </button>
                    ) : (
                      <button 
                        onClick={() => spendXP(reward.cost, reward.id)}
                        disabled={!canAfford}
                        className={`w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                          canAfford 
                            ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-100' 
                            : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                        }`}
                      >
                        <Zap size={16} className={canAfford ? 'fill-white' : ''} />
                        {reward.cost} XP
                      </button>
                    )}
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="customize"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="premium-card p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Layout size={20} className="text-brand-600" />
                  Profile Frames
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => updateProfile({ selectedFrame: undefined })}
                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                      !profile.selectedFrame ? 'border-brand-500 bg-brand-50' : 'border-zinc-100 hover:border-zinc-200'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-zinc-100 border-4 border-white" />
                    <span className="text-xs font-bold">Default</span>
                  </button>
                  {unlockedRewards.filter(id => rewards.find(r => r.id === id)?.type === 'frame').map(id => {
                    const reward = rewards.find(r => r.id === id);
                    return (
                      <button 
                        key={id}
                        onClick={() => handleApplyReward(id)}
                        className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                          profile.selectedFrame === id ? 'border-brand-500 bg-brand-50' : 'border-zinc-100 hover:border-zinc-200'
                        }`}
                      >
                        <div className={`w-16 h-16 rounded-2xl bg-zinc-100 ${getFrameStyle(id)}`} />
                        <span className="text-xs font-bold">{reward?.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="premium-card p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Palette size={20} className="text-brand-600" />
                  Background Styles
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => updateProfile({ selectedBackground: undefined })}
                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                      !profile.selectedBackground ? 'border-brand-500 bg-brand-50' : 'border-zinc-100 hover:border-zinc-200'
                    }`}
                  >
                    <div className="w-full h-12 rounded-xl bg-white border border-zinc-200" />
                    <span className="text-xs font-bold">Default Light</span>
                  </button>
                  {unlockedRewards.filter(id => rewards.find(r => r.id === id)?.type === 'background').map(id => {
                    const reward = rewards.find(r => r.id === id);
                    return (
                      <button 
                        key={id}
                        onClick={() => handleApplyReward(id)}
                        className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                          profile.selectedBackground === id ? 'border-brand-500 bg-brand-50' : 'border-zinc-100 hover:border-zinc-200'
                        }`}
                      >
                        <div className={`w-full h-12 rounded-xl ${
                          reward?.id === 'bg_stars' ? 'bg-zinc-950' : 
                          reward?.id === 'bg_forest' ? 'bg-emerald-950' : 
                          'bg-zinc-100'
                        }`} />
                        <span className="text-xs font-bold">{reward?.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
}
