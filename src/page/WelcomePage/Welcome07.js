import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome02.css'; // CSS 파일을 임포트하세요
import './Welcome.css';
import styled from "styled-components"
import SplitMessage from './SplitMessage';


const BackgroundImage = styled.div `
background-image: url(${process.env.PUBLIC_URL}/image/background3.png); /* public 폴더에 있는 이미지 경로 */
background-size: contain;
background-repeat: no-repeat;
background-color: #EDADC8;
background-position: center top; /* 수평 중앙, 수직 상단에 위치 */
width: 100vw;
height: 100vh;
position: fixed;
z-index: -1;

` 

function Welcome07() {
  const [message, setMessage] = useState('');
  const fullMessage1 = "전공이 어느쪽이야?";
  const typingSpeed = 75;
  
  useEffect(() => {
      if (message.length < fullMessage1.length) {
        setTimeout(() => {
          setMessage (fullMessage1.slice(0, Math.min(message.length + 1, fullMessage1.length)))
        }, typingSpeed);
      }
    }, [message, fullMessage1]);

  const navigate = useNavigate();

  const [selectedJob, setSelectedJob] = useState(''); // 사용자가 선택한 직업
  const [showOptions, setShowOptions] = useState(false); // 옵션 목록을 표시할지 결정하는 상태
  const [typingText, setTypingText] = useState('...'); // 말풍선에 표시될 타이핑 텍스트
  const [isTyping, setIsTyping] = useState(false); // 타이핑 상태

  useEffect(() => {
    if (isTyping) {
      if (typingText !== selectedJob && selectedJob) {
        const nextCharIndex = typingText.length;
        const nextChar = selectedJob[nextCharIndex];

        const timeoutId = setTimeout(() => {
          setTypingText((text) => text + nextChar);
        }, 75); // 한 글자씩 타이핑 속도 조절

        return () => clearTimeout(timeoutId);
      } else {
        setIsTyping(false); // 타이핑이 완료되면 상태를 업데이트
      }
    }
  }, [typingText, selectedJob, isTyping]);

  const jobs = ['공대', '자연대', '인문대', '미대' , '체대' , '음대', '의대']; // 선택 가능한 옵션들

  const handleJobSelect = (job) => {
    setSelectedJob(job); // 선택한 직업을 상태에 저장합니다.
    setTypingText(''); // 타이핑 텍스트를 초기화합니다.
    setIsTyping(true); // 타이핑 시작 상태로 변경합니다.
    setShowOptions(false); // 옵션 목록을 숨깁니다.
  };
  

  const handlePreviousClick = () => {
    // "이전" 버튼 로직
    navigate(-1);
  };

  const handleNextClick = () => {
    // "다음" 버튼 클릭 시에 실행될 로직
    navigate('/login/information/Welcome08'); // '/welcome05' 경로로 이동
  };


  return (
    <div className="home">
      <BackgroundImage />
      <div className="header"></div>
      <div className="header1">
        <p>5. 학과를 입력해주세요!</p>
      </div>
      <SplitMessage message={message} splitIndex={fullMessage1.length} />
      <div className="typing-container">
      <div className="typing message">
        {typingText}
      </div>
      </div>
      <div className="JobSelectionButton">
      <div className="job-selection" onClick={() => setShowOptions(!showOptions)}>
        {selectedJob || "학과를 선택해주세요."}
      </div>
      {showOptions && (
        <div className="options">
          {jobs.map((job) => (
            <div key={job} onClick={() => handleJobSelect(job)} className="option">
              {job}
            </div>
          ))}
        </div>
      )}
      </div>
      
      <div className="buttons-container">
        <button onClick={handlePreviousClick} className="previous-button">이전</button>
        <button onClick={handleNextClick} className="next-button">다음</button>
      </div>
    </div>
    
  );
}

export default Welcome07 ;