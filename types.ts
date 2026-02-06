
export type MediaType = 'image' | 'video';

export interface GalleryItem {
  id: string;
  type: MediaType;
  url: string;
  label: string;
}

export interface GallerySet {
  id: string;
  items: GalleryItem[]; // Exactly 4 items: 3 images, 1 video
}

export type SwipeDirection = 'left' | 'right' | null;
