import { careers } from '@/app/data/careers';
import { Button } from '@/app/components/Button';
import styles from '@/app/styles/PathwayDetail.module.css';

export async function generateStaticParams() {
  return careers.map((career) => ({
    id: career.id,
  }));
}

interface PathwayPageProps {
  params: Promise<{ id: string }>;
}

export default async function PathwayPage({ params }: PathwayPageProps) {
  const { id } = await params;
  const career = careers.find((c) => c.id === id);

  if (!career) {
    return (
      <div className={styles.notFound}>
        <h1>Career not found</h1>
        <p>The career pathway you&apos;re looking for doesn&apos;t exist.</p>
        <Button href="/pathways" variant="primary">
          Back to Pathways
        </Button>
      </div>
    );
  }

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
            <Button href="#" variant="primary" size="large">
              Start Simulation
            </Button>
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
