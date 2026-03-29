/**
 * Utility function to combine class names conditionally.
 * Useful for merging CSS module classes with conditional classes.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
