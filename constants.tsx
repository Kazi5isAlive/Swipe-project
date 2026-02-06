
import { GallerySet } from './types';

export const DEFAULT_SETS: GallerySet[] = [
  {
    id: 'set-1',
    items: [
      { id: '1-1', type: 'image', url: 'https://picsum.photos/seed/art1/800/800', label: 'Image 1' },
      { id: '1-2', type: 'image', url: 'https://picsum.photos/seed/art2/800/800', label: 'Image 2' },
      { id: '1-3', type: 'image', url: 'https://picsum.photos/seed/art3/800/800', label: 'Image 3' },
      { id: '1-4', type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', label: 'Video' },
    ]
  },
  {
    id: 'set-2',
    items: [
      { id: '2-1', type: 'image', url: 'https://picsum.photos/seed/art4/800/800', label: 'Image 1' },
      { id: '2-2', type: 'image', url: 'https://picsum.photos/seed/art5/800/800', label: 'Image 2' },
      { id: '2-3', type: 'image', url: 'https://picsum.photos/seed/art6/800/800', label: 'Image 3' },
      { id: '2-4', type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', label: 'Video' },
    ]
  },
  {
    id: 'set-3',
    items: [
      { id: '3-1', type: 'image', url: 'https://picsum.photos/seed/art7/800/800', label: 'Image 1' },
      { id: '3-2', type: 'image', url: 'https://picsum.photos/seed/art8/800/800', label: 'Image 2' },
      { id: '3-3', type: 'image', url: 'https://picsum.photos/seed/art9/800/800', label: 'Image 3' },
      { id: '3-4', type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', label: 'Video' },
    ]
  }
];
