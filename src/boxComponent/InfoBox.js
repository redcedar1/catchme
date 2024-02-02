import React, { useState } from "react";
import styled from "styled-components";
import Modal from "react-modal";

const globeImage = `${process.env.PUBLIC_URL}/image/gps.png`;
const clockImage = `${process.env.PUBLIC_URL}/image/time.png`;
const humanImage = `${process.env.PUBLIC_URL}/image/human.png`;

const InfoBoxContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    align-items: center; 
`;

const InfoButton = styled.button`
  grid-column: 5;
  background: url(${process.env.PUBLIC_URL}/image/info.png) no-repeat;
  background-size: contain;
  width: 50%;
  height: 35%;
  border: none;
  cursor: pointer;
  margin-left: auto; 
`;

const customModalStyles = {
  overlay: {
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
  content: {
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%", 
    height: "30%", 
    borderRadius: "10%",
    opacity: 1,
    padding: "20px",
  },
};

const ModalTitle = styled.h3`
  color: #000;
  text-align: left;
  font-size: 24px;
`;

const ModalText = styled.div`
  color: #000;
  text-align: left;
  font-size: 18px;
  font-weight: 900;
  display: flex;
  align-items: center;
  margin-top: 5px;

  img.globe {
    width: 15px;
    height: 24px;
    margin-left: 5px;
    margin-right: 10px;
  }

  img.clock {
    width: 24px;
    height: 24px;
    margin-top: 5px;
    margin-right: 5px;
  }

  img.human {
    width: 24px;
    height: 30px;
    margin-top: 5px;
    margin-right: 5px;
  }
`;

const InfoBox = ({ roomName, location, time, count }) => {

  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  const dateTime = new Date(time);
  const year = dateTime.getFullYear();
  const month = dateTime.getMonth() + 1; // 월은 0부터 시작하므로 1을 더합니다.
  const day = dateTime.getDate();
  const hour = dateTime.getHours();
  const minute = dateTime.getMinutes();
  const formattedDateTime = `${year}/${month}/${day+3}/${hour}:${minute}`;

  return (
    <InfoBoxContainer>
      <InfoButton onClick={openModal}></InfoButton>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
      >
        <ModalTitle>"{roomName}"의 정보</ModalTitle>
        <ModalText><img className="globe" src={globeImage} alt="globe" /> {location} </ModalText>
        <ModalText><img className="clock" src={clockImage} alt="clock" /> 방 파기 날짜: {formattedDateTime}</ModalText>
        <ModalText><img className="human" src={humanImage} alt="human" /> 인원수 : {count}</ModalText>
      </Modal>
    </InfoBoxContainer>
  );
};

export default InfoBox;
