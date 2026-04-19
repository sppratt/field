'use client';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import styles from './ClassroomStatCard.module.css';

interface ClassroomStatCardProps {
  label: string;
  value: string | number;
  subtext: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export const ClassroomStatCard = ({ label, value, subtext, onClick, icon }: ClassroomStatCardProps) => {
  return (
    <button
      className={styles.card}
      onClick={onClick}
      title={subtext}
      type="button"
    >
      <div className={styles.infoIcon}>
        <InfoOutlinedIcon className={styles.icon} />
      </div>

      <div className={styles.content}>
        <div className={styles.label}>{label}</div>
        <div className={styles.value}>{value}</div>
        <div className={styles.subtext}>{subtext}</div>
      </div>
    </button>
  );
};
