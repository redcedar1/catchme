import React from "react";
import styled from "styled-components";

const ReadyStateBoxContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  `;

const ReadyStateItem = styled.div`
  text-align: center;
  background-color: ${({ index }) => (index % 2 === 0 ? "#FFFAF8" : "#FFF8F0")};
  padding: 10px;
  color: #414141;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.68px;
`;

const ReadyStateBox = ({ users }) => {

  return (
    <ReadyStateBoxContainer>
      {users.map((user, index) => (
        <ReadyStateItem key={index} ready={user.ready}>
          {user.ready ? "Ready" : ""}
        </ReadyStateItem>
      ))}
    </ReadyStateBoxContainer>
  );
};

export default ReadyStateBox;
