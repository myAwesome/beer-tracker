import { useEffect, useState } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getDailyAlcohol } from '../api';

function splitRollingData(rows, threshold = 14) {
    const result = [];

    for (let i = 0; i < rows.length; i++) {
        const curr = rows[i];
        const prev = result[result.length - 1];

        const val = Number(curr.rolling_7d ?? 0);

        const basePoint = {
            ...curr,
            rolling_safe: val <= threshold ? val : null,
            rolling_over: val > threshold ? val : null,
        };

        // якщо є попередня точка — перевіряємо перетин
        if (prev) {
            const prevVal = Number(prev.rolling_7d ?? 0);

            const crossed =
                (prevVal <= threshold && val > threshold) ||
                (prevVal > threshold && val <= threshold);

            if (crossed) {
                // лінійна інтерполяція
                const ratio =
                    (threshold - prevVal) / (val - prevVal);

                const interpolated = {
                    ...curr,
                    // зміщуємо "дату" між точками (для Recharts достатньо дубля)
                    date: curr.date + ' ',
                    rolling_7d: threshold,
                    rolling_safe: threshold,
                    rolling_over: threshold,
                };

                result.push(interpolated);
            }
        }

        result.push(basePoint);
    }

    return result;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 6,
      padding: '0.5rem 0.75rem',
      fontSize: '0.85rem',
    }}>
      <p style={{ margin: '0 0 0.25rem', fontWeight: 600 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ margin: '0.1rem 0', color: p.color }}>
          {p.name}: <strong>{p.value.toFixed(2)}</strong> units
        </p>
      ))}
    </div>
  );
};

export default function AlcoholChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDailyAlcohol()
      .then((rows) =>
          setData(
              splitRollingData(
                  rows.map((r) => {
                      const d = new Date(r.date);
                      return {
                          ...r,
                          date: d.toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                          }),
                      }
                  })
              )
          )
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p style={{ color: 'var(--text-muted)' }}>Loading chart…</p>;
  }

  if (data.length === 0) {
    return <p style={{ color: 'var(--text-muted)' }}>No consumption data yet.</p>;
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 1rem' }}>Alcohol Consumption</h2>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={false}
            unit=" U"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '0.85rem', paddingTop: '0.5rem' }}
          />
          <Bar
            dataKey="daily_units"
            name="Daily units"
            fill="var(--accent)"
            opacity={0.85}
            radius={[3, 3, 0, 0]}
            maxBarSize={40}
          />
            <Line
                dataKey="rolling_safe"
                name="7-day rolling"
                stroke="green"
                strokeWidth={2}
                dot={false}

            />

            <Line
                dataKey="rolling_over"
                stroke="var(--danger)"
                dot={false}
                strokeWidth={2}
                legendType="none"
            />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
