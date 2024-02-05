import React from "react";
import { useNavigate } from "react-router-dom";

const friends = [
  {
    id: 1,
    nickname: "w98_hyun_",
    gender: "남",
    age: "26",
    loacte: "강남구 전체",
  },
  {
    id: 2,
    nickname: "JIPDANJISUNG",
    gender: "여",
    age: "24",
    loacte: "강남구 전체",
  },
  {
    id: 1,
    nickname: "w99_hyun_",
    gender: "남",
    age: "26",
    loacte: "강남구 전체",
  },
  {
    id: 2,
    nickname: "JIPDANJISUNG",
    gender: "여",
    age: "24",
    loacte: "강남구 전체",
  },
  {
    id: 1,
    nickname: "w99_hyun_",
    gender: "남",
    age: "26",
    loacte: "강남구 전체",
  },
  {
    id: 2,
    nickname: "JIPDANJISUNG",
    gender: "여",
    age: "24",
    loacte: "강남구 전체",
  },
  {
    id: 1,
    nickname: "w99_hyun_",
    gender: "남",
    age: "26",
    loacte: "강남구 전체",
  },
  {
    id: 2,
    nickname: "JIPDANJISUNG",
    gender: "여",
    age: "24",
    loacte: "강남구 전체",
  },
  {
    id: 1,
    nickname: "w99_hyun_",
    gender: "남",
    age: "26",
    loacte: "강남구 전체",
  },
  {
    id: 2,
    nickname: "JIPDANJISUNG",
    gender: "여",
    age: "24",
    loacte: "강남구 전체",
  },
];

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px",
    borderBottom: "1px solid #f0f0f0",
  },
  withfriendsHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "20px",
    padding: "10px 20px 10px 15px",
  },
  withfriendsText: {
    fontSize: "25px",
    fontWeight: "bold",
    textDecoration: "none",
    color: "rgb(60, 57, 57)",
    textAlign: "center",
  },
  friendsList: {
    padding: "10px",
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: "30px",
    border: "0px solid rgb(213, 213, 213)",
    overflowY: "auto",
  },
  friendsItem: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "12px",
    marginBottom: "8px",
    display: "grid",
    gridTemplateColumns: "2fr 5fr 1fr",
    gap: "15px",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  friendInfo: {},
  friendNickname: {
    marginLeft: "0px",
    fontWeight: "bold",
  },
  friendDetails: {
    marginLeft: "0px",
    fontSize: "0.8em",
    color: "#777",
  },
  gogo: {
    fontSize: "30px",
  },
  simplePlusButton: {
    fontSize: "12px",
    width: "96px",
    height: "32px",
    backgroundColor: "#fbfbfb",
    fontWeight: "bold",
    color: "#8e8e8e",
    textAlign: "center",
    borderRadius: "10px",
    border: "0.2px solid rgb(213, 213, 213)",
    marginTop: "10%", // Adjusted for direct use
  },
  kakaoButton1: {
    display: "block",
    margin: "auto",
    marginTop: "5%",
    width: "330px",
    height: "50px",
    color: "#391b1b",
    fontWeight: "bold",
    fontSize: "16px",
    backgroundColor: "#fee500",
    border: "none",
    borderRadius: "10px",
  },
  withfriendsNoFriends: {
    textAlign: "center",
    marginTop: "8%",
    fontSize: "16px",
    color: "#cccbcb",
  },
  withfriendsContainer: {
    display: "grid",
    gridTemplateRows: "7fr 1fr",
    gap: "20px",
    padding: "20px",
    minHeight: "75vh",
    maxHeight: "75vh",
  },
};

function WithFriends() {
  const navigate = useNavigate();

  return (
    <div>
      <div style={styles.withfriendsHeader}>
        <div>
          <span style={styles.withfriendsText}>친구목록</span>
        </div>
        <div style={{ flexGrow: 1 }}></div>
        <div>
          <button style={styles.simplePlusButton}>간편친구추가</button>
        </div>
      </div>

      <div style={styles.withfriendsContainer}>
        <div style={styles.friendsList}>
          {friends.length > 0 ? (
            friends.map((friend, index) => (
              <div key={index} style={styles.friendsItem}>
                <div>
                  <img
                    src={`${process.env.PUBLIC_URL}/image/profile/catMale.png`}
                    alt=""
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                    }}
                  />
                </div>
                <div style={styles.friendInfo}>
                  <p style={styles.friendNickname}>{friend.nickname}님</p>
                  <p style={styles.friendDetails}>
                    {friend.age}/{friend.gender}/{friend.loacte}
                  </p>
                </div>
                <div>
                  <span style={styles.gogo}>{">"}</span>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.withfriendsNoFriends}>
              아직 등록된 친구가 없어요. <br />
              카카오톡으로 간편하게 등록하세요.
            </div>
          )}
        </div>
        <div>
          <button style={styles.kakaoButton1}>카카오톡으로 초대하기</button>
        </div>
      </div>
    </div>
  );
}

export default WithFriends;

// import { Link, useNavigate } from "react-router-dom";
// import Header from "../Component/Header";
// import "./WithFriendsPage.css";

