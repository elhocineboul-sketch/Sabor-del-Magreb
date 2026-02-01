import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { MenuItem } from '../types';

interface NutritionChartProps {
  item: MenuItem;
}

const NutritionChart: React.FC<NutritionChartProps> = ({ item }) => {
  const data = [
    { subject: 'حرارة', A: item.spiciness, fullMark: 100 },
    { subject: 'حلاوة', A: item.sweetness, fullMark: 100 },
    { subject: 'بروتين', A: (item.protein / 60) * 100, fullMark: 100 }, // Normalized roughly
    { subject: 'نشويات', A: (item.carbs / 120) * 100, fullMark: 100 }, // Normalized roughly
    { subject: 'تقييم', A: (item.rating / 5) * 100, fullMark: 100 },
  ];

  return (
    <div className="w-full h-64 bg-white rounded-lg p-4">
      <h4 className="text-center font-bold text-orange-600 mb-2">ملف النكهة والقيمة الغذائية</h4>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#4B5563', fontSize: 12 }} />
          <Radar
            name={item.name}
            dataKey="A"
            stroke="#b91c1c"
            strokeWidth={2}
            fill="#fbbf24"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NutritionChart;