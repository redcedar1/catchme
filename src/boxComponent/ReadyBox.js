import React, { useState } from "react";
import styled from "styled-components";

const ReadyBoxContainer = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1fr 0.5fr; /* 3개의 열로 구성 */
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const LeftButton = styled.button`
grid-column: 1;
grid-row : 3;
justify-self: left;
max-width: 30%;
border: none;
border-radius: 25px;
background: #FAFAFA;
box-shadow: 4px 4px 8px 0px rgba(0, 0, 0, 0.10);
margin: 10px;
`;

const CenterButton = styled.button`
grid-column: 2;
grid-row: 2;
height: 125%;
border-radius: 16px;
border: none;
background: ${({ isReady }) => (isReady ? "#FF0000" : "#B2D3FB")};
box-shadow: 0px 0px 11px 0px rgba(0, 0, 0, 0.15);
`;

const LeftText = styled.span`
color: #000;
text-align: center;
font-family: Inter;
font-size: 12px;
font-style: normal;
font-weight: 700;
line-height: normal;
letter-spacing: 0.48px;
`;

const ReadyText = styled.span`
color: #3C3C3C;
text-align: center;
font-family: Inter;
font-size: 23px;
font-weight: 700;
letter-spacing: 0.92px;
`;

const ReadyBox = ( ) => {

  const [isReady, setReady] = useState(false);
  const [isMale, setMale] = useState(true); // 성별 상태 추가

  const handleReadyClick = () => {
    // 여기에 데이터베이스로 레디 정보를 전송하는 로직 추가
    sendReadyStatusToServer(); // API 호출 함수
    
    console.log("레디 버튼 클릭");

    setReady(!isReady);
  };

  const handleGenderChange = () => {
    setMale(!isMale);
  };

  const sendReadyStatusToServer = async () => {
    try {
      const response = await fetch("API 주소", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "me", // 추후에 유저 고유 식별값으로 변경
          ready: !isReady, // 현재 레디 상태의 반전 값
        }),
      });

      if (response.ok) {
        console.log("레디 정보 전송 성공");
      } else {
        console.error("레디 정보 전송 실패");
      }
    } catch (error) {
      console.error("API 호출 오류:", error);
    }

  };

  return (
    <ReadyBoxContainer>
      <LeftButton onClick={handleGenderChange}>
      <LeftText>{isMale ? "남" : "여"}</LeftText>
        </LeftButton>
      <CenterButton isReady={isReady} onClick={handleReadyClick}>
        <ReadyText>Ready !</ReadyText>
      </CenterButton>
    </ReadyBoxContainer>
  );
};

export default ReadyBox;
