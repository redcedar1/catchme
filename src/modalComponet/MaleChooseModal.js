import React, { useState, useEffect  } from "react";
import Modal from "react-modal";
import styled, { css, keyframes } from "styled-components";

const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      border: "none", // 테두리 없애기
      padding: 0, // 내부 패딩 없애기
      width: "100%", // 화면 너비만큼
      height: "80%", // 화면 높이만큼
      opacity: "0.95",
      display: "grid",
      gridTemplateRows: "repeat(6, 1fr)", // 5개의 열로 구성
      gap: "5px",
      padding: "20px",
      margin: "5px",
    },
  };

  const blinkAnimation = keyframes`
  0% {
    border-color: #000;
  }
  50% {
    border-color: #E296B6;
  }
  100% {
    border-color: #000;
  }
`;

  const TimeText = styled.div`
    color: #FFF;
    text-align: center;
    font-family: Inter;
    font-size: 21px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    background: #515151;
    border: 2px solid #515151;
    border-radius: 30px;
    width: 30%;
    height: 40%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
`;

  const GridItem = styled.div`
    display: grid;
    justify-content: center;
    margin: auto;
    grid-template-columns: 1fr 3fr 1fr;
    width: 84%;
    height: 30%;
    background: #FFF;
    box-shadow: 0px 0px 22px 0px rgba(0, 0, 0, 0.10);
    padding: 20px;
    text-align: center;
    border-radius: 8px;
    border: 2px solid transparent;
    ${(props) =>
      props.isSelected &&
      css`
        animation: ${blinkAnimation} 1s infinite;
      `}    `;

const SubGridItem1 = styled.div`

`;

const SubGridItem2 = styled.div`
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    color: #515151;
    text-align: center;
    font-family: Inter;
    font-size: 17px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`;

const StyledButton = styled.button`
  height: 85%;
  border-radius: 9px;
  background: ${(props) => (props.selected ? "#E296B6" : "#515151")};  
  color: white;
  border: none;
  cursor: pointer;
`;

const MaleChooseModal = ({ isOpen, onClose, maleusers }) => {

  const [selectedUser, setSelectedUser] = useState(null);
  const [timer, setTimer] = useState(60); // 60 seconds

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (timer === 0) {
      onClose(); // Close the modal when the timer reaches 0
    }
  }, [timer, onClose]);

  const handleButtonClick = (user) => {
    if (selectedUser === user) {
      // 취소하기
      setSelectedUser(null);
    } else {
      // 선택하기
      setSelectedUser(user);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles}>
        <TimeText>{`00:${timer < 10 ? `0${timer}` : timer}`}</TimeText>
      {maleusers.map((user, index) => (
        <GridItem key={index} isSelected={selectedUser === user}>
          <SubGridItem1>
            {user.name}
          </SubGridItem1>
          <SubGridItem2>
            {user.univ} {user.major}
          </SubGridItem2>
          <SubGridItem1>
            <StyledButton
              selected={selectedUser === user}
              onClick={() => handleButtonClick(user)}
            >
              {selectedUser === user ? "취소하기 ↗" : "선택하기 ↗"}
            </StyledButton>
          </SubGridItem1>
        </GridItem>
      ))}
    </Modal>
  );
};

export default MaleChooseModal;
