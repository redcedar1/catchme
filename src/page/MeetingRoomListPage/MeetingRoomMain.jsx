import React, { useState, useEffect } from "react";
import styled  from "styled-components";
import { useNavigate , useLocation} from 'react-router-dom';
import CreateRoomModal from "./CreateRoomModal"; 
import DeleteRoomModal from "./DeleteRoomModal";
import axios from "axios"; // npm install axios

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


const MeetingRoomMain = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPeople = location.state?.selectedPeople;

  const [top5Rooms, setTopRooms] = useState([]);
  const [allRooms, setAllRooms] = useState([]); // 전체 방 목록 초기화
  const [currentTop5RoomIndex, setCurrentTop5RoomIndex] = useState(0);
  const [currentAllPageIndex, setCurrentAllPageIndex] = useState(1); // 전체 방 현재 페이지
  const [displayedRooms, setDisplayedRooms] = useState([]); // 화면에 표시할 방 목록 상태와 업데이트 함수 추가
  const [hasMoreRooms, setHasMoreRooms] = useState(true);
  const [noMatchingRooms, setNoMatchingRooms] = useState(false);
  const [allTotalPage, setAllTotalPage] = useState(0);
  const [isCreateRoomModalOpen, setCreateRoomModalOpen] = useState(false); // 방 생성 모달 상태
  const [isDeleteRoomModalOpen, setDeleteRoomModalOpen] = useState(false); // 삭제 모달 상태 추가
  const [userId, setUserId] = useState("hardcodedUserId");
  const [isLoading, setIsLoading] = useState(true); //로딩상태
  const [sortOption, setSortOption] = useState('whole'); // 'whole', 'downtown', 'participants'
  const [filteredRooms, setFilteredRooms] = useState([...allRooms]); // 필터링된 방 목록 초기화
  const [error, setError] = useState('');
  // useState를 사용하여 selectedRno 상태를 정의합니다.
  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true);
      try {
        const [top5Response, allRoomsResponse] = await Promise.all([
          axios.get('http://ec2-54-180-83-160.ap-northeast-2.compute.amazonaws.com:8080/room/api/room_info/'),
          axios.get('http://ec2-54-180-83-160.ap-northeast-2.compute.amazonaws.com:8080/room/api/room_info/')
        ]);
  
        // selectedPeople과 meetingNum이 일치하는 방만 필터링
        const filteredRooms = allRoomsResponse.data.filter(room => room.meetingnum === selectedPeople);
  
        // 방에 랜덤 색상 입히기
        const top5RoomsWithColors = top5Response.data.map(room => ({
          ...room,
          bgColor: getRandomColor()
        }));
        const allFilteredRoomsWithColors = filteredRooms.map(room => ({
          ...room,
          bgColor: getRandomColor()
        }));

        const sortedAllRooms = sortRooms(allFilteredRoomsWithColors, 'whole');  
        setTopRooms(top5RoomsWithColors);
        setAllRooms(sortedAllRooms); // 정렬된 전체 방 목록을 상태에 저장
        setFilteredRooms(sortedAllRooms); // 화면에 표시될 방 목록도 업데이트
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
        setError('Failed to fetch rooms');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchRooms();
  }, []);
  


//방만들기

const handleCreateRoom = async (roomTitle, meetingPlace, userId, meetingNum) => {
  setIsLoading(true);
  try {
    const response = await axios.post('/api/rooms', {
      rname: roomTitle,
      location: meetingPlace,
      userId: userId,
      meetingnum: meetingNum,  
    });
    if (response.data.approved) {
      setAllRooms(prevRooms => [...prevRooms, response.data.room]);
      alert('방이 성공적으로 생성되었습니다.');
    } else {
      alert('방 생성이 승인되지 않았습니다.');
    }
  } catch (error) {
    console.error('Failed to create room:', error);
    setError('방 생성이 승인되지 않았습니다.'); // 에러 설정
  } finally {
    setIsLoading(false);
  }
};


