// Centralized mock data for the entire UI. Backend will replace these.

export type SourceType = "github" | "pdf" | "website" | "sql" | "api";
export type SourceStatus = "indexed" | "indexing" | "failed" | "pending";
export type QueryType = "code" | "document" | "graph" | "sql" | "api" | "hybrid";
export type Confidence = "high" | "medium" | "low";
export type PlanTier = "free" | "pro" | "enterprise";

export interface Workspace {
  id: string;
  name: string;
  description: string;
  sourceCount: number;
  lastActivity: string; // ISO
}

export interface Source {
  id: string;
  workspaceId: string;
  name: string;
  type: SourceType;
  status: SourceStatus;
  uri: string;
  addedAt: string;
  lastIndexedAt: string;
  chunkCount: number;
  entityCount: number;
  progress?: number;
}

export interface QueryRecord {
  id: string;
  workspaceId: string;
  text: string;
  type: QueryType;
  retrievers: string[];
  candidatesBefore: number;
  candidatesAfter: number;
  responseTimeMs: number;
  confidence: Confidence;
  createdAt: string;
  answer: string;
  sources: Citation[];
}

export interface Citation {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceType: SourceType;
  ref: string; // file path or page
  relevance: number; // 0..1
  snippet: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "failed" | "pending";
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  emailVerified: boolean;
  plan: PlanTier;
  onboardingComplete: boolean;
}

export const PLANS: Record<PlanTier, {
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  workspaces: number;
  sources: number;
  queries: number;
  graphAccess: boolean;
  apiAccess: boolean;
  description: string;
  features: { label: string; included: boolean }[];
}> = {
  free: {
    name: "Free", priceMonthly: 0, priceAnnual: 0,
    workspaces: 1, sources: 3, queries: 50, graphAccess: false, apiAccess: false,
    description: "Get started exploring your knowledge",
    features: [
      { label: "1 workspace", included: true },
      { label: "3 sources", included: true },
      { label: "50 queries / month", included: true },
      { label: "Knowledge graph explorer", included: false },
      { label: "API key access", included: false },
      { label: "Priority support", included: false },
    ],
  },
  pro: {
    name: "Pro", priceMonthly: 999, priceAnnual: 9990,
    workspaces: 5, sources: 25, queries: 500, graphAccess: true, apiAccess: true,
    description: "For serious teams and power users",
    features: [
      { label: "5 workspaces", included: true },
      { label: "25 sources", included: true },
      { label: "500 queries / month", included: true },
      { label: "Knowledge graph + mind map", included: true },
      { label: "API key access", included: true },
      { label: "Priority support", included: false },
    ],
  },
  enterprise: {
    name: "Enterprise", priceMonthly: 4999, priceAnnual: 49990,
    workspaces: Infinity, sources: Infinity, queries: Infinity, graphAccess: true, apiAccess: true,
    description: "Unlimited everything for organizations",
    features: [
      { label: "Unlimited workspaces", included: true },
      { label: "Unlimited sources", included: true },
      { label: "Unlimited queries", included: true },
      { label: "Knowledge graph + mind map", included: true },
      { label: "API key access", included: true },
      { label: "Priority support", included: true },
    ],
  },
};

export const MOCK_USER: User = {
  id: "u_1",
  fullName: "Aarav Mehta",
  email: "aarav@enterpriseiq.dev",
  emailVerified: true,
  plan: "free",
  onboardingComplete: true,
};

export const MOCK_USAGE = {
  queriesUsed: 41,
  sourcesUsed: 2,
  workspacesUsed: 1,
};

export const MOCK_WORKSPACES: Workspace[] = [
  { id: "ws_payments", name: "Payments Platform", description: "Microservices for billing, invoicing, and payment processing across regions.", sourceCount: 8, lastActivity: new Date(Date.now() - 1000*60*60*3).toISOString() },
  { id: "ws_auth", name: "Identity & Auth", description: "OAuth, SSO, session management, and access policies.", sourceCount: 5, lastActivity: new Date(Date.now() - 1000*60*60*26).toISOString() },
  { id: "ws_data", name: "Data Warehouse", description: "Analytical schemas, dbt models, and ETL pipelines.", sourceCount: 12, lastActivity: new Date(Date.now() - 1000*60*60*72).toISOString() },
];

