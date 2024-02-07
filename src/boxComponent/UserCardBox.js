import React, { useState } from "react";
import styled from "styled-components";
import Modal from "react-modal";

const customModalStyle = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  content: {
    backgroundColor: "#FFE5D6",
    top: "50%", // 수직 위치를 화면의 중간으로 조정
    left: "50%", // 수평 위치를 화면의 중간으로 조정
    transform: "translate(-50%, -50%)", // 말풍선을 가운데로 정렬
    width: "70%",
    height: "50%",
    borderRadius: "7%",
    padding: "5px",
    boxShadow: "4px 4px 11px 0px rgba(0, 0, 0, 0.22)",
  },
};

const CustomModalContent = styled.div`
  display: grid;
  gap: 20px;
  margin: 10px;
  margin-top: 40px;
`;

const FirstGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
`;

const Text1 = styled.div`
  color: #000;
  font-size: 16px;
  font-weight: 700;
`;

const Text2 = styled.div`
  color: #999;
  font-size: 10px;
`;

const Text3 = styled.div`
  color: #444;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
`;

const Text4 = styled.div`
color: #242424;
text-align: center;
font-size: 17px;
font-weight: 700;
span {
  color: #E296B6;
}
`;

const UserCardBoxContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
`;

const UserCardItem = styled.div`
  display: grid;
  grid-template-rows: 0.1fr 0.9fr;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: ${props => props.bgColor};
  cursor: pointer;
`;

const UserCardInfo = styled.div`
  font-family: Inter;
  font-size: 10px;
  margin-top: 5px;
`;

const colors = [
  "#FED3E2",
  "#EFCBDA",
  "#FFD5A9",
  "#BFA9FF",
  "#BFFFA9",
  "#F7D6FF",
  "#FEFFBE",
  "#F6B6B6",
  "#E6FED3",
  "#D3E4FE",
  "#D3F4FE",
  "#FEDDD3",
];

const UserCardBox = ({ users, gender }) => {

  const [selectedUser, setSelectedUser] = useState(null);

  const getImagePath = (animal, gender) => {
    // 나중에 프로필카드로 변경
    return `/image/profile/${animal.toLowerCase()}${gender === 'Male' ? 'Male' : 'Female'}.png`;
  };

  const openModal = (user, gender) => {
    setSelectedUser(user, gender);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  return (
    <UserCardBoxContainer>
       {Array.from({ length: 5 }).map((_, index) => {
        const user = users[index];
        return (
        <UserCardItem 
        key={index} 
        bgColor={colors[index % colors.length +1]} // 나중에 유저 고유 ID값(정수) 이용하여 색상 선택
        onClick={() => openModal(user, gender)}
        >
          {user ? (
              <>
          <UserCardInfo>
            {user.school} {user.major}
          </UserCardInfo>
          <img src={getImagePath(user.animal, user.gender)} 
           alt={`${user.animal} 이미지`}
           style={{ width: "65px", height: "65px" }}
          />
          </>
          ) : (
            <>
            <div></div>
            <img
                src="/image/profileCard/luaCard.png"
                alt="기본 프로필 이미지"
                style={{ width: "70px", height: "110px" }}
              />
            </>
            )}
        </UserCardItem>
        );
          })}

      <Modal isOpen={selectedUser !== null} onRequestClose={closeModal} style={customModalStyle}>
        {selectedUser && (
          <CustomModalContent>
            <div> 
              {/* 이상형 퍼센트 가져오기 */}
              <Text4> 회원님의 <span> 이상형 </span>과 <br /> <span> 78% </span> 일치하는 상대에요 !</Text4>
            </div>
            <FirstGrid>
            <img
              src={getImagePath(selectedUser.animal, selectedUser.gender)}
              alt={`${selectedUser.animal} 이미지`}
              style={{ width: "70px", height: "70px" }}
            />
            <div>
              <Text1> {selectedUser.nickname} 님
              <br /> <br />
              {selectedUser.school} {selectedUser.major} {selectedUser.age}살
              위치: {selectedUser.location}
              <br />
              </Text1>
              {/* 대학교 인증 정보 가져오기 */}
              <Text2> 대학교 인증 완료 </Text2>
            </div>
            </FirstGrid>
            <div>
              {/*  이상형 정보는 특별하게 표시 */}
              <Text3>
                {selectedUser.mbti} / {selectedUser.height} / {selectedUser.body}한 체형 <br />
                {selectedUser.army} <br />
                {selectedUser.eyes} / {selectedUser.face} <br />
                취미: {selectedUser.hobby} <br />
                {selectedUser.free} <br />
              </Text3> 
            </div> 
          </CustomModalContent>
        )}
        <button onClick={closeModal}>닫기</button>
      </Modal>

    </UserCardBoxContainer>
  );
};

export default UserCardBox;
