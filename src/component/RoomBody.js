import React, { useState, useEffect } from "react";
import styled from "styled-components";
import InfoBox from "../boxComponent/InfoBox";
import ChatBox from "../boxComponent/ChatBox";
import UserBox from "../boxComponent/UserBox";
import ReadyBox from "../boxComponent/ReadyBox";
import UserCardBox from "../boxComponent/UserCardBox";
import ReadyStateBox from "../boxComponent/ReadyStateBox";
import MaleChooseModal from "../modalComponet/MaleChooseModal";

const RootBodyContainer = styled.div`
display: grid;
width: 100%;
height: 100vh;
grid-template-rows: 0.1fr 0.1fr 0.15fr 0.1fr 0.15fr 0.1fr 0.18fr 0.05fr;
position: relative;
`;

const RectangleTable = styled.div`
  position: absolute;
  width: 90%;
  height: 10%;
  flex-shrink: 0;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 42px;
  background: #DEAF69;
  box-shadow: 0px 4px 7px 0px rgba(0, 0, 0, 0.25);
  z-index: -1;
`;

const RoomBody = () => {


  let user1 = { gender: "male", name: 'wohyun', text: 'hi', ready: 'READY', univ: '홍익대', major: '공대'};
  let user2 = { gender: "male", name: 'taeil', text: 'bye', ready: 'READY', univ: '중앙대', major: '공대' };
  let user3 = { gender: "female", name: 'suhyun', text: 'good', ready: 'READY', univ: '연세대', major: '공대' };
  let me = { gender: "female", name: 'me', text: 'ㅋ', ready: '', univ: '이화여대', major: '미대' };

  const maleusers = [user1, user2, user3, me].filter(user => user.gender === "male");
  const femaleusers = [user1, user2, user3, me].filter(user => user.gender === "female");



  const [isMale, setIsMale] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const areAllUsersReady = async () => {
    
    try {
      const response = await fetch("");
      if (response.ok) {
        const result = await response.json();
        return result.allUsersReady;
      } else {
        console.error("모든 사용자 레디 상태 확인 실패");
        return false;
      }
    } catch (error) {
      console.error("API 호출 오류:", error);
      return false;
    } 

  };

  useEffect(() => {
    const checkAllUsersReady = () => {
      const allReady = [...maleusers, ...femaleusers].every((user) => user.ready === "READY");
      // 만약 모든 유저가 READY 상태라면 모달을 엽니다.
      if (allReady) {
        setShowModal(true);
      }
    };

    checkAllUsersReady();

  }, [maleusers, femaleusers]);

  return (
    <RootBodyContainer>
      <InfoBox />
      <ChatBox users={isMale ? maleusers : femaleusers} />
      <UserBox users={isMale ? maleusers : femaleusers} />
      <RectangleTable />
      <ChatBox users={!isMale ? maleusers : femaleusers} />
      <UserBox users={!isMale ? maleusers : femaleusers} />
      <ReadyBox />
      <UserCardBox users={isMale ? maleusers : femaleusers} />
      <ReadyStateBox users={isMale ? maleusers : femaleusers} /*areAllUsersReady={areAllUsersReady}*/ />
      {showModal && (
        // 모달 컴포넌트 추가
        <MaleChooseModal isOpen={true} onClose={() => setShowModal(false)} maleusers={maleusers}>
        </MaleChooseModal>
      )}
    </RootBodyContainer>
  );
};

export default RoomBody;