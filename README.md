# @sfpy/raast-sdk

Auto-generated TypeScript SDK for Safepay's Raast Wire API, built from the [OpenAPI 3.1.0 specification](https://github.com/getsafepay/raast-docs/blob/main/api-reference/openapi.yaml).

Uses `@hey-api/openapi-ts` to generate fully-typed API methods, request/response types, and schemas from the spec. The HTTP client is Axios.

## What's Generated

| File                            | Contents                                                                   |
| ------------------------------- | -------------------------------------------------------------------------- |
| `src/generated/services.gen.ts` | One function per API endpoint (39 total) with JSDoc comments               |
| `src/generated/types.gen.ts`    | TypeScript interfaces for all request params, response bodies, and schemas |
| `src/generated/schemas.gen.ts`  | Runtime schema definitions                                                 |
| `src/generated/core/`           | Axios HTTP client, error classes, cancellation support                     |

The build outputs three formats:

- **CommonJS** (`dist/cjs/`) - for `require()`
- **ES Modules** (`dist/esm/`) - for `import`
- **Type Declarations** (`dist/types/`) - `.d.ts` files

## OpenAPI Source

The spec is fetched from:

```
https://raw.githubusercontent.com/getsafepay/raast-docs/main/api-reference/openapi.yaml
```

When the spec updates in the `raast-docs` repo, regenerate this SDK (see below).

## Regenerating the SDK

When the OpenAPI spec changes in the [raast-docs](https://github.com/getsafepay/raast-docs) repo:

```bash
# 1. Clean old generated code and build artifacts
pnpm run clean

# 2. Regenerate from the latest remote spec + rebuild
pnpm run build
```

That's it. `pnpm run build` automatically fetches the latest `openapi.yaml` from GitHub, regenerates `src/generated/`, and compiles everything.

If you have a local copy of `openapi.yaml` instead:

```bash
pnpm run generate:local   # uses ./openapi.yaml
pnpm run build:cjs && pnpm run build:esm && pnpm run build:types
```

### What `pnpm run build` does step by step

```
pnpm run build
│
├── 1. prebuild (automatic npm lifecycle hook)
│   └── pnpm run generate
│       └── openapi-ts -i <remote-url> -o src/generated --client legacy/axios
│           - Fetches openapi.yaml from GitHub
│           - Parses all paths, schemas, parameters, request bodies, responses
│           - Writes src/generated/services.gen.ts  (API functions)
│           - Writes src/generated/types.gen.ts     (TypeScript types)
│           - Writes src/generated/schemas.gen.ts   (schema objects)
│           - Writes src/generated/core/*           (Axios client internals)
│
├── 2. build:cjs
│   └── tsc -p tsconfig.cjs.json
│       - Compiles src/ → dist/cjs/ as CommonJS modules
│
├── 3. build:esm
│   └── tsc -p tsconfig.esm.json
│       - Compiles src/ → dist/esm/ as ES Modules
│
└── 4. build:types
    └── tsc -p tsconfig.types.json
        - Emits dist/types/*.d.ts declaration files only
```

### Safe to regenerate

- `src/generated/` is completely overwritten each time (this is expected)
- `src/client.ts` and `src/index.ts` are never touched
- `dist/` is rebuilt from scratch

## Using as a Package in Another Repo

### Option 1: Install from npm (after publishing)

```bash
pnpm add @sfpy/raast-sdk
```

### Option 2: Link locally for development

```bash
# In this SDK repo
pnpm link --global

# In your consuming project
pnpm link --global @sfpy/raast-sdk
```

### Option 3: Install directly from GitHub

```bash
pnpm add github:getsafepay/safepay-raast-sdk
```

### Usage

```typescript
import { RaastClient } from "@sfpy/raast-sdk";
import {
  getV1AggregatorsByRaastAggregatorId,
  postV1AggregatorsByRaastAggregatorIdPayments,
  getV1AggregatorsByRaastAggregatorIdKeys,
} from "@sfpy/raast-sdk";

// Initialize once — configures base URL and auth header
new RaastClient({
  apiKey: "your-api-key",
});

// Get aggregator
const aggregator = await getV1AggregatorsByRaastAggregatorId({
  raastAggregatorId: "agg_2288490a-...",
});

// Create payment
const payment = await postV1AggregatorsByRaastAggregatorIdPayments({
  raastAggregatorId: "agg_2288490a-...",
  requestBody: {
    request_id: "unique-id",
    amount: 5000,
    aggregator_merchant_identifier: "am_...",
    order_id: "order_123",
    type: "RTP_NOW",
    debitor_iban: "PK89SCBL0000001234651601",
    expiry_in_minutes: 45,
  },
});

// List access keys with filters
const keys = await getV1AggregatorsByRaastAggregatorIdKeys({
  raastAggregatorId: "agg_2288490a-...",
  limit: 10,
  offset: 0,
  isActive: "true",
});
```

## Viewing the API Docs Visually

The generated TypeScript files are the SDK, not a visual API reference. To browse the API visually (like Swagger UI), use any of these:

### Swagger Editor (quickest)

Open https://editor.swagger.io and paste the contents of `openapi.yaml`, or import from URL:

```
https://raw.githubusercontent.com/getsafepay/raast-docs/main/api-reference/openapi.yaml
```

### Swagger UI locally

```bash
docker run -p 8080:8080 \
  -e SWAGGER_JSON_URL=https://raw.githubusercontent.com/getsafepay/raast-docs/main/api-reference/openapi.yaml \
  swaggerapi/swagger-ui
```

Then open http://localhost:8080.

### Redocly (cleaner docs)

```bash
npx @redocly/cli preview-docs openapi.yaml
```

Opens a polished, searchable API reference at http://localhost:8080.

## Available Scripts

| Script                    | Description                                                   |
| ------------------------- | ------------------------------------------------------------- |
| `pnpm run generate`       | Fetch latest spec from GitHub and regenerate `src/generated/` |
| `pnpm run generate:local` | Regenerate from local `openapi.yaml`                          |
| `pnpm run build`          | Generate + compile CJS, ESM, and type declarations            |
| `pnpm run clean`          | Delete `dist/` and `src/generated/`                           |

## API Coverage

All 39 endpoints across 11 resource groups:

- **Aggregators** — Get aggregator details
- **Access Keys** — CRUD + rotate
- **Merchants** — CRUD for aggregator merchants
- **Raast Merchants** — List/find Raast merchant directory
- **Payments** — Create RTP (Now/Later), list, find
- **Payouts** — Initiate credit transfers
- **Refunds** — Create, list, find
- **QR Codes** — Create (static/dynamic), list, find, delete, list payments
- **Utilities** — Title fetch, account info
- **Aliases** — List, find, title fetch
- **Ledgers** — Aggregator and merchant ledger accounts
- **Webhooks** — CRUD + rotate + deliveries
