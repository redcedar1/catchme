import React, { useState, useEffect } from "react";
import styled  from "styled-components";
import { useNavigate } from 'react-router-dom';
import CreateRoomModal from "./CreateRoomModal"; 
import DeleteRoomModal from "./DeleteRoomModal";

const allColors = 
  ["#BEE7E8", 
  "#FED3E2", 
  "#FFD5A9", 
  "#9EC4EA", 
  "#FEFFBA", 
  "#A9FBBB", 
  "#ECDE62", 
  "#E5FFC5", 
  "#D9D9D9", 
  "#A9FBBB", 
  "#B2D3FB", 
  "#ADE998", 
  "#7AB6C3", 
  "#D3E0DC", 
  "#FFC8DD", 
  "#ECD4C0", 
  "#BFD8D2"];
const usedColors = new Set();

const getRandomColor = () => {
  let availableColors = allColors.filter(color => !usedColors.has(color)); // 이미 사용된 색깔 제외
  if (availableColors.length === 0) {
      console.error("No more unique colors available.");
      return "black"; // 모든 색깔이 사용되었다면 기본 색상 반환
  }
  const randomIndex = Math.floor(Math.random() * availableColors.length);
  const color = availableColors[randomIndex];
  usedColors.add(color);
  return color;
};

const getRandomNumber = max => Math.floor(Math.random() * (max + 1));

