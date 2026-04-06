import Link from 'next/link';
import { careers } from '@/app/data/careers';
import styles from '@/app/styles/PathwaysPage.module.css';

export default function PathwaysPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Explore Fields</h1>
        <p className={styles.description}>
          Choose a career below to step into a scenario and experience what the job is really
          like. Make decisions, learn from outcomes, and discover which field resonates with you.
        </p>
      </div>

      <div className={styles.grid}>
        {careers.map((career) => (
          <Link
            key={career.id}
            href={`/pathways/${career.id}`}
            className={styles.card}
          >
            <h2 className={styles.cardTitle}>{career.title}</h2>
            <p className={styles.cardDescription}>{career.description}</p>
            <span className={styles.cardLink}>Explore →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
