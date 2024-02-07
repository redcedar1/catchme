import React, { useState, useEffect } from "react";
import styled from "styled-components";
import InfoBox from "../boxComponent/InfoBox";
import ChatBox from "../boxComponent/ChatBox";
import UserBox from "../boxComponent/UserBox";
import ReadyBox from "../boxComponent/ReadyBox";
import UserCardBox from "../boxComponent/UserCardBox";
import ReadyStateBox from "../boxComponent/ReadyStateBox";
import ReadyConfirmModal from "../modalComponet/ReadyConfirmModal";
import MaleChooseModal from "../modalComponet/MaleChooseModal";
import FemaleChooseModal from "../modalComponet/FemaleChooseModal";
import SecondModal from "../modalComponet/SecondModal";
import FinalModal from "../modalComponet/FinalModal";
//import io from 'socket.io-client';

const RootBodyContainer = styled.div`
  display: grid;
  width: 100%;
  height: 100vh;
  grid-template-rows: 0.15fr 0.1fr 0.1fr 0.1fr 0.1fr 0.15fr 0.18fr 0.05fr;
  position: relative;
`;

const RectangleTable = styled.div`
  position: absolute;
  width: 90%;
  height: 10%;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 42px;
  background: #deaf69;
  box-shadow: 0px 4px 7px 0px rgba(0, 0, 0, 0.25);
  z-index: -1;
`;

