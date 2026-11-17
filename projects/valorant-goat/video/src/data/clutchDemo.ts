// DEMO NUMBERS ONLY. Shapes match what the scoring will output; values are made up
// so the motion can be judged before the real data exists.
import { random } from "remotion";

export type FieldPlayer = { id: string; name: string; team: string; teamColor: string; score: number };

const TEAMS: [string, string][] = [
  ["FNC", "#FF6A13"], ["LEV", "#00AEEF"], ["SEN", "#E4002B"], ["PRX", "#8E44AD"], ["DRX", "#2E86DE"],
  ["LOUD", "#00D26A"], ["EG", "#1D3E8A"], ["NAVI", "#FFE500"], ["EDG", "#C8102E"], ["TH", "#F2C94C"],
  ["G2", "#D0D0D0"], ["FUT", "#F7F7F7"], ["NRG", "#F15A24"], ["T1", "#E2012D"], ["GEN", "#AA8A00"],
];

export const TOP5: FieldPlayer[] = [
  { id: "p1", name: "Chronicle", team: "FNC", teamColor: "#FF6A13", score: 94.2 },
  { id: "p2", name: "aspas", team: "LEV", teamColor: "#00AEEF", score: 91.7 },
  { id: "p3", name: "Derke", team: "FNC", teamColor: "#FF6A13", score: 89.9 },
  { id: "p4", name: "Less", team: "LOUD", teamColor: "#00D26A", score: 88.4 },
  { id: "p5", name: "something", team: "PRX", teamColor: "#8E44AD", score: 87.1 },
];

// Key raw stat shown under each countdown row (demo values)
export const KEY_STAT: Record<string, string> = {
  p1: "1vX won 31%", p2: "1vX won 29%", p3: "1vX won 28%", p4: "1vX won 27%", p5: "1vX won 26%",
};

const rest: FieldPlayer[] = Array.from({ length: 59 }, (_, i) => {
  const [team, teamColor] = TEAMS[i % TEAMS.length];
  // roughly normal around 52, spread ~12, capped below the top 5
  const u = (random(`a${i}`) + random(`b${i}`) + random(`c${i}`)) / 3;
  const score = Math.min(84, Math.max(14, 52 + (u - 0.5) * 70));
  return { id: `f${i}`, name: `P${i + 6}`, team, teamColor, score };
});

export const FIELD: FieldPlayer[] = [...TOP5, ...rest];
export const MEDIAN = 52;
