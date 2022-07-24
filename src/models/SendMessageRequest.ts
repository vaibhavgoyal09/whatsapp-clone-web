interface SendMessageRequest {
  type: number;
  own_user_id: string;
  to_user_id: string;
  chat_id: string;
  media_url?: string | null;
  text?: string | null;
}

export default SendMessageRequest;
