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
      width: "100%", 
      height: "80%", 
      display: "grid",
      gridTemplateRows: "1fr 1fr 1.5fr 1.5fr 1.5fr 1.5fr 1.5fr 0.5fr", 
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
    font-size: 17px;
    font-weight: 600;
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

const Text = styled.div`
    text-align: center;
    width: 90%;
    height: 80%;
    margin: auto;
    font-size: 13px;
    font-weight: 600;
    color: #515151;
    span {
    color: #CE6591;
    font-size: 21px;
    font-weight: 600;
    }
`;

  const GridItem = styled.div`
    display: grid;
    margin: auto;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-template-areas:
    "subgrid1 subgrid2 subgrid3 subgrid3"
    "subgrid4 subgrid4 subgrid4 subgrid5";
    width: 95%;
    height: 80%;
    background: #FFF;
    box-shadow: 0px 0px 22px 0px rgba(0, 0, 0, 0.10);
    border-radius: 8px;
    border: 2px solid transparent;
    ${(props) =>
      props.isSelected &&
      css`
        animation: ${blinkAnimation} 1s infinite;
      `}    `;

const SubGridItem1 = styled.div`
    grid-area: subgrid1;
 `;

const SubGridItem2 = styled.div`
    grid-area: subgrid2;
    color: #515151;
    text-align: center;
    font-size: 13px;
    font-weight: 700;
    margin: auto;
`;

const SubGridItem3 = styled.div`
    grid-area: subgrid3;
    margin: auto;
`;

const SubGridItem4 = styled.div`
    grid-area: subgrid4;
    span {
        color: #CE6591;
        font-size: 18px;
        font-weight: 600;
    }
    margin: auto;
`;

const SubGridItem5 = styled.div`
    grid-area: subgrid5;
    margin: auto;
`;

const StyledButton = styled.button`
  width: 100%;
  height: 70%;
  font-size: 15px;
  border-radius: 9px;
  background: ${(props) => (props.selected ? "#E296B6" : "#515151")};  
  color: white;
  border: none;
  cursor: pointer;
`;

const StyledButton2 = styled.button`
  width: 20%;
  height: 30px;
  margin: auto;
  font-size: 13px;
  border-radius: 9px; 
  color: black;
  border: none;
  cursor: pointer;
`;

const MaleChooseModal = ({ isOpen, onClose, maleusers }) => {

  const [selectedUser, setSelectedUser] = useState(null);
  const [timer, setTimer] = useState(1800);

  const getImagePath = (user) => {
    return `/image/profile/${user.animal.toLowerCase()}Male.png`;
  };

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

  const handleButtonClick = async (user) => {
    if (selectedUser === user) {
      setSelectedUser(null);
    } else {
      setSelectedUser(user);
    }
  };

  const handleChooseClick = async () => {
    if (selectedUser) {
      await sendSelectedUserToServer(selectedUser);
    }
    onClose();
  };

  const handleCancelClick = async () => {
    await sendSelectedUserToServer(null);
    onClose();
  };

  const sendSelectedUserToServer = async (selectedUser) => {
    try {
      const response = 
      await fetch('http://ec2-54-180-83-160.ap-northeast-2.compute.amazonaws.com:8080/room/api/room_info/', {
        method: "POST",
        mode: 'cors',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedUser,
        }),
      });

      if (response.ok) {
        console.log("선택한 사용자 정보 전송 성공");
      } else {
        console.error("선택한 사용자 정보 전송 실패");
      }
    } catch (error) {
      console.error("API 호출 오류:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles}>
        <TimeText>{`00:${timer < 10 ? `0${timer}` : timer}`}</TimeText>
        <Text>
            <span> 나를 선택한 사람들이에요 ! </span>
            <br /><br />
            여기서 선택하면 바로 매칭이 돼요 !
            <br /><br />
        </Text>
      {maleusers.map((user, index) => (
        <GridItem key={index} isSelected={selectedUser === user}>
          <SubGridItem1>
          <img 
            src={getImagePath(user)} 
            alt={`${user.animal} 이미지`}
            style={{ width: "50px", height: "50px" }}
            />
          </SubGridItem1>
          <SubGridItem2>
            {user.school} {user.major} {user.age}
          </SubGridItem2>
          <SubGridItem3>
            {user.height} {user.body} {user.mbti}
          </SubGridItem3>
          <SubGridItem4>
            회원님의 <span>이상형</span>과 <span>78%</span> 부합해요!
          </SubGridItem4>
          <SubGridItem5>
            <StyledButton
                selected={selectedUser === user}
                onClick={() => handleButtonClick(user)}
                >
                {selectedUser === user ? "취소하기 ↗" : "선택하기 ↗"}
            </StyledButton>
          </SubGridItem5>
        </GridItem>
      ))}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <StyledButton2 onClick={handleChooseClick}>
          선택 완료
        </StyledButton2>
        <StyledButton2 onClick={handleCancelClick}>
          선택 안 함
        </StyledButton2>
      </div>
    </Modal>
  );
};

export default MaleChooseModal;
