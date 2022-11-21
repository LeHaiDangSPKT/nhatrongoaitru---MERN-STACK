import * as React from "react";
import Axios from "axios";
import Table_detail from "./Table_detail";
import "../../../styles/Manager/manager.scss";
import { BiTrashAlt } from "react-icons/bi";
import $ from "jquery";
import FileBase64 from "react-file-base64";
import Loader from "../../Loader";
export default function Manager() {
  const [idYear, setIdYear] = React.useState("");
  const [year, setYear] = React.useState("");
  const [nameOfYear, setNameOfYear] = React.useState("");
  const [listOfYear, setListOfYear] = React.useState([]);
  const [newActivity, setNewActivity] = React.useState({
    name: "",
    title: "",
    link: "",
    state: "",
    imgActivity: "",
  });
  const [loader, setLoader] = React.useState(true);

  //Get data years
  React.useEffect(() => {
    Axios.get(process.env.REACT_APP_API + "/managerActivity/getYear").then(
      (response) => {
        setListOfYear(response.data);
        setNameOfYear(response.data[0].year);
        setLoader(false);
      }
    );
  }, []);

  const setActive = () => {
    var btns = document.getElementsByClassName("item-ward");
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].value === nameOfYear) {
        btns[i].style.backgroundColor = "#0d6efd";
        btns[i].style.color = "white";
      } else {
        btns[i].style.backgroundColor = "transparent";
        btns[i].style.color = "#0d6efd";
      }
    }
  };
  setActive();

  const addYear = () => {
    if (year.trim() === "") {
      alert("Bạn chưa nhập gì");
    } else {
      Axios.post(process.env.REACT_APP_API + "/managerActivity/addYear", {
        year,
      }).then((response) => {
        setListOfYear([
          ...listOfYear,
          {
            year,
          },
        ]);
        setYear("");
        $(".form-control").focus();
      });
    }
  };

  const handleSubmit = () => {
    Axios.post(process.env.REACT_APP_API + "/managerActivity/", {
      name: newActivity.name,
      title: newActivity.title,
      link: newActivity.link,
      state: newActivity.state,
      imgActivity: newActivity.imgActivity,
    })
      .then(function (response) {
        setNameOfYear(newActivity.year);
      })
      .catch(function (error) {
        alert("Thêm thất bại...");
      });
  };

  const handleChange = (e) => {
    setNewActivity({ ...newActivity, [e.target.name]: e.target.value });
  };

  const handleDestroyYear = () => {
    Axios.delete(
      `${process.env.REACT_APP_API}/managerActivity/deleteActivityByName/${nameOfYear}`
    )
      .then(function (response) {
        alert(`Đã xoá tất cả các hoạt động của năm ${nameOfYear}`);
      })
      .catch(function (error) {
        alert("Xoá nhà thất bại...");
      });

    Axios.delete(
      `${process.env.REACT_APP_API}/managerActivity/deleteYear/${idYear}`
    )
      .then(function (response) {
        alert(`Đã xoá tất cả các hoạt động của năm ${year}`);
        const result = listOfYear.filter((year) => !(year._id == idYear));
        setListOfYear(result);
        setNameOfYear(listOfYear[0].year);
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
                {listOfYear.map((item) => {
                  return (
                    <div className="d-flex" key={item._id}>
                      <input
                        value={item.year}
                        type="button"
                        className="btn btn-lg w-100 btn-outline-primary item-ward"
                        onClick={() => setNameOfYear(item.year)}
                      ></input>
                      <button
                        className="btn-delete-ward"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteWardModal"
                        onClick={() => {
                          setIdYear(item._id);
                          setNameOfYear(item.year);
                        }}
                      >
                        <BiTrashAlt />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="d-flex add-ward">
                <input
                  required
                  id="inputAddYear"
                  type="text"
                  className="form-control input-add-ward"
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      $("#btnAddYear").click();
                    }
                  }}
                ></input>
                <button
                  id="btnAddYear"
                  type="button"
                  className="btn btn-primary btn-add-ward"
                  onClick={addYear}
                >
                  Thêm năm học mới
                </button>
              </div>
            </div>
            <div className="col-8">
              <Table_detail name={nameOfYear} />
            </div>
          </div>

          {/* MODAL */}
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
                    Thêm một hoạt động
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
                    <label className="col-form-label">Năm học:</label>
                    <select
                      className="form-select"
                      id="inputGroupSelectName"
                      name="name"
                      onChange={handleChange}
                    >
                      <option defaultValue>Choose...</option>
                      {listOfYear.map((item) => {
                        return (
                          <option key={item._id} value={item.year}>
                            {item.year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="col-form-label">Tên hoạt động:</label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      name="title"
                      value={newActivity.title}
                      onChange={handleChange}
                    ></input>
                  </div>
                  <div className="mb-3">
                    <label className="col-form-label">Link:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="link"
                      value={newActivity.link}
                      onChange={handleChange}
                    ></input>
                  </div>
                  <div className="mb-3">
                    <label className="col-form-label">Trạng thái:</label>
                    <select
                      className="form-select"
                      id="inputGroupSelectstate"
                      name="state"
                      onChange={handleChange}
                    >
                      <option defaultValue>Choose...</option>
                      <option value="Sắp diễn ra">Sắp diễn ra</option>
                      <option value="Đang diễn ra">Đang diễn ra</option>
                      <option value="Đã diễn ra">Đã diễn ra</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="col-form-label">Ảnh:</label>
                    <FileBase64
                      className="form-control"
                      accept="image/*"
                      multiple={false}
                      type="file"
                      value={newActivity.imgActivity}
                      onDone={({ base64 }) =>
                        setNewActivity({ ...newActivity, imgActivity: base64 })
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
                    type="submit"
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
                      Xoá năm học ...
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    Tất cả các hoạt động thuộc năm {nameOfYear} sẽ bị xoá. Bạn
                    chắc chắn muốn xoá chứ?
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
                      onClick={handleDestroyYear}
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
