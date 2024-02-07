import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

const ModalContainer = styled.div`
  display: grid;
  grid-template-rows: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 2px;
  animation: 0.5s ease-out 0s 1 slideInFromLeft forwards;
  background: white;
  width: 50%; /* You can adjust the width as needed */
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  overflow-y: auto;
`;

const XIcon = styled.img`
  width: 29px;
  height: 29px;
  display: block;
  margin: auto;
  cursor: pointer;
`;

const ModalText = styled.div`
  display: flex;
  font-size: 25px;
  font-weight: bold;
  text-decoration: none;
  color: rgba(238, 101, 183, 0.859);
  text-align: left;
  align-items: center;
`;

const ModalTextTeam = styled.div`
  font-size: 12px;
  font-weight: bold;
  text-decoration: none;
  color: rgba(238, 101, 183, 0.859);
  text-align: center;
`;

const YesLoginModal = ({ isOpen, onClose }) => {
  const MenuModalStyles = {
    content: {
      top: "0",
      left: "30%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, 0)",
      width: "50%",
      height: "95%",
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={MenuModalStyles}
      contentLabel="Example Modal"
      className="modal-slide-in container-modal"
    >
      <ModalContainer>
        <XIcon
          src={`${process.env.PUBLIC_URL}/image/xIcon.png`}
          alt="Close Modal"
          onClick={onClose}
        />
        <ModalText>
          <Link to="/login/mypage" className="modal-text">
            my page.
          </Link>
        </ModalText>
        <ModalText>
          <Link to="/login/withfriends" className="modal-text">
            with friends.
          </Link>
        </ModalText>
        <ModalText>
          <Link to="/login/matchhistory" className="modal-text">
            match history.
          </Link>
        </ModalText>
        <ModalText>
          <Link to="/login/help" className="modal-text">
            help.
          </Link>
        </ModalText>
        <ModalText>
          <Link to="https://www.instagram.com/" className="modal-text">
            about us.
          </Link>
        </ModalText>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <ModalTextTeam>JIPDANJISUNG</ModalTextTeam>
      </ModalContainer>
    </Modal>
  );
};

export default YesLoginModal;
