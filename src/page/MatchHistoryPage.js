import React from "react";
import "./MatchHistoryPage.css"; // CSS 파일을 임포트합니다.
import { useNavigate } from "react-router-dom";

const historys = [
  {
    id: 1,
    date: "2024-01-22 19:36분",
    meeter: "w99_hyun_",
    gender: "남",
    age: 26,
    location: "서울특별시 마포구",
  },
  {
    id: 2,
    date: "2024-01-16 13:36분",
    meeter: "JIPDANJISUNG",
    gender: "남",
    age: 20,
    location: "서울특별시 강남구",
  },
  {
    id: 3,
    date: "2024-01-10 19:11분",
    meeter: "Woo_Wu_Uk",
    gender: "남",
    age: 23,
    location: "서울특별시 노원구",
  },
  {
    id: 1,
    date: "2024-01-22 19:36분",
    meeter: "w99_hyun_",
    gender: "남",
    age: 26,
    location: "서울특별시 마포구",
  },
  {
    id: 2,
    date: "2024-01-16 13:36분",
    meeter: "JIPDANJISUNG",
    gender: "남",
    age: 20,
    location: "서울특별시 강남구",
  },
  {
    id: 3,
    date: "2024-01-10 19:11분",
    meeter: "Woo_Wu_Uk",
    gender: "남",
    age: 23,
    location: "서울특별시 노원구",
  },
  {
    id: 1,
    date: "2024-01-22 19:36분",
    meeter: "w99_hyun_",
    gender: "남",
    age: 26,
    location: "서울특별시 마포구",
  },
  {
    id: 2,
    date: "2024-01-16 13:36분",
    meeter: "JIPDANJISUNG",
    gender: "남",
    age: 20,
    location: "서울특별시 강남구",
  },
  {
    id: 3,
    date: "2024-01-10 19:11분",
    meeter: "Woo_Wu_Uk",
    gender: "남",
    age: 23,
    location: "서울특별시 노원구",
  },
];

function MatchHistory() {
  const navigate = useNavigate();
  const isZero = historys.length === 0;
  return (
    <div>
      <div className="header-history">
        <span className="history-text">매칭 목록</span>
      </div>
      <div className="button-select-delete-locate">
        <button className="select-button">선택</button>
        <button className="delete-all-button">전체 삭제</button>
      </div>
      <div className="history-container">
        <div className="history-list">
          {!isZero
            ? historys.map((history) => (
                <div key={history.id} className="history-item">
                  <div className="middle-sort">
                    <img
                      src={`${process.env.PUBLIC_URL}/image/profile/catMale.png`}
                      className=""
                      style={{ width: '50px', height: '50px' }}
                    />
                  </div>
                  <div>
                    <div className="history-info">
                      <div>
                        <p className="history-date">{history.date} 매칭</p>
                        <p className="history-meeter">{history.meeter}</p>
                        <p className="history-details">
                          {history.gender}/{history.age}/{history.location}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="middle-sort">
                    <button className="report-button">신고하기</button>
                  </div>
                </div>
              ))
            : "매칭 이력이 없습니다."}
        </div>
      </div>
    </div>
  );
}

export default MatchHistory;
