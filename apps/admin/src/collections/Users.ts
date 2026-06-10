import type { CollectionConfig } from 'payload';

/**
 * Users: Auth-Collection für den authentifizierten Payload-Admin (§17.5, Prod hinter
 * Basic-Auth/IP-Filter). Nicht öffentlich.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email', group: 'System' },
  fields: [{ name: 'name', type: 'text' }],
};
