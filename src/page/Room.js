import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router} from "react-router-dom";
import RoomHeader from "../component/RoomHeader";
import RoomBody from "../component/RoomBody";


const BackgroundImage = styled.div`

  background-image: url(${process.env.PUBLIC_URL}/image/background.png);
  background-size: cover;
  background-repeat: no-repeat;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;

  @media screen and (min-width: 320px) and (max-width: 1439px) {
    background-size: cover;
  }

`;

function Room() {
  return (
        <div>
          <BackgroundImage />
          <RoomHeader />
          <RoomBody />
        </div>
  );
}

export default Room;
