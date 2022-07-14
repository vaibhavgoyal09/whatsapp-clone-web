class SendMessageRequest {
   constructor(type, own_user_id, to_user_id, chat_id, media_url, text) {
      this.type = type;
      this.own_user_id = own_user_id;
      this.to_user_id = to_user_id;
      this.chat_id = chat_id;
      this.media_url = media_url;
      this.text = text;
   }
}

export default SendMessageRequest;