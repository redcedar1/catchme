import React, { useState } from "react";

const styles = {
  notificationsContainer: {
    display: "grid",
    gridTemplateRows: "0.5fr 7fr",
    marginTop: "10%",
    padding: "2px 20px 20px 20px",
    gap: "5px",
    maxHeight: "75vh",
  },
  notificationsTextContainer: {
    display: "flex",
    justifyContent: "space-between",
    margin: "0px 30px 0px 15px",
  },
  notificationTextNumber: {
    fontSize: "12px",
    fontWeight: "lighter",
  },
  notificationTextDelete: {
    fontSize: "10px",
    fontWeight: "lighter",
  },
  notificationList: {
    padding: "10px",
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: "30px",
    overflowY: "auto",
    minHeight: "63vh",
    maxHeight: "63vh",
  },
  notificationItem: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "12px",
    marginBottom: "8px",
    display: "grid",
    minHeight: "60px",
    gridTemplateColumns: "0.1fr 6fr 1fr",
    gap: "10px",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // 그림자 효과 추가
  },
  notificationEmpty: {
    textAlign: "center",
    marginTop: "8%",
    fontSize: "16px",
    color: "#cccbcb",
  },
  alarmHeader: {
    display: "flex",
    alignItems: "center",
    padding: "16px",
  },
  time: {
    color: "#666666",
    fontSize: "12px",
  },
  alarmText: {
    fontSize: "25px",
    fontWeight: "bold",
    textDecoration: "none",
    color: "rgb(60, 57, 57)",
    textAlign: "center",
  },
};
function AlarmItem({ notification, onDelete }) {
  const [style, setStyle] = useState(styles.notificationItem);

  let touchStartX = 0;
  let touchCurrentX = 0;

  function handleTouchStart(e) {
    touchStartX = e.targetTouches[0].clientX;
    // Set the style to be able to move horizontally
    setStyle({
      ...styles.notificationItem,
      transition: "none", // Disable transitions to follow finger immediately
    });
  }

  function handleTouchMove(e) {
    touchCurrentX = e.targetTouches[0].clientX;
    const moveX = touchCurrentX - touchStartX;

    // Update the style to move with the touch
    setStyle({
      ...styles.notificationItem,
      transform: `translateX(${moveX}px)`,
      transition: "", // Disable transitions to follow finger immediately
    });
  }

  function handleTouchEnd() {
    const moveX = touchCurrentX - touchStartX;

    if (moveX > 0) {
      swipeFunction();
    }

    // Reset the style regardless of the swipe distance
    setStyle(styles.notificationItem);
    touchStartX = 0;
    touchCurrentX = 0;
  }

  function swipeFunction() {
    onDelete(notification.id);
  }

  return (
    <div
      style={style}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Notification content */}

      <div style={styles.alarmCheck}>
        {notification.read ? null : (
          <img
            src={`${process.env.PUBLIC_URL}/image/alarmCheck.png`}
            style={styles.alarmCheck}
            alt="check"
          />
        )}
      </div>
      <p>{notification.message}</p>
      <span style={styles.time}>{notification.time}</span>
    </div>
  );
}
function Alarm() {
  // const notifications = [
  //   {
  //     id: 1,
  //     message: "___eve 님의 이상형과 76% 일치하는 사람이 활동중이에요.",
  //     time: "지금",
  //     read: 0,
  //   },
  //   { id: 2, message: "3,000 코인 충전이 완료되었습니다.", time: "1분 전" },
  //   {
  //     id: 3,
  //     message: "___eve 님의 이상형과 43% 일치하는 사람이 활동중이에요.",
  //     time: "20분 전",
  //     read: 0,
  //   },
  //   {
  //     id: 4,
  //     message: "___eve 님의 이상형과 98% 일치하는 사람이 활동중이에요.",
  //     time: "25분 전",
  //     read: 1,
  //   },
  //   {
  //     id: 5,
  //     message: "___eve 님의 이상형과 98% 일치하는 사람이 활동중이에요.",
  //     time: "25분 전",
  //     read: 1,
  //   },
  //   {
  //     id: 6,
  //     message: "___eve 님의 이상형과 98% 일치하는 사람이 활동중이에요.",
  //     time: "25분 전",
  //     read: 1,
  //   },
  // ];

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "___eve 님의 이상형과 76% 일치하는 사람이 활동중이에요.",
      time: "지금",
      read: 0,
    },
    { id: 2, message: "3,000 코인 충전이 완료되었습니다.", time: "1분 전" },
    {
      id: 3,
      message: "___eve 님의 이상형과 43% 일치하는 사람이 활동중이에요.",
      time: "20분 전",
      read: 0,
    },
    {
      id: 4,
      message: "___eve 님의 이상형과 98% 일치하는 사람이 활동중이에요.",
      time: "25분 전",
      read: 1,
    },
    {
      id: 5,
      message: "___eve 님의 이상형과 98% 일치하는 사람이 활동중이에요.",
      time: "25분 전",
      read: 1,
    },
    {
      id: 6,
      message: "___eve 님의 이상형과 98% 일치하는 사람이 활동중이에요.",
      time: "25분 전",
      read: 1,
    },
  ]);
  const isZero = notifications.length === 0;
  // 읽지 않은 알림의 개수를 계산합니다.
  const notRead = notifications.reduce(
    (count, notification) => count + (notification.read ? 0 : 1),
    0
  );

  // 알림을 삭제하는 함수
  const deleteNotification = (id) => {
    // ID가 일치하지 않는 알림만 남깁니다.
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div>
      <div style={styles.alarmHeader}>
        <span style={styles.alarmText}>알림</span>
      </div>
      <div style={styles.notificationsContainer}>
        <div style={styles.notificationsTextContainer}>
          <span style={styles.notificationTextNumber}>
            {`읽지 않은 알람 ${notRead}개`}
          </span>
          <span style={styles.notificationTextDelete}>전체 삭제</span>
        </div>
        <div style={styles.notificationList}>
          {!isZero ? (
            notifications.map((notification) => (
              <AlarmItem
                key={notification.id}
                notification={notification}
                onDelete={deleteNotification}
              />
            ))
          ) : (
            <div style={styles.notificationEmpty}>현재 알림이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Alarm;

//원래코드.
// import React from "react";
// import Header from "../Component/Header";
// import "./AlarmPage.css"; // CSS 파일을 임포트합니다.
// import { useNavigate } from "react-router-dom";
// <div className="withfriends-header">
//   <span className="withfriends-text">매칭 목록</span>
// </div>;
// const notifications = [
//   {
//     id: 1,
//     message: "___eve 님의 이상형과 76% 일치하는 사람이 활동중이에요.",
//     time: "지금",
//   },
//   { id: 2, message: "3,000 코인 충전이 완료되었습니다.", time: "1분 전" },
//   {
//     id: 3,
//     message: "___eve 님의 이상형과 43% 일치하는 사람이 활동중이에요.",
//     time: "20분 전",
//   },
//   {
//     id: 4,
//     message: "___eve 님의 이상형과 98% 일치하는 사람이 활동중이에요.",
//     time: "25분 전",
//   },
//   {
//     id: 5,
//     message: "___eve 님의 이상형과 98% 일치하는 사람이 활동중이에요.",
//     time: "25분 전",
//   },
//   {
//     id: 6,
//     message: "___eve 님의 이상형과 98% 일치하는 사람이 활동중이에요.",
//     time: "25분 전",
//   },
//   {
//     id: 7,
//     message: "___eve 님의 이상형과 98% 일치하는 사람이 활동중이에요.",
//     time: "25분 전",
//   },
//   {
//     id: 8,
//     message: "___eve 님의 이상형과 98% 일치하는 사람이 활동중이에요.",
//     time: "25분 전",
//   },
//   {
//     id: 9,
//     message: "___eve 님의 이상형과 98% 일치하는 사람이 활동중이에요.",
//     time: "25분 전",
//   },
//   {
//     id: 10,
//     message: "___eve 님의 이상형과 98% 일치하는 사람이 활동중이에요.",
//     time: "25분 전",
//   },
//   {
//     id: 11,
//     message: "___eve 님의 이상형과 98% 일치하는 사람이 활동중이에요.",
//     time: "25분 전",
//   },
//   {
//     id: 12,
//     message: "das 이상형과 98% 일치하는 사람이 활동중이에요.",
//     time: "25분 전",
//   },
// ];

// function Alarm() {
//   const isZero = notifications.length === 0;
//   const notRead = 2;
//   return (
//     <div>
//       <Header />
//       <div className="alarm-header">
//         <span className="alarm-text">알림</span>
//       </div>
//       <div className="notifications-container">
//         <div className="notifications-text-container">
//           <span className="notification-text-number">{`읽지 않은 알람 ${notRead}개`}</span>
//           <span className="notification-text-delete">전체 삭제</span>
//         </div>
//         <div className="notification-list">
//           {!isZero
//             ? notifications.map((notification) => (
//                 <div key={notification.id} className="notification-item">
//                   <p>{notification.message}</p>
//                   <span className="time">{notification.time}</span>
//                 </div>
//               ))
//             : "현재 알림이 없습니다."}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Alarm;

//이제부터 css
/* .notifications-container {
  display: grid;
  grid-template-rows: 0.5fr 7fr;
  margin-top: 10%;
  padding: 2px 20px 20px 20px;
  gap: 5px;
  max-height: 75vh;
}
.notifications-text-container {
  display: flex;
  justify-content: space-between;
  margin: 0px 30px 0px 15px;
}
.notification-text-number {
  font-size: 12px;
  font-weight: lighter;
}

.notification-text-delete {
  font-size: 10px;
  font-weight: lighter;
}

.notification-list {
  padding: 10px;
  background-color: rgb(255, 255, 255);
  border-radius: 30px;
  overflow-y: auto;
  min-height: 63vh;
  max-height: 63vh;
}
.notification-item {
  background: #ffffff;
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 8px;
  display: grid;
  min-height: 60px;
  grid-template-columns: 6fr 1fr;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); 
}

.notification-item p {
  margin: 0;
  color: #333333;
}

.alarm-header {
  display: flex;
  align-items: center;
  padding: 16px;
}

.header button {
  margin-right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.time {
  color: #666666;
  font-size: 12px;
}

.alarm-text {
  font-size: 25px;
  font-weight: bold;
  text-decoration: none;
  color: rgb(60, 57, 57);
  text-align: center;
} */