const getRandomDate = () => {
  const start = new Date(2024, 0, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const topRooms = Array.from({ length: 5 }, (_, id) => {
  const femaleCount = getRandomNumber(4);
  const maleCount = getRandomNumber(4);
  return {
      id: id + 1,
      name: ["달려라 뿅뿅뿅!!", "다함께 차차차!!", "좋은 사람 좋은 시간", "동네 친구 구함~", "강아지 산책하실분? 흐흐"][id],
      location: ["홍대", "건대", "신촌", "잠실", "여의도"][id],
      bgColor: getRandomColor(), // Ensure unique color
      female: femaleCount,
      male: maleCount,
      participantCount: femaleCount + maleCount,
      createdAt: getRandomDate().toISOString()
  };
});

const totalRooms = Array.from({ length: 17 }, (_, id) => {
  
  if (usedColors.size >= 9) { // 추천 방 5개 + 페이지 색깔 4개 = 총 9개 색깔 제한
    usedColors.clear(); // 색깔 제한에 도달하면 usedColors를 초기화
  }
  const femaleCount = getRandomNumber(4);
  const maleCount = getRandomNumber(4);
  return {
    id: id + 1,
    name: ["달려라 뿅뿅뿅!!", "다함께 차차차!!", "좋은 사람 좋은 시간", "동네 친구 구함~", "강아지 산책하실분? 흐흐", "주말 등산 가실 분!", "밤샘 코딩 모임", "영화 마니아들 모여라", "토요일 자전거 라이딩", "맛집 탐방 러버들", "수다 떨기 좋은 카페", "책 읽기 좋은 날", "커피 마시며 휴식", "화요일 점심 브런치", "게임 좋아하는 사람들", "피트니스 도전", "일요일 아침 요가"][id % 17],
    location: ["홍대", "건대", "신촌", "잠실", "홍대", "강남", "이태원", "홍대", "강남", "대학로", "홍대", "홍대", "여의도", "서초", "건대", "잠실", "신촌"][id % 17],
    bgColor: getRandomColor(),
    female: femaleCount,
    male: maleCount,
    participantCount: femaleCount + maleCount,
    createdAt: getRandomDate().toISOString()
  };
});



const MeetingRoomMain = () => {
  const navigate = useNavigate();
  const [top5Rooms, setRooms] = useState(topRooms);
  const [allRooms, setAllRooms] = useState(totalRooms); // 전체 방 목록 초기화
  const [currentTop5RoomIndex, setCurrentTop5RoomIndex] = useState(0);
  const [currentAllPageIndex, setCurrentAllPageIndex] = useState(1); // 전체 방 현재 페이지
  const [displayedRooms, setDisplayedRooms] = useState([]); // 화면에 표시할 방 목록 상태와 업데이트 함수 추가
  const [hasMoreRooms, setHasMoreRooms] = useState(true);
  const [noMatchingRooms, setNoMatchingRooms] = useState(false);
  const [allTotalPage, setAllTotalPage] = useState(0);
  const [isCreateRoomModalOpen, setCreateRoomModalOpen] = useState(false); // 방 생성 모달 상태
  const [isDeleteRoomModalOpen, setDeleteRoomModalOpen] = useState(false); // 삭제 모달 상태 추가
  const [roomToDelete, setRoomToDelete] = useState(null); // 삭제할 방 정보 상태 추가
  const [userId, setUserId] = useState("hardcodedUserId");

  // 상태 관리
const [sortOption, setSortOption] = useState('whole'); // 'whole', 'downtown', 'participants'
const [filteredRooms, setFilteredRooms] = useState([...totalRooms]); // 필터링된 방 목록 초기화
// 정렬 및 필터링 함수
useEffect(() => {
  // 전체 방 목록 정렬
  let sortedRooms = [...totalRooms];

  if (sortOption === "participants") {
    sortedRooms.sort((a, b) => b.participantCount - a.participantCount); // 인원수로 정렬
  } else {
    sortedRooms.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // 최신순으로 정렬
  }

  // 필터링 (우리동네 버튼을 눌렀을 때만 필터링)
  if (sortOption === "downtown") {
    sortedRooms = sortedRooms.filter(room => room.location === "홍대"); // '홍대'로 필터링
  }

  // 페이지네이션
  const startIndex = (currentAllPageIndex - 1) * 4;
  const endIndex = startIndex + 4;
  const paginatedRooms = sortedRooms.slice(startIndex, endIndex);
  setAllRooms(paginatedRooms); 
  
  if (currentAllPageIndex >= allTotalPage) {
    setHasMoreRooms(false);
  } else {
    setHasMoreRooms(true);
  }

  // Check if there are matching rooms in "우리동네"
  const matchingRooms = sortedRooms.filter(room => room.location === "홍대");
  if (matchingRooms.length === 0) {
    setNoMatchingRooms(true);
  } else {
    setNoMatchingRooms(false);
  }
  const totalPage = Math.ceil(sortedRooms.length / 4);
  setAllTotalPage(totalPage); // allTotalPage 업데이트
}, [sortOption, currentAllPageIndex]);

// 정렬 옵션 변경 핸들러
const handleSortOptionChange = (option) => {
  setSortOption(option);
  setCurrentAllPageIndex(1); // 정렬 옵션이 변경될 때 첫 페이지로 리셋
};



  const handleTop5Next = () => {
      setRooms(prev => [...prev.slice(1), prev[0]]);
      setCurrentTop5RoomIndex(prevIndex => (prevIndex + 1) % top5Rooms.length);

  };

  const handleTop5Prev = () => {
    setRooms(prev => {
      const lastRoom = prev[prev.length - 1];
      return [lastRoom, ...prev.slice(0, prev.length - 1)];
  });
  setCurrentTop5RoomIndex(prev => (prev - 1 + 5) % 5);
};

const handleAllRoomsNextPage = () => {
  if (currentAllPageIndex < allTotalPage) {
    const newPageIndex = currentAllPageIndex + 1;
    setCurrentAllPageIndex(newPageIndex); // 페이지 인덱스 업데이트

    // 방 목록 업데이트
    const startIndex = (newPageIndex - 1) * 4;
    const endIndex = startIndex + 4;
    const paginatedRooms = allRooms.slice(startIndex, endIndex);
    setAllRooms(paginatedRooms);

    // "다음" 버튼 가시성 업데이트
    if (newPageIndex >= allTotalPage) {
      setHasMoreRooms(false);
    } else {
      setHasMoreRooms(true);
    }
  }
};


const handleAllRoomsPrevPage = () => {
  if (currentAllPageIndex > 1) {
    const newPageIndex = currentAllPageIndex - 1;
    setCurrentAllPageIndex(newPageIndex); // 페이지 인덱스 업데이트
  }
};


const enterRoom = roomId => {
  navigate(`/room/${roomId}`);
};


//방만들기
const handleCreateRoom = (newRoomData) => {
  const newRoom = {
    id: newRoomData.id,
    name: newRoomData.title,
    location: newRoomData.location,
    bgColor: getRandomColor(),
    female: 0,
    male: 0,
    participantCount: 0,
    createdAt: new Date().toISOString(),
    createdBy: userId, // 사용자 아이디 추가
  };

  setAllRooms((prevRooms) => [...prevRooms, newRoom]);
};


const handleDeleteRoom = (roomId) => {
  // 서버로 방 삭제 요청을 보내는 로직을 추가해야 합니다.
  // 이 예제에서는 클라이언트에서만 삭제하도록 구현합니다.
  const room = allRooms.find((room) => room.id === roomId);

  // 방을 삭제하려면 해당 방의 작성자 아이디와 현재 로그인한 사용자 아이디를 비교하여 검증해야 합니다.
  if (room.createdBy === userId) {
    // 작성자 아이디와 현재 사용자 아이디가 일치하면 삭제 가능
    setRoomToDelete(room);
    setDeleteRoomModalOpen(true);
  } else {
    alert("삭제 권한이 없습니다.");
  }
};

  return (
    <MainContainer>
        <HeaderText>맞춤 Top5</HeaderText>
        <RecommendRoomContainer>
            <Arrow
            src="./image/Group15.png" alt="Back Button"
            onClick={handleTop5Prev }
            style={{ visibility: currentTop5RoomIndex  > 0 ? 'visible' : 'hidden' }}>
            </Arrow>
            <RoomsWrapper>
            {top5Rooms.map((room, index) => (
                    <RecommendRoom 
                        key={room.id} 
                        bgColor={room.bgColor} 
                        isMultipleOf3={(index + 1) % 3 === 0}
                        onClick={() => enterRoom(room.id)}
                        female={room.female}
                        male={room.male}
                    >
                        <RoomName>{room.name}</RoomName>
                        <RoomLocation>{room.location}</RoomLocation>
                        <SexContainer>
                          <FemaleNumber>
                            <IconImage src="./image/Ellipse58.png" alt="Female Icon" />
                            {room.female}
                          </FemaleNumber> 
                          
                          <MaleNumber>  
                            <IconImage src="./image/Ellipse59.png" alt="Male Icon" />
                            {room.male}
                          </MaleNumber>   
                        </SexContainer>
                    </RecommendRoom>
                ))}
            </RoomsWrapper>
            <Arrow 
            src="./image/Group14.png" alt="Next Button"
            onClick={handleTop5Next } 
            style={{ visibility: currentTop5RoomIndex  < 4 ? 'visible' : 'hidden'}}>
           </Arrow>
        </RecommendRoomContainer>


        <SortContainer>
          <SortStateContainer>
          <CreateRoomButton onClick={() => setCreateRoomModalOpen(true)}>
        +
      </CreateRoomButton>
      <CreateRoomModal
        isOpen={isCreateRoomModalOpen}
        onClose={() => setCreateRoomModalOpen(false)}
        onCreateRoom={handleCreateRoom}
      />
      <DeleteButton onClick={() => setDeleteRoomModalOpen(true)}>
        -</DeleteButton>
       <DeleteRoomModal
       isOpen={isDeleteRoomModalOpen}
          rooms={allRooms}
          onDeleteRoom={handleDeleteRoom}
         onClose={() => setDeleteRoomModalOpen(false)}
         />



            <SortingButtonWrapper>
            <SortingButton
          isActive={sortOption === 'whole'}
          onClick={() => handleSortOptionChange('whole')}>
          전체
        </SortingButton>
        <SortingButton
          isActive={sortOption === 'downtown'}
          onClick={() => handleSortOptionChange('downtown')}>
          우리동네
        </SortingButton>
        <SortingButton
          isActive={sortOption === 'participants'}
          onClick={() => handleSortOptionChange('participants')}>
          인원순
              </SortingButton>
            </SortingButtonWrapper>
          </SortStateContainer>
        </SortContainer>


        <PopularMeetingBox>
        {noMatchingRooms ? (
          <NoMatchingRoomsMessage>우리동네에 일치하는 방이 없어요!</NoMatchingRoomsMessage>
        ) : (
          <>
        <Arrow
            src="./image/Group15.png" alt="Back Button"
            onClick={handleAllRoomsPrevPage }
            style={{ visibility: currentAllPageIndex > 1 ? 'visible' : 'hidden' }}>
            </Arrow>         
          <MeetingRoomWrapper>
            
          {allRooms.map(room => (
             <MeetingRoom 
              key={room.id} 
             bgColor={room.bgColor}
             onClick={() => enterRoom(room.id)}
             >
                <RoomName>{room.name}</RoomName>
               <RoomLocation>{room.location}</RoomLocation>
               <SexContainer>
                  <FemaleNumber>
                      <IconImage src="./image/Ellipse58.png" alt="Female Icon" />
                        {room.female}
                      </FemaleNumber> 
                          
                          <MaleNumber>  
                            <IconImage src="./image/Ellipse59.png" alt="Male Icon" />
                            {room.male}
                          </MaleNumber>   
                        </SexContainer>
             </MeetingRoom>
           ))}
          </MeetingRoomWrapper>
          <Arrow 
            src="./image/Group14.png" alt="Next Button"
            onClick={handleAllRoomsNextPage } 
            style={{ visibility: hasMoreRooms  ? 'visible' : 'hidden'}}>
           </Arrow>
           </>)}    

        </PopularMeetingBox>
    </MainContainer>
  );
}

  export default MeetingRoomMain;

  const PopularMeetingBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  margin: 2.5rem auto;
  padding: 1.06rem;
  height: 20rem;

`;

  const MeetingRoomWrapper=styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); 
  grid-template-rows: repeat(2, 1fr); 
  gap: 1.75rem;
  justify-content: center; 
  align-content: center; 
  width: 70%;
  margin: auto;

@media (max-width: 1200px) {
justify-content: space-around;
}  `;

  const MeetingRoom=styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  background-color: ${props => props.bgColor};
  border-radius: 0.75rem;
  width: 10.0625rem;
  height: 9.1875rem;
  box-shadow: 4px 4px 22px 0px rgba(0, 0, 0, 0.09);
  cursor: pointer;
  padding: 0.5rem;
  &:active {
    box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.15);
    transform: scale(0.95);  
  }

`;
  

  
  const SortStateContainer = styled.div`
  width: 100%;
  height: 3.75rem;
  background: #F9F9F9;
  display: flex;
  flex-direction: row; 
  justify-content: center;
  align-items: center;
  justify-content: space-between;
  padding-left: 1.81rem;
  position: relative;
  top:0.87rem;
`;


  const SortContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.87rem;
  width: 24.375rem;
`;

const SortingButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4.125rem;
  height: 2rem;
  border-radius: 1.125rem;
  box-shadow: 4px 4px 22px 0px rgba(0, 0, 0, 0.15);
  margin-right: 10px;
  border: none;
  background-color: ${props => props.isActive ? 'black' : 'white'};
  color: ${props => props.isActive ? 'white' : 'black'};
  cursor: pointer;
  font-family: 'SUITE';
  &:active {
    box-shadow: inset 0px 0px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(2px);
  }
`;


const SortingButtonWrapper = styled.div`
  display: flex;
  justify-content: center; 
  align-items: center;
  padding-right: 1.37rem; 
`;


  const RoomsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  `;


  const Arrow = styled.img`
  width: 0.5rem;
  height: 1.41169rem;
  margin-top:-10rem;
  margin-left: 1rem;
  margin-right: 1rem;
  cursor: pointer;
  
`;
  const MainContainer = styled.div`
  display: flex; 
  flex-direction: column; 
  align-items: center; 

  width: 100%;
  `;
  
const HeaderText = styled.div`
color: #414141;
  font-size: 1.125rem;
  font-weight: 700;
  position: relative;
  left: -7.8rem;
  top:2rem;
  height: 5rem;
`;

  const RecommendRoomContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 11rem;
  height: 100%;
  
`;
const RecommendRoom = styled.div`
position: relative;

justify-content: center;
  align-items: center;
  width: 19.5rem;
  height: 9.5625rem;
  font-size: 1.125rem;
  border-radius: 0.75rem;
  background-color: ${(props) => props.bgColor};
  padding: 10px;
  margin-top: -11rem;
  box-shadow: 4px 4px 22px 0px rgba(0, 0, 0, 0.09);
  position: relative;
  transform: ${(props) => props.isMultipleOf3 ? 'rotate(-5deg)' : 'none'};
  transition: transform 0.5s ease, margin-top 0.5s ease;
  z-index: ${(props) => props.index};
  cursor: pointer;
  &:active {
    box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.15);
    transform: scale(0.95);
  }

