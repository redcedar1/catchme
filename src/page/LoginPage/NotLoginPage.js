import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NotLoginPage.css";
import styled from "styled-components";

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

  const loginClick = function () {
    console.log("login");
    onLogin(true);
    navigate("/login");
  };

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
