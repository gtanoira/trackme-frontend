export interface ItemModelModel {
  id?: number;
  clientId: number;
  clientName?: string;
  model: string;
  unitLength?: string | 'cm';
  width?: number | 0;
  height?: number | 0;
  length?: number | 0;
  unitWeight?: string | 'kg';
  weight?: number | 0;
  unitVolumetric?: string | 'kgV';
  volumeWeight?: number | 0;
}
