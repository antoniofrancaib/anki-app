import React from 'react';
import Link from 'next/link';
import styles from '../styles/Dashboard.module.css';

export default function Dashboard() {
  // This would come from your backend/auth state
  const userStats = {
    totalCards: 124,
    dueToday: 15,
    streakDays: 7,
    completionRate: 92,
  };

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.logo}>
            recall
          </Link>
          <div className={styles.navLinks}>
            <button className={styles.profileButton}>
              JD
            </button>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Welcome back, John</h1>
          <Link href="/review" className={styles.reviewButton}>
            Start Review
          </Link>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{userStats.dueToday}</div>
            <div className={styles.statLabel}>Cards Due Today</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{userStats.totalCards}</div>
            <div className={styles.statLabel}>Total Cards</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{userStats.streakDays}d</div>
            <div className={styles.statLabel}>Current Streak</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{userStats.completionRate}%</div>
            <div className={styles.statLabel}>Completion Rate</div>
          </div>
        </div>

        <div className={styles.sections}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Recent Decks</h2>
              <button className={styles.addButton}>+</button>
            </div>
            <div className={styles.deckGrid}>
              <div className={styles.deck}>
                <h3>JavaScript</h3>
                <p>42 cards · 8 due</p>
              </div>
              <div className={styles.deck}>
                <h3>React</h3>
                <p>28 cards · 4 due</p>
              </div>
              <div className={styles.deck}>
                <h3>TypeScript</h3>
                <p>35 cards · 3 due</p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Study Progress</h2>
              <select className={styles.timeSelect}>
                <option>This Week</option>
                <option>This Month</option>
                <option>All Time</option>
              </select>
            </div>
            <div className={styles.progressChart}>
              {/* Placeholder for chart */}
              <div className={styles.chartPlaceholder}>
                Progress visualization coming soon
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
