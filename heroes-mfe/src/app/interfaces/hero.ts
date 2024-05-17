import { SortDirection } from "@angular/material/sort";

export interface Hero {
  id: number;
  name: string;
}

export interface HeroResult {
  heroes: Hero[];
  total: number;
}


export class HeroFilter {
  pageIndex = 0;
  pageSize = 10;
  name = '';
  sortField = 'name';
  sortDirection = 'asc' as SortDirection;
}
