import Image from 'next/image';
import styles from '@/app/(authenticated)/student/dashboard/StudentDashboard.module.css';

export function HeroPlant() {
  return (
    <div className={styles.heroPicture}>
      <Image
        src="/houseplant.png"
        alt="Houseplant illustration representing growth"
        width={200}
        height={200}
        priority
      />
    </div>
  );
}
