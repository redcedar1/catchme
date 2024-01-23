import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import styled from "styled-components";

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2em;
  height: 4em;
  color: rgba(227, 150, 181, 1);
`;

function RoomHeader() {
  return (
    <HeaderContainer>
      <FaArrowLeftLong />
    </HeaderContainer>
  );
}

export default RoomHeader;


/*
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
        <Arrow src="../public/image/Arrow4.png" alt="Back Arrow" onClick={handlePageBack} />
        <Logo src="../public/image/Logo.png" alt="Catchme Logo" />
    </HeaderContainer>
  );
};

export default RoomHeader;

const HeaderContainer = styled.header`
  width: 100%; 
  height: 4.0625rem; 
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-bottom: 0.0625rem solid #DDDADA;
  max-width: 24.375rem;
  margin: 0 auto; // 중앙 정렬


  @media (max-width: 25rem) { 
    // 화면 너비가 25rem(400px) 이하일 경우
    // 반응형 스타일을 여기에 추가해야됨
  }
`;

const Arrow = styled.img`
  width: 1.875rem;
  height: 1.875rem;
  flex-shrink: 0;
  cursor: pointer;
  position: absolute;
  margin-left: 1rem; // 왼쪽 여백 조정
  margin-right: 20rem;
  top: 50%;
  transform: translateY(-50%);

  @media (max-width: 25rem) { 
    // 화면 너비가 25rem(400px) 이하일 경우
    // 예를 들어, 화살표 크기를 줄일 수 있음
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const Logo = styled.img`
  width: 10.25rem;
  height: auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  @media (max-width: 25rem) { 
    // 화면 너비가 25rem(400px) 이하일 경우
    // 예를 들어, 로고 크기를 줄일 수 있음
    width: 8rem;
  }
`;
*/
