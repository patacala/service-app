export interface MediaFile {
  id: string;
  url: string;
  variant: string;
  position: number;
}

export interface Message {
  id: string;
  bookServiceId: string;
  senderId: string;
  message: string;
  createdAt: string;
  readAt: string | null;
  media?: MediaFile[];
  sender?: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
}

export interface MediaDto {
  filename: string;
  id: string;
  downloaded?: boolean;
  kind: 'image' | 'video';
  variants?: string[];
}

export interface CreateMessageRequest {
  bookServiceId: string;
  message: string;
  media?: MediaDto[];
}

export interface CreateMessageResponse {
  id: string;
  bookServiceId: string;
  senderId: string;
  message: string;
  createdAt: string;
  readAt: string | null;
  sender: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
  media: MediaFile[];
}

export interface GetMessagesParams {
  bookServiceId: string;
}