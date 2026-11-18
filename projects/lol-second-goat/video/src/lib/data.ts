// Typed access to video/src/data/league.json (written by scoring/export_league.py).
import raw from "../data/league.json";

export type Player = {
  id: string; link: string; name: string; role: string; region: string; regions: string; years: string; games: number;
  rank: number; score: number; vsFaker: number; photo: string | null; color: string;
  cats: Record<string, number>;
  raw: Record<string, number>;
  titles: { worlds: number; msi: number; first_stand: number; domestic: number; mvps: number };
  trophyPts: number; rawPts: number; soloCarryPts: number; allpro: number; coveredSplits: number; eliteYears: number;
  peakYear: number | null; teamLift: number;
  stats: { gd15?: number; csd15?: number; xpd15?: number; kills_pg?: number; deaths_pg?: number; kda?: number; kp?: number;
    dshare?: number; vis_pm?: number; dpm?: number; wr?: number; intl_games?: number; intl_wr?: number; teams?: string[] };
};
export const D = raw as unknown as {
  meta: { tournaments: number; games: number; players: number; pool: number; minGames: number; firstYear: number; lastYear: number;
    weights: Record<string, number>; trophyPoints: any };
  players: Player[];
  boards: Record<string, string[]>;
  roleBoards: Record<string, Record<string, string[]>>;
  sweep: { w: number; top: [string, number][] }[];
  shuffle: { first: [string, number][]; second: [string, number][] };
  variants: Record<string, { top: [string, number][]; rank: Record<string, number> }>;
  worlds: { year: number; team: string; players: [string, string, number][] }[];
  regionStrength: Record<string, Record<string, number>>;
  validation: any[];
  fittedWeights: Record<string, number>;
};
const byId: Record<string, Player> = {};
D.players.forEach((p) => (byId[p.id] = p));
export const P = (id: string): Player => {
  const p = byId[id];
  if (!p) throw new Error("unknown player " + id);
  return p;
};
export const has = (id: string) => !!byId[id];
export const ranked = () => D.players; // already sorted by score
export const fmt = (x: number | null | undefined, d = 0) => (x === null || x === undefined ? "–" : x.toFixed(d));
export const sign = (x: number | null | undefined, d = 0) => (x === null || x === undefined ? "–" : (x > 0 ? "+" : "") + x.toFixed(d));
