'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthProvider';
import { Button } from '@/app/components/Button';
import { Career } from '@/app/data/careers';
import styles from '@/app/styles/PathwayDetail.module.css';

interface PathwayDetailClientProps {
  career: Career;
}

export function PathwayDetailClient({ career }: PathwayDetailClientProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleSimulationClick = () => {
    if (!user) {
      // Redirect to login with the current pathway as the redirect destination
      router.push(`/auth/login?redirect=${encodeURIComponent(`/pathways/${career.id}`)}`);
      return;
    }
    // Simulation logic would go here
    alert('Simulation starting for ' + career.title);
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{career.title}</h1>
          <p className={styles.description}>{career.description}</p>
        </div>
      </section>

      <div className={styles.container}>
        <section className={styles.simulationSection}>
          <div className={styles.simulationContainer}>
            <h2>Ready to experience this career?</h2>
            <p className={styles.simulationPlaceholder}>
              Step into a realistic scenario and make decisions like a {career.title.toLowerCase()} would. See how your choices shape the outcome.
            </p>
            <Button
              onClick={handleSimulationClick}
              variant="primary"
              size="large"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Start Simulation'}
            </Button>
            {!user && (
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                Log in to start the simulation
              </p>
            )}
          </div>

          <div className={styles.infoSection}>
            <div className={styles.infoCard}>
              <h3>Estimated Time</h3>
              <p>8-12 minutes</p>
            </div>

            <div className={styles.infoCard}>
              <h3>What You&apos;ll Experience</h3>
              <p>
                Real-world scenarios, meaningful decisions, and outcomes that reflect professional challenges in this field.
              </p>
            </div>

            <div className={styles.infoCard}>
              <h3>Skills Explored</h3>
              <div className={styles.skillsList}>
                <div className={styles.skillItem}>Problem solving</div>
                <div className={styles.skillItem}>Decision making</div>
                <div className={styles.skillItem}>Communication</div>
                <div className={styles.skillItem}>Time management</div>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.backButton}>
          <Button href="/pathways" variant="secondary">
            ← Back to Pathways
          </Button>
        </div>
      </div>
    </div>
  );
}
