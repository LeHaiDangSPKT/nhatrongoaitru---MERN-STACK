import * as React from "react";
import Axios from "axios";

export default function ModalSignIn() {
  const [listOfAccount, setListOfAccount] = React.useState([]);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  React.useEffect(() => {
    Axios.get(process.env.REACT_APP_API + "/account/getAccount").then(
      (response) => {
        setListOfAccount(response.data);
      }
    );
  }, []);

  function checkedUsername(username, password) {
    const result = listOfAccount.map((item) => {
      if (
        Object.values(item.username).includes(username) &&
        Object.values(item.password).includes(password)
      )
        return true;
      else return false;
    });
    return result.includes(false);
  }

  const sendData = () => {
    if (checkedUsername(username, password)) {
      localStorage.setItem("login", username);
      window.location.reload();
    } else {
      alert("Tài khoản không tồn tại!");
    }
  };

  const handleDeleteKey = () => {
    localStorage.removeItem("login");
    alert("Đăng xuất thành công!!!");
    window.location.reload();
  };

  return (
    <div>
      {!localStorage.getItem("login") && (
        <button
          type="button"
          className="btn btn-primary btn-lg btn-modal"
          data-bs-toggle="modal"
          data-bs-target="#loginModal"
          data-bs-whatever="@fat"
        >
          Trở thành Admin
        </button>
      )}
      {localStorage.getItem("login") && (
        <>
          <a href="/manager">
            <button type="submit" className="btn btn-primary btn-lg btn-modal">
              Quản lý nhà trọ
            </button>
          </a>
          <button
            className="btn btn-primary btn-lg btn-modal"
            onClick={handleDeleteKey}
          >
            Đăng xuất
          </button>
        </>
      )}

      <div
        className="modal fade"
        id="loginModal"
        tabIndex="-1"
        aria-labelledby="loginModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="loginModalLabel">
                Đăng nhập
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
                <label htmlFor="inputEmail" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="inputEmail"
                  aria-describedby="emailHelp"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                ></input>
                <div id="emailHelp" className="form-text">
                  We'll never share your email with anyone else.
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="inputPassword" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  name="inputPassword"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                ></input>
              </div>
              <div className="d-flex justify-content-end">
                <button onClick={sendData} className="btn btn-primary">
                  Đăng nhập
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
