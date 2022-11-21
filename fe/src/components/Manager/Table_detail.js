import * as React from "react";
import Axios from "axios";
import "../../styles/Manager/table_details.scss";
import { BiPencil, BiTrashAlt } from "react-icons/bi";
import FileBase64 from "react-file-base64";
import ClipLoader from "react-spinners/ClipLoader";

export default function Table_detail({ nameOfWard }) {
  const [listOfDetail, setListOfDetail] = React.useState([]);
  const [idHome, setIdHome] = React.useState("");
  const [home, setHome] = React.useState({});
  const [miniLoader, setMiniLoader] = React.useState(true);

  //Get data homes
  React.useEffect(() => {
    setMiniLoader(true);
    nameOfWard &&
      Axios.get(`${process.env.REACT_APP_API}/manager/${nameOfWard}`).then(
        ({ data }) => {
          setListOfDetail(data);
          setMiniLoader(false);
        }
      );
  }, [nameOfWard]);

  const handleDeleteHome = (id) => {
    setIdHome(id);
  };
  const handleDestroyHome = () => {
    Axios.delete(
      `${process.env.REACT_APP_API}/manager/home/deleteHomeById/${idHome}`
    )
      .then(function (response) {
        const result = listOfDetail.filter((ward) => !(ward._id == idHome));
        setListOfDetail(result);
      })
      .catch(function (error) {
        alert("Xoá thất bại...");
      });
  };

  const handleGetHome = (id) => {
    const result = listOfDetail.filter((item) => item._id == id);
    setHome(result[0]);
  };

  const handleEditValue = (e) => {
    setHome({ ...home, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    Axios.put(`${process.env.REACT_APP_API}/manager/update/${home._id}`, {
      name: home.name,
      address: home.address,
      map: home.map,
      distance: home.distance,
      price: home.price,
      power: home.power,
      water: home.water,
      motorcycle: home.motorcycle,
      wifi: home.wifi,
      airConditioner: home.airConditioner,
      waste: home.waste,
      describe: home.describe,
      hostName: home.hostName,
      hostPhoneNumber: home.hostPhoneNumber,
      imgHome: home.imgHome,
    })
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
              Địa chỉ phòng ({nameOfWard})
            </th>
            <th className="table__header" scope="col">
              Giá phòng
            </th>
            <th className="table__header" scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {miniLoader ? (
            <ClipLoader />
          ) : (
            listOfDetail.map((item, index) => {
              return (
                <tr key={item._id} className="table__row">
                  <th scope="row">{index + 1}</th>
                  <td>{item.address}</td>
                  <td>{item.price}</td>
                  <td>
                    <button
                      className="btn-controller"
                      data-bs-toggle="modal"
                      data-bs-target="#editModal"
                      onClick={() => handleGetHome(item._id)}
                    >
                      <BiPencil />
                    </button>
                    <button
                      className="btn-controller"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteModal"
                      onClick={() => handleDeleteHome(item._id)}
                    >
                      <BiTrashAlt />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
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
      <div className="modal-edit">
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
                  Chỉnh sửa nhà trọ
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
                  <input
                    required
                    type="text"
                    className="form-control"
                    name="address"
                    value={home.name}
                  ></input>
                </div>

                <div className="mb-3">
                  <label className="col-form-label">Địa chỉ:</label>
                  <input
                    required
                    type="text"
                    className="form-control"
                    name="address"
                    value={home.address}
                    onChange={handleEditValue}
                  ></input>
                </div>
                <div className="mb-3">
                  <label className="col-form-label">Map:</label>
                  <input
                    required
                    type="text"
                    className="form-control"
                    name="map"
                    value={home.map}
                    onChange={handleEditValue}
                  ></input>
                </div>
                <div className="mb-3">
                  <label className="col-form-label">Khoảng cách:</label>
                  <input
                    required
                    type="text"
                    className="form-control"
                    name="distance"
                    value={home.distance}
                    onChange={handleEditValue}
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
                      value={home.price}
                      onChange={handleEditValue}
                    ></input>
                  </div>
                  <div className="w-25">
                    <label className="col-form-label">Tiền điện:</label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      name="power"
                      value={home.power}
                      onChange={handleEditValue}
                    ></input>
                  </div>
                  <div className="w-25">
                    <label className="col-form-label">Tiền nước:</label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      name="water"
                      value={home.water}
                      onChange={handleEditValue}
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
                      value={home.motorcycle}
                      onChange={handleEditValue}
                    ></input>
                  </div>
                  <div className="w-25">
                    <label className="col-form-label">Tiền wifi:</label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      name="wifi"
                      value={home.wifi}
                      onChange={handleEditValue}
                    ></input>
                  </div>
                  <div className="w-25">
                    <label className="col-form-label">Tiền máy lạnh:</label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      name="airConditioner"
                      value={home.airConditioner}
                      onChange={handleEditValue}
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
                      value={home.waste}
                      onChange={handleEditValue}
                    ></input>
                  </div>
                  <div className="w-50">
                    <label className="col-form-label">Mô tả:</label>
                    <textarea
                      required
                      type="text"
                      className="form-control"
                      name="describe"
                      value={home.describe}
                      onChange={handleEditValue}
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
                    value={home.hostName}
                    onChange={handleEditValue}
                  ></input>
                </div>
                <div className="mb-3">
                  <label className="col-form-label">Số điện thoại chủ:</label>
                  <input
                    required
                    type="text"
                    className="form-control"
                    name="hostPhoneNumber"
                    value={home.hostPhoneNumber}
                    onChange={handleEditValue}
                  ></input>
                </div>
                <div className="mb-3">
                  <label className="col-form-label">Ảnh:</label>
                  <FileBase64
                    accept="image/*"
                    multiple={false}
                    type="file"
                    value={home.imgHome}
                    onDone={({ base64 }) =>
                      setHome({ ...home, imgHome: base64 })
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
                  onClick={handleUpdate}
                >
                  Cập nhật
                </button>
              </div>
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
                  Xoá nhà trọ
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                Dữ liệu sẽ không thể khôi phục. Bạn chắc chắn muốn xoá chứ
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
                  onClick={handleDestroyHome}
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
