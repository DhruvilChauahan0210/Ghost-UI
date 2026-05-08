export type GhostId = string;
export type ZoneId = string;

export type GhostEventType = 'click' | 'hover' | 'dwell' | 'miss' | 'rage';

/** CSS Grid area tier assigned by the optimizer. Primary = highest scored, tertiary = rest. */
export type GravityTier = 'primary' | 'secondary' | 'tertiary';

export interface GhostEvent {
  id: GhostId;
  zone: ZoneId;
  type: GhostEventType;
  ts: number;
  /** hover/dwell duration in ms */
  ms?: number;
  /** miss offset (px) */
  dx?: number;
  dy?: number;
  /** click followed by quick reversal */
  regret?: boolean;
}

export interface GhostNode {
  id: GhostId;
  zone: ZoneId;
  /** dev-supplied prior weight; default 0 */
  weight?: number;
  /** when true the optimizer never reorders or dims this node */
  pinned?: boolean;
}

export interface LayoutPlan {
  /** ordered list of ghost ids per zone, highest score first */
  order: Record<ZoneId, GhostId[]>;
  /** 0..1 emphasis level — drives glow intensity */
  emphasis: Record<GhostId, number>;
  /** hit-box expansion in pixels per side */
  hitbox: Record<GhostId, { top: number; right: number; bottom: number; left: number }>;
  /** CSS Grid area tier per node — primary / secondary / tertiary */
  area?: Record<GhostId, GravityTier>;
  /** Normalized canvas position (0.0–1.0 of container dimensions). Used by GhostCanvas Phase B. */
  position?: Record<GhostId, { x: number; y: number }>;
  /** generated at */
  ts: number;
}

export interface ScoringWeights {
  click: number;
  hover: number;
  dwell: number;
  recency: number;
  regret: number;
  rage: number;
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  click: 3,
  hover: 0.5,
  dwell: 0.001,
  recency: 1.5,
  regret: -4,
  rage: -6,
};
