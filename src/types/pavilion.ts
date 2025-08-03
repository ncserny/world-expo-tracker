export interface Pavilion {
  id: string;
  pavilionCode?: string; // C, W, E, S, P, X etc. - area/zone indicator
  pavilion: string;
  location?: string;
  reserve?: string;
  category: 'Country' | 'Signature' | 'Private Sector' | 'Other';
  visited: boolean;
}

export type PavilionCategory = Pavilion['category'];