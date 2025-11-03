'use client';

import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import styles from './AkeReport.module.css';

interface AkeRequirement {
  id: number;
  date: string;
  ms_ake: number;
  et_ake: number;
  per_ake: number;
  total_ake: number;
  created_at: string;
  updated_at: string;
}

export default function AkeReport() {
  const [akeList, setAkeList] = useState<AkeRequirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAkeData();
  }, []);

  const loadAkeData = async () => {
    try {
      const response = await fetch('/api/ake');
      const data = await response.json();
      
      if (data.success) {
        setAkeList(data.akeList);
      }
    } catch (error) {
      console.error('Error loading AKE data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading AKE data...</div>;
  }

  if (akeList.length === 0) {
    return (
      <div className={styles.empty}>
        No AKE requirements set yet. Leaders can set AKE in the roster planning page.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>MS 馬莎</th>
              <th>ET 肯亞菜</th>
              <th>PER 鮮活</th>
              <th>Total AKE</th>
            </tr>
          </thead>
          <tbody>
            {akeList.map((ake) => (
              <tr key={ake.id}>
                <td className={styles.dateCell}>
                  {format(parseISO(ake.date), 'EEE, MMM d, yyyy')}
                </td>
                <td className={styles.numberCell}>{ake.ms_ake}</td>
                <td className={styles.numberCell}>{ake.et_ake}</td>
                <td className={styles.numberCell}>{ake.per_ake}</td>
                <td className={styles.totalCell}>{ake.total_ake}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

