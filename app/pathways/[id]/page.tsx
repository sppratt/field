import FieldDetailClient from '@/app/components/FieldDetailClient';
import Button from '@/app/components/Button';
import { careers } from '@/app/data/careers';
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
        <h1>Field not found</h1>
        <p>The field you&apos;re looking for doesn&apos;t exist.</p>
        <Button href="/pathways" variant="primary">
          Back to Fields
        </Button>
      </div>
    );
  }

  const fieldInfo = {
    id: career.id,
    name: career.title,
    description: career.description,
    icon: career.icon || '🔍',
  };

  return <FieldDetailClient field={fieldInfo} />;
}