// const friends = [
//   {
//     id: 1,
//     nickname: "w98_hyun_",
//     gender: "남",
//     age: "26",
//     loacte: "강남구 전체",
//   },
//   {
//     id: 2,
//     nickname: "JIPDANJISUNG",
//     gender: "여",
//     age: "24",
//     loacte: "강남구 전체",
//   },
//   {
//     id: 1,
//     nickname: "w99_hyun_",
//     gender: "남",
//     age: "26",
//     loacte: "강남구 전체",
//   },
//   {
//     id: 2,
//     nickname: "JIPDANJISUNG",
//     gender: "여",
//     age: "24",
//     loacte: "강남구 전체",
//   },
//   {
//     id: 1,
//     nickname: "w99_hyun_",
//     gender: "남",
//     age: "26",
//     loacte: "강남구 전체",
//   },
//   {
//     id: 2,
//     nickname: "JIPDANJISUNG",
//     gender: "여",
//     age: "24",
//     loacte: "강남구 전체",
//   },
//   {
//     id: 1,
//     nickname: "w99_hyun_",
//     gender: "남",
//     age: "26",
//     loacte: "강남구 전체",
//   },
//   {
//     id: 2,
//     nickname: "JIPDANJISUNG",
//     gender: "여",
//     age: "24",
//     loacte: "강남구 전체",
//   },
//   {
//     id: 1,
//     nickname: "w99_hyun_",
//     gender: "남",
//     age: "26",
//     loacte: "강남구 전체",
//   },
//   {
//     id: 2,
//     nickname: "JIPDANJISUNG",
//     gender: "여",
//     age: "24",
//     loacte: "강남구 전체",
//   },
// ];

// function WithFriends() {
//   const isZero = friends.length === 0;
//   const navigate = useNavigate();
//   const backButton = function () {
//     navigate("/yeslogin");
//   };

//   return (
//     <div>
//       <Header />
//       <div className="withfriends-header">
//         <div>
//           <span className="withfriends-text">친구목록</span>
//         </div>
//         <div></div>
//         <div className="simple-plus-button-locate">
//           <button className="simple-plus-button">간편친구추가</button>
//         </div>
//       </div>

//       <div className="withfriends-container">
//         <div className="friends-list">
//           {!isZero ? (
//             friends.map((friend) => (
//               <div key={friend.id} className="friends-item">
//                 <div>
//                   <img
//                     src={`${process.env.PUBLIC_URL}/Imgs/수컷냥.png`}
//                     className=""
//                   />
//                 </div>
//                 <div>
//                   <div className="friend-info">
//                     <div>
//                       <p className="friend-nickname">{friend.nickname}님</p>
//                       <p className="friend-details">
//                         {friend.age}/{friend.gender}/{friend.loacte}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <div>
//                   <span className="gogo">{">"}</span>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="withfriends-no-friends">
//               아직 등록된 친구가 없어요. <br />
//               카카오톡으로 간편하게 등록하세요.
//             </div>
//           )}
//         </div>
//         <div>
//           <button className="kakao-button1">카카오톡으로 초대하기</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default WithFriends;

//css
// .header {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 16px;
//   border-bottom: 1px solid #f0f0f0;
// }

// .withfriends-header {
//   display: grid;
//   grid-template-columns: 1fr 1fr 1fr;
//   gap: 20px;
//   padding: 10px 20px 10px 15px;
// }

// .withfriends-text {
//   font-size: 25px;
//   font-weight: bold;
//   text-decoration: none;
//   color: rgb(60, 57, 57);
//   text-align: center;
// }
// .friends-list {
//   padding: 10px;
//   background-color: rgb(255, 255, 255);
//   border-radius: 30px;
//   border: 0.2px solid rgb(213, 213, 213);
//   overflow-y: auto;
// }

// .friends-item {
//   background: #f9f9f9;
//   border-radius: 16px;
//   padding: 12px;
//   margin-bottom: 8px;
//   display: grid;
//   grid-template-columns: 2fr 5fr 1fr;
//   gap: 15px;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 8px;
//   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
// }
// .avatar {
//   width: 40px;
//   height: 40px;
//   border-radius: 50%;
// }
// .friend-info {
//   display: flex;
//   align-items: center;
// }
// .friend-nickname {
//   margin-left: 12px;
//   font-weight: bold;
// }

// .friend-details {
//   margin-left: 12px;
//   font-size: 0.8em;
//   color: #777;
// }
// .friends-item p {
//   margin: 0;
//   color: #333333;
// }

// .back-icon {
//   display: block;
//   margin: auto;
// }

// .withfriends-container {
//   display: grid;
//   grid-template-rows: 7fr 1fr;
//   gap: 20px;
//   padding: 20px;
//   min-height: 75vh;
//   max-height: 75vh;
// }
// .gogo {
//   font-size: 30px;
// }
// .simple-plus-button {
//   font-size: 12px;
//   width: 96px;
//   height: 32px;
//   background-color: #fbfbfb;
//   font-weight: bold;
//   color: #8e8e8e;
//   text-align: center;
//   border-radius: 10px;
//   border: 0.2px solid rgb(213, 213, 213);
// }

// .simple-plus-button-locate {
//   margin-top: 10%;
// }

// .kakao-button1 {
//   display: block;
//   margin: auto;
//   margin-top: 5%;
//   width: 330px;
//   height: 50px;
//   color: #391b1b;
//   font-weight: bold;
//   font-size: 16px;
//   background-color: #fee500;
//   border: none;
//   border-radius: 10px;
// }
// .withfriends-no-friends {
//   text-align: center;
//   margin-top: 8%;
//   font-size: 16px;
//   color: #cccbcb;
// }
