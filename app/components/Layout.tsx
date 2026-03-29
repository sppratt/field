import React from 'react';
import { Navigation } from './Navigation';
import styles from '@/app/styles/Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>{children}</div>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <p>
            © {new Date().getFullYear()} Field. Empowering students to explore careers.
          </p>
        </div>
      </footer>
    </div>
  );
};
