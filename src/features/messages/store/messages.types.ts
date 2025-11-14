export interface Message {
  id: string;
  bookServiceId: string;
  senderId: string;
  message: string;
  createdAt: string;
  readAt: string | null;
}

export interface CreateMessageRequest {
  bookServiceId: string;
  message: string;
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
}

export interface GetMessagesParams {
  bookServiceId: string;
}