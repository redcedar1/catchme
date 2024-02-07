import { Link, useNavigate } from "react-router-dom";
import "./HelpPage.css";

function Help() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="help-header">
        <span className="help-text">도움</span>
      </div>
      <div className="help-container">
        <div className="explain-box">
          <p className="need-help-text">도움이 필요하신가요?</p>
          <p className="need-help-text2">
            아래의 링크로 알려주시면 <br />
            신속한 확인 및 조치 하겠습니다.
          </p>
        </div>
        <div className="path-box">
          <div className="path-text">
            <p>캐치미 인스타그램</p>
          </div>
          <div className="path-icon">
            <Link to="https://www.instagram.com/">
              <img
                src={`${process.env.PUBLIC_URL}/image/gobutton/GoPink.png`}
                className="back-icon"
              />
            </Link>
          </div>
        </div>
        <div className="path-box">
          <div className="path-text">
            <p>캐치미 카카오톡 채널</p>
          </div>
          <div className="path-icon">
            <Link to="https://www.instagram.com/">
              <img
                src={`${process.env.PUBLIC_URL}/image/gobutton/GoYellow.png`}
                className="back-icon"
              />
            </Link>
          </div>
        </div>
        <div className="path-box">
          <div className="path-text">
            <p>캐치미 이메일 주소 복사</p>
          </div>
          <div className="path-icon">
            <Link to="https://www.instagram.com/">
              <img
                src={`${process.env.PUBLIC_URL}/image/gobutton/GoGreen.png`}
                className="back-icon"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
