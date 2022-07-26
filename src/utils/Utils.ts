import Chat from "../models/Chat";
import Message from "../models/Message";
import User from "../models/User";


class Utils {

    static getRemoteUserFromChat(chat: Chat, currentUserId: string): User {
      return chat.users.filter((user: User) => {
        return user.id !== currentUserId;
      })[0];
    }

    static userFromJson(json: any): User {
      let user: User = {
        id: json.id,
        name: json.name,
        firebaseUid: json.firebase_uid,
        phoneNumber: json.phone_number,
        about: json.about,
        profileImageUrl: json.profile_image_url
      }
      return user;
    }

    static chatFromJson(json: any): Chat {
        let message = json.last_message ? this.messageFromJson(json.last_message): null; 
        let chat: Chat = {
          id: json.id,
          type: json.type,
          name: json.name,
          profileImageUrl: json.profile_image_url,
          groupId: json.group_id,
          users: json.users,
          lastMessage: message
        }
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
          timestamp: json.created_at
        }
        return message;
    }
}

export default Utils;
