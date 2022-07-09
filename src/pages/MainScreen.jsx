import { useEffect } from "react";
import { useState } from "react";
import ChattingScreen from "../components/ChattingScreen";
import MainSidebar from "../components/MainSidebar";
import WhatsappIntroScreen from "../components/WhatsappIntroScreen";
import { useAuth } from "../context/AuthContext";
import { useAxios } from "../context/AxiosContext";
import "../css/mainScreenStyle.css";
import Chat from "../models/Chat";
import User from "../models/User";
import Message from "../models/Message";

const MainScreen = () => {
  const { currentUser } = useAuth();
  const [chat, setChat] = useState(null);
  const { getAllChats, searchUsers, getMessagesForChat } = useAxios();
  const [contactsList, setContactsList] = useState([]);
  const [chatsList, setChatsList] = useState([
    new Chat(
      1,
      2,
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
      "Lorem Ipsum",
      null,
      0
    ),
    new Chat(4, 3, null, "Lorem Ipsum", null, 0),
    new Chat(
      5,
      6,
      "https://images.pexels.com/photos/2340978/pexels-photo-2340978.jpeg?auto=compress&cs=tinysrgb&w=600",
      "Lorem Ipsum",
      new Message(
        21,
        1,
        6,
        "text",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia voluptatibus iste quibusdam.",
        null,
        ""
      ),
      0
    ),
    new Chat(
      1,
      9,
      "http://127.0.0.1:8000/static/6e4768615410480284ab5546a0737a3b.jpg",
      "Lorem Ipsum",
      new Message(
        2,
        1,
        9,
        "image",
        null,
        "https://images.pexels.com/photos/11377550/pexels-photo-11377550.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=400&h=250&fit=crop&crop=focalpoint",
        ""
      ),
      0
    ),
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const [messagesListForChat, setMessagesListForChat] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      getAllChats()
        .then((result) => {
          console.table(result);
        })
        .catch((e) => {});
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
            )
            contacts.push(c);
          })
          setContactsList(contacts);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [searchQuery]);

  useEffect(() => {
    console.log("Calling Get Messages For Chat");
    if(chat) {
      getMessagesForChat(chat.getId())
      .then(result => console.log(result))
      .catch(e => console.log(e));
    }
  }, [chat]);

  const onChatClick = (chat) => setChat(chat);
  const onProfileClick = (chat) => {};
  const onSearchQueryChange = (value) => setSearchQuery(value);
  const onContactClicked = (contact) => {
    let chat = new Chat(
      null,
      contact.getId(),
      contact.getProfileImageUrl(),
      contact.getName(),
      null,
      0
    );
    setChat(chat);
  };

  return (
    <div className="pg">
      <div className="sidebarContainer">
        <MainSidebar
          chatsList={chatsList}
          onChatClicked={(chat) => onChatClick(chat)}
          onSearchQueryChange={(value) => onSearchQueryChange(value)}
          contactsList={contactsList}
          onContactClicked={(contact) => onContactClicked(contact)}
        />
      </div>
      <div className="chattingContainer">
        <ChattingScreen
          currentUser={currentUser}
          chat={chat}
          onProfileClick={(chat) => onProfileClick(chat)}
          messages={messagesListForChat}
        />
      </div>
    </div>
  );
};

export default MainScreen;
