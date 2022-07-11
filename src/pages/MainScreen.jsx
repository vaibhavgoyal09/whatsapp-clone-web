import { useEffect, useState } from "react";
import ChattingScreen from "../components/ChattingScreen";
import MainSidebar from "../components/MainSidebar";
import WhatsappIntroScreen from "../components/WhatsappIntroScreen";
import { useAuth } from "../context/AuthContext";
import { useAxios } from "../context/AxiosContext";
import "../css/mainScreenStyle.css";
import Chat from "../models/Chat";
import Message from "../models/Message";
import User from "../models/User";

const MainScreen = () => {
  const { currentUser } = useAuth();
  const [chat, setChat] = useState(null);
  const {
    currentUserModel,
    getAllChats,
    searchUsers,
    getMessagesForChat,
    createNewChat,
  } = useAxios();
  const [contactsList, setContactsList] = useState([]);
  const [chatsList, setChatsList] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [messagesListForChat, setMessagesListForChat] = useState([
    new Message(
      5,
      4,
      "text",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis aliquid nihil ullam odio libero modi nesciunt excepturi a corporis eligendi, ratione provident vel dolores aut incidunt dolor sit? Corrupti labore hic officiis saepe repudiandae atque at nemo eaque voluptas, delectus fuga molestiae quas!",
      null,
      Date.now()
    ),
    new Message(7, 1, "text", "Hello", null, Date.now()),
    new Message(6, 4, "text", "Hello", null, Date.now()),
    new Message(
      5,
      1,
      "text",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis aliquid nihil ullam odio libero modi nesciunt excepturi a corporis eligendi, ratione provident vel dolores aut incidunt dolor sit? Corrupti labore hic officiis saepe repudiandae atque at nemo eaque voluptas, delectus fuga molestiae quas!",
      null,
      Date.now()
    ),
    new Message(
      5,
      4,
      "text",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis aliquid nihil ullam odio libero modi nesciunt excepturi a corporis eligendi, ratione provident vel dolores aut incidunt dolor sit? Corrupti labore hic officiis saepe repudiandae atque at nemo eaque voluptas, delectus fuga molestiae quas!",
      null,
      Date.now()
    ),
    new Message(
      5,
      4,
      "text",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis aliquid nihil ullam odio libero modi nesciunt excepturi a corporis eligendi, ratione provident vel dolores aut incidunt dolor sit? Corrupti labore hic officiis saepe repudiandae atque at nemo eaque voluptas, delectus fuga molestiae quas!",
      null,
      Date.now()
    ),
    new Message(
      5,
      4,
      "text",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis aliquid nihil ullam odio libero modi nesciunt excepturi a corporis eligendi, ratione provident vel dolores aut incidunt dolor sit? Corrupti labore hic officiis saepe repudiandae atque at nemo eaque voluptas, delectus fuga molestiae quas!",
      null,
      Date.now()
    ),
    new Message(
      5,
      4,
      "text",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis aliquid nihil ullam odio libero modi nesciunt excepturi a corporis eligendi, ratione provident vel dolores aut incidunt dolor sit? Corrupti labore hic officiis saepe repudiandae atque at nemo eaque voluptas, delectus fuga molestiae quas!",
      null,
      Date.now()
    ),
    new Message(
      5,
      4,
      "text",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis aliquid nihil ullam odio libero modi nesciunt excepturi a corporis eligendi, ratione provident vel dolores aut incidunt dolor sit? Corrupti labore hic officiis saepe repudiandae atque at nemo eaque voluptas, delectus fuga molestiae quas!",
      null,
      Date.now()
    ),
  ]);

  useEffect(() => {
    setTimeout(() => {
      getAllChats()
        .then((result) => {
          let chats = [];
          result.forEach((element) => {
            let chat = new Chat(
              element.id,
              element.remote_user_id,
              element.remote_user_profile_image_url,
              element.remote_user_name,
              null,
              element.unseen_message_count
            );
            chats.push(chat);
          });
          setChatsList(chats);
        })
        .catch((e) => {
          console.log(e);
        });
    }, 2000);
  }, [currentUser]);

  useEffect(() => {
    if (searchQuery === "") {
    } else {
      searchUsers(searchQuery)
        .then((result) => {
          console.log(result);
          let contacts = [];
          result.forEach((element) => {
            let c = new User(
              element.id,
              element.name,
              element.about,
              element.firebase_uid,
              element.phone_number,
              element.profile_image_url
            );
            contacts.push(c);
          });
          setContactsList(contacts);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [searchQuery]);

  useEffect(() => {
    console.log("Calling Get Messages For Chat");
    if (chat) {
      getMessagesForChat(chat.getId())
        .then((result) => console.log(result))
        .catch((e) => console.log(e));
    }
  }, [chat]);

  const onChatClick = (chat) => setChat(chat);
  const onProfileClick = (chat) => {};
  const onSearchQueryChange = (value) => setSearchQuery(value);
  const onContactClicked = (contact) => {
    var chatId = null;

    for (let i in chatsList) {
      let c = chatsList[i];
      console.log(`Chat ID ${c}`);
      console.log(`Contact ID ${contact.id}`);
      chatId = c.remoteUserId === contact.id ? c.id : null;
      if (!chatId) {
        continue;
      } else {
        setChat(c);
        break;
      }
    }
    if (!chatId) {
      createNewChat(contact.getId())
        .then((result) => {
          let chat = new Chat(
            result.id,
            contact.getId(),
            contact.getProfileImageUrl(),
            contact.getName(),
            null,
            0
          );
          setChat(chat);
          let chats = [...chatsList];
          chats.push(chat);
          setChatsList(chats);
        })
        .catch((e) => console.log(e));
    }
  };

  return (
    <div className="pg">
      <div className="sidebarContainer">
        <MainSidebar
          currentUserModel={currentUserModel}
          chatsList={chatsList}
          onChatClicked={(chat) => onChatClick(chat)}
          onSearchQueryChange={(value) => onSearchQueryChange(value)}
          contactsList={contactsList}
          onContactClicked={(contact) => onContactClicked(contact)}
        />
      </div>
      {chat ? (
        <div className="chattingContainer">
          <ChattingScreen
            currentUserModel={currentUserModel}
            chat={chat}
            onProfileClick={(chat) => onProfileClick(chat)}
            messages={messagesListForChat}
          />
        </div>
      ) : (
        <div className="whatsappIntroContainer">
          <WhatsappIntroScreen />
        </div>
      )}
    </div>
  );
};

export default MainScreen;
