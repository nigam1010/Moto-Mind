export type SavedConfig = {
  id: string
  userId: string
  modelSlug: string
  trimName: string
  colorCode: string
  wheelName: string
  calculatedPrice: number
  createdAt: string
}

export const SAVED_CONFIGS: SavedConfig[] = []
