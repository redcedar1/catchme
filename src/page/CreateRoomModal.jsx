import React, { useState } from "react";
import styled from "styled-components";


const CreateRoomModal = ({ isOpen, onClose, onCreateRoom }) => {
  const [roomTitle, setRoomTitle] = useState("");
  const [roomLocation, setRoomLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const roomId = Date.now();
    console.log('Creating room with:', { id: roomId, title: roomTitle, location: roomLocation });
    onCreateRoom({ id: roomId, title: roomTitle, location: roomLocation });
    onClose();
    setRoomTitle("");
    setRoomLocation("");
  };

  return isOpen ? (
    <ModalWrapper>
      <ModalContent>
        <ModalHeader>
          <h2>새로운 방 만들기</h2>
          <CloseButton onClick={onClose}>X</CloseButton>
        </ModalHeader>
        <RoomForm onSubmit={handleSubmit}>
          <Label>
            <span>방 제목</span>
            <InputField
              type="text"
              value={roomTitle}
              onChange={(e) => setRoomTitle(e.target.value)}
              required
              maxLength={15} // 최대 15자로 제한
            placeholder="공백 포함 최대 15자"
            />
          </Label>
          <Label>
            <span>만남 장소</span>
            <InputField
              type="text"
              value={roomLocation}
              onChange={(e) => setRoomLocation(e.target.value)}
              required
              maxLength={7} // 최대 7자로 제한
              placeholder="ex) 홍대, 강남"
            />
          </Label>
          <SubmitButton type="submit">GO</SubmitButton>
        </RoomForm>
        <Note>* 방은 3일 뒤 자동으로 사라집니다!</Note>
      </ModalContent>
    </ModalWrapper>
  ) : null;
};

export default CreateRoomModal;
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
const RoomForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  display: flex;
  width: 12rem;
  flex-direction: column;
  align-items: flex-start;
  font-size: 1rem;
  font-weight: 700;
  color: black;
`;


const InputField = styled.input`
  padding: 0.5rem;
  border: none;
  border-bottom: 2px solid #4caf50;
  font-size: 1rem;
  outline: none;
  margin-top: 0.5rem;
  font-family: SUITE, sans-serif;
  display: block;
  width: 100%;
  box-sizing: border-box;
`;


const SubmitButton = styled.button`
  background-color: #4caf50; 
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-top:1rem;
  transition: background-color 0.2s;
  font-family: Arial, sans-serif; 
  &:hover {
    background-color: #45a049; 
  }
`;

const Note = styled.p`
  font-size: 0.8rem;
  color: #ff6666;
  text-align: left;
  margin-top: 1rem;
  font-family: Arial, sans-serif;
`;
