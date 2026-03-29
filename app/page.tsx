import styles from '@/app/styles/Homepage.module.css';
import { Button } from '@/app/components/Button';

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.content}>
          <p className={styles.subtitle}>Welcome to Field</p>
          <h1 className={styles.title}>
            Discover careers by <span className={styles.titleAccent}>living them</span>
          </h1>
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
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3>Choose a Career</h3>
              <p>Browse our collection of career pathways and select one that interests you. Each career offers a unique perspective on professional life.</p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3>Step Into a Scenario</h3>
              <p>Experience a realistic, interactive simulation that puts you in a professional&apos;s shoes. Face the challenges and opportunities they encounter.</p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3>Make Decisions & Learn</h3>
              <p>Make meaningful choices that shape your experience. See how different decisions lead to different outcomes and gather valuable insights.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
