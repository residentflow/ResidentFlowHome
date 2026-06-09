import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

import { Users } from './src/collections/Users';
import { Roles } from './src/collections/Roles';
import { SizeMetrics } from './src/collections/SizeMetrics';
import { Problems } from './src/collections/Problems';
import { Solutions } from './src/collections/Solutions';
import { Assets } from './src/collections/Assets';
import { CompositeAssets } from './src/collections/CompositeAssets';
import { CalculationModels } from './src/collections/CalculationModels';
import { Benchmarks } from './src/collections/Benchmarks';
import { ProofFindings } from './src/collections/ProofFindings';
import { CTARules } from './src/collections/CTARules';
import { Experiments } from './src/collections/Experiments';
import { DesignVariants } from './src/collections/DesignVariants';
import { CopyKeys } from './src/collections/CopyKeys';
import { Leads } from './src/collections/Leads';
import { LeadEvents } from './src/collections/LeadEvents';
import { ConsentRecords } from './src/collections/ConsentRecords';
import { Pages } from './src/collections/Pages';
import { Settings } from './src/collections/Settings';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: { user: Users.slug },
  // PRD §20 — alle Collections des Datenmodells (+ Users als Auth-Collection).
  collections: [
    Users,
    Roles,
    SizeMetrics,
    Problems,
    Solutions,
    Assets,
    CompositeAssets,
    CalculationModels,
    Benchmarks,
    ProofFindings,
    CTARules,
    Experiments,
    DesignVariants,
    CopyKeys,
    Leads,
    LeadEvents,
    ConsentRecords,
    Pages,
    Settings,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-not-for-prod-change-me',
  typescript: { outputFile: path.resolve(dirname, 'src/payload-types.ts') },
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URI || 'postgresql://postgres@127.0.0.1:5433/residentflow',
    },
  }),
});