//방 삭제하기
const handleDeleteRoom = async(roomId) => {
  setIsLoading(true);
  const room = allRooms.find((room) => room.id === roomId);
  if (room.participantCount > 0) {
    alert('참가자가 있는 방은 삭제할 수 없습니다.');
    return;
  }
  if (room.createdBy !== userId) {
    alert('자신이 생성한 방만 삭제할 수 있습니다.');
    return;
  }
  try {
    await axios.delete(`/api/rooms/${roomId}`);
    setAllRooms(prev => prev.filter(room => room.id !== roomId));
    alert('방이 성공적으로 삭제되었습니다.');
  } catch (error) {
    console.error('Failed to delete room:', error);
    setError('Failed to delete room');
  } finally {
    setIsLoading(false);
  }
};
// 전체 방 목록 정렬하는 로직
// 정렬 옵션 변경 핸들러
const handleSortOptionChange = (option) => {
  setSortOption(option);
  setCurrentAllPageIndex(1); 
   setFilteredRooms(sortRooms(allRooms, option));
};


// 정렬 로직 함수
const sortRooms = (rooms, option) => {
  let sortedRooms = [...rooms];
  switch (option) {
    case 'whole':
      sortedRooms.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'downtown':
      sortedRooms = sortedRooms.filter(room => room.location === '홍대');
      break;
    case 'participants':
      sortedRooms.sort((a, b) => b.participantCount - a.participantCount);
      break;
    default:
      break;
  }
  return sortedRooms;
};


useEffect(() => {
  // filteredRooms 상태가 변경될 때마다 displayedRooms를 업데이트
  const updateDisplayedRooms = () => {
    // 페이지네이션 로직에 따라 displayedRooms를 계산
    const startIndex = (currentAllPageIndex - 1) * 4;
    const endIndex = startIndex + 4;
    const newDisplayedRooms = filteredRooms.slice(startIndex, endIndex);
    setDisplayedRooms(newDisplayedRooms);
  };

  updateDisplayedRooms();
}, [filteredRooms, currentAllPageIndex]);



const handleTop5Next = () => {
    setTopRooms(prev => [...prev.slice(1), prev[0]]);
      setCurrentTop5RoomIndex(prevIndex => (prevIndex + 1) % top5Rooms.length);

  };