export const MOCK_SOURCES: Source[] = [
  { id: "src_1", workspaceId: "ws_payments", name: "payments-api", type: "github", status: "indexed", uri: "github.com/acme/payments-api", addedAt: "2025-05-12T10:00:00Z", lastIndexedAt: "2025-05-30T08:14:00Z", chunkCount: 1284, entityCount: 312 },
  { id: "src_2", workspaceId: "ws_payments", name: "Stripe Integration Guide.pdf", type: "pdf", status: "indexed", uri: "uploads/stripe-guide.pdf", addedAt: "2025-05-14T11:00:00Z", lastIndexedAt: "2025-05-14T11:02:00Z", chunkCount: 92, entityCount: 48 },
  { id: "src_3", workspaceId: "ws_payments", name: "docs.acme.com", type: "website", status: "indexed", uri: "https://docs.acme.com", addedAt: "2025-05-20T11:00:00Z", lastIndexedAt: "2025-05-29T11:02:00Z", chunkCount: 504, entityCount: 188 },
  { id: "src_4", workspaceId: "ws_payments", name: "billing_db (Postgres)", type: "sql", status: "indexed", uri: "postgres://billing-prod", addedAt: "2025-05-22T11:00:00Z", lastIndexedAt: "2025-05-28T11:02:00Z", chunkCount: 0, entityCount: 64 },
  { id: "src_5", workspaceId: "ws_payments", name: "payments-openapi.yaml", type: "api", status: "indexed", uri: "uploads/payments-openapi.yaml", addedAt: "2025-05-25T11:00:00Z", lastIndexedAt: "2025-05-25T11:02:00Z", chunkCount: 41, entityCount: 89 },
  { id: "src_6", workspaceId: "ws_payments", name: "ledger-service", type: "github", status: "indexing", uri: "github.com/acme/ledger-service", addedAt: "2025-05-30T11:00:00Z", lastIndexedAt: "2025-05-30T11:02:00Z", chunkCount: 0, entityCount: 0, progress: 64 },
  { id: "src_7", workspaceId: "ws_payments", name: "fraud-rules.pdf", type: "pdf", status: "failed", uri: "uploads/fraud-rules.pdf", addedAt: "2025-05-29T11:00:00Z", lastIndexedAt: "2025-05-29T11:02:00Z", chunkCount: 0, entityCount: 0 },
  { id: "src_8", workspaceId: "ws_payments", name: "kafka-events.yaml", type: "api", status: "pending", uri: "uploads/kafka-events.yaml", addedAt: "2025-05-30T11:00:00Z", lastIndexedAt: "2025-05-30T11:02:00Z", chunkCount: 0, entityCount: 0 },
  { id: "src_9", workspaceId: "ws_auth", name: "auth-service", type: "github", status: "indexed", uri: "github.com/acme/auth-service", addedAt: "2025-04-12T10:00:00Z", lastIndexedAt: "2025-05-28T08:14:00Z", chunkCount: 944, entityCount: 218 },
  { id: "src_10", workspaceId: "ws_data", name: "dbt-models", type: "github", status: "indexed", uri: "github.com/acme/dbt-models", addedAt: "2025-03-12T10:00:00Z", lastIndexedAt: "2025-05-22T08:14:00Z", chunkCount: 2010, entityCount: 588 },
];

const sampleAnswer = `The payments service uses a **multi-layer authentication strategy** that combines OAuth 2.0 client credentials for service-to-service calls with HMAC-signed webhooks for callbacks from Stripe.

### Service-to-service
Internal callers obtain a short-lived JWT from the auth-service [SOURCE_1] and present it as a Bearer token. The token is verified in \`middleware/auth.ts\` against the JWKS endpoint.

\`\`\`ts
export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, jwks, { issuer: ISSUER });
  return payload;
}
\`\`\`

### Webhook callbacks
Stripe webhooks are verified using the signing secret described in the integration guide [SOURCE_2], with a 5-minute tolerance window to prevent replay attacks.

### Trust model
Calls that fail verification are logged to the audit trail [SOURCE_3] and return a \`401 Unauthorized\` response.`;

