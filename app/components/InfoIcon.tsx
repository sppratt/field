'use client';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import styles from './InfoIcon.module.css';

interface InfoIconProps {
  label?: string;
  onClick?: () => void;
}

export const InfoIcon = ({ label, onClick }: InfoIconProps) => {
  return (
    <button
      className={styles.infoIcon}
      onClick={onClick}
      title={label}
      aria-label={label || 'More information'}
      type="button"
    >
      <InfoOutlinedIcon className={styles.icon} />
    </button>
  );
};
