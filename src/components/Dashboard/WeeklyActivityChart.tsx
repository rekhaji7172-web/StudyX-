/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useStudyStats } from '../../hooks/useStudyData';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';

export default function WeeklyActivityChart() {
  const { sessions } = useStudyStats();

  const data = React.useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const daySessions = sessions.filter(s => isSameDay(new Date(s.timestamp), date));
      const totalMinutes = daySessions.reduce((acc, s) => acc + s.duration, 0);
      
      return {
        name: format(date, 'EEE'),
        minutes: totalMinutes,
        fullDate: format(date, 'MMM d'),
      };
    });
    return last7Days;
  }, [sessions]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-xl">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{payload[0].payload.fullDate}</p>
          <p className="text-sm font-bold text-zinc-900">{payload[0].value} mins focused</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fontWeight: 600, fill: '#a1a1aa' }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fontWeight: 600, fill: '#a1a1aa' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f4f4f5', radius: 8 }} />
          <Bar 
            dataKey="minutes" 
            radius={[6, 6, 0, 0]} 
            barSize={32}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === 6 ? '#4f46e5' : '#e0e7ff'} 
                className="transition-all duration-300 hover:fill-brand-500"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
