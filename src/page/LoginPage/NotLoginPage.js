import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./NotLoginPage.css";
import styled from "styled-components";
import { useUser } from "../../component/UserContext";

const BackgroundImage = styled.div`
  background-image: url(${process.env.PUBLIC_URL}/image/background2.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;

  @media screen and (min-width: 320px) and (max-width: 1439px) {
    background-size: contain;
  }
`;

function NotLogin({ onLogin }) {
  const navigate = useNavigate();
  const [kakaoLoginLink, setKakaoLoginLink] = useState("");
  const { setKidValue } = useUser();

  const fetchKakaoLoginLink = async () => {
    try {
      // 백엔드에서 카카오톡 로그인 링크를 가져오는 API 호출
      const response = await fetch("http://ec2-54-180-83-160.ap-northeast-2.compute.amazonaws.com:8080/main/kakaoLoginLogic/");
      if (!response.ok) {
        throw new Error("Failed to fetch Kakao login link");
      }
      const data = await response.json();
      // 가져온 링크를 상태에 저장
      setKakaoLoginLink(data._url);
    } catch (error) {
      console.error("Error fetching Kakao login link:", error);
      // 에러에 대한 처리 추가
    }
  };

  const loginClick = function () {
    try {
      // 카카오톡 로그인 링크를 가져온 후 저장
      fetchKakaoLoginLink();
    } catch (error) {
      console.error("Error during login:", error);
      // 에러에 대한 처리 추가
    }
    directLogin();
  };

  // 사용자가 저장된 링크로 직접 이동
  const directLogin = async () => {
    if (kakaoLoginLink) {
      window.location.href = kakaoLoginLink;
    }
  };

  useEffect(() => {
    // URL 쿼리 파라미터에서 코드값 추출
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    console.log(code);
  }, []); // 빈 배열을 넣어 마운트 시에만 실행되도록 설정

  return (
    <div>
      <BackgroundImage />
      <div className="notlogin-container">
        <div></div>
        <div></div>
        <div>
          <p className="notlogin-text">
            간편하게 로그인하고
            <br />
            지금바로 시작하세요.
          </p>
        </div>
        <div></div>
        <div>
          <div className="notlogin-kakao-image">
            <img
              src={`${process.env.PUBLIC_URL}/image/kakao/kakaoLogin.png`}
              onClick={loginClick}
            />
          </div>
          <div className="notlogin-problem-text">
            <Link to="/login/help" className="notlogin-problem-text">
              문제가 발생했나요?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotLogin;
