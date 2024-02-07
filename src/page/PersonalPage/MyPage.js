import "./MyPage.css";

const myinformation = {
  id: 1,
  nickname: "w99_hyun_",
  gender: "남",
  height: "184cm",
  weight: "72kg",
  age: "26",
  univ: "서울대학교",
  home: "강남구",
  certify: "true",
};
const lst = [1, 2, 3, 4, 5, 6];
function MyPage() {
  return (
    <div>
      <div className="mypage-header">
        <span className="mypage-text">마이페이지</span>
      </div>
      <div className="mypage-container">
        <div className="mypage-myinfo">
          <div className="mypage-myinfo-first">
            <div>
              <img
                src={`${process.env.PUBLIC_URL}/image/profile/catMale.png`}
                className="mypage-myinfo-img"
              />
            </div>
            <div className="mypage-myinfo-nickname">
              <span>r___eve님</span>
            </div>
            <div className="mypage-myinfo-modify-button">
              <span>{">"}</span>
            </div>
          </div>

          <div className="mypage-myinfo-second">
            <div className="mypage-myinfo-body">
              <div>{myinformation.height}</div>
              <div>{myinformation.weight}</div>
              <div>{myinformation.age}</div>
            </div>
            <div className="mypage-myinfo-univ">
              {myinformation.univ} 재학중
              <span className="mypage-certify">
                {myinformation.certify ? " 위치인증 완료" : " 위치인증 미완료"}
              </span>
            </div>
            <div className="mypage-myinfo-univ">{myinformation.home}</div>
          </div>
        </div>
        <div className="mypage-container-col">
          <div className="emoji-container">
            <div>감정아이콘 설정</div>
            <div className="emojies">
              {lst.map((idx) => (
                <div>
                  <img
                    src={`${process.env.PUBLIC_URL}/image/chat/good.png`}
                    className="mypage-image-container"
                  />
                </div>
              ))}
            </div>
            <div>아이콘변경</div>
          </div>

          <div className="mypage-friends-manage">
            <img
              src={`${process.env.PUBLIC_URL}/image/personalpage/managefriends.png`}
              className="mypage-image-container"
            />
          </div>
        </div>
        <div>
          <div className="coin-container">
            <div>
              <p>보유코인: </p>
            </div>
            <p>7,000c</p>
            <div>
              <p>
                <button className="mypage-charge-button">충전하기</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
