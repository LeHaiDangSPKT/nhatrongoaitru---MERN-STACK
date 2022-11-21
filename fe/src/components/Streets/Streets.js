import "../../styles/index.scss";
import * as React from "react";
import Axios from "axios";
import $ from "jquery";
import { BsArrowLeft, BsFilter } from "react-icons/bs";
import { Link } from "react-router-dom";
import Table_Commne from "./Table_commne";
import RemoveVietnameseTones from "../RemoveVietnameseTones";
import { SiOpenstreetmap } from "react-icons/si";
import {
  FaHome,
  FaRegSnowflake,
  FaMotorcycle,
  FaPhoneAlt,
} from "react-icons/fa";
import { IoIosWater, IoIosWifi, IoIosTrash } from "react-icons/io";
import { TbWritingSign } from "react-icons/tb";
import { GiElectric } from "react-icons/gi";
import { AiFillIdcard } from "react-icons/ai";
import Loader from "../Loader";

const style = {
  width: "30px",
  height: "100%",
  fontWeight: "600",
  marginRight: "7px",
};
const styleCard = {
  fontSize: "35px",
  marginRight: "10px",
  transform: "translate(0, -2px)",
};

const stylePhone = { fontSize: "25px", marginRight: "10px" };
if (document.body.clientWidth <= 740) {
  style.width = "20px";
}

function Streets(prop) {
  const nameOfWard = prop.name;
  const [state, setState] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [listOfDetail, setListOfDetail] = React.useState([]);
  const [listOfWard, setListOfWard] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [loader, setLoader] = React.useState(true);

  //Get homes by name
  React.useEffect(() => {
    setLoader(true);
    nameOfWard &&
      Axios.get(`${process.env.REACT_APP_API}/manager/${nameOfWard}`).then(
        ({ data }) => {
          setListOfDetail(data);
          setData(data);
          setLoader(false);
        }
      );
  }, [nameOfWard]);
  //Get data wards
  React.useEffect(() => {
    Axios.get(process.env.REACT_APP_API + "/manager/").then((response) => {
      setListOfWard(response.data);
    });
  }, []);
  const sort = (state) => {
    if (state == "price") {
      setListOfDetail((data) => data.sort((a, b) => a.price - b.price));
    }
    if (state == "distance") {
      setListOfDetail((data) => data.sort((a, b) => a.distance - b.distance));
    }
    setState(state);

    //Load
    window.scrollTo(0, 0);
    $("body").addClass("stop-scrolling");
    document.getElementById("loader-wapper").classList.add("displayFlex");
    setTimeout(() => {
      document.getElementById("loader-wapper").classList.remove("displayFlex");
      $("body").removeClass("stop-scrolling");
    }, 2000);
  };

  const search = (value) => {
    setListOfDetail(() => {
      return data.filter((item) => {
        return JSON.stringify(item.address)
          .toLowerCase()
          .includes(value.toLowerCase());
      });
    });
  };
  let imageWard = "";
  //Get name wards
  const listNameWard = listOfWard.map((item) => {
    if (RemoveVietnameseTones(item.name) === nameOfWard) {
      imageWard = item.imgWardSub;
    }
    return item.name;
  });

  return (
    <div id="content">
      {loader ? (
        <Loader state={loader} />
      ) : (
        <>
          <div className="grid wide">
            <Link className="back" to="/">
              <BsArrowLeft style={{ transform: "translate(-5px, 3px)" }} />
              Quay lại trang chủ
            </Link>
            <button className="button-show" onClick={() => setShow(!show)}>
              Xem thêm các phường khác
            </button>
            {show && <Table_Commne list={listNameWard} />}
            <img src={imageWard} alt="" className="street-name"></img>
            <div className="sort">
              <div className="left">
                <BsFilter style={style} />
                <span>Lọc nhà trọ theo</span>
              </div>
              <div className="right">
                <button
                  className="sort-btn"
                  id="sort-giaphong"
                  onClick={() => sort("price")}
                >
                  Giá phòng
                </button>
                <button
                  className="sort-btn"
                  id="sort-khoangcach"
                  onClick={() => sort("distance")}
                >
                  Khoảng cách đến trường
                </button>
              </div>
            </div>
            <p className="feedback">
              Nếu thông tin có sai sót, vui lòng góp ý tại{" "}
              <a href="https://tinyurl.com/44349krw">đây.</a>
            </p>
            <p className="feedback">
              Nếu bạn đã tìm được nhà trọ, hãy để lại đánh giá tại{" "}
              <a href="https://tinyurl.com/4bh7vhae">đây </a>nhé.
            </p>
            <div className="search">
              <form className="search-container">
                <label htmlFor="search">Tìm kiếm nhà trọ còn phòng:</label>
                <input
                  type="search"
                  id="search-bar"
                  placeholder="Nhập địa chỉ nhà trọ bạn muốn tìm..."
                  data-search
                  onChange={(e) => search(e.target.value)}
                ></input>
              </form>
            </div>
            <div className="room-state">{`Có ${
              listOfDetail.length || 0
            } nhà trọ`}</div>
            <div>
              <div className="row">
                {listOfDetail.map((item) => {
                  return (
                    <div key={item._id} className="col c-6">
                      <div className="street-item">
                        <div className="address-and-map">
                          <div className="address">
                            <h2>
                              {item.address} (cách trường {item.distance} km)
                            </h2>
                          </div>
                          <a
                            href={item.map}
                            style={{ textDecoration: "none" }}
                            className="btn-map"
                          >
                            <SiOpenstreetmap style={{ color: "white" }} />
                          </a>
                        </div>
                        <div className="info-home">
                          <div className="list-img">
                            <img src={item.imgHome} alt="" />
                          </div>
                          <div className="item-content">
                            <div className="info-home-detail">
                              <ul>
                                <li>
                                  <span>
                                    <FaHome style={style} />
                                    Giá phòng:{" "}
                                  </span>
                                  {item.price} đồng/tháng
                                </li>
                                <li>
                                  <span>
                                    <GiElectric style={style} /> Điện:{" "}
                                  </span>
                                  {item.power}
                                </li>
                                <li>
                                  <span>
                                    <IoIosWater style={style} /> Nước:{" "}
                                  </span>
                                  {item.water}
                                </li>
                                <li>
                                  <span>
                                    <FaMotorcycle style={style} /> Gửi xe:{" "}
                                  </span>{" "}
                                  {item.motorcycle}
                                </li>
                                <li>
                                  <span>
                                    <IoIosWifi style={style} /> Wifi:{" "}
                                  </span>
                                  {item.wifi}
                                </li>
                                <li>
                                  <span>
                                    <FaRegSnowflake style={style} /> Máy lạnh:{" "}
                                  </span>{" "}
                                  {item.airConditioner}
                                </li>
                                <li>
                                  <span>
                                    <IoIosTrash style={style} /> Rác:{" "}
                                  </span>
                                  {item.waste}
                                </li>
                                <li>
                                  <span>
                                    <TbWritingSign style={style} />
                                    Mô tả về nhà trọ:{" "}
                                  </span>
                                  {item.describe}
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="avatar">
                          <div className="info-admin">
                            <div className="name">
                              <AiFillIdcard style={styleCard} />
                              {item.hostName !== ""
                                ? item.hostName
                                : "Đang cập nhật"}
                            </div>
                            <div className="phone">
                              <FaPhoneAlt style={stylePhone} />
                              {item.hostPhoneNumber !== ""
                                ? item.hostPhoneNumber
                                : "Đang cập nhật"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div id="loader-wapper">
            <div className="loader">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Streets;
