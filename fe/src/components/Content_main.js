import "../styles/base.scss";
import "../styles/main.scss";
import "../styles/table.scss";
import "../styles/responsive.scss";
import Slick from "../js/Slick";
import ClipLoader from "react-spinners/ClipLoader";

import ModalSignIn from "./Manager/ModalSignIn";
import * as React from "react";
import Axios from "axios";
import Loader from "./Loader";

const styleModalSignIn = {
  display: "flex",
  flexDirection: "row-reverse",
};
const styleSelect = {
  fontSize: 18,
  marginLeft: 10,
};
function Content_main() {
  const [yearCurrent, setYearCurrent] = React.useState("");
  const [listOfYear, setListOfYear] = React.useState([]);
  const [listOfActivities, setListOfActivities] = React.useState([]);
  const [listOfWard, setListOfWard] = React.useState([]);
  const [loader, setLoader] = React.useState(true);
  const [miniLoader, setMiniLoader] = React.useState(true);

  //Get data year of activities
  React.useEffect(() => {
    Axios.get(`${process.env.REACT_APP_API}/managerActivity/getYear`).then(
      ({ data }) => {
        setListOfYear(data);
        setYearCurrent(data[0].year);
      }
    );
  }, []);
  //Get data activities
  React.useEffect(() => {
    setMiniLoader(true);
    Axios.get(
      `${process.env.REACT_APP_API}/managerActivity/${
        yearCurrent || "2021-2022"
      }`
    ).then(({ data }) => {
      setListOfActivities(data);
      setMiniLoader(false);
    });
  }, [yearCurrent]);

  //Get data ward
  React.useEffect(() => {
    Axios.get(process.env.REACT_APP_API + "/manager/").then((response) => {
      setListOfWard(response.data);
      setLoader(false);
    });
  }, []);
  return (
    <div id="content">
      {loader ? (
        <Loader state={loader} />
      ) : (
        <div className="grid wide">
          <div className="content__place">
            <div style={styleModalSignIn}>
              <ModalSignIn />
            </div>
            <div className="content__title">
              <h3 className="content__heading">Tìm nhà trọ</h3>
              <div className="content__heading-sub">
                Gần trường ĐH SPKT TP.HCM
              </div>
              <p className="feedback">
                *Các thông tin sẽ được cập nhật theo định kì, nếu có sai sót hãy
                đóng góp ở ngay địa điểm đó nhé!
              </p>
              <p className="feedback">
                *Nếu muốn đóng góp thêm nơi ở của mình, bạn có thể đóng góp tại{" "}
                <a href="https://tinyurl.com/yckk29zp">đây.</a>
              </p>
            </div>
            <div className="content__place-list">
              <Slick list={listOfWard} />
            </div>
          </div>
          <div className="content__activities">
            <div className="content__title d-flex justify-content-between">
              <div className="left">
                <h3 className="content__heading">
                  Các hoạt động của LCH Sinh viên Ngoại Trú
                </h3>
                <div className="content__heading-sub">
                  Đây là các hoạt động diễn ra trong năm học
                  <select
                    onChange={(e) => setYearCurrent(e.target.value)}
                    style={styleSelect}
                  >
                    {listOfYear.map((item) => {
                      return (
                        <option key={item._id} value={item.year}>
                          {item.year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="right">
                {localStorage.getItem("login") && (
                  <a href="/managerActivity">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg btn-modal"
                    >
                      Quản lý các hoạt động
                    </button>
                  </a>
                )}
              </div>
            </div>
            {miniLoader ? (
              <ClipLoader />
            ) : listOfActivities.length == 0 ? (
              <h3 className="content__heading-center">Chưa có hoạt động</h3>
            ) : (
              <>
                <div className="table">
                  <div className="table-header">
                    <div className="header__item">
                      <div id="name" className="filter__link">
                        STT
                      </div>
                    </div>
                    <div className="header__item">
                      <div
                        id="wins"
                        className="filter__link filter__link--number"
                      >
                        Tên hoạt động
                      </div>
                    </div>
                    <div className="header__item">
                      <div
                        id="draws"
                        className="filter__link filter__link--number"
                      >
                        Trạng thái
                      </div>
                    </div>
                  </div>
                  {listOfActivities.map((item, index) => {
                    return (
                      <div className="table-row" key={item._id}>
                        <div className="table-data">{index + 1}</div>
                        <div className="table-data content__activities-item">
                          <a
                            style={{ textDecoration: "none", color: "black" }}
                            href={item.link}
                          >
                            {item.title}
                          </a>
                        </div>
                        <div className="table-data">{item.state}</div>
                      </div>
                    );
                  })}
                </div>

                <h3 className="content__heading-center">
                  Các hoạt động đã và đang diễn ra
                </h3>
                <div className="content__activities-list">
                  {listOfActivities.map((item) => {
                    if (item.state !== "Sắp diễn ra") {
                      return (
                        <div className="col c-4" key={item._id}>
                          <a href={item.link}>
                            <div className="content__activities-item">
                              <img src={item.imgActivity}></img>
                              <a href={item.link}>{item.title}</a>
                            </div>
                          </a>
                        </div>
                      );
                    }
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Content_main;
