import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import type { BiomarkerEntry, BiomarkerName } from "@shared/schema";
import { biomarkerLabels } from "@shared/schema";

const colors = [
  "#2563eb", "#dc2626", "#16a34a", "#9333ea",
  "#ea580c", "#0891b2", "#4f46e5", "#be123c",
  "#15803d", "#86198f", "#b45309", "#0369a1",
  "#4338ca", "#be185d"
];

interface BiomarkerGraphProps {
  entries: BiomarkerEntry[];
  selectedBiomarkers: BiomarkerName[];
}

export default function BiomarkerGraph({ entries, selectedBiomarkers }: BiomarkerGraphProps) {
  const data = entries.map(entry => ({
    ...entry,
    date: format(new Date(entry.date), "MMM d"),
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 10]} />
        <Tooltip />
        <Legend />
        {selectedBiomarkers.map((biomarker, index) => (
          <Line
            key={biomarker}
            type="monotone"
            dataKey={biomarker}
            name={biomarkerLabels[biomarker]}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
