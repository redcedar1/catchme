import React from "react";
import styled from "styled-components";

const PayBodyContainer = styled.div`
  display: grid;
  width: 100%;
  height: 100vh;
  grid-template-rows: 0.3fr 0.1fr 0.18fr 0.1fr 0.1fr 0.2fr;
  position: relative;
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  margin: auto;
  display: block;
`;

const Text1 = styled.div`
  text-align: center;
  font-size: 26px;
  font-weight: 900;
  color: #444444;
  span {
    color: #3562FF;
  }
`;

const Text3 = styled.div`
  text-align: center;
  font-size: 11px;
  font-weight: 900;
  color: #444444;
`;

const Text2 = styled.div`
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #444444;
  span {
    color: #CBC41C;
  }
  line-height: 2;
  margin-bottom: 10px;
`;

const Button1Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button1 = styled.button`
  background-color: #FFFFFF;
  color: 000000;
  border: 1px solid #000000;
  border-radius: 21px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 900;
`;

const Button2Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Button2 = styled.button`
  background-color: #FFFFFF;
  color: 000000;
  padding: 10px;
  border: 1px solid #000000;
  border-radius: 29px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 900;
`;

function PayComplete() {
  return (
    <PayBodyContainer>
      <Image src="./image/payComplete.png" alt="Image" />
      <Text1>
        <span> 5,000원 </span> 결제 성공 !
        <Text3>카카오톡으로 직접 상대방과 만나봐요.</Text3>
      </Text1>
      <div>
      <Text2>
        상대방의 카카오톡 아이디는
        <br />
        <span> jwh1802 </span> 예요.
      </Text2>
      <Button1Container>
          <Button1>카카오톡 아이디 복사하기</Button1>
        </Button1Container>
      </div>
      <div>
      <Button2Container>
          <Button2>다음창으로 넘어가기.</Button2>
        </Button2Container>
      </div>
    </PayBodyContainer>
  );
}

export default PayComplete;
