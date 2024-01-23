import React, { useState } from "react";
import styled from "styled-components";
import Modal from "react-modal";

const customModalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  content: {
    top: "63%", // 수직 위치를 화면의 중간으로 조정
    left: "50%", // 수평 위치를 화면의 중간으로 조정
    transform: "translate(-50%, -50%)", // 말풍선을 가운데로 정렬
    width: "50%",
    height: "20px",
    borderRadius: "10%",
    opacity: 0.8,
    padding: "5px",
    boxShadow: "4px 4px 11px 0px rgba(0, 0, 0, 0.22)",
  },
};

const UserBoxContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: ${({ isMe }) => (isMe ? "pointer" : "default")};
`;

const ModalText = styled.div`
  color: #000;
  text-align: center;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const UserBox = ({ users }) => {

  const [selectedUser, setSelectedUser] = useState(null);

  const getImagePath = (name) => {
    // 예를 들어 이미지 파일은 "lion1.jpg", "taeil.jpg"와 같이 저장되어 있다고 가정합니다.
    return `/path/to/images/${name.toLowerCase()}1.jpg`;
  };

  const handleUserClick = (user) => {
    if (user.name === "me") {
      setSelectedUser(user);
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  return (
    <UserBoxContainer>
      {users.map((user, index) => (
        <UserItem
          key={index}
          isMe={user.name === "me"}
          onClick={() => handleUserClick(user)}
        >
          <div>{user.name}</div>
          {/*<img src={getImagePath(user.name)} alt={`${user.name} 이미지`} /> */}
        </UserItem>
      ))}
      {selectedUser && (
        <Modal
        isOpen={true} // 모달 상태를 열린 상태로 설정
        onRequestClose={closeModal}
        style={customModalStyles}
      >
        <ModalText>"말풍선 종류"</ModalText>
      </Modal>
      )}
    </UserBoxContainer>
  );
};

export default UserBox;
