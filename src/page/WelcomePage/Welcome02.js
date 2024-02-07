import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 
import './Welcome.css';
import './Welcome02.css';
import styled from "styled-components"
import SplitMessage from './SplitMessage';

const BackgroundImage = styled.div `
    background-image: url(${process.env.PUBLIC_URL}/image/welcome/background3.png); /* public 폴더에 있는 이미지 경로 */
    background-size: contain;
    background-repeat: no-repeat;
    background-color: #EDADC8;
    background-position: center top; /* 수평 중앙, 수직 상단에 위치 */
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: -1;
`

function Welcome02() {
  const [message, setMessage] = useState('');
  const [typingMessage, setTypingMessage] = useState('...');
  const fullMessage1 = "나에게 너를 소개해줘!";
  const fullMessage2 = "좋은 사람을 찾아줄게!!";
  const buttonMessage = "알겠어!";
  const typingSpeed = 75;
  const navigate = useNavigate();

  useEffect(() => {
    if (message.length < fullMessage1.length + fullMessage2.length) {
      setTimeout(() => {
        setMessage(fullMessage1.slice(0, Math.min(message.length + 1, fullMessage1.length)) + 
                   fullMessage2.slice(0, Math.max(message.length - fullMessage1.length + 1, 0)));
      }, typingSpeed);
    }
  }, [message, fullMessage1, fullMessage2]);

  useEffect(() => {
    if (typingMessage !== '...' && typingMessage.length < buttonMessage.length) {
      setTimeout(() => {
        setTypingMessage(buttonMessage.slice(0, typingMessage.length + 1));
      }, typingSpeed);
    } else if (typingMessage === buttonMessage) {
      // "알겠어!"가 완성되면 페이지 이동
      setTimeout(() => {
        navigate('/login/information/Welcome03');
      }, 500); // 약간의 지연 후 페이지 이동
    }
  }, [typingMessage, buttonMessage, navigate]);

  const handleButtonClick = () => {
    setTypingMessage('');
  };
  const handlePreviousClick = () => {
    // "이전" 버튼 로직
    navigate(-1); // 이전 페이지로 돌아갑니다.
  };

  return (
    <div className="home">
      <BackgroundImage />
      <div className="header"></div>
      <div className="header1">
        <p>회원님께 딱! 맞는 매칭을 위해서 <br /> 
           인공지능 친구 "루아"에게 <br />
           간단한 정보를 알려주세요!</p>
      </div>
      <div className='received'>
      <SplitMessage message={message} splitIndex={fullMessage1.length} />
    </div>
    <div className="typing-container">
      <div className="message typing">
        <div className="message-content">{typingMessage}</div>
      </div>
      </div>
      <div className="footer">
        <button className="button" onClick={handleButtonClick}>알겠어!</button>
        <button className="button secondary" onClick={handlePreviousClick}>다음에 할래...</button>
      </div>
    </div>
  );
}

export default Welcome02;