export const MOCK_QUERIES: QueryRecord[] = [
  {
    id: "q_1", workspaceId: "ws_payments",
    text: "How is authentication implemented in the payments service?",
    type: "code", retrievers: ["Code Retriever", "Document Retriever", "Graph Retriever"],
    candidatesBefore: 24, candidatesAfter: 6,
    responseTimeMs: 2840, confidence: "high",
    createdAt: new Date(Date.now() - 1000*60*12).toISOString(),
    answer: sampleAnswer,
    sources: [
      { id: "c1", sourceId: "src_1", sourceName: "payments-api", sourceType: "github", ref: "src/middleware/auth.ts:12", relevance: 0.94, snippet: "export async function verifyToken(token: string) {\n  const { payload } = await jwtVerify(token, jwks, { issuer: ISSUER });\n  return payload;\n}" },
      { id: "c2", sourceId: "src_2", sourceName: "Stripe Integration Guide.pdf", sourceType: "pdf", ref: "page 14", relevance: 0.88, snippet: "All incoming Stripe webhooks must be verified using the signing secret. Stripe recommends a tolerance window of 300 seconds to mitigate replay attacks." },
      { id: "c3", sourceId: "src_3", sourceName: "docs.acme.com", sourceType: "website", ref: "/security/audit-trail", relevance: 0.81, snippet: "Failed verification attempts are persisted in the audit_events table with the originating IP and request ID." },
    ],
  },
  {
    id: "q_2", workspaceId: "ws_payments",
    text: "What services depend on the ledger module?",
    type: "graph", retrievers: ["Graph Retriever"],
    candidatesBefore: 12, candidatesAfter: 4,
    responseTimeMs: 1120, confidence: "medium",
    createdAt: new Date(Date.now() - 1000*60*60*5).toISOString(),
    answer: "Three services declare a runtime dependency on `ledger`: `invoicing-service`, `refunds-worker`, and `reporting-api` [SOURCE_1]. Of these, `refunds-worker` calls `ledger.reverse()` synchronously while the others publish events.",
    sources: [
      { id: "c4", sourceId: "src_1", sourceName: "payments-api", sourceType: "github", ref: "services/*/package.json", relevance: 0.79, snippet: "\"dependencies\": { \"@acme/ledger\": \"^4.2.0\" }" },
    ],
  },
  {
    id: "q_3", workspaceId: "ws_payments",
    text: "Show me the schema of the invoices table",
    type: "sql", retrievers: ["SQL Retriever"],
    candidatesBefore: 3, candidatesAfter: 1,
    responseTimeMs: 480, confidence: "high",
    createdAt: new Date(Date.now() - 1000*60*60*22).toISOString(),
    answer: "The `invoices` table has 11 columns including `id`, `customer_id`, `amount_cents`, `currency`, `status`, and `issued_at` [SOURCE_1]. It is indexed on `customer_id` and `status`.",
    sources: [
      { id: "c5", sourceId: "src_4", sourceName: "billing_db (Postgres)", sourceType: "sql", ref: "public.invoices", relevance: 0.97, snippet: "CREATE TABLE invoices ( id uuid PRIMARY KEY, customer_id uuid NOT NULL, amount_cents bigint NOT NULL, currency char(3), status text, issued_at timestamptz );" },
    ],
  },
  {
    id: "q_4", workspaceId: "ws_payments",
    text: "Does the API support partial refunds?",
    type: "api", retrievers: ["Document Retriever", "API Retriever"],
    candidatesBefore: 8, candidatesAfter: 2,
    responseTimeMs: 1980, confidence: "low",
    createdAt: new Date(Date.now() - 1000*60*60*48).toISOString(),
    answer: "Partial refunds appear to be supported through the `amount` field on `POST /refunds`, but documentation is sparse and there is no explicit test coverage [SOURCE_1].",
    sources: [
      { id: "c6", sourceId: "src_5", sourceName: "payments-openapi.yaml", sourceType: "api", ref: "/refunds POST", relevance: 0.62, snippet: "amount: { type: integer, description: 'Amount in cents. If omitted, the full charge is refunded.' }" },
    ],
  },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: "inv_1031", date: "2025-05-01", amount: 0, status: "paid" },
  { id: "inv_1030", date: "2025-04-01", amount: 0, status: "paid" },
  { id: "inv_1029", date: "2025-03-01", amount: 0, status: "paid" },
];

export const MOCK_FOLLOWUPS = [
  "How are tokens rotated?",
  "What happens if a webhook signature is invalid?",
  "Show me the audit_events schema",
];
