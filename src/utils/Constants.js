export class WhatsApi {
  static BASE_URL = "http://127.0.0.1:8000/api/v1";
  static REGISTER_USER_URL = "user/register";
  static UPLOAD_FILE_URL = "file/new";
  static CHECK_USER_SIGNING_IN_URL = "/user/check_exists";
  static GET_ALL_CHATS_URL = "chat/all";
  static SEARCH_USERS_BY_PHONE_NUMBER_URL = "/user/search"
  static GET_MESSAGES_FOR_CHAT_URL = "/message"
  static GET_CURRENT_USER_INFO_URL = "/user/current"
  static CREATE_NEW_CHAT_URL = "/chat/new"
}
