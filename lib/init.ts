/**
 * Initialize database on server startup
 */

import { initializeDatabase } from './database';

// Initialize database when this module is imported
if (typeof window === 'undefined') {
  // Only run on server side
  try {
    initializeDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

