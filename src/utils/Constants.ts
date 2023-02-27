export class WhatsApi {
  static BASE_URL = "https://whatsapp-clone-backend-mmu8.onrender.com/api/v1";
  static REGISTER_USER_URL = "user/register";
  static SEARCH_USERS_BY_PHONE_NUMBER_URL = "/user/search/phone";
  static GET_CURRENT_USER_INFO_URL = "/user/current";
  static CHECK_USER_SIGNING_IN_URL = "/user/check_exists";
  static UPDATE_USER_DETAILS_URL = "/user/update"
  static GET_REMOTE_USER_DETAILS_URL = "/user/details"
  static SEARCH_CONTACTS_BY_NAME_URL = "/user/search/name"
  static GET_ALL_USERS_WITH_ACTIVE_STATUS_URL = "/user/with_active_status"
  static UPLOAD_FILE_URL = "file/new";
  static GET_ALL_CHATS_URL = "chat/all";
  static CREATE_NEW_CHAT_URL = "/chat/new";
  static GET_MESSAGES_FOR_CHAT_URL = "/message";
  static CREATE_NEW_GROUP_URL = "/group/new"
  static GET_GROUP_DETAILS_URL = "/group/details"
  static ADD_GROUP_PARTICIPANTS_URL = "/group/participant/add"
  static REMOVE_GROUP_PARTICIPANTS_URL = "/group/participant/remove"
  static CREATE_NEW_STATUS_URL = "/status/new"
  static GET_STATUSES_OF_USER_URL = "/status/all"

  static CHAT_WEBSOCKET_BASE_URL = "wss://whatsapp-clone-backend-mmu8.onrender.com/ws/chat";
}
