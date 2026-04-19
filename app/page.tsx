import styles from '@/app/styles/Homepage.module.css';
import { Button } from '@/app/components/Button';
import { StepsConnector } from '@/app/components/StepsConnector';

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroCenter}>
          <div className={styles.headlineWrapper}>
            <h1 className={styles.title}>
              <span className={styles.titleLine1}>Discover careers</span>
              <span className={styles.titleLine2}>by <span className={styles.titleAccent}>living them</span></span>
            </h1>
          </div>
        </div>

        <div className={styles.heroBottom}>
          <p className={styles.subtitle}>Explore Careers</p>
          <p className={styles.description}>
            Step into real-world scenarios, make meaningful decisions, and experience what professionals actually do on the job. Explore career paths in an interactive, exploratory environment.
          </p>
          <div className={styles.cta}>
            <Button
              href="/pathways"
              variant="primary"
              size="large"
              aria={{ label: 'Start exploring career pathways' }}
            >
              Start Exploring
            </Button>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>How Field Works</h2>

        <div className={styles.steps}>
          <div className={styles.step}>
            <p className={styles.stepBadge}>Explore</p>
            <h3 className={styles.stepTitle}>Browse Career Fields</h3>
            <p className={styles.stepDescription}>Discover a curated collection of realistic career paths. Each field includes a rich overview of what professionals actually do, the skills they use, and the growth opportunities available.</p>
          </div>

          <div className={styles.step}>
            <p className={styles.stepBadge}>Experience</p>
            <h3 className={styles.stepTitle}>Step Into a Simulation</h3>
            <p className={styles.stepDescription}>Live through a realistic scenario as if you were in that role. Face authentic decisions, navigate real-world challenges, and experience the day-to-day reality of the profession.</p>
          </div>

          <div className={styles.step}>
            <p className={styles.stepBadge}>Grow</p>
            <h3 className={styles.stepTitle}>Discover Your Path</h3>
            <p className={styles.stepDescription}>Reflect on your choices, see your growth across different skills, and uncover which careers align with who you are. Build clarity about your future with every simulation you complete.</p>
          </div>
        </div>
      </section>
    </>
  );
}
