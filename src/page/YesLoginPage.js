import React, { useState } from "react";
import styled from "styled-components";
import EnterRoomModal from "./EnterRoomModal";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./YesLoginPage.css";

const BackgroundNoneImage = styled.div`
  background-image: url(${process.env.PUBLIC_URL}/image/backgroundNone.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;

  @media screen and (min-width: 320px) and (max-width: 1439px) {
    background-size: contain;
  }
`;

const ModalButton = styled.button`
  padding: 10px 15px;
  width: 200px;
  height: 50px;
  background-color: transparent;
  color: #ffffff;
  border: 1.7px solid #3B3B3B;
  border-radius: 44px;
  box-shadow: 0px 0px 11px 0px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StartText = styled.span`
color: #515151;
font-size: 23px;
font-weight: bold;
`;

function YesLogin() {
  const userName = "r___eve";
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  
  return (
    <>
      <BackgroundNoneImage />
      <div className="yeslogin-container">
        <div></div>
        <div className="yeslogin-wellcome-text">{`어서오세요!! ${userName}님.`}</div>
        <div></div>
        <div></div>
        <div className="yeslogin-btn">
          <ModalButton onClick={() => { toggleModal(); }}>
            <StartText> 지금 시작하기 </StartText>
          </ModalButton>  
          <EnterRoomModal isOpen={showModal} onClose={toggleModal}/>
        </div>
        <div className="yeslogin-logout-text">
          <Link to="/notlogin" className="yeslogin-logout-text">
            LOGOUT
          </Link>
        </div>
      </div>
    </>
  );
}

export default YesLogin;
