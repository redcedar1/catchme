import {React, useState} from 'react';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import RoomHeader from "./page/RoomHeader";
import MeetingRoomMain from "./page/MeetingRoomListPage/MeetingRoomMain";
import Room from "./page/Room";
import PayComplete from "./page/PayCompletePage";
import Loading from "./page/LoginPage/LoadingPage";
import NotLogin from "./page/LoginPage/NotLoginPage";
import YesLogin from "./page/LoginPage/YesLoginPage";
import MyPage from "./page/PersonalPage/MyPage";
import Help from "./page/PersonalPage/HelpPage";
import WithFriends from "./page/PersonalPage/WithFriendsPage";
import Alarm from "./page/PersonalPage/AlarmPage";
import MatchHistory from "./page/PersonalPage/MatchHistoryPage";
import Information from "./page/WelcomePage/InformationPage";
import Welcome02 from "./page/WelcomePage/Welcome02";
import Welcome03 from "./page/WelcomePage/Welcome03";
import { GenderProvider } from "./page/WelcomePage/GenderContext";
import Welcome04 from "./page/WelcomePage/Welcome04";
import Welcome05 from "./page/WelcomePage/Welcome05";
import Welcome06 from "./page/WelcomePage/Welcome06";
import Welcome07 from "./page/WelcomePage/Welcome07";
import Welcome08 from "./page/WelcomePage/Welcome08";
import Welcome09 from "./page/WelcomePage/Welcome09";
import Welcome10 from "./page/WelcomePage/Welcome10";
import Welcome11 from "./page/WelcomePage/Welcome11";
import Welcome12 from "./page/WelcomePage/Welcome12";
import Welcome13M from "./page/WelcomePage/Welcome13M";
import Welcome13W from "./page/WelcomePage/Welcome13W";
import Welcome14 from "./page/WelcomePage/Welcome14";
import Welcome15 from "./page/WelcomePage/Welcome15";
import { UserProvider } from './component/UserContext';

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);

  const handleLogin = (loggedIn) => {
    setIsUserLoggedIn(loggedIn);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <UserProvider>
        <RoomHeader isUserLoggedIn={isUserLoggedIn}/>
        <GenderProvider>
      <Routes> 
          <Route path="/" element={<Loading />} />
          <Route path="/notlogin" element={<NotLogin onLogin={handleLogin} />} />
          <Route path="/login" element={<YesLogin />} />
          <Route path="/login/information" element={<Information />} />
          <Route path="/login/information/Welcome02" element={<Welcome02 />} />
          <Route path="/login/information/Welcome03" element={<Welcome03 />} />
          <Route path="/login/information/Welcome04" element={<Welcome04 />} /> 
          <Route path="/login/information/Welcome05" element={<Welcome05 />} /> 
          <Route path="/login/information/Welcome06" element={<Welcome06 />} /> 
          <Route path="/login/information/Welcome07" element={<Welcome07 />} /> 
          <Route path="/login/information/Welcome08" element={<Welcome08 />} /> 
          <Route path="/login/information/Welcome09" element={<Welcome09 />} /> 
          <Route path="/login/information/Welcome10" element={<Welcome10 />} /> 
          <Route path="/login/information/Welcome11" element={<Welcome11 />} /> 
          <Route path="/login/information/Welcome12" element={<Welcome12 />} />
          <Route path="/login/information/Welcome13M" element={<Welcome13M />} /> 
          <Route path="/login/information/Welcome13W" element={<Welcome13W />} /> 
          <Route path="/login/information/Welcome14" element={<Welcome14 />} /> 
          <Route path="/login/information/Welcome15" element={<Welcome15 />} /> 
          <Route path="/login/mypage" element={<MyPage />} />
          <Route path="/login/help" element={<Help />} />
          <Route path="/login/alarm" element={<Alarm />} />
          <Route path="/login/withfriends" element={<WithFriends />} />
          <Route path="/login/matchhistory" element={<MatchHistory />} />
          <Route path="/MeetingRoomMain" element={<MeetingRoomMain />} />
          <Route path="/room/:roomId" element={<Room />} /> 
          <Route path="/PayComplete" element={<PayComplete />} />
      </Routes>
      </GenderProvider>
      </UserProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
