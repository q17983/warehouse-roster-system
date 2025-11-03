'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Store auth token in sessionStorage
        sessionStorage.setItem('admin_auth', data.token);
        router.push('/admin');
      } else {
        setError('Incorrect password');
        setPassword('');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>🔒 Admin Login</h1>
        <p className={styles.subtitle}>Enter password to access admin panel</p>
        
        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className={styles.input}
            autoFocus
            disabled={loading}
          />
          
          {error && (
            <div className={styles.error}>{error}</div>
          )}
          
          <button 
            type="submit" 
            disabled={loading || !password}
            className={styles.loginButton}
          >
            {loading ? 'Checking...' : 'Login'}
          </button>
        </form>

        <div className={styles.hint}>
          <small>Contact system administrator if you forgot the password</small>
        </div>
      </div>
    </div>
  );
}

