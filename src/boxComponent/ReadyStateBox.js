import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ReadyStateBoxContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  `;

const ReadyStateItem = styled.div`
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: ${({ ready }) => (ready === "ready" ? "#FFFAF8" : "#FFF8F0")};
  padding: 10px;
  color: #414141;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.68px;
`;

const ReadyStateBox = ({ users, /*areAllUsersReady*/  }) => {

  const [showModal, setShowModal] = useState(false);

  /* useEffect(() => {
    const checkAllUsersReady = async () => {
      const allUsersReady = await areAllUsersReady();
      if (allUsersReady) {
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    };

    // 주기적으로 모든 사용자의 레디 상태 확인
    const interval = setInterval(checkAllUsersReady, 5000); // 5초마다 확인 (원하는 주기로 변경)

    return () => clearInterval(interval); // 컴포넌트 언마운트 시에 interval 제거
  }, [users, areAllUsersReady]);
  */

  return (
    <ReadyStateBoxContainer>
      {users.map((user, index) => (
        <ReadyStateItem key={index} ready={user.ready}>
          {user.ready}
        </ReadyStateItem>
      ))}
       {/* showModal && (
        // 모달 컴포넌트 추가
        <Modal isOpen={true} onRequestClose={() => setShowModal(false)}>
                    <div>All users are ready!</div>
        </Modal>
       ) */}
    </ReadyStateBoxContainer>
  );
};

export default ReadyStateBox;
