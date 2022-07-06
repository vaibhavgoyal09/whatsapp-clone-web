import { useState } from "react";
import ChattingScreen from "../components/ChattingScreen";
import MainSidebar from "../components/MainSidebar";
import { useAuth } from "../context/AuthContext";
import "../css/mainScreenStyle.css";
import Chat from "../models/Chat";
import Message from "../models/Message";

const MainScreen = () => {
  const { currentUser } = useAuth();
  const [chat, setChat] = useState(null);

  const chats = [
    new Chat(
      1,
      2,
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
      "Lorem Ipsum",
      null,
      0
    ),
    new Chat(
      4,
      3,
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600",
      "Lorem Ipsum",
      null,
      0
    ),
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
      "https://images.pexels.com/photos/38554/girl-people-landscape-sun-38554.jpeg?auto=compress&cs=tinysrgb&w=600",
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
    new Chat(
      1,
      2,
      "https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=600",
      "Lorem Ipsum",
      new Message(
        1,
        1,
        2,
        "video",
        null,
        "https://player.vimeo.com/external/371863420.sd.mp4?s=2fe8f1b2b47e1d9c5dbcc5743eb26b471b1a861d&profile_id=164&oauth2_token_id=57447761",
        ""
      ),
      0
    ),
    new Chat(
      1,
      2,
      "https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=600",
      "Lorem Ipsum",
      new Message(
        1,
        1,
        2,
        "video",
        null,
        "https://player.vimeo.com/external/371863420.sd.mp4?s=2fe8f1b2b47e1d9c5dbcc5743eb26b471b1a861d&profile_id=164&oauth2_token_id=57447761",
        ""
      ),
      0
    ),
    new Chat(
      1,
      2,
      "https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=600",
      "Lorem Ipsum",
      new Message(
        1,
        1,
        2,
        "video",
        null,
        "https://player.vimeo.com/external/371863420.sd.mp4?s=2fe8f1b2b47e1d9c5dbcc5743eb26b471b1a861d&profile_id=164&oauth2_token_id=57447761",
        ""
      ),
      0
    ),
    new Chat(
      1,
      2,
      "https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=600",
      "Lorem Ipsum",
      new Message(
        1,
        1,
        2,
        "video",
        null,
        "https://player.vimeo.com/external/371863420.sd.mp4?s=2fe8f1b2b47e1d9c5dbcc5743eb26b471b1a861d&profile_id=164&oauth2_token_id=57447761",
        ""
      ),
      0
    ),
    new Chat(
      1,
      2,
      "https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=600",
      "Lorem Ipsum",
      new Message(
        1,
        1,
        2,
        "video",
        null,
        "https://player.vimeo.com/external/371863420.sd.mp4?s=2fe8f1b2b47e1d9c5dbcc5743eb26b471b1a861d&profile_id=164&oauth2_token_id=57447761",
        ""
      ),
      0
    ),
    new Chat(
      1,
      2,
      "https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=600",
      "Lorem Ipsum",
      new Message(
        1,
        1,
        2,
        "video",
        null,
        "https://player.vimeo.com/external/371863420.sd.mp4?s=2fe8f1b2b47e1d9c5dbcc5743eb26b471b1a861d&profile_id=164&oauth2_token_id=57447761",
        ""
      ),
      0
    ),
    new Chat(
      1,
      2,
      "https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=600",
      "Lorem Ipsum",
      new Message(
        1,
        1,
        2,
        "video",
        null,
        "https://player.vimeo.com/external/371863420.sd.mp4?s=2fe8f1b2b47e1d9c5dbcc5743eb26b471b1a861d&profile_id=164&oauth2_token_id=57447761",
        ""
      ),
      0
    ),
    new Chat(
      1,
      2,
      "https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=600",
      "Lorem Ipsum",
      new Message(
        1,
        1,
        2,
        "video",
        null,
        "https://player.vimeo.com/external/371863420.sd.mp4?s=2fe8f1b2b47e1d9c5dbcc5743eb26b471b1a861d&profile_id=164&oauth2_token_id=57447761",
        ""
      ),
      0
    ),
    new Chat(
      1,
      2,
      "https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=600",
      "Lorem Ipsum",
      new Message(
        1,
        1,
        2,
        "video",
        null,
        "https://player.vimeo.com/external/371863420.sd.mp4?s=2fe8f1b2b47e1d9c5dbcc5743eb26b471b1a861d&profile_id=164&oauth2_token_id=57447761",
        ""
      ),
      0
    ),
  ];

  const onChatClick = (chat) => setChat(chat);

  return (
    <div className="pg">
      <div className="sidebarContainer">
        <MainSidebar chats={chats} onChatClick={(chat) => onChatClick(chat)} />
      </div>
      <div className="chattingContainer">
        <ChattingScreen />
      </div>
    </div>
  );
};

export default MainScreen;
