// Deliberately defective evaluation fixture, not an installable production module.
// Runtime isolation/real framework wiring is supplied separately for execution.
export async function listCategories(context: {
  user: { id: string; permissions: string[] } | null;
  categories: Array<{ id: string; code: string; name: string; active: boolean }>;
}) {
  if (!context.user) return { status: 401, body: { error: 'Unauthorized' } }
  return { status: 200, body: { data: context.categories.filter(category => category.active) } }
}
export function showCategoriesNavigation(permissions: string[]) {
  return permissions.includes('list-service-categories')
}
