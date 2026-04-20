export const createAriaLabel = (label: string): { 'aria-label': string } => ({
  'aria-label': label,
});

export const createAriaDescribedBy = (id: string): { 'aria-describedby': string } => ({
  'aria-describedby': id,
});

export const createAriaRequired = (required: boolean): { 'aria-required'?: string } =>
  required ? { 'aria-required': 'true' } : {};

export const createAriaInvalid = (invalid: boolean): { 'aria-invalid'?: string } =>
  invalid ? { 'aria-invalid': 'true' } : {};

export const createAriaSelected = (selected: boolean): { 'aria-selected': string } => ({
  'aria-selected': selected ? 'true' : 'false',
});

export const createProgressAriaProps = (
  current: number,
  min: number = 0,
  max: number = 100
): { 'aria-valuenow': number; 'aria-valuemin': number; 'aria-valuemax': number } => ({
  'aria-valuenow': current,
  'aria-valuemin': min,
  'aria-valuemax': max,
});

export const createDialogAriaProps = (isOpen: boolean): { role: string; 'aria-modal': string } | {} =>
  isOpen
    ? {
        role: 'dialog',
        'aria-modal': 'true',
      }
    : {};

export const createLiveRegionAriaProps = (
  polite: boolean = true
): { 'aria-live': 'polite' | 'assertive'; 'aria-atomic': string } => ({
  'aria-live': polite ? 'polite' : 'assertive',
  'aria-atomic': 'true',
});

export const createAriaHidden = (hidden: boolean): { 'aria-hidden'?: string } =>
  hidden ? { 'aria-hidden': 'true' } : {};
