import { useState, useEffect } from "react";

const API = "http://localhost:8080/api/stats/consumption-by-days";

function rolling7(data, i) {
  let sum = 0;
  for (let j = i; j < Math.min(data.length, i + 6); j++) {
    sum += data[j].alcohol_units;
  }
  return sum;
}

function MiniBar({ value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 60, height: 6, borderRadius: 3, background: "var(--color-border-tertiary)", overflow: "hidden" }}>
        <span style={{ display: "block", width: `${pct}%`, height: "100%", borderRadius: 3, background: color }} />
      </span>
      <span>{value.toFixed(2)}</span>
    </span>
  );
}

const PERIODS = [7, 14, 30, 60];

export default function AlcoholStats() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API}?days=${days}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [days]);

  const rolls = data.map((_, i) => rolling7(data, i));
  const maxDay = Math.max(...data.map((d) => d.alcohol_units), 0);
  const maxRoll = Math.max(...rolls, 0);

  // Будуємо 7 днів вперед від сьогодні
const future7 = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i + 1);
  const key = date.toISOString().slice(0, 10);

  // rolling = сума останніх (6-i) днів з data (перші елементи — найновіші)
  let sum = 0;
  const take = Math.max(0, 6 - i);
  for (let j = 0; j < take; j++) {
    sum += data[j]?.alcohol_units ?? 0;
  }

  return { date: key, alcohol_units: 0, rolling: sum };
});

  return (
    <div style={{ fontFamily: "var(--font-sans)", padding: "1rem 0" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: "1.25rem" }}>
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setDays(p)}
            style={{
              padding: "5px 14px",
              borderRadius: "var(--border-radius-md)",
              border: "0.5px solid var(--color-border-secondary)",
              background: days === p ? "var(--color-background-secondary)" : "transparent",
              color: days === p ? "var(--color-text-primary)" : "var(--color-text-secondary)",
              fontWeight: days === p ? 500 : 400,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {p} днів
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "2rem 0", fontSize: 13, color: "var(--color-text-secondary)" }}>
          Завантаження...
        </div>
      )}

      {error && (
        <div style={{ textAlign: "center", padding: "2rem 0", fontSize: 13, color: "var(--color-text-danger)" }}>
          Помилка: {error}
        </div>
      )}

      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              {["Дата", "units per day", "7-day rolling"].map((h, i) => (
                <th
                  key={h}
                  style={{
                    textAlign: i === 0 ? "left" : "right",
                    padding: "6px 10px",
                    color: "var(--color-text-secondary)",
                    fontWeight: 500,
                    borderBottom: "0.5px solid var(--color-border-tertiary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {future7.reverse().map((row) => (
            <tr key={row.date}>
                <td style={{ padding: "7px 10px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                    {row.date}
                  </td>
                <td style={{ padding: "7px 10px", borderBottom: "0.5px solid var(--color-border-tertiary)", textAlign: "right" }}>
                <span style={{ color: "var(--color-text-tertiary)" }}>—</span>
                </td>
                 <td style={{ padding: "7px 10px", borderBottom: "0.5px solid var(--color-border-tertiary)", textAlign: "right" }}>
                {row.rolling === 0 ? (
                    <span style={{ color: "var(--color-text-tertiary)" }}>—</span>
                ) : (
                    <MiniBar value={row.rolling} max={maxRoll} color={row.rolling > 14 ? "#E24B4A" : "#1D9E75"}  />
                )}
                </td>
            </tr>
            ))}

            {data.map((row, i) => {
              const roll = rolls[i];
              return (
                <tr key={row.date}  style={i === 0 ? { backgroundColor: "#dbe8c2ff" } : {}} >
                  <td style={{ padding: "7px 10px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                    {row.date}
                  </td>
                  <td style={{ padding: "7px 10px", borderBottom: "0.5px solid var(--color-border-tertiary)", textAlign: "right" }}>
                    {row.alcohol_units === 0 ? (
                      <span style={{ color: "var(--color-text-tertiary)" }}>—</span>
                    ) : (
                      <MiniBar value={row.alcohol_units} max={maxDay} color="#378ADD" />
                    )}
                  </td>
                  <td style={{ padding: "7px 10px", borderBottom: "0.5px solid var(--color-border-tertiary)", textAlign: "right" }}>
                    {roll === 0 ? (
                      <span style={{ color: "var(--color-text-tertiary)" }}>—</span>
                    ) : (
                      <MiniBar value={roll} max={maxRoll} color={roll > 14 ? "#E24B4A" : "#1D9E75"}  />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
