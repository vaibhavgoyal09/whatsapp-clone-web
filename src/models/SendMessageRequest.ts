interface SendMessageRequest {
  type: number;
  own_user_id: number;
  to_user_id: number;
  chat_id: number;
  media_url?: string;
  text?: string;
}

export default SendMessageRequest;