`;
  const RoomName = styled.div `
  font-weight: 700; 
  font-size: 1.125rem;
   color: #444444; 
   margin-top: 0.87rem; 
   margin-left: 0.63rem;
  `;
  const RoomLocation = styled.div `
  font-weight: 700; 
  color: #444444; 
  font-size: 0.6875rem;
   margin-top: 0.56rem; 
   margin-left: 0.63rem;
   `;

   const FemaleNumber=styled.div`
  margin-right: 0.25rem;
  display: flex; 
  align-items: center;
  font-size: 0.6875rem;
  font-weight: 700;

   
   `;
   const MaleNumber = styled.div`
   display: flex; 
  align-items: center;
   font-size: 0.6875rem;
   font-weight: 700;

   `;
   const IconImage=styled.img`
   
    width: 0.75rem;
    height: 0.75rem;
    margin-right: 0.31rem;
   `;
   const SexContainer = styled.div`
   position: absolute;
   bottom: 10px; // 위치를 바닥에서 10px 높이에 배치
   right: 10px; // 오른쪽에서 10px 떨어진 곳에 배치
   display: flex;
   align-items: center;
 `;
 const NoMatchingRoomsMessage = styled.div`
  color: #FF0000;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  margin-top: 1rem;
`;
const CreateRoomButton = styled.button`
box-shadow: 4px 4px 7px 0px rgba(0, 0, 0, 0.15);
  background-color: #4caf50;
  color: #fff;
  font-size: 24px;
  border: none;
  border-radius: 50%;
  width:2rem;
  height:2rem;
  cursor: pointer;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  &:active {
    box-shadow: inset 0px 0px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(2px);
  }
  
`;
const DeleteButton = styled.button`
box-shadow: 4px 4px 7px 0px rgba(0, 0, 0, 0.15);
background-color: #ff6666;
color: #fff;
font-size:2rem;
border: none;
border-radius: 50%;
width:2rem;
height:2rem;
cursor: pointer;
z-index: 1;
display: flex;
margin-left: -4rem;
justify-content: center;
text-align: center;
align-items: flex-end;
&:active {
  box-shadow: inset 0px 0px 8px rgba(0, 0, 0, 0.2);
  transform: translateY(2px);
}
`;