import * as React from "react";
import Axios from "axios";
import Table_detail from "./Table_detail";
import RemoveVietnameseTones from "../RemoveVietnameseTones";
import $ from "jquery";
import "../../styles/Manager/manager.scss";
import { BiTrashAlt } from "react-icons/bi";
import FileBase64 from "react-file-base64";
import Loader from "../Loader";

export default function Manager() {
  const [idWard, setIdWard] = React.useState("");
  const [nameOfWard, setNameOfWard] = React.useState("");
  const [listOfWard, setListOfWard] = React.useState([]);
  const [loader, setLoader] = React.useState(true);

  const [newHome, setNewHome] = React.useState({
    name: "",
    address: "",
    map: "",
    distance: 0,
    price: 0,
    power: 0,
    water: 0,
    motorcycle: 0,
    wifi: 0,
    airConditioner: 0,
    waste: 0,
    describe: "",
    hostName: "",
    hostPhoneNumber: "",
    imgHome: "",
  });

  const [newWard, setNewWard] = React.useState({
    name: "",
    imgWardMain: "",
    imgWardSub: "",
  });

  //Get data wards
  React.useEffect(() => {
    Axios.get(process.env.REACT_APP_API + "/manager/").then((response) => {
      setListOfWard(response.data);
      setNameOfWard(response.data[0].name);
      setLoader(false);
    });
  }, []);

  const setActive = () => {
    var btns = document.getElementsByClassName("item-ward");
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].value === nameOfWard) {
        btns[i].style.backgroundColor = "#0d6efd";
        btns[i].style.color = "white";
      } else {
        btns[i].style.backgroundColor = "transparent";
        btns[i].style.color = "#0d6efd";
      }
    }
  };
  setActive();

  const addWard = () => {
    Axios.post(process.env.REACT_APP_API + "/manager/addWard", {
      name: newWard.name,
      imgWardMain: newWard.imgWardMain,
      imgWardSub: newWard.imgWardSub,
    })
      .then(function (response) {
        setNameOfWard(newWard.name);
        setListOfWard([
          ...listOfWard,
          {
            name: newWard.name,
            imgWardMain: newWard.imgWardMain,
            imgWardSub: newWard.imgWardSub,
          },
        ]);
      })
      .catch(function (error) {
        alert("Thêm thất bại...");
      });
  };

  const handleSubmit = () => {
    Axios.post(process.env.REACT_APP_API + "/manager/addHome", {
      name: newHome.name,
      address: newHome.address,
      map: newHome.map,
      distance: newHome.distance,
      price: newHome.price,
      power: newHome.power,
      water: newHome.water,
      motorcycle: newHome.motorcycle,
      wifi: newHome.wifi,
      airConditioner: newHome.airConditioner,
      waste: newHome.waste,
      describe: newHome.describe,
      hostName: newHome.hostName,
      hostPhoneNumber: newHome.hostPhoneNumber,
      imgHome: newHome.imgHome,
    })
      .then(function (response) {
        setNameOfWard(newHome.name);
        alert("Thêm thành công");
      })
      .catch(function (error) {
        alert("Thêm thất bại...");
      });
  };

  const handleChange = (e) => {
    setNewHome({ ...newHome, [e.target.name]: e.target.value });
  };

  const handleSelect = () => {
    const value = $("#inputGroupSelectWard").val();
    setNewHome({ ...newHome, name: value });
  };

  const handleDeleteWard = (id, name) => {
    setIdWard(id);
    setNameOfWard(name);
  };

  const handleDestroyWard = () => {
    Axios.delete(
      `${
        process.env.REACT_APP_API
      }/manager/home/deleteHomeByName/${RemoveVietnameseTones(nameOfWard)}`
    )
      .then(function (response) {
        alert(`Đã xoá tất cả nhà thuộc phường ${nameOfWard}`);
      })
      .catch(function (error) {
        alert("Xoá nhà thất bại...");
      });

    Axios.delete(
      `${process.env.REACT_APP_API}/manager/ward/deleteWard/${idWard}`
    )
      .then(function (response) {
        const result = listOfWard.filter((ward) => !(ward.name == nameOfWard));
        setListOfWard(result);
        setNameOfWard(listOfWard[0].name);
      })
      .catch(function (error) {
        alert("Xoá thất bại...");
      });
  };

  return (
    <div id="content">
      {loader ? (
        <Loader state={loader} />
      ) : (
        <div className="grid wide">
          <div className="row">
            <div className="col-4">
              <div className="list-group" id="list-tab" role="tablist">
                {listOfWard.map((item) => {
                  return (
                    <div className="d-flex" key={item._id}>
                      <input
                        value={item.name}
                        type="button"
                        className="btn btn-lg w-100 btn-outline-primary item-ward"
                        onClick={() => setNameOfWard(item.name)}
                      ></input>
                      <button
                        className="btn-delete-ward"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteWardModal"
                        onClick={() => handleDeleteWard(item._id, item.name)}
                      >
                        <BiTrashAlt />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="add-ward">
                <button
                  id="btnAddWard"
                  type="button"
                  className="btn btn-primary btn-add-ward"
                  data-bs-toggle="modal"
                  data-bs-target="#addWardModal"
                >
                  Thêm phường
                </button>
              </div>
            </div>
            <div className="col-8">
              <Table_detail nameOfWard={RemoveVietnameseTones(nameOfWard)} />
            </div>
          </div>

          {/* MODAL ADD WARD*/}
          <div className="modal-add-ward">
            <div
              className="modal fade"
              id="addWardModal"
              tabIndex="-1"
              aria-labelledby="addWardModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="addWardModalLabel">
                      Thêm phường mới
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="col-form-label">Tên phường:</label>
                      <input
                        required
                        type="text"
                        className="form-control"
                        name="name"
                        value={newWard.name}
                        onChange={(e) =>
                          setNewWard({ ...newWard, name: e.target.value })
                        }
                      ></input>
                    </div>
                    <div className="mb-3">
                      <label className="col-form-label">Ảnh chính:</label>
                      <FileBase64
                        accept="image/*"
                        multiple={false}
                        type="file"
                        value={newWard.imgWardMain}
                        onDone={({ base64 }) =>
                          setNewWard({ ...newWard, imgWardMain: base64 })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="col-form-label">Ảnh phụ:</label>
                      <FileBase64
                        accept="image/*"
                        multiple={false}
                        type="file"
                        value={newWard.imgWardSub}
                        onDone={({ base64 }) =>
                          setNewWard({ ...newWard, imgWardSub: base64 })
                        }
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Huỷ
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      id="destroy-ward"
                      data-bs-toggle="modal"
                      data-bs-dismiss="modal"
                      onClick={addWard}
                    >
                      Xác nhận
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MODAL ADD HOME */}
          <div
            className="modal fade modal-lg"
            id="addModal"
            tabIndex="-1"
            aria-labelledby="addModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="addModalLabel">
                    Thêm một nhà trọ
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="col-form-label">Phường:</label>
                    <select
                      className="form-select"
                      id="inputGroupSelectWard"
                      onChange={handleSelect}
                    >
                      <option defaultValue>Choose...</option>
                      {listOfWard.map((item) => {
                        return (
                          <option
                            key={item._id}
                            value={RemoveVietnameseTones(item.name)}
                          >
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="col-form-label">Địa chỉ:</label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      name="address"
                      value={newHome.address}
                      onChange={handleChange}
                    ></input>
                  </div>
                  <div className="mb-3">
                    <label className="col-form-label">Map:</label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      name="map"
                      value={newHome.map}
                      onChange={handleChange}
                    ></input>
                  </div>
                  <div className="mb-3">
                    <label className="col-form-label">Khoảng cách:</label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      name="distance"
                      value={newHome.distance}
                      onChange={handleChange}
                    ></input>
                  </div>
                  <div className="mb-3 d-flex justify-content-between">
                    <div className="w-25">
                      <label className="col-form-label">Tiền phòng:</label>
                      <input
                        required
                        type="text"
                        className="form-control"
                        name="price"
                        value={newHome.price}
                        onChange={handleChange}
                      ></input>
                    </div>
                    <div className="w-25">
                      <label className="col-form-label">Tiền điện:</label>
                      <input
                        required
                        type="text"
                        className="form-control"
                        name="power"
                        value={newHome.power}
                        onChange={handleChange}
                      ></input>
                    </div>
                    <div className="w-25">
                      <label className="col-form-label">Tiền nước:</label>
                      <input
                        required
                        type="text"
                        className="form-control"
                        name="water"
                        value={newHome.water}
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>
                  <div className="mb-3 d-flex justify-content-between">
                    <div className="w-25">
                      <label className="col-form-label">Tiền giữ xe:</label>
                      <input
                        required
                        type="text"
                        className="form-control"
                        name="motorcycle"
                        value={newHome.motorcycle}
                        onChange={handleChange}
                      ></input>
                    </div>
                    <div className="w-25">
                      <label className="col-form-label">Tiền wifi:</label>
                      <input
                        required
                        type="text"
                        className="form-control"
                        name="wifi"
                        value={newHome.wifi}
                        onChange={handleChange}
                      ></input>
                    </div>
                    <div className="w-25">
                      <label className="col-form-label">Tiền máy lạnh:</label>
                      <input
                        required
                        type="text"
                        className="form-control"
                        name="airConditioner"
                        value={newHome.airConditioner}
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>
                  <div className="mb-3 d-flex justify-content-between">
                    <div className="w-25">
                      <label className="col-form-label">Tiền rác:</label>
                      <input
                        required
                        type="text"
                        className="form-control"
                        name="waste"
                        value={newHome.waste}
                        onChange={handleChange}
                      ></input>
                    </div>
                    <div className="w-50">
                      <label className="col-form-label">Mô tả:</label>
                      <textarea
                        required
                        type="text"
                        className="form-control"
                        name="describe"
                        value={newHome.describe}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="col-form-label">Tên chủ: </label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      name="hostName"
                      value={newHome.hostName}
                      onChange={handleChange}
                    ></input>
                  </div>
                  <div className="mb-3">
                    <label className="col-form-label">Số điện thoại chủ:</label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      name="hostPhoneNumber"
                      value={newHome.hostPhoneNumber}
                      onChange={handleChange}
                    ></input>
                  </div>
                  <div className="mb-3">
                    <label className="col-form-label">Ảnh:</label>
                    <FileBase64
                      accept="image/*"
                      multiple={false}
                      type="file"
                      value={newHome.imgHome}
                      onDone={({ base64 }) =>
                        setNewHome({ ...newHome, imgHome: base64 })
                      }
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Huỷ
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    onClick={handleSubmit}
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* MODAL DELETE WARD*/}
          <div className="modal-delete-ward">
            <div
              className="modal fade"
              id="deleteWardModal"
              tabIndex="-1"
              aria-labelledby="deleteWardModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="deleteWardModalLabel">
                      Xoá phường ...
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    Tất cả nhà trò thuộc phường {nameOfWard} sẽ bị xoá. Bạn chắc
                    chắn muốn xoá chứ?
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Huỷ
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      id="destroy-ward"
                      data-bs-toggle="modal"
                      onClick={handleDestroyWard}
                    >
                      Xác nhận
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
