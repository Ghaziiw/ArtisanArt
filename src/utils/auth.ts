import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { z } from 'zod';

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL, // Use DATABASE_URL for connection
  }),
  // Configure authentication methods and options
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  user: {
    additionalFields: {
      // Additional custom field 'role' to the user table
      role: {
        type: 'string',
        required: false,
        defaultValue: 'client',
        validator: {
          input: z.enum(['admin', 'artisan', 'client']), // Validate role values
        },
      },
      location: {
        type: 'string',
        required: false,
        defaultValue: null,
      },
    },
  },
  // Session configuration
  session: {
    enabled: true,
    expiresIn: 60 * 60 * 24 * 1, // 1 day
  },
  debug: true, // Enable debug mode for development
});
