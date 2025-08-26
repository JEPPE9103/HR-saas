import { collection, type Firestore } from "firebase/firestore";

export type UserDoc = {
  uid: string;
  email: string;
  name?: string;
  companyId?: string;
  role: "owner" | "admin" | "viewer";
  createdAt: number;
  lastLoginAt: number;
};

export type CompanyDoc = {
  id: string;
  name: string;
  country?: string; // ISO 2
  plan: "free" | "team" | "enterprise";
  createdAt: number;
  createdBy: string; // uid
  members: string[]; // uids
};

export type DatasetDoc = {
  id: string;
  companyId: string;
  label: string; // ex: '2025-Q3'
  rowCount: number;
  status: "ready" | "processing" | "failed";
  createdAt: number;
  createdBy: string;
  source: "upload" | "demo";
};

// Firestore refs
export const usersRef = (db: Firestore) => collection(db, "users");
export const companiesRef = (db: Firestore) => collection(db, "companies");
export const datasetsRef = (db: Firestore) => collection(db, "datasets");
export const insightsRef = (db: Firestore) => collection(db, "insights");
export const metricsRef = (db: Firestore) => collection(db, "metrics");
export const reportsRef = (db: Firestore) => collection(db, "reports");


