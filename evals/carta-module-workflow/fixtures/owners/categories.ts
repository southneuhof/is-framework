// Evaluation source fixture: current behavior, not an implementation recommendation.
export type ServiceCategory = { id: string; code: string; name: string; active: boolean }
export const categoryOwner = {
  resourceIdentity: 'id',
  lookupKey: 'code',
  lookupList: 'serviceCategories.list',
  lookupDetail: 'serviceCategories.detail',
  retainedHistory: 'inactive categories remain resolvable for existing records',
} as const
export type ServiceRequest = { id: string; categoryCode: string; category: ServiceCategory }
export function requestWrite(input: ServiceRequest) {
  return { id: input.id, categoryCode: input.category.code }
}
