import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import type { GhostId, ZoneId } from '@ghost-ui/core';
import { useGhostEngine } from './context.js';
import { useGhostOrder, useGhostScore, useRegisterNode } from './hooks.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GhostColumn<T = Record<string, unknown>> {
  id: GhostId;
  header: ReactNode;
  accessor: keyof T | ((row: T) => ReactNode);
  pinned?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface GhostDataTableProps<T = Record<string, unknown>> {
  zone: ZoneId;
  columns: GhostColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  rowZone?: ZoneId;
  className?: string;
  onRowClick?: (row: T) => void;
}

// ─── GhostColumnHeader ────────────────────────────────────────────────────────

interface GhostColumnHeaderProps {
  col: GhostColumn;
  zone: ZoneId;
  sortDir: 'asc' | 'desc' | null;
  onSort: (id: GhostId) => void;
}

function GhostColumnHeader({ col, zone, sortDir, onSort }: GhostColumnHeaderProps) {
  useRegisterNode(col.id, zone, { pinned: col.pinned });
  const engine = useGhostEngine();
  const score = useGhostScore(col.id);

  const handleClick = useCallback(() => {
    engine.record('click', col.id, zone);
    onSort(col.id);
  }, [engine, col.id, zone, onSort]);

  const borderGlow = score > 0.1
    ? `0 2px 0 rgba(139,141,248,${score})`
    : undefined;

  return (
    <th
      data-ghost-id={col.id}
      data-ghost-score={score.toFixed(2)}
      onClick={handleClick}
      aria-sort={sortDir === 'asc' ? 'ascending' : sortDir === 'desc' ? 'descending' : 'none'}
      style={{
        textAlign: col.align ?? 'left',
        width: col.width,
        cursor: 'pointer',
        userSelect: 'none',
        boxShadow: borderGlow,
        transition: 'box-shadow 240ms ease',
      }}
    >
      {col.header}
    </th>
  );
}

// ─── GhostTableRow ────────────────────────────────────────────────────────────

interface GhostTableRowProps<T> {
  row: T;
  rowId: string;
  rowZone: ZoneId;
  orderedColumns: GhostColumn<T>[];
  onClick?: (row: T) => void;
}

function GhostTableRow<T>({ row, rowId, rowZone, orderedColumns, onClick }: GhostTableRowProps<T>) {
  useRegisterNode(rowId, rowZone);
  const engine = useGhostEngine();
  const score = useGhostScore(rowId);
  const hoverStart = useRef<number | null>(null);

  const handleMouseEnter = useCallback(() => {
    hoverStart.current = performance.now();
    engine.record('hover', rowId, rowZone);
  }, [engine, rowId, rowZone]);

  const handleMouseLeave = useCallback(() => {
    if (hoverStart.current != null) {
      const ms = performance.now() - hoverStart.current;
      hoverStart.current = null;
      if (ms > 120) engine.record('dwell', rowId, rowZone, { ms });
    }
  }, [engine, rowId, rowZone]);

  const rowStyle: CSSProperties = {
    transition: 'background 200ms ease',
    boxShadow: score > 0.1
      ? `inset 3px 0 0 rgba(139,141,248,${score * 0.8})`
      : undefined,
  };

  return (
    <tr
      data-ghost-row-id={rowId}
      data-ghost-score={score.toFixed(2)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick ? () => onClick(row) : undefined}
      style={{ cursor: onClick ? 'pointer' : undefined, ...rowStyle }}
    >
      {orderedColumns.map((col) => {
        const cell =
          typeof col.accessor === 'function'
            ? col.accessor(row)
            : (row as Record<string, unknown>)[col.accessor as string] as ReactNode;
        return (
          <td key={col.id} style={{ textAlign: col.align ?? 'left', width: col.width }}>
            {cell}
          </td>
        );
      })}
    </tr>
  );
}

// ─── StaticTableRow (when rowZone not provided) ───────────────────────────────

interface StaticTableRowProps<T> {
  row: T;
  rowId: string;
  orderedColumns: GhostColumn<T>[];
  onClick?: (row: T) => void;
}

function StaticTableRow<T>({ row, rowId, orderedColumns, onClick }: StaticTableRowProps<T>) {
  return (
    <tr
      data-ghost-row-id={rowId}
      onClick={onClick ? () => onClick(row) : undefined}
      style={{ cursor: onClick ? 'pointer' : undefined, transition: 'background 200ms ease' }}
    >
      {orderedColumns.map((col) => {
        const cell =
          typeof col.accessor === 'function'
            ? col.accessor(row)
            : (row as Record<string, unknown>)[col.accessor as string] as ReactNode;
        return (
          <td key={col.id} style={{ textAlign: col.align ?? 'left', width: col.width }}>
            {cell}
          </td>
        );
      })}
    </tr>
  );
}

// ─── GhostDataTable ───────────────────────────────────────────────────────────

export function GhostDataTable<T = Record<string, unknown>>({
  zone,
  columns,
  data,
  rowKey,
  rowZone,
  className,
  onRowClick,
}: GhostDataTableProps<T>) {
  const order = useGhostOrder(zone);
  const [sortCol, setSortCol] = useState<GhostId | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = useCallback((id: GhostId) => {
    setSortCol((prev) => {
      if (prev === id) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        return id;
      }
      setSortDir('asc');
      return id;
    });
  }, []);

  const orderedColumns = useMemo(() => {
    const pinned = columns.filter((c) => c.pinned);
    const unpinned = columns.filter((c) => !c.pinned);

    if (order.length === 0) return [...pinned, ...unpinned] as GhostColumn<T>[];

    const indexById = new Map(order.map((id, i) => [id, i]));
    const sortedUnpinned = [...unpinned].sort((a, b) => {
      const ai = indexById.get(a.id) ?? Number.POSITIVE_INFINITY;
      const bi = indexById.get(b.id) ?? Number.POSITIVE_INFINITY;
      return ai - bi;
    });

    return [...pinned, ...sortedUnpinned] as GhostColumn<T>[];
  }, [columns, order]);

  const sortedData = useMemo(() => {
    if (!sortCol) return data;
    const col = columns.find((c) => c.id === sortCol);
    if (!col) return data;
    return [...data].sort((a, b) => {
      const av = typeof col.accessor === 'function' ? String(col.accessor(a)) : String((a as Record<string, unknown>)[col.accessor as string] ?? '');
      const bv = typeof col.accessor === 'function' ? String(col.accessor(b)) : String((b as Record<string, unknown>)[col.accessor as string] ?? '');
      const cmp = av.localeCompare(bv, undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortCol, sortDir, columns]);

  const allFixed = columns.every((c) => c.width);

  return (
    <table
      className={className}
      style={{ tableLayout: allFixed ? 'fixed' : 'auto', width: '100%', borderCollapse: 'collapse' }}
    >
      <thead>
        <tr>
          {orderedColumns.map((col) => (
            <GhostColumnHeader
              key={col.id}
              col={col as GhostColumn}
              zone={zone}
              sortDir={sortCol === col.id ? sortDir : null}
              onSort={handleSort}
            />
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row) => {
          const rk = rowKey(row);
          return rowZone ? (
            <GhostTableRow
              key={rk}
              row={row}
              rowId={rk}
              rowZone={rowZone}
              orderedColumns={orderedColumns}
              onClick={onRowClick}
            />
          ) : (
            <StaticTableRow
              key={rk}
              row={row}
              rowId={rk}
              orderedColumns={orderedColumns}
              onClick={onRowClick}
            />
          );
        })}
      </tbody>
    </table>
  );
}
