/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { useFlashcards } from '../../hooks/useStudyData';

export default function MasteryChart() {
  const { flashcards } = useFlashcards();

  const data = React.useMemo(() => {
    const levels = [0, 1, 2, 3, 4, 5];
    return levels.map(level => ({
      name: `Level ${level}`,
      value: flashcards.filter(c => c.masteryLevel === level).length,
      level
    })).filter(d => d.value > 0);
  }, [flashcards]);

  const COLORS = ['#f4f4f5', '#e0e7ff', '#c7d2fe', '#818cf8', '#6366f1', '#4f46e5'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-xl">
          <p className="text-sm font-bold text-zinc-900">{payload[0].name}</p>
          <p className="text-xs font-medium text-zinc-500">{payload[0].value} cards</p>
        </div>
      );
    }
    return null;
  };

  if (flashcards.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
          <PieChartIcon size={24} className="text-zinc-200" />
        </div>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">No cards yet</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.level % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
