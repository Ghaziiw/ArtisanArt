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
  password: {
    // Custom password verification using regex
    verify: (password: string) => {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      return passwordRegex.test(password);
    },
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
        input: false, // Hide from user input forms
      },
      location: {
        type: 'string',
        required: false,
        defaultValue: null,
      },
    },
    deleteUser: {
      enabled: true,
    },
  },
  // Session configuration
  session: {
    enabled: true,
    expiresIn: 60 * 60 * 24 * 1, // 1 day
  },
  debug: true, // Enable debug mode for development
  trustedOrigins: [
    'http://localhost:3000', // backend
    'http://localhost:4200', // frontend
  ],
});
