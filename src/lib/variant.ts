export type Variant = 'central' | 'huasteca';
export const VARIANTS: Variant[] = ['central', 'huasteca'];
export const VARIANT_NAMES: Record<Variant, string> = {
  central: 'Náhuatl central',
  huasteca: 'Náhuatl de la Huasteca',
};
/** A Nahuatl string: either the same in both variants, or one form per variant. */
export type V = string | { central: string; huasteca: string };

export function pick(v: V, variant: Variant): string {
  return typeof v === 'string' ? v : v[variant];
}
export function isVariant(x: unknown): x is Variant {
  return x === 'central' || x === 'huasteca';
}
