import React from "react";
import styled from "styled-components";

const UserCardBoxContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
`;

const UserCardItem = styled.div`
  display: grid;
  grid-template-rows: 0.1fr 0.9fr
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: ${(props) => props.bgColor || "lightblue"};
`;

const UserCardInfo = styled.div`
  font-family: Inter;
  font-size: 8px;
  font-weight: 400;
  margin-top: 5px;
`;

const UserCardBox = ({ users }) => {

  const getImagePath = (name) => {
    // 예를 들어 이미지 파일은 "lion1.jpg", "taeil.jpg"와 같이 저장되어 있다고 가정합니다.
    return `/path/to/images/${name.toLowerCase()}1.jpg`;
  };

  const getRandomColor = () => {
    // 랜덤한 색상을 생성하는 함수
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <UserCardBoxContainer>
      {users.map((user, index) => (
        <UserCardItem key={index} bgColor={getRandomColor()}>
          <UserCardInfo>
            {user.univ} {user.major}
          </UserCardInfo>
          <div>{user.name}</div>
          {/*<img src={getImagePath(user.name)} alt={`${user.name} 이미지`} /> */}
        </UserCardItem>
      ))}
    </UserCardBoxContainer>
  );
};

export default UserCardBox;