const handleTop5Prev = () => {
    setTopRooms(prev => {
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

//입장제한 사용자의 개인정보 api 필요합니다
const enterRoom = (roomId, gender) => {
  const selectedRoom = allRooms.find(room => room.rno === roomId);

  if (!selectedRoom) {
    alert('방을 찾을 수 없습니다.');
    return;
  }


  // 여자 5명이면 입장 막기
  if (gender === 'female' && selectedRoom.wnum >= 5) {
    alert('이 방에는 더 이상 여성이 입장할 수 없습니다.');
    return;
  }

  // 남자 5명이면 입장 막기
  if (gender === 'male' && selectedRoom.mnum >= 5) {
    alert('이 방에는 더 이상 남성이 입장할 수 없습니다.');
    return;
  }
  
  // 조건을 모두 통과하면 방 입장
  navigate(`/room/${roomId}`);
};





if (isLoading) return <p>Loading...</p>;
if (error) return <p>{error}</p>;

// Top 5 방 목록에 대한 이전/다음 버튼의 가시성 처리
const showTop5PrevButton = currentTop5RoomIndex > 0 && top5Rooms.length > 0;
const showTop5NextButton = currentTop5RoomIndex < (top5Rooms.length - 1) && top5Rooms.length > 0;

// 전체 방 목록에 대한 이전/다음 버튼의 가시성 처리
const showAllPrevButton = currentAllPageIndex > 1 && allRooms.length > 0;
const showAllNextButton = currentAllPageIndex < allTotalPage && allRooms.length > 0;

  return (
    <MainContainer>
        <HeaderText>맞춤 Top5</HeaderText>
        <RecommendRoomContainer>
            {showTop5PrevButton && (
            <Arrow
               src="./image/MeetingRoomList/Group15.png"
              alt="Back Button"
              onClick={handleTop5Prev}
             />
            )}

            {top5Rooms.length > 0 ? (
            <RoomsWrapper>
            {top5Rooms.map((room, index) => (
              room ? ( // room이 undefined가 아닐 때만 렌더링
                    <RecommendRoom 
                        key={room.rno} 
                        bgColor={room.bgColor} 
                        isMultipleOf3={(index + 1) % 3 === 0}
                        onClick={() => enterRoom(room.rno)}
                      //onClick={() => enterRoom(room.rno, userGender)} api에서 성별 정보 알려주면 변수명 바꾸기
             >
                        <RoomName>{room.rname}</RoomName>
                        <RoomLocation>{room.location}</RoomLocation>
                        <SexContainer>
                          <FemaleNumber>
                            <IconImage src="./image/MeetingRoomList/Ellipse58.png" alt="Female Icon" />
                            {room.wnum}
                          </FemaleNumber> 
                          
                          <MaleNumber>  
                            <IconImage src="./image/MeetingRoomList/Ellipse59.png" alt="Male Icon" />
                            {room.mnum}
                          </MaleNumber>   
                        </SexContainer>
                    </RecommendRoom>) : null
                ))}
            </RoomsWrapper>) : (
      <NoneMessage>당신의 이상형은 아직 안왔나봐요!</NoneMessage>
        )}
            {showTop5NextButton && (
             <Arrow
               src="./image/MeetingRoomList/Group14.png"
              alt="Next Button"
              onClick={handleTop5Next}
             />
      )}
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
        {showAllPrevButton &&
            <Arrow
             src="./image/MeetingRoomList/Group15.png"
             alt="Back Button"
             onClick={handleAllRoomsPrevPage}
           />
        }  
        {noMatchingRooms ? (
          <NoMatchingRoomsMessage>우리동네에 일치하는 방이 없어요!</NoMatchingRoomsMessage>
        ) : (     
          <MeetingRoomWrapper>
            
          {displayedRooms.map(room => (
            room ? ( // room이 undefined가 아닐 때만 렌더링
             <MeetingRoom 
              key={room.rno} 
             bgColor={room.bgColor}
             onClick={() => enterRoom(room.rno)} 
           //onClick={() => enterRoom(room.rno, userGender)} api에서 성별 정보 알려주면 변수명 바꾸기
             >
                <RoomName>{room.rname}</RoomName>
               <RoomLocation>{room.location}</RoomLocation>
               <SexContainer>
                  <FemaleNumber>
                      <IconImage src="./image/MeetingRoomList/Ellipse58.png" alt="Female Icon" />
                        {room.wnum}
                      </FemaleNumber> 
                          
                          <MaleNumber>  
                            <IconImage src="./image/MeetingRoomList/Ellipse59.png" alt="Male Icon" />
                            {room.mnum}
                          </MaleNumber>   
                        </SexContainer>
             </MeetingRoom>) : null
           ))}
          </MeetingRoomWrapper>
            )}  
            {showAllNextButton && 
             <Arrow
             src="./image/MeetingRoomList/Group14.png"
             alt="Next Button"
             onClick={handleAllRoomsNextPage}
            />}
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
  gap: 0.5rem;
  justify-content: center; 
  align-content: center; 
  width: 100%;
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
  width: 9.5625rem;
  height: 9.1875rem;
  box-shadow: 4px 4px 22px 0px rgba(0, 0, 0, 0.09);
  cursor: pointer;
  padding: 0.3rem;
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

const NoneMessage = styled.div`
  color: #414141;
  font-size: 1.125rem;
  font-weight: 700;
  position: relative;
  top: -7rem;

`;