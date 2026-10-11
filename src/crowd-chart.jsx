import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const density = data.density;
    const color = density > 75 ? '#e11d48' : density > 55 ? '#d97706' : '#059669';
    const statusText = density > 75 ? 'Dense / Super-Crush' : density > 55 ? 'Moderate Occupancy' : 'Low Boarding';
    return (
      <div style={{
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        padding: '6px 10px',
        borderRadius: '8px',
        fontSize: '11px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
        border: '1px solid #334155',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ fontWeight: 800, color: '#f1f5f9' }}>{data.coach} ({data.type})</div>
        <div style={{ color: color, fontWeight: 800, marginTop: '2px' }}>
          {density}% Density · {statusText}
        </div>
        <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '1px' }}>
          {data.hint}
        </div>
      </div>
    );
  }
  return null;
}

export function CrowdBarChart({ data }) {
  return (
    <div style={{ width: '100%', height: 165 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 6, left: -22, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="label" 
            tick={{ fontSize: 9, fill: '#475569', fontWeight: 700 }}
            interval={0}
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={false}
          />
          <YAxis 
            domain={[0, 100]} 
            ticks={[0, 25, 50, 75, 100]}
            tick={{ fontSize: 8, fill: '#94a3b8', fontWeight: 600 }}
            tickFormatter={(v) => `${v}%`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} />
          <ReferenceLine y={80} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'Crush Line (80%)', position: 'insideTopRight', fill: '#e11d48', fontSize: 8, fontWeight: 700 }} />
          <Bar dataKey="density" radius={[4, 4, 0, 0]} animationDuration={500} maxBarSize={28}>
            {data.map((entry, index) => {
              const color = entry.density > 75 ? '#dc2626' : entry.density > 55 ? '#d97706' : '#059669';
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const rootMap = new Map();

window.renderCrowdDensityChart = function(containerId, coachData) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let root = rootMap.get(container);
  if (!root) {
    root = createRoot(container);
    rootMap.set(container, root);
  }

  root.render(<CrowdBarChart data={coachData} />);
};
