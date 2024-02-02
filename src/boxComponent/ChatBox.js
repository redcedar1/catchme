import React from "react";
import styled, { keyframes } from "styled-components";

const bounceAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
`;

const ChatBoxContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
`;

const ChatItem = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  animation: ${bounceAnimation} 1s 5;
`;

const ChatBox = ({ users }) => {
  const getImagePath = (text) => {
    return `/image/chatBubble/chat_${text.toLowerCase()}.png`;
  };

  return (
    <ChatBoxContainer>
      {users.map((user, index) => (
        <ChatItem  key={index}>
          <img 
          src={getImagePath(user.chat)} 
          alt={`${user.chat} 이미지`} 
          style={{ width: "70px", height: "70px" }}
          />
        </ChatItem >
      ))}
    </ChatBoxContainer>
  );
};

export default ChatBox;
