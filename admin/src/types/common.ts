import type { ReactNode } from 'react';

export type UUID = string;

export interface Paginated<T> {
  rows: T[];
  count: number;
}

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}
