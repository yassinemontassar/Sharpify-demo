export interface ImageStats {
    size: number;
    format: string;
    width: number;
    height: number;
    aspectRatio: number;
    hasAlpha: boolean;
    colorSpace: string;
    channels: number;
    compression?: unknown; // Changed from string | undefined to unknown
  }
  
  