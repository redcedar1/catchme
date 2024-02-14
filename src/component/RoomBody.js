import React, { useState, useEffect, useRef } from "react";
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
import io from 'socket.io-client';

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

const RoomBody = ({roomId}) => {

  const [user, setUser] = useState(null);

  const [roomName, setRoomName] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [meetingnum, setMeetingnum] = useState("");
  const [maleusers, setMaleusers] = useState([]);
  const [femaleusers, setFemaleusers] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const dataSocket = useRef(null);

  const handleReadyButtonClick = async () => {
    if (isReady) {
      // 레디 상태일 때 버튼을 누르면 웹소켓 연결을 종료
      if (dataSocket.current) {
        dataSocket.current.close();
        dataSocket.current = null;
      }
      setIsReady(false);
    } else {

      /* try {
        // 카카오에서 사용자 정보 가져오기
        const kakaoResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
          headers: {
            Authorization: `Bearer ${kakaoAccessToken}`, // Kakao Access Token이 필요
          },
        });

        if (!kakaoResponse.ok) {
          throw new Error("Failed to fetch Kakao user information");
        }

        const kakaoUserData = await kakaoResponse.json();
        */

        // 사용자 정보 상태에 저장
        setUser({
          kid: 1001
          //nickname: kakaoUserData.properties.nickname,
          //profileImage: kakaoUserData.properties.profile_image,
        });
      // 레디 상태가 아닐 때 버튼을 누르면 웹소켓 연결
      dataSocket.current = new WebSocket(`ws://ec2-54-180-83-160.ap-northeast-2.compute.amazonaws.com:8000/ws/room/${roomId.roomId}/`);

      dataSocket.current.onopen = () => {
        console.log('웹 소켓 연결 성공!');
        // 웹소켓 연결이 성공하면 서버로 'ready' 메시지
        dataSocket.current.send(JSON.stringify({ message: 'ready', kid: user.kid }));
      };

      dataSocket.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log('서버로부터 메시지 수신:', data);
      };

      setIsReady(true);
    } /* catch (error) {
      console.error("Error handling ready button click:", error);
    } */
  };

  useEffect(() => {
    return () => {
      if (dataSocket.current) {
        dataSocket.current.close();
      }
    };
  }, []);


    const fetchData = async () => {
      try {
        const roomResponse = await fetch(
          `http://ec2-54-180-83-160.ap-northeast-2.compute.amazonaws.com:8080/room/api/room_info/${roomId}/`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            }
          }
        );
        const MaleusersResponse = await fetch(
          `http://ec2-54-180-83-160.ap-northeast-2.compute.amazonaws.com:8080/room/api/room_info/${roomId}/`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              'Accept': 'application/json'
            }
          }
        );
        const FemaleusersResponse = await fetch(
          `http://ec2-54-180-83-160.ap-northeast-2.compute.amazonaws.com:8080/room/api/room_info/${roomId}/`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              'Accept': 'application/json'
            }
          }
        );

        const roomdata = await roomResponse.json();
        const maledata = await MaleusersResponse.json();
        const femaledata = await FemaleusersResponse.json();
        setRoomName(roomdata.rname);
        setLocation(roomdata.location);
        setTime(roomdata.created_at);
        setMeetingnum(roomdata.meetingnum);
        setMaleusers(roomdata.menInfos);
        setFemaleusers(roomdata.womenInfos);

      } catch (error) {
        console.error("Error fetching room info:", error);
      }
  };

  useEffect(() => {
    fetchData(); // 초기 로딩 시에도 데이터를 불러오도록 함
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
        if(/*day1*/ true)
          setShowReadyConfirmModal(true);
        if(/*day2*/ false) {
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
      <InfoBox roomName={roomName} location={location} time={time} meetingnum={meetingnum} />
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
            ? filteredFemaleUsers.map((user) => ({ ...user, gender: "Female", roomId: "roomId" }))
            : filteredMaleUsers.map((user) => ({ ...user, gender: "Male", roomId: "roomId" }))
        }
      />
      <ReadyBox 
        onGenderChange={handleGenderChange} 
        isMale={isMale} 
        onReadyButtonClick={handleReadyButtonClick} 
        roomId={roomId}
        isReady={isReady}
        setIsReady={setIsReady}
      />
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
          me={final[0]} // 여기 클라이언트랑
          you={final[1]} // 클라이언트가 선택한 유저로 출력해야함
        />
      )}
    </RootBodyContainer>
  );
};


export default RoomBody;
