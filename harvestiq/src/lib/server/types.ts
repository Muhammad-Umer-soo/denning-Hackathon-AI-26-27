export type DataFreshnessStatus =
  | "live"
  | "delayed"
  | "latest_reported"
  | "preliminary"
  | "final"
  | "sample";

export type ProvenanceMetadata = {
  source: string;
  unit?: string;
  asOf: string;
  status: DataFreshnessStatus;
  reportingPeriod?: string;
  coverage?: string;
  disclaimer?: string;
  recordCount?: number;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: ProvenanceMetadata;
};

export type UserRole = "farmer" | "officer" | "planner" | "admin";

export type AuthContext = {
  userId: string;
  role: UserRole;
  pilotDistrict?: string;
};
