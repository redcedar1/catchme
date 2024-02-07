import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome02.css'; // CSS 파일을 임포트하세요
import './Welcome.css';
import styled from "styled-components"
import SplitMessage from './SplitMessage';


const BackgroundImage = styled.div `
background-image: url(${process.env.PUBLIC_URL}/image/Welcome/background3.png); /* public 폴더에 있는 이미지 경로 */
background-size: contain;
background-repeat: no-repeat;
background-color: #EDADC8;
background-position: center top; /* 수평 중앙, 수직 상단에 위치 */
width: 100vw;
height: 100vh;
position: fixed;
z-index: -1;

` 

function Welcome06() {
  const [message, setMessage] = useState('');
  const fullMessage1 = "학교가 어딘지 알려줘!";
  const typingSpeed = 75;
  
  useEffect(() => {
      if (message.length < fullMessage1.length) {
        setTimeout(() => {
          setMessage (fullMessage1.slice(0, Math.min(message.length + 1, fullMessage1.length)))
        }, typingSpeed);
      }
    }, [message, fullMessage1]);

  const navigate = useNavigate();

  const [schoolInput, setSchoolInput] = useState('');
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(''); // 선택된 학교
  const [typingText, setTypingText] = useState('...'); // 타이핑 텍스트
  const [isTyping, setIsTyping] = useState(false); // 타이핑 상태
  const [showOptions, setShowOptions] = useState(false);
  

  // 예시 학교 목록
  useEffect(() => {
    const schools = ['서울대학교', '연세대학교', '고려대학교', '서강대학교', '성균관대학교', '한양대학교'];
    
    if (schoolInput) {
      setAutoCompleteOptions(schools.filter(school => school.toLowerCase().includes(schoolInput.toLowerCase())));
    } else {
      setAutoCompleteOptions([]);
    }
  }, [schoolInput]);

  useEffect(() => {
    if (isTyping && selectedSchool) {
      if (typingText.length < selectedSchool.length) {
        const nextChar = selectedSchool[typingText.length];
        const timeoutId = setTimeout(() => {
          setTypingText((text) => text + nextChar);
        }, 75); // 한 글자씩 타이핑 속도 조절
  
        return () => clearTimeout(timeoutId);
      } else {
        setIsTyping(false); // 타이핑이 완료되면 상태를 업데이트
      }
    }
  }, [typingText, selectedSchool, isTyping]);
  

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school); // 선택한 학교를 상태에 저장합니다.
    setTypingText(''); // 타이핑 텍스트를 초기화합니다.
    setIsTyping(true); // 타이핑 시작 상태로 변경합니다.
    setSchoolInput(school); // 입력 필드를 선택한 학교명으로 설정합니다.
    setShowOptions(false); // 드롭다운 메뉴를 닫습니다.
  };
  const handlePreviousClick = () => {
    // "이전" 버튼 로직
    navigate(-1);
  };

  const handleNextClick = () => {
    // "다음" 버튼 클릭 시에 실행될 로직
    navigate('/login/information/Welcome07'); // '/welcome05' 경로로 이동
  };


  return (
    <div className="home">
      <BackgroundImage />
      <div className="header"></div>
      <div className="header1">
        <p>4. 학교를 입력해주세요!</p>
      </div>
      <SplitMessage message={message} splitIndex={fullMessage1.length} />
      <div className="typing-container">
      <div className="typing message">
        {typingText}
      </div>
      </div>
      <div className="JobSelectionButton">
      <input
        className="job-selection"
        value={schoolInput}
        onChange={(e) => {
          setSchoolInput(e.target.value);
          if (e.target.value) {
            setShowOptions(true); // 사용자가 입력할 때 드롭다운 메뉴를 보여줍니다.
          } else {
            setShowOptions(false); // 입력이 없으면 드롭다운 메뉴를 숨깁니다.
          }
        }}
        placeholder="학교를 입력해주세요."
      />
      {showOptions && autoCompleteOptions.length > 0 && (
        <div className="options">
          {autoCompleteOptions.map((school) => (
            <div key={school} onClick={() => handleSchoolSelect(school)} className="options">
              {school}
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

export default Welcome06 ;