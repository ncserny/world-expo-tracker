export interface Pavilion {
  id: string;
  pavilion: string;
  location?: string;
  reserve?: string;
  category: 'Country' | 'Signature' | 'Private Sector' | 'Other';
  visited: boolean;
}

export type PavilionCategory = Pavilion['category'];