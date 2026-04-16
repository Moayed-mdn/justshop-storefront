// Assumes a global ApiResponse<T> type
// interface ApiResponse<T> {
//   success: true;
//   data: T;
//   message: string;
// }

import { ApiSuccess } from "./api";

export interface BreadcrumbItem {
  id: number;
  name: string;
  slug: string;
}

export type BreadcrumbResponse = ApiSuccess<BreadcrumbItem[]>;