const RoomBody = (roomId) => {
  const [roomName, setRoomName] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [count, setCount] = useState("");
  const [maleusers, setMaleusers] = useState([]);
  const [femaleusers, setFemaleusers] = useState([]);

  // API 알고리즘
  useEffect(() => {
    /* 
     useEffect(() => {
    // 서버의 웹 소켓 엔드포인트에 연결
    const socket = io('http://your-server-endpoint');

    // 연결이 수립되면 콘솔에 로그 출력
    socket.on('connect', () => {
      console.log('웹 소켓 연결 성공!');
    });

    // 메시지를 수신하면 콘솔에 로그 출력
    socket.on('message', (data) => {
      console.log('서버로부터 메시지 수신:', data);
    });

    // 컴포넌트가 언마운트되면 연결 해제
    return () => {
      socket.disconnect();
    };
  }, []); // 빈 배열은 컴포넌트가 마운트될 때 한 번만 실행
  */

    // 나중에 제대로 할 땐 URI/room/(number) 이런식으로 만들기
    const fetchData = async () => {
      try {
        const roomResponse = await fetch(
          "http://ec2-54-180-83-160.ap-northeast-2.compute.amazonaws.com:8080/room/api/room_info/",
          {
            //뒤에 ${roomId} 붙이기
            method: "GET",
            mode: "cors",
          }
        );
        const MaleusersResponse = await fetch(
          "http://ec2-54-180-83-160.ap-northeast-2.compute.amazonaws.com:8080/room/api/room_info/",
          {
            //뒤에 ${roomId} 붙이기
            method: "GET",
            mode: "cors",
          }
        );
        const FemaleusersResponse = await fetch(
          "http://ec2-54-180-83-160.ap-northeast-2.compute.amazonaws.com:8080/room/api/room_info/",
          {
            //뒤에 ${roomId} 붙이기
            method: "GET",
            mode: "cors",
          }
        );

        const roomdata = await roomResponse.json();
        const maledata = await MaleusersResponse.json();
        const femaledata = await FemaleusersResponse.json();
        setRoomName(roomdata[0].rname);
        setLocation(roomdata[0].location);
        setTime(roomdata[0].created_at);
        setCount(roomdata[0].count);
        setMaleusers(maledata[0].menInfos);
        setFemaleusers(femaledata[0].womenInfos);
      } catch (error) {
        console.error("Error fetching room info:", error);
      }
    };

    fetchData(); // 웹소켓 연동 후 여기 없애기
  }, [roomId]);

  const [showReadyConfirmModal, setShowReadyConfirmModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [showSecondModal, setShowSecondModal] = useState(false);
  const [secondRecommendations, setSecondRecommendations] = useState([]);

  const [showFinalModal, setShowFinalModal] = useState(false);
  const [final, setFinal] = useState([]);

  // 선택 모달창 여는 알고리즘
  useEffect(() => {
    const anyNotReady = [...maleusers, ...femaleusers].some(
      (user) => !user.ready
    );
    const isMaleFemaleEqual = maleusers.length === femaleusers.length;
    const isMaleFemaleOver2 = maleusers.length > 1 && femaleusers.length > 1;

    const checkAllUsersReady = async () => {
      if (!anyNotReady && isMaleFemaleEqual && isMaleFemaleOver2) {
        if (/*day1*/ true) setShowReadyConfirmModal(true);
        if (/*day2*/ false) {
          const isMutualSelected = true;

          if (!isMutualSelected) {
            try {
              const response = await fetch(
                "http://ec2-54-180-83-160.ap-northeast-2.compute.amazonaws.com:8080/room/api/room_info/",
                {
                  method: "GET",
                  mode: "cors",
                }
              );
              if (!response.ok) {
                throw new Error("Failed to fetch second recommendations");
              }
              const data = await response.json();
              setSecondRecommendations(data[0].menInfos);
              setShowSecondModal(true);
            } catch (error) {
              console.error("Error fetching second recommendations:", error);
            }
          } else if (isMutualSelected) {
            try {
              const response = await fetch(
                "http://ec2-54-180-83-160.ap-northeast-2.compute.amazonaws.com:8080/room/api/room_info/",
                {
                  method: "GET",
                  mode: "cors",
                }
              );
              if (!response.ok) {
                throw new Error("Failed to fetch second recommendations");
              }
              const data = await response.json();
              setFinal(data[0].menInfos);
              setShowFinalModal(true);
            } catch (error) {
              console.error("Error fetching second recommendations:", error);
            }
          }
        } else {
          setShowSecondModal(false);
        }
      } else {
        setShowReadyConfirmModal(false);
      }
    };
    checkAllUsersReady();
  }, [maleusers, femaleusers]);

  const [isMale, setIsMale] = useState(true);
  const filteredMaleUsers = maleusers.filter((user) => user.ready);
  const filteredFemaleUsers = femaleusers.filter((user) => user.ready);

  const handleGenderChange = (newIsMale) => {
    setIsMale(newIsMale);
  };

  return (
    // 기본 방 구조
    <RootBodyContainer>
      <InfoBox
        roomName={roomName}
        location={location}
        time={time}
        count={count}
      />
      <ChatBox users={isMale ? filteredMaleUsers : filteredFemaleUsers} />
      <UserBox
        users={
          isMale
            ? filteredMaleUsers.map((user) => ({ ...user, gender: "Male" }))
            : filteredFemaleUsers.map((user) => ({ ...user, gender: "Female" }))
        }
      />
      <RectangleTable />
      <ChatBox users={isMale ? filteredFemaleUsers : filteredMaleUsers} />
      <UserBox
        users={
          isMale
            ? filteredFemaleUsers.map((user) => ({ ...user, gender: "Female" }))
            : filteredMaleUsers.map((user) => ({ ...user, gender: "Male" }))
        }
      />
      <ReadyBox onGenderChange={handleGenderChange} isMale={isMale} />
      <UserCardBox
        users={
          isMale
            ? filteredMaleUsers.map((user) => ({ ...user, gender: "Male" }))
            : filteredFemaleUsers.map((user) => ({ ...user, gender: "Female" }))
        }
      />
      <ReadyStateBox users={isMale ? filteredMaleUsers : filteredFemaleUsers} />

      {/* 선택창 모달 구조 */}
      {showReadyConfirmModal && (
        <ReadyConfirmModal
          isOpen={showReadyConfirmModal}
          onClose={() => setShowReadyConfirmModal(false)}
          onConfirm={() => setShowModal(true)}
        />
      )}
      {showModal &&
        (isMale ? (
          <FemaleChooseModal
            isOpen={true}
            onClose={() => setShowModal(false)}
            femaleusers={femaleusers}
          />
        ) : (
          <MaleChooseModal
            isOpen={true}
            onClose={() => setShowModal(false)}
            maleusers={maleusers}
          />
        ))}
      {showSecondModal && (
        <SecondModal
          isOpen={showSecondModal}
          onClose={() => setShowSecondModal(false)}
          recommendations={secondRecommendations}
          gender={isMale ? "Male" : "Female"}
        />
      )}
      {showFinalModal && (
        <FinalModal
          isOpen={showFinalModal}
          onClose={() => setShowFinalModal(false)}
          me={final[0]}
          you={final[1]}
        />
      )}
    </RootBodyContainer>
  );
};

export default RoomBody;
