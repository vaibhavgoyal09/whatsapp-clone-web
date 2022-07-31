import Chat from "../models/Chat";
import Message from "../models/Message";
import User from "../models/User";
import Group from "../models/Group";

class Utils {
  static timeSince(date: any) {
    var seconds = Math.floor(new Date().getTime() / 1000 - date),
      interval = Math.floor(seconds / 31536000);

    if (interval > 1) return interval + "y";

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return interval + "m";

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + "d";

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + "h";

    interval = Math.floor(seconds / 60);
    if (interval > 1) return interval + "m ";

    return Math.floor(seconds) + "s";
  }

  static getRemoteUserIdFromChat(chat: Chat, currentUserId: string): string {
    return chat.userIds.filter((id) => {
      return id !== currentUserId;
    })[0];
  }

  static userFromJson(json: any): User {
    let user: User = {
      id: json.id,
      name: json.name,
      firebaseUid: json.firebase_uid,
      phoneNumber: json.phone_number,
      about: json.about,
      profileImageUrl: json.profile_image_url,
      onlineStatus: json.online_status,
      lastOnlineAt: json.last_online_at,
    };
    return user;
  }

  static chatFromJson(json: any): Chat {
    let message = json.last_message
      ? this.messageFromJson(json.last_message)
      : null;
    let chat: Chat = {
      id: json.id,
      type: json.type,
      name: json.name,
      profileImageUrl: json.profile_image_url,
      groupId: json.group_id,
      userIds: json.user_ids,
      lastMessage: message,
      typingUsersIds: [],
    };
    return chat;
  }

  static messageFromJson(json: any): Message {
    let message: Message = {
      id: json.id,
      senderId: json.sender_id,
      type: json.type,
      text: json.text,
      mediaUrl: json.media_url,
      chatId: json.chat_id,
      timestamp: json.created_at,
    };
    return message;
  }

  static groupFromJson(json: any): Group {
    let users: User[] = [];
    for (let user of json.users) {
      users.push(this.userFromJson(user));
    }

    return {
      id: json.id,
      name: json.name,
      profileImageUrl: json.profile_image_url,
      users: users,
      adminId: json.admin_id,
    };
  }
}

export default Utils;
