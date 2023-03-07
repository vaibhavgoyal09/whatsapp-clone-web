import { EmojiClickData, Theme } from "emoji-picker-react";
import React, { createRef, Suspense, useEffect, useState } from "react";
import { useAxios } from "../context/AxiosContext";
import "../css/chattingScreenStyle.css";
import Chat, { ChatType } from "../models/Chat";
import Message from "../models/Message";
import SendMessageRequest from "../models/SendMessageRequest";
import User, { OnlineStatus } from "../models/User";
import Utils from "../utils/Utils";

const ChatFooter = React.lazy(() => import("./ChatFooter"));
const ChatHeader = React.lazy(() => import("./ChatHeader"));
const PreviewAttachment = React.lazy(() => import("./PreviewAttachment"));
const ReceivedMessageItem = React.lazy(() => import("./ReceivedMessageItem"));
const SentMessageItem = React.lazy(() => import("./SentMessageItem"));

const EmojiPicker = React.lazy(() => import("emoji-picker-react"));

interface Props {
  currentUserModel: User;
  chat: Chat;
  messages: Message[];
  remoteUser: User | null;
  onProfileClick: () => void;
  onSendMessage: (request: SendMessageRequest) => void;
  onTypingStatusChange: (isTyping: boolean) => void;
}

const ChattingScreen: React.FC<Props> = ({
  currentUserModel,
  chat,
  messages,
  onProfileClick,
  onSendMessage,
  onTypingStatusChange,
  remoteUser,
}) => {
  const [messageText, setMessageText] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPreviewAttachment, setShowPreviewAttachment] = useState(false);
  const fileInputRef = createRef<HTMLInputElement>();
  const axios = useAxios()!;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let files = event.target.files;

    if (files && files.length >= 1) {
      setAttachment(files[0]);
      setShowPreviewAttachment(true);
    }
  };

  if (!chat || !currentUserModel) {
    return null;
  }

  let isUserOnline: boolean | null = null;
  let lastOnlineAt: number | null = null;

  if (chat.type === ChatType.oneToOne) {
    if (!remoteUser) {
      return null;
    } else {
      isUserOnline = remoteUser.onlineStatus === OnlineStatus.online;
      lastOnlineAt = remoteUser.lastOnlineAt;
    }
  }

  const onAttachmentClicked = () => {
    fileInputRef.current!.click();
  };

  const onEmojiIconClicked = () => {
    console.log("onEmojiIconClicked");
    setShowEmojiPicker((prev) => !prev);
  };

  const handleOnEmojiSelected = (emojiData: EmojiClickData) => {
    setMessageText((prev) => prev + emojiData.emoji);
  };

  const sendMessage = async () => {
    if (messageText === "") {
      return;
    }

    let attachmentUrl: string | null = null;

    if (attachment) {
      try {
        await axios.safeApiRequest(async () => {
          attachmentUrl = await axios.uploadFile(attachment);
        });
      } catch (e: any) {
        alert(e.message);
      }
    }

    let remoteUserId;
    if (remoteUser) {
      remoteUserId = remoteUser.id;
    } else {
      remoteUserId = Utils.getRemoteUserIdFromChat(chat, currentUserModel.id);
    }
    let request: SendMessageRequest = {
      type: 0,
      own_user_id: currentUserModel.id,
      to_user_id: remoteUserId,
      chat_id: chat.id,
      media_url: attachmentUrl,
      text: messageText,
    };
    onSendMessage(request);
    setAttachment(null);
    setMessageText("");
  };

  const handleRemoveAttachmentClicked = () => {
    setAttachment(null);
    setShowPreviewAttachment(false);
  };

  return (
    <div id="content">
      <div className="headerContainer">
        <ChatHeader
          profileImageUrl={chat.profileImageUrl}
          onProfileClick={() => onProfileClick()}
          name={chat.name}
          type={chat.type}
          isUserOnline={isUserOnline}
          lastOnlineAt={lastOnlineAt}
          isTyping={
            remoteUser ? remoteUser.onlineStatus === OnlineStatus.typing : false
          }
        />
      </div>
      <div
        className="messagesContainer"
        onClick={() => {
          if (showEmojiPicker) {
            setShowEmojiPicker(false);
          }
        }}
      >

        <div className="listContainer">
          {messages.map((message: Message) =>
            message.senderId === currentUserModel.id ? (
              <SentMessageItem message={message} key={message.id} />
            ) : (
              <ReceivedMessageItem message={message} key={message.id} />
            )
          )}
        </div>
        <Suspense>
          <div className="emojiPickerCtnr" onClick={(e) => e.stopPropagation()}>
            {showEmojiPicker ? (
              <EmojiPicker
                onEmojiClick={(data: EmojiClickData) =>
                  handleOnEmojiSelected(data)
                }
                theme={Theme.DARK}
                lazyLoadEmojis
                searchDisabled
                height="350px"
              />
            ) : null}
          </div>
        </Suspense>
        {showPreviewAttachment ? (
          <div className="attachmentPreviewCtnr">
            <PreviewAttachment
              onRemoveAttachmentClicked={() => handleRemoveAttachmentClicked()}
              attachment={attachment!}
              doShow={showPreviewAttachment}
            />
          </div>
        ) : null}
      </div>
      <input
        type="file"
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <div className="footerContainer">
        <ChatFooter
          messageFieldValue={messageText}
          onSendMessage={() => sendMessage()}
          onMessageFieldValueChange={(value: string) => setMessageText(value)}
          onTypingStatusChange={(isTyping: boolean) =>
            onTypingStatusChange(isTyping)
          }
          onAttachmentClicked={() => onAttachmentClicked()}
          onEmojiIconClicked={() => onEmojiIconClicked()}
        />
      </div>
    </div>
  );
};

export default ChattingScreen;
