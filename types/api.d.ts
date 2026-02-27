interface ApiResponse<T> {
    status: string;
    message: string | null;
    data: T;
  }