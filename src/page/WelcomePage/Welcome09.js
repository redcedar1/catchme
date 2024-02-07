import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome02.css'; // CSS 파일을 임포트하세요
import './Welcome.css';
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

  function Welcome09() {
    const [message, setMessage] = useState('');
const fullMessage1 = "키를 알려줘!";
const typingSpeed = 75;

useEffect(() => {
    if (message.length < fullMessage1.length) {
      setTimeout(() => {
        setMessage (fullMessage1.slice(0, Math.min(message.length + 1, fullMessage1.length)))
      }, typingSpeed);
    }
  }, [message, fullMessage1]);

  const navigate = useNavigate();

      
  const [sliderValue, setSliderValue] = useState(25); // 초기값을 50으로 설정

  const handleSliderChange = (e) => {
    setSliderValue(e.target.value);
  };

  useEffect(() => {
    const percentage = ((sliderValue - 140) / (200 - 140)) * 100; // 슬라이더의 min과 max 값을 고려하여 계산
    document.documentElement.style.setProperty('--slider-percentage', `${percentage}%`);
  }, [sliderValue]);

  const handlePreviousClick = () => {
    // "이전" 버튼 로직
    navigate(-1); // 이전 페이지로 돌아갑니다.
  };

  const handleNextClick = () => {
    // "다음" 버튼 클릭 시에 실행될 로직
    navigate('/login/information/Welcome10'); // '/welcome05' 경로로 이동
  };


  return (
    <div className="home">
      <BackgroundImage />
      <div className="header"></div>
      <div className="header1">
        <p>7. 키를 입력해주세요!</p>
      </div>
      <SplitMessage message={message} splitIndex={fullMessage1.length} />
      <div className='value-container'>
      <div className="slider-value">{sliderValue}</div>
      </div>
    <div className="slider-container">
    <input
      type="range"
      min="140" // 슬라이더의 최소값
      max="200" // 슬라이더의 최대값
      value={sliderValue}
      onChange={handleSliderChange}
      className="slider"
    />
      </div>
      <div className="buttons-container">
        <button onClick={handlePreviousClick} className="previous-button">이전</button>
        <button onClick={handleNextClick} className="next-button">다음</button>
      </div>
    </div>
    
  );
}

export default Welcome09 ;