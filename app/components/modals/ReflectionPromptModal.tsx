'use client';

import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import styles from './StatsModals.module.css';
import { saveReflection } from '@/lib/db/reflections';

interface ReflectionPromptModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  pathwayId: string;
  pathwayTitle: string;
}

export const ReflectionPromptModal = ({
  open,
  onClose,
  userId,
  pathwayId,
  pathwayTitle,
}: ReflectionPromptModalProps) => {
  const [reflection, setReflection] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!reflection.trim()) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      await saveReflection(userId, pathwayId, 'surprise', reflection);
      setReflection('');
      onClose();
    } catch (err) {
      console.error('Error saving reflection:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    setReflection('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleSkip} className={styles.dialog} maxWidth="sm" fullWidth>
      <DialogTitle className={styles.dialogTitle}>
        <span className={styles.titleText}>What did you discover?</span>
        <span className={styles.titleSubtext}>{pathwayTitle}</span>
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <div className={styles.reflectionPrompt}>
          <p className={styles.promptText}>
            Reflecting on what you learned helps cement your career exploration. What surprised you most about this career field?
          </p>
          <textarea
            className={styles.reflectionInput}
            placeholder="Share your thoughts... (optional)"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            rows={4}
          />
        </div>
      </DialogContent>
      <DialogActions className={styles.dialogActions}>
        <Button onClick={handleSkip} variant="outlined" className={styles.button}>
          Skip
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={loading} className={styles.button}>
          {loading ? 'Saving...' : 'Save Reflection'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
