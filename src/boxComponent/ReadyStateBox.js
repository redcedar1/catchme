import React from "react";
import styled from "styled-components";

const ReadyStateBoxContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  `;

const ReadyStateItem = styled.div`
  text-align: center;
  background-color: ${({ index, ready }) =>
  ready ? (index % 2 === 0 ? "#FFFAF8" : "#FFF8F0") : "#D7D7D7"};  padding: 10px;
  color: #414141;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.68px;
`;

const ReadyStateBox = ({ users }) => {
  const totalUsers = 5;

  const filledUsers = [...users, ...Array(totalUsers - users.length).fill({ ready: false })];

  return (
    <ReadyStateBoxContainer>
      {filledUsers.map((user, index) => (
        <ReadyStateItem key={index} ready={user.ready}>
          {user.ready ? "Ready" : "Empty"}
        </ReadyStateItem>
      ))}
    </ReadyStateBoxContainer>
  );
};

export default ReadyStateBox;
