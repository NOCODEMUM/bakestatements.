export function generateSlug(businessName: string): string {
  if (!businessName || businessName.trim() === '') {
    return '';
  }

  return businessName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function isValidSlug(slug: string): boolean {
  if (!slug || slug.length < 2 || slug.length > 100) {
    return false;
  }

  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

export function generateLandingPageUrl(slug: string, origin?: string): string {
  const baseUrl = origin || window.location.origin;
  return `${baseUrl}/baker/${slug}`;
}

export function suggestAlternativeSlugs(baseSlug: string): string[] {
  const suggestions: string[] = [];

  suggestions.push(`${baseSlug}-bakery`);
  suggestions.push(`${baseSlug}-cakes`);
  suggestions.push(`${baseSlug}-bakes`);

  const timestamp = Date.now().toString().slice(-4);
  suggestions.push(`${baseSlug}-${timestamp}`);

  for (let i = 2; i <= 5; i++) {
    suggestions.push(`${baseSlug}-${i}`);
  }

  return suggestions;
}
