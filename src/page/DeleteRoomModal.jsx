import React, { useState } from "react";
import styled from "styled-components";

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  width: 20rem;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #4caf50;
`;

const RoomList = styled.div`
  margin-top: 1rem;
`;

const Room = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DeleteButton = styled.button`
  background-color: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
`;

const NoRoomsMessage = styled.div`
  color: #ff0000;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  margin-top: 1rem;
`;
const DeleteRoomModal = ({ isOpen, onClose, rooms, onDeleteRoom }) => {
  const handleDeleteRoom = (roomId) => {
    onDeleteRoom(roomId);
  };

  return isOpen ? (
    <ModalWrapper>
      <ModalContent>
        <ModalHeader>
          <h2>방 삭제하기</h2>
          <CloseButton onClick={onClose}>X</CloseButton>
        </ModalHeader>
        {rooms.length > 0 ? ( // rooms 배열에 방이 있는 경우
          <RoomList>
            {rooms.map((room) => (
              <Room key={room.id}>
                <div>
                  <h3>{room.title}</h3>
                  <p>{room.description}</p>
                </div>
                <DeleteButton onClick={() => handleDeleteRoom(room.id)}>
                  삭제
                </DeleteButton>
              </Room>
            ))}
          </RoomList>
        ) : ( // rooms 배열에 방이 없는 경우
          <NoRoomsMessage>생성하신 방이 없어요!</NoRoomsMessage>
        )}
      </ModalContent>
    </ModalWrapper>
  ) : null;
};

export default DeleteRoomModal;
