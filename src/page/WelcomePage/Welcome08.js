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
    background-position: center top; /* 이미지가 수평 및 수직 중앙에 위치 */
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: -1;
` 

  function Welcome08() {
    const [message, setMessage] = useState('');
const fullMessage1 = "MBTI가 뭐야?";
const typingSpeed = 75;

useEffect(() => {
    if (message.length < fullMessage1.length) {
      setTimeout(() => {
        setMessage (fullMessage1.slice(0, Math.min(message.length + 1, fullMessage1.length)))
      }, typingSpeed);
    }
  }, [message, fullMessage1]);

  const navigate = useNavigate();

  const [mbti, setMbti] = useState({ EorI: '', NorS: '', ForT: '', PorJ: '' });
  const [currentText, setCurrentText] = useState('...');
  const [typingText, setTypingText] = useState('');


  const handleMbtiButtonClick = (category, letter) => {
    setMbti((prevMbti) => ({ ...prevMbti, [category]: letter }));

    // 현재 타이핑된 텍스트 리셋
    setCurrentText('');
  };

  useEffect(() => {
    const fullMbti = `${mbti.EorI}${mbti.NorS}${mbti.ForT}${mbti.PorJ}`;
    setTypingText(fullMbti);
  }, [mbti]);

  // 타이핑 효과
  useEffect(() => {
    if (currentText.length < typingText.length) {
      const timer = setTimeout(() => {
        setCurrentText(typingText.slice(0, currentText.length + 1));
      }, 75);
      return () => clearTimeout(timer);
    }
  }, [currentText, typingText]);

  


  const handlePreviousClick = () => {
    // "이전" 버튼 로직
    navigate(-1);
  };

  const handleNextClick = () => {
    if (typingText.length === 4) {
      navigate('/login/information/Welcome09');
    } else {
      alert('MBTI 유형을 완성해주세요.');
    }
  };



  return (
    <div className="home">
      <BackgroundImage />
      <div className="header"></div>
      <div className="header1">
        <p>6. MBTI를 입력해주세요!</p>
      </div>
      <SplitMessage message={message} splitIndex={fullMessage1.length} />
      <div className="typing-container">
        <div className="typing message">
          {currentText}
        </div>
      </div>
      <div className="JobSelectionButton">
      {/* 첫 번째 행: E N F P */}
      <div className="mbti-row">
        <button className={`mbti-button ${mbti.EorI === 'E' ? 'selected' : ''}`} onClick={() => handleMbtiButtonClick('EorI', 'E')}>E</button>
        <button className={`mbti-button ${mbti.NorS === 'N' ? 'selected' : ''}`} onClick={() => handleMbtiButtonClick('NorS', 'N')}>N</button>
        <button className={`mbti-button ${mbti.ForT === 'F' ? 'selected' : ''}`} onClick={() => handleMbtiButtonClick('ForT', 'F')}>F</button>
        <button className={`mbti-button ${mbti.PorJ === 'P' ? 'selected' : ''}`} onClick={() => handleMbtiButtonClick('PorJ', 'P')}>P</button>
      </div>
      {/* 두 번째 행: I S T J */}
      <div className="mbti-row">
        <button className={`mbti-button ${mbti.EorI === 'I' ? 'selected' : ''}`} onClick={() => handleMbtiButtonClick('EorI', 'I')}>I</button>
        <button className={`mbti-button ${mbti.NorS === 'S' ? 'selected' : ''}`} onClick={() => handleMbtiButtonClick('NorS', 'S')}>S</button>
        <button className={`mbti-button ${mbti.ForT === 'T' ? 'selected' : ''}`} onClick={() => handleMbtiButtonClick('ForT', 'T')}>T</button>
        <button className={`mbti-button ${mbti.PorJ === 'J' ? 'selected' : ''}`} onClick={() => handleMbtiButtonClick('PorJ', 'J')}>J</button>
      </div>
    </div>
      
      <div className="buttons-container">
        <button onClick={handlePreviousClick} className="previous-button">이전</button>
        <button onClick={handleNextClick} className="next-button">다음</button>
      </div>
    </div>
    
  );
}

export default Welcome08 ;