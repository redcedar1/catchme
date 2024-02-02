import React from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';

const RoomHeader = () => {
  const navigate = useNavigate();

  const handlePageBack = () => {
    navigate(-1);
  };

  return (
    <HeaderContainer>
        <Arrow src="/image/backButton.png" alt="Back Arrow" onClick={handlePageBack} />
        <Logo src="/image/logo.png" alt="Catchme Logo" />
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
  margin: 0 auto; // 중앙 정렬
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
