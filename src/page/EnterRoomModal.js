import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';

const CloudModalContainer = styled.div`
  position: fixed;
  width: 70%;
  height: 60%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  z-index: 2;
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  grid-gap: 10px;
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #F1F1F1;
  opacity: 50%;
  z-index: 1;
`;

const Text1 = styled.div`
  color: #E296B6;
  text-align: center;
  font-size: 18px;
  font-weight: 900;
  width: 100%;
  height: 40%;
  margin: auto;
`

const Text2 = styled.div`
  color: #E296B6;
  text-align: center;
  font-size: 12px;
  font-weight: 900;
  width: 100%;
  height: 40%;
  margin: auto;
`

const Button = styled.button`
  background-color: #E296B6;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  width: 80%;
  height: 80%;
  margin: 0 auto;
  font-size: 28px;
  font-weight: 800;
`;

const EnterRoomModal = ({ isOpen, onClose }) => {

  const [selectedPeople, setSelectedPeople] = useState(null);
  const [roomCount, setRoomCount] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedPeople !== null) {
      const fetchData = async () => {
        try {
          const roomResponse = 
          await fetch('http://ec2-54-180-83-160.ap-northeast-2.compute.amazonaws.com:8080/room/api/room_info/', { //뒤에 ${selectedPeople} 붙이기 
            method: "GET",
            mode: 'cors'
          })

          const roomNumberdata = await roomResponse.json();
          
          setRoomCount(roomNumberdata);
        } catch (error) {
          console.error('Error fetching room info:', error);
        }
      };
  
      fetchData();
    }
  }, [selectedPeople]);

  const handleButtonClick = (people) => {
    setSelectedPeople(people);
    onClose();

    navigate(`/MeetingRoomMain`, { state: { selectedPeople: people } }); // 이건 임시
  };

  useEffect(() => {
    if (roomCount.count) {
      navigate(`/MeetingRoomMain/${roomCount.count}`);
    }
  }, [roomCount, navigate]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <>
          <Backdrop onClick={handleBackdropClick} />
          <CloudModalContainer>
            <Text1> 
              원하는 미팅 인원수를 선택하세요
            </Text1>
            <Button onClick={() => handleButtonClick(1)}>1 : 1</Button>
            <Button onClick={() => handleButtonClick(2)}>2 : 2</Button>
            <Button onClick={() => handleButtonClick(3)}>3 : 3</Button>
            <Button onClick={() => handleButtonClick(4)}>4 : 4</Button>
            <Text2> 
              Tip. 매칭이 되면 미팅의 대표자로서의 
              <br />
              역할을 하게 됩니다.
              <br />
              몇 명의 친구와 미팅을 나갈지 선택하세요 !
            </Text2>
          </CloudModalContainer>
        </>
      )}
    </>
  );
};

export default EnterRoomModal;