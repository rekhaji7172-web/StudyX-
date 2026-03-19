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
    if (frameId === 'frame_gold') return 'ring-4 ring-amber-400 ring-offset-4 ring-offset-slate-900 shadow-[0_0_25px_rgba(251,191,36,0.4)]';
    if (frameId === 'frame_neon') return 'ring-4 ring-purple-500 ring-offset-4 ring-offset-slate-900 shadow-[0_0_30px_rgba(168,85,247,0.5)] animate-pulse';
    return 'ring-4 ring-white/20 ring-offset-4 ring-offset-slate-900';
  };

  const getBackgroundStyle = (bgId?: string) => {
    if (bgId === 'bg_stars') return 'bg-slate-950 text-white';
    if (bgId === 'bg_forest') return 'bg-emerald-950 text-white';
    return 'bg-slate-900/40 text-white';
  };

  return (
    <div className="flex flex-col space-y-6 md:space-y-8 pb-24">
      {/* Profile Header */}
      <section className={cn(
        "premium-card p-6 md:p-10 relative overflow-hidden transition-all duration-500 border border-white/10",
        getBackgroundStyle(profile.selectedBackground)
      )}>
        {profile.selectedBackground === 'bg_stars' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0.1, 0.6, 0.1],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
                className="absolute w-0.5 h-0.5 bg-white rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        )}
        
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500 rounded-full -mr-40 -mt-40 opacity-10 blur-[100px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className={cn(
              "w-36 h-36 rounded-[2.5rem] bg-brand-500/20 flex items-center justify-center text-white text-5xl font-black shadow-2xl transition-all duration-500 group-hover:scale-105",
              getFrameStyle(profile.selectedFrame)
            )}>
              {profile.avatar}
            </div>
            {isEditing && (
              <div className="absolute inset-0 bg-black/60 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                <Camera className="text-white" size={28} />
              </div>
            )}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-2 -right-2 w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 rounded-2xl flex items-center justify-center font-black text-lg border-4 border-slate-900 shadow-xl"
            >
              {level}
            </motion.div>
          </div>
          
          <div className="flex-1 text-center md:text-left w-full">
            {isEditing ? (
              <div className="space-y-4 max-w-md mx-auto md:mx-0">
                <input 
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-2xl font-bold focus:ring-2 focus:ring-brand-500 outline-none text-white placeholder:text-slate-500"
                  placeholder="Your Name"
                />
                <textarea 
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none text-slate-300 placeholder:text-slate-500"
                  placeholder="Your Bio or Study Goal"
                  rows={2}
                />
                <div className="flex gap-3">
                  <button 
                    onClick={handleSaveProfile}
                    className="action-button flex items-center gap-2 px-6 py-2.5 text-sm"
                  >
                    <Save size={18} /> Save Changes
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="secondary-button flex items-center gap-2 px-6 py-2.5 text-sm"
                  >
                    <CloseIcon size={18} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <h1 className="text-4xl font-black tracking-tight text-white">{profile.name}</h1>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-brand-400 transition-all border border-white/5"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
                <p className="text-slate-400 font-bold mt-2 text-lg max-w-xl">{profile.bio}</p>
                
                <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
                  <div className="flex items-center gap-2.5 px-5 py-2.5 bg-orange-500/10 rounded-2xl border border-orange-500/20 backdrop-blur-md shadow-lg group hover:scale-105 transition-transform">
                    <Flame size={18} className="text-orange-500 fill-orange-500 group-hover:animate-bounce" />
                    <span className="text-sm font-black text-orange-400">{streak} Day Streak</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-5 py-2.5 bg-brand-500/10 rounded-2xl border border-brand-500/20 backdrop-blur-md shadow-lg group hover:scale-105 transition-transform">
                    <Zap size={18} className="text-brand-400 fill-brand-400 group-hover:animate-pulse" />
                    <span className="text-sm font-black text-brand-400">{xp} Total XP</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-5 py-2.5 bg-amber-500/10 rounded-2xl border border-amber-500/20 backdrop-blur-md shadow-lg group hover:scale-105 transition-transform">
                    <Trophy size={18} className="text-amber-500 fill-amber-500 group-hover:rotate-12" />
                    <span className="text-sm font-black text-amber-400">{unlockedAchievements.length} Badges</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="w-full md:w-72 bg-slate-900/60 p-8 rounded-[2rem] border border-white/10 backdrop-blur-xl shadow-2xl">
            <div className="flex justify-between items-end mb-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Level {level} Progress</span>
              <span className="text-sm font-black text-brand-400">{Math.round(xpProgress)}%</span>
            </div>
            <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 p-1 shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full shadow-[0_0_15px_rgba(92,103,232,0.5)]"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-3 text-center font-bold uppercase tracking-widest">
              {xpForNextLevel - xp} XP to Level {level + 1}
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex p-2 bg-slate-900/50 backdrop-blur-xl rounded-[2rem] gap-2 mb-8 w-fit mx-auto md:mx-0 overflow-x-auto no-scrollbar border border-white/5 shadow-xl">
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
              "flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-black transition-all relative z-10",
              activeTab === tab.id 
                ? "text-white" 
                : "text-slate-500 hover:text-slate-300"
            )}
          >
            <tab.icon size={20} />
            <span className="hidden sm:inline uppercase tracking-widest text-[10px]">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTabProfile"
                className="absolute inset-0 bg-brand-500 rounded-2xl -z-10 shadow-[0_8px_20px_rgba(92,103,232,0.4)]"
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
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="premium-card p-8 flex flex-col items-center text-center group transition-all border border-white/5 hover:border-brand-500/30"
                >
                  <div className={cn(
                    "w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110 shadow-2xl",
                    stat.color === 'brand' ? "bg-brand-500/20 text-brand-400" :
                    stat.color === 'orange' ? "bg-orange-500/20 text-orange-400" :
                    stat.color === 'emerald' ? "bg-emerald-500/20 text-emerald-400" :
                    "bg-blue-500/20 text-blue-400"
                  )}>
                    <stat.icon size={32} />
                  </div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{stat.label}</div>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
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
                    className={cn(
                      "p-8 rounded-[2rem] border transition-all duration-500 relative overflow-hidden group",
                      isUnlocked 
                        ? 'bg-slate-900/40 border-brand-500/30 shadow-2xl hover:border-brand-500 hover:shadow-brand-500/10' 
                        : 'bg-slate-900/20 border-white/5 opacity-50 grayscale'
                    )}
                  >
                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">{achievement.icon}</div>
                    <h3 className="text-lg font-black text-white mb-2">{achievement.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">{achievement.description}</p>
                    
                    {isUnlocked ? (
                      <div className="mt-6 flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        <CheckCircle2 size={14} />
                        Unlocked
                      </div>
                    ) : (
                      <div className="mt-6 flex items-center gap-2 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
                        <Lock size={14} />
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
                    className="premium-card p-8 flex flex-col border border-white/5 hover:border-brand-500/30 transition-all"
                  >
                    <div className="w-full aspect-square bg-slate-950 rounded-[2rem] mb-8 flex items-center justify-center text-6xl border border-white/5 relative overflow-hidden group shadow-inner">
                      <div className="absolute inset-0 bg-brand-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                      <div className="relative z-10 group-hover:scale-125 transition-transform duration-500">{reward.preview}</div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-black text-white">{reward.title}</h3>
                        <span className="text-[10px] font-black text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full uppercase tracking-widest">
                          {reward.type}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed mb-8 font-medium">{reward.description}</p>
                    </div>

                    {isUnlocked ? (
                      <button 
                        disabled
                        className="w-full py-4 bg-emerald-500/10 text-emerald-400 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-emerald-500/20"
                      >
                        <CheckCircle2 size={18} />
                        Unlocked
                      </button>
                    ) : (
                      <button 
                        onClick={() => spendXP(reward.cost, reward.id)}
                        disabled={!canAfford}
                        className={cn(
                          "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all duration-300 shadow-xl",
                          canAfford 
                            ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-brand-500/20' 
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                        )}
                      >
                        <Zap size={18} className={canAfford ? 'fill-white' : ''} />
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
              <div className="premium-card p-10 border border-white/5">
                <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-white">
                  <Layout size={24} className="text-brand-400" />
                  Profile Frames
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <button 
                    onClick={() => updateProfile({ selectedFrame: undefined })}
                    className={cn(
                      "p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-4 group",
                      !profile.selectedFrame ? 'border-brand-500 bg-brand-500/10' : 'border-white/5 bg-slate-900/40 hover:border-white/20'
                    )}
                  >
                    <div className="w-20 h-20 rounded-[1.5rem] bg-slate-800 border-4 border-slate-700 shadow-inner" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Default</span>
                  </button>
                  {unlockedRewards.filter(id => rewards.find(r => r.id === id)?.type === 'frame').map(id => {
                    const reward = rewards.find(r => r.id === id);
                    return (
                      <button 
                        key={id}
                        onClick={() => handleApplyReward(id)}
                        className={cn(
                          "p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-4 group",
                          profile.selectedFrame === id ? 'border-brand-500 bg-brand-500/10' : 'border-white/5 bg-slate-900/40 hover:border-white/20'
                        )}
                      >
                        <div className={cn("w-20 h-20 rounded-[1.5rem] bg-slate-800", getFrameStyle(id))} />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">{reward?.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="premium-card p-10 border border-white/5">
                <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-white">
                  <Palette size={24} className="text-brand-400" />
                  Background Styles
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <button 
                    onClick={() => updateProfile({ selectedBackground: undefined })}
                    className={cn(
                      "p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-4 group",
                      !profile.selectedBackground ? 'border-brand-500 bg-brand-500/10' : 'border-white/5 bg-slate-900/40 hover:border-white/20'
                    )}
                  >
                    <div className="w-full h-16 rounded-2xl bg-slate-900 border border-white/10 shadow-inner" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Default Dark</span>
                  </button>
                  {unlockedRewards.filter(id => rewards.find(r => r.id === id)?.type === 'background').map(id => {
                    const reward = rewards.find(r => r.id === id);
                    return (
                      <button 
                        key={id}
                        onClick={() => handleApplyReward(id)}
                        className={cn(
                          "p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-4 group",
                          profile.selectedBackground === id ? 'border-brand-500 bg-brand-500/10' : 'border-white/5 bg-slate-900/40 hover:border-white/20'
                        )}
                      >
                        <div className={cn("w-full h-16 rounded-2xl shadow-inner", 
                          reward?.id === 'bg_stars' ? 'bg-slate-950' : 
                          reward?.id === 'bg_forest' ? 'bg-emerald-950' : 
                          'bg-slate-800'
                        )} />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">{reward?.title}</span>
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
