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
    const schools = [
      '서울대학교', '연세대학교', '고려대학교', '서강대학교', '성균관대학교', '한양대학교',
      '이화여자대학교', '중앙대학교', '경희대학교', '서울시립대학교', '서울과학기술대학교',
      '동국대학교', '숙명여자대학교', '건국대학교', '동덕여자대학교',
      '명지대학교', '숭실대학교', '상명대학교', '서울여자대학교', '국민대학교',
      '세종대학교', '상지대학교', '덕성여자대학교', '삼육대학교', '서울기독대학교',
      '카이스트 서울캠퍼스', '가톨릭대학교', '육군사관학교', '백석예술대학교',
      '총신대학교', '한성대학교', '한국방송통신대학교', '한국예술종합학교', '한세대학교',
      '서울신학대학교', '서울장신대학교', '서울한영대학교', '세계사이버대학', '숭의여자대학교',
      '신한대학교', '아세아연합신학대학교', '예수대학교', '우석대학교', '유한대학교',
      '이화여자대학교 의과대학', '인덕대학교', '장로회신학대학교', '정화예술대학교', '종로대학교',
      '중앙승가대학교', '차의과학대학교', '총신대학교 신학대학원', '평택대학교', '한국과학기술원',
      '한국교통대학교', '한국국제대학교', '한국기술교육대학교', '한국방송통신대학교', '한국성서대학교',
      '한국영상대학교', '한국외국어대학교', '한국체육대학교', '한국폴리텍대학교',
      '한국항공대학교', '한남대학교', '한동대학교', '한라대학교', '한림대학교',
      '한밭대학교', '한서대학교', '한성대학교', '한세대학교', '한신대학교',
      '한양대학교', '한양여자대학교', '한영신학대학교', '한일장신대학교', '한중대학교',
      '협성대학교', '홍익대학교', '화신사이버대학교', '횃불트리니티신학대학원대학교', '흥덕대학교', 
      '경상대학교', '경북대학교', '부산대학교', '울산과학기술원(UNIST)', '부경대학교',
      '동아대학교', '영남대학교', '인제대학교', '부산외국어대학교', '경남대학교',
      '경일대학교', '경주대학교', '경성대학교', '경운대학교', '경주대학교',
      '대구가톨릭대학교', '대구대학교', '대구예술대학교', '대구한의대학교', '동명대학교',
      '동서대학교', '동신대학교', '동의대학교', '부산가톨릭대학교', '부산교육대학교',
      '부산장신대학교', '상지영서대학교', '서라벌대학교', '서울장신대학교', '성신여자대학교',
      '신라대학교', '안동대학교', '영산대학교', '영산선학대학교', '영진전문대학',
      '우송정보대학', '울산대학교', '위덕대학교', '인하대학교', '창신대학교',
      '창원대학교', '청강문화산업대학교', '포항공과대학교'
    ];
    
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