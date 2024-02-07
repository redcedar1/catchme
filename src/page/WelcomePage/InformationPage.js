import React from 'react';
import { useNavigate } from 'react-router-dom';

import { GenderProvider } from './GenderContext';

import './Information.css';

function Home() {
    let navigate = useNavigate();
  
    const handleRegisterClick = () => {
      navigate('/login/information/Welcome02');
    };
  
    const handleLogoutClick = () => {
      // 로그아웃 로직을 여기에 추가
      // 예: 사용자 세션을 종료하거나 인증 토큰을 삭제
      console.log('로그아웃 처리됨');
      // 로그아웃 후 홈 페이지로 리디렉션
      navigate('/');
    };
  
    return (
      <div className="app-background">
        <div className="buttons">
          <button onClick={handleRegisterClick} className="register-button">
            회원 정보 등록하기
          </button>
          <button onClick={handleLogoutClick} className="logout-button">
            LOGOUT
          </button>
        </div>
      </div>
    );
  }

  function Information() {
    return (
      <GenderProvider>
        <Home />
      </GenderProvider>
    );
  }
  
  export default Information;
  