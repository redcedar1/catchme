import React, { useState } from "react";
import styled from "styled-components";
import Modal from "react-modal";

const customModalStyles = {
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    content: {
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "70%", // 모달 너비 조정
      height: "30%", // 모달 높이 조정
      borderRadius: "10%", // 테두리 border radius 20%
      opacity: 0.8,
      padding: "20px",
    },
  };

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
  display: block;
  margin-left: auto; /* 오른쪽에 붙이기 위해 marginLeft를 auto로 설정 */
  margin-right: 0; /* 불필요한 오른쪽 여백 제거 */
`;

const ModalTitle = styled.h3`
  color: #000;
  text-align: left;
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
`;

const ModalText = styled.div`
  color: #000;
  text-align: left;
  font-family: Inter;
  font-size: 21px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
`;

const InfoBox = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <InfoBoxContainer>
      <InfoButton onClick={openModal}></InfoButton>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
      >
        <ModalTitle>"달려라 뿅뿅뿅"의 정보</ModalTitle>
        <ModalText>🌐 "지역"</ModalText>
        <ModalText>🕖 방 삭제까지 "시간" 남았습니다.</ModalText>
      </Modal>
    </InfoBoxContainer>
  );
};

export default InfoBox;
