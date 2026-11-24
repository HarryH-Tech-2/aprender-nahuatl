/**
 * Details that only the site owner can supply. Fill these in before launch:
 * the legal pages show a visible "[PENDIENTE …]" marker for anything left empty.
 */
export const CONTACT_EMAIL = '';
export const OPERATOR_NAME = '';
export const OPERATOR_ADDRESS = '';
export const LEGAL_UPDATED = '24 de noviembre de 2026';

export const pending = (value: string, what: string) => value || `[PENDIENTE: ${what}]`;
