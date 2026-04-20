import FieldDetailClient from '@/app/components/FieldDetailClient';
import Button from '@/app/components/Button';
import styles from '@/app/styles/PathwayDetail.module.css';

const FIELDS = [
  { id: 'software-engineer', name: 'Software Engineer' },
  { id: 'nurse', name: 'Nurse' },
  { id: 'graphic-designer', name: 'Graphic Designer' },
  { id: 'data-analyst', name: 'Data Analyst' },
  { id: 'architect', name: 'Architect' },
];

export async function generateStaticParams() {
  return FIELDS.map((field) => ({
    id: field.id,
  }));
}

interface PathwayPageProps {
  params: Promise<{ id: string }>;
}

export default async function PathwayPage({ params }: PathwayPageProps) {
  const { id } = await params;
  const field = FIELDS.find((f) => f.id === id);

  if (!field) {
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

  return <FieldDetailClient field={field} />;
}
