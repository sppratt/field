import { careers } from '@/app/data/careers';
import { Button } from '@/app/components/Button';
import { PathwayDetailClient } from '@/app/components/PathwayDetailClient';
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

  return <PathwayDetailClient career={career} />;
}
