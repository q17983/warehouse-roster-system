'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Warehouse Roster System</h1>
      </div>
      
      <div className={styles.nav}>
        <Link href="/leader" className={styles.navButton}>
          <span className={styles.navIcon}>📅</span>
          <span>Leader's App</span>
        </Link>
        
        <Link href="/admin" className={styles.navButton}>
          <span className={styles.navIcon}>⚙️</span>
          <span>Admin Panel</span>
        </Link>
      </div>
    </div>
  );
}

