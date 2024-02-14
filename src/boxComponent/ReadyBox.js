import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ReadyBoxContainer = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1fr 0.5fr; /* 3개의 열로 구성 */
`;

const LeftButton = styled.button`
grid-column: 1;
grid-row : 3;
justify-self: left;
max-width: 30%;
height:50%;
border: none;
border-radius: 25px;
background: #FAFAFA;
box-shadow: 4px 4px 8px 0px rgba(0, 0, 0, 0.10);
margin: 10px;
`;

const CenterButton = styled.button`
grid-column: 2;
grid-row: 2;
width: 150px;
height: 100%;
margin: 0 auto;
border-radius: 16px;
border: 2px solid #3B3B3B;
background: ${({ isReady }) => (isReady ? "#FCFF71" : "#B2D3FB")};
box-shadow: 0px 0px 11px 0px rgba(0, 0, 0, 0.15);
`;

const LeftText = styled.span`
color: #000;
font-size: 12px;
font-weight: 700;
`;

const ReadyText = styled.span`
color: #3C3C3C;
font-family: Inter;
font-size: 23px;
font-weight: 900;
letter-spacing: 0.92px;
`;

const ReadyBox = ( { onGenderChange, isMale, onReadyButtonClick, roomId, isReady, setIsReady } ) => {

  const [isMaleUser, setMale] = useState(isMale);

  const handleReadyClick = () => {
    setIsReady(!isReady);
    sendReadyStatusToServer();
    onReadyButtonClick();
  };

  const handleGenderChange = () => {
    setMale(!isMaleUser);
    onGenderChange(!isMaleUser);
  };

  const [csrfToken, setCsrfToken] = useState(null); 

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('http://ec2-54-180-83-160.ap-northeast-2.compute.amazonaws.com:8080/main/csrf/', {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
        });
    
        if (!response.ok) {
          throw new Error('서버 응답이 OK 상태가 아닙니다.');
        }
    
        const contentType = response.headers.get('content-type');
      
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log(data);
          console.log(data.csrfToken);
          setCsrfToken(data.csrfToken);
        } else {
          console.error('서버 응답이 JSON 형식이 아닙니다.');
        }
      } catch (error) {
        console.error('CSRF 토큰 가져오기 오류:', error);
      }
    };

    fetchCsrfToken();
  }, []);
  

  const sendReadyStatusToServer = async () => {
    try {
      if (!csrfToken) {
        console.error('CSRF 토큰이 유효하지 않습니다.');
        return;
      }
      const response = 
      await fetch(`http://ec2-54-180-83-160.ap-northeast-2.compute.amazonaws.com:8080/room/api/room_info/${roomId}/`, {
        // 현재 클라이언트 유저로 접근
        method: "POST",
        mode: 'cors',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          kid: 1001,
          rno: 1,
          ready: !isReady,
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
      <LeftText>{isMaleUser ? "남" : "여"}</LeftText>
        </LeftButton>
      <CenterButton isReady={isReady} onClick={handleReadyClick}>
        <ReadyText>{isReady ? "CANCEL !" : "READY !"}</ReadyText>
      </CenterButton>
    </ReadyBoxContainer>
  );
};

export default ReadyBox;
