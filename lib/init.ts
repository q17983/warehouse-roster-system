/**
 * Initialize database on server startup
 */

import { initializeDatabase } from './database';

// Initialize database when this module is imported
if (typeof window === 'undefined') {
  try {
    initializeDatabase();
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}
