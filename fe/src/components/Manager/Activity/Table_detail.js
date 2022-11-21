import * as React from "react";
import Axios from "axios";
import "../../../styles/Manager/table_details.scss";
import { BiPencil, BiTrashAlt } from "react-icons/bi";
import $ from "jquery";
import FileBase64 from "react-file-base64";

export default function Table_detail({ name }) {
  const [listOfDetail, setListOfDetail] = React.useState([]);
  const [idActivity, setIdActivity] = React.useState("");
  const [activity, setActivity] = React.useState({});

  //Get data activities
  React.useEffect(() => {
    name &&
      Axios.get(`${process.env.REACT_APP_API}/managerActivity/${name}`).then(
        ({ data }) => {
          setListOfDetail(data);
        }
      );
  }, [name]);

  const handleDestroyActivity = () => {
    Axios.delete(
      `${process.env.REACT_APP_API}/managerActivity/deleteActivityById/${idActivity}`
    )
      .then(function (response) {
        const result = listOfDetail.filter(
          (activity) => !(activity._id == idActivity)
        );
        setListOfDetail(result);
      })
      .catch(function (error) {
        alert("Xoá thất bại...");
      });
  };

  const handleGetActivity = (id) => {
    const result = listOfDetail.filter((item) => item._id == id);
    setActivity(result[0]);
  };

  const handleEditValue = (e) => {
    console.log(e.target, ":", e.target.value);
    setActivity({ ...activity, [e.target.name]: e.target.value });
  };
  const handleUpdate = () => {
    console.log(activity);
    Axios.put(
      `${process.env.REACT_APP_API}/managerActivity/update/${activity._id}`,
      {
        name: activity.name,
        title: activity.title,
        link: activity.link,
        state: activity.state,
        imgActivity: activity.imgActivity,
      }
    )
      .then(function (response) {
        alert("Cập nhật thành công !!!");
      })
      .catch(function (error) {
        alert("Cập nhật thất bại...");
      });
  };
  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th className="table__header" scope="col">
              #
            </th>
            <th className="table__header" scope="col">
              Tên hoạt động ({name})
            </th>
            <th className="table__header" scope="col">
              Trạng thái
            </th>
            <th className="table__header" scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {listOfDetail.map((item, index) => {
            return (
              <tr key={item._id} className="table__row">
                <th scope="row">{index + 1}</th>
                <td>{item.title}</td>
                <td>{item.state}</td>
                <td>
                  <button
                    className="btn-controller"
                    data-bs-toggle="modal"
                    data-bs-target="#editModal"
                    onClick={() => handleGetActivity(item._id)}
                  >
                    <BiPencil />
                  </button>
                  <button
                    className="btn-controller"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteModal"
                    onClick={() => setIdActivity(item._id)}
                  >
                    <BiTrashAlt />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        type="button"
        className="btn btn-primary btn-add"
        data-bs-toggle="modal"
        data-bs-target="#addModal"
      >
        <span>+</span>
      </button>

      {/* MODAL EDIT */}
      <div
        className="modal fade modal-lg"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editModalLabel">
                Sửa hoạt động
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
                <input
                  required
                  className="form-control"
                  name="name"
                  value={activity.name}
                ></input>
              </div>
              <div className="mb-3">
                <label className="col-form-label">Tên hoạt động:</label>
                <input
                  required
                  type="text"
                  className="form-control"
                  name="title"
                  value={activity.title}
                  onChange={handleEditValue}
                ></input>
              </div>
              <div className="mb-3">
                <label className="col-form-label">Link:</label>
                <input
                  type="text"
                  className="form-control"
                  name="link"
                  value={activity.link}
                  onChange={handleEditValue}
                ></input>
              </div>
              <div className="mb-3">
                <label className="col-form-label">Trạng thái:</label>
                <select
                  className="form-select"
                  id="inputGroupSelectstate"
                  name="state"
                  onChange={handleEditValue}
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
                  accept="image/*"
                  multiple={false}
                  type="file"
                  value={activity.imgActivity}
                  onDone={({ base64 }) =>
                    setActivity({ ...activity, imgActivity: base64 })
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
                onClick={handleUpdate}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* MODAL DELETE */}
      <div className="modal-delete">
        <div
          className="modal fade"
          id="deleteModal"
          tabIndex="-1"
          aria-labelledby="deleteModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deleteModalLabel">
                  Xoá hoạt động
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                Dữ liệu sẽ không thể khôi phục. Bạn chắc chắn muốn xoá chứ ?
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
                  data-bs-dismiss="modal"
                  onClick={handleDestroyActivity}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
