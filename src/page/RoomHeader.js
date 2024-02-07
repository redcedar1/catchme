import { React, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import YesLoginModal from "../modalComponet/MenubarModal";

const RoomHeader = ({ isUserLoggedIn }) => {
  const navigate = useNavigate();

  const handlePageBack = () => {
    navigate(-1);
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => {
    setModalIsOpen(true);
  };

  if (!isUserLoggedIn) {
    return null; // 로그인되지 않은 경우 헤더를 렌더링하지 않음
  }

  return (
    <HeaderContainer>
      <Arrow
        src="/image/navigationbar/backButton.png"
        alt="Back Arrow"
        onClick={handlePageBack}
      />
      <Logo src="/image/logo.png" alt="Catchme Logo" />
      <Alarm
        src="/image/navigationbar/alarmIcon.png"
        alt="alarm Dots"
        onClick={() => navigate("/login/alarm")}
      />
      <Setting
        src="/image/navigationbar/Group17.png"
        alt="Setting Dots"
        onClick={openModal}
      />
      {modalIsOpen && (
        <YesLoginModal
          isOpen={modalIsOpen}
          onClose={() => setModalIsOpen(false)}
        />
      )}
    </HeaderContainer>
  );
};

export default RoomHeader;

const HeaderContainer = styled.header`
  width: 100%;
  height: 4.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0 auto;
`;

const Arrow = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  position: absolute;
  margin-left: 3rem;
  margin-right: 23rem;
  top: 50%;
  transform: translateY(-50%);
`;

const Logo = styled.img`
  width: 10rem;
  height: auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const Alarm = styled.img`
  width: 34px;
  height: 43px;
  cursor: pointer;
  top: 27%;
  position: absolute;
  right: 2.6rem;
  transform: translateX(-50%);
`;

const Setting = styled.img`
  width: 1.3125rem;
  height: auto;
  cursor: pointer;
  top: 50%;
  position: absolute;
  right: 0.69rem;
  transform: translateX(-50%);
`;
