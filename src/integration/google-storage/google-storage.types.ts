export interface GoogleStorageFilterObject {
  startDate: number;
  endDate: number;
  subject: string;
  mediaType: MediaTypes | string;
}

// TODO: #4 It should be implemented in the domain
export enum MediaTypes {
  IMAGES = 'images',
  VIDEOS = 'videos',
  AUDIOS = 'audios'
}