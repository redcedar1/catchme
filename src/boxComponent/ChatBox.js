import React from "react";
import styled from "styled-components";

const ChatBoxContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
`;

const ChatItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center; /* 텍스트 가운데 정렬 */
`;

const ChatBox = ({ users }) => {
  const getImagePath = (text) => {
    // 예를 들어 이미지 파일은 "lion1.jpg", "taeil.jpg"와 같이 저장되어 있다고 가정합니다.
    return `/path/to/images/${text.toLowerCase()}1.jpg`;
  };

  return (
    <ChatBoxContainer>
      {users.map((user, index) => (
        <ChatItem  key={index}>
          <div>{user.text}</div>
          {/*<img src={getImagePath(user.text)} alt={`${user.text} 이미지`} /> */}
        </ChatItem >
      ))}
    </ChatBoxContainer>
  );
};

export default ChatBox;
