export type OutputFormat = 'jpeg' | 'jpg' | 'png' | 'webp' | 'avif' | 'tiff';

export interface GenerateVariantsJob {
  originalPath: string;
  userId?: string;
  overrideSizes?: number[];
  format?: OutputFormat;
  quality?: number;
  taskId: string;
}
