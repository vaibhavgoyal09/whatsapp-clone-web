export class WhatsApi {
  static BASE_URL = "http://127.0.0.1:8000/api/v1";
  static REGISTER_USER_URL = "user/register";
  static SEARCH_USERS_BY_PHONE_NUMBER_URL = "/user/search/phone";
  static GET_CURRENT_USER_INFO_URL = "/user/current";
  static CHECK_USER_SIGNING_IN_URL = "/user/check_exists";
  static UPDATE_USER_DETAILS_URL = "/user/update"
  static GET_REMOTE_USER_DETAILS_URL = "/user/details"
  static SEARCH_CONTACTS_BY_NAME_URL = "/user/search/name"
  static UPLOAD_FILE_URL = "file/new";
  static GET_ALL_CHATS_URL = "chat/all";
  static CREATE_NEW_CHAT_URL = "/chat/new";
  static GET_MESSAGES_FOR_CHAT_URL = "/message";
  static CREATE_NEW_GROUP_URL = "/group/new"
  static GET_GROUP_DETAILS_URL = "/group/details"

  static CHAT_WEBSOCKET_BASE_URL = "ws://127.0.0.1:8000/ws/chat";
}
