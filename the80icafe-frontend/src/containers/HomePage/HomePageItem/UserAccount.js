/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import { connect } from "react-redux";
import "./UserAccount.scss";
import * as services from "./../../../services/index";
import { Button } from "reactstrap";
import * as actions from "../../../store/actions";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import ReceiptIcon from "@mui/icons-material/Receipt";
import HistoryIcon from "@mui/icons-material/History";
class InforProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentActive: 0,
      listProduct: [],
      sumProduct: 0,
      address: "",
      email: "",
      fullname: "",
      id: null,
      numberPhone: "",
      name: "",
      listHistory: [],
      listCurrentOrder: [],
    };
  }
  componentDidMount() {
    let { userInfo } = this.props;
    if (userInfo.id) {
      this.props.historyOrderUser({ id: userInfo.id });
      this.props.currentOrderUser({ id: userInfo.id });
    }
    if (this.props.listProduct && this.props.listProduct.length > 0) {
      this.sumValue(this.props.listProduct);
      this.setState({
        listProduct: this.props.listProduct,
      });
      if (this.props.listHistory && this.props.listHistory.length > 0) {
        this.setState({
          listHistory: this.props.listHistory,
        });
      }
      if (
        this.props.listCurrentOrder &&
        this.props.listCurrentOrder.length > 0
      ) {
        this.setState({
          listCurrentOrder: this.props.listCurrentOrder,
        });
      }
    }

    if (userInfo) {
      this.setState({
        address: userInfo.address,
        email: userInfo.email,
        name: userInfo.fullname,
        id: userInfo.id,
        numberPhone: userInfo.numberPhone,
      });
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.listProduct !== prevProps.listProduct) {
      this.sumValue(this.props.listProduct);
      this.setState({
        listProduct: this.props.listProduct,
      });
    }
    if (this.props.listHistory !== prevProps.listHistory) {
      this.setState({
        listHistory: this.props.listHistory,
      });
    }
    if (this.props.listCurrentOrder !== prevProps.listCurrentOrder) {
      this.setState({
        listCurrentOrder: this.props.listCurrentOrder,
      });
    }
    if (this.props.userInfo !== prevProps.userInfo) {
      let { userInfo } = this.props;
      this.props.historyOrderUser("userInfo", userInfo);
      this.setState({
        address: userInfo.address,
        email: userInfo.email,
        name: userInfo.fullname,
        id: userInfo.id,
        numberPhone: userInfo.numberPhone,
      });
    }
  }
  changeCurrentActive = (value) => {
    this.setState({ currentActive: value });
  };
  logoutUser = () => {
    this.props.userLogout();
  };

  sumValue = (listProduct) => {
    let value = 0;
    if (listProduct && listProduct.length > 0) {
      value = listProduct.reduce((total, item) => {
        return total + item.price * item.currentValue;
      }, 0);
    }
    this.setState({
      sumProduct: value,
    });
  };

  renderListProduct = (listProduct) => {
    let result = [];
    if (listProduct && listProduct.length > 0) {
      result = listProduct.map((item, index) => {
        let currentSize = "";
        if (item.size === -1) {
          currentSize = "S";
        }
        if (item.size === 0) {
          currentSize = "M";
        }
        if (item.size === 1) {
          currentSize = "L";
        }
        this.state.sum += item.sum;
        return (
          <li className="cart-right-item col-xl-12" key={item}>
            <span className={"cart-right-item-header col-xl-4"}>
              {item.name}
            </span>
            <div className={"col-xl-3"}>
              <div className="gr-icon-change">
                <span className="current-value">
                  {item.currentValue > 10
                    ? item.currentValue
                    : `0${item.currentValue}`}
                </span>
              </div>
            </div>
            <span className={"col-xl-2"}>{currentSize}</span>
            <span className={"col-xl-3 sumPrice"}>
              {item.currentValue * item.price} VND{" "}
            </span>
          </li>
        );
      });
    } else {
      return (
        <li className="cart-right-item col-xl-12">
          S??? l?????ng s???n ph???m trong gi??? b???ng v???i s??? l?????ng ti???n trong t??i th???ng
          vi???t c??i web n??y!!!
        </li>
      );
    }
    return result;
  };

  handleInput = (e) => {
    let target = e.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      [name]: value,
    });
  };

  EditUser = async (e) => {
    e.preventDefault();
    await this.props.updateUser({
      name: this.state.name,
      address: this.state.address,
      numberPhone: this.state.numberPhone,
      id: this.state.id,
    });
  };

  render() {
    let { userInfo, address, email, name, numberPhone } = this.state;
    console.log(" this.state.listHistory", this.state.listHistory);
    return (
      <>
        <p className="login-title"> T??I KHO???N</p>
        <div className="login col-xl-12 d-flex">
          <div className="login-left col-xl-4 p-4">
            <p className="login-left-header">Xin ch??o! {name}</p>
            <div className="login-left-header-items">
              <p
                className={
                  this.state.currentActive === 0
                    ? "login-left-header-item active"
                    : "login-left-header-item"
                }
                onClick={() => this.changeCurrentActive(0)}
              >
                <AccountCircleIcon className="icon" />
                Th??ng tin t??i kho???n
              </p>
              <p
                className={
                  this.state.currentActive === 1
                    ? "login-left-header-item active"
                    : "login-left-header-item"
                }
                onClick={() => this.changeCurrentActive(1)}
              >
                <ReceiptIcon className="icon" />
                ????n h??ng hi???n t???i
              </p>
              <p
                className={
                  this.state.currentActive === 2
                    ? "login-left-header-item active"
                    : "login-left-header-item"
                }
                onClick={() => this.changeCurrentActive(2)}
              >
                <HistoryIcon className="icon" />
                L???ch s??? ????n h??ng
              </p>
              <p className="login-left-header-logout" onClick={this.logoutUser}>
                <LogoutIcon className="icon" />
                ????ng xu???t
              </p>
            </div>
          </div>
          <div className="login-right col-xl-8">
            {this.state.currentActive === 0 && (
              <div>
                <p className="login-right-header">Th??ng tin t??i kho???n</p>
                <form className="user-form">
                  <div className="form-group">
                    <label htmlFor="exampleInputPassword1">T??n:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleInputPassword1"
                      value={name}
                      name="name"
                      onChange={this.handleInput}
                      placeholder="Vui l??ng nh???p t??n c???a b???n"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email:</label>
                    <input
                      type="email"
                      className="form-control"
                      id="exampleInputEmail1"
                      value={email}
                      name="email"
                      onChange={this.handleInput}
                      aria-describedby="emailHelp"
                      placeholder="Vui l??ng nh???p nh???p email"
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputPhone">
                      S??? ??i???n tho???i li??n h???:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleInputPhone"
                      name="numberPhone"
                      value={numberPhone}
                      onChange={this.handleInput}
                      aria-describedby="emailHelp"
                      placeholder="Vui l??ng nh???p s??? ??i???n tho???i"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputAddress">?????a ch???:</label>
                    <textarea
                      type="text"
                      className="form-control"
                      id="exampleInputAddress"
                      name="address"
                      value={address}
                      onChange={this.handleInput}
                      aria-describedby="emailHelp"
                      placeholder="Vui l??ng nh???p ?????a ch???"
                    />
                  </div>
                  <div className={"div-btn"}>
                    <button
                      type="submit"
                      className="btn btn-submit"
                      onClick={this.EditUser}
                    >
                      Ch???nh s???a
                    </button>
                  </div>
                </form>
              </div>
            )}
            {this.state.currentActive === 1 && (
              <div>
                <p className="cart-right-text">Th??ng tin ????n h??ng</p>
                <ul className="table cart-right-items">
                  <li className="cart-right-header col-xl-12">
                    <span className="cart-right-header-item col-xl-4">M?? ????n h??ng</span>
                    <span className="cart-right-header-item col-xl-3">
                      S??? l?????ng
                    </span>
                    <span className="cart-right-header-item col-xl-2">
                      Size
                    </span>
                    <span className="cart-right-header-item col-xl-3">
                      T???ng
                    </span>
                  </li>

                  {this.state.listCurrentOrder &&
                    this.state.listCurrentOrder.map((item) => {
                      let currentSum
                      let sum = 0;
                      JSON.parse(item.listProduct).map((item) => {
                        sum += item.currentValue;
                      });
                      return (
                        <li
                          className="cart-right-item col-xl-12"
                          key={item.token}
                        >
                          <span className={"cart-right-item-header col-xl-4"}>
                            {item.token}
                          </span>
                          <span className={"cart-right-item-header col-xl-2"}>
                            {sum}
                          </span>
                          <span className={"col-xl-3"}> {item.createdAt}</span>
                          <span className={"col-xl-3 sumPrice"}>
                            {item.price} VND
                          </span>
                        </li>
                      );
                    })}
                </ul>
              </div>
            )}
            {this.state.currentActive === 2 && (
              <div>
                <p className="cart-right-text">L???ch s??? ????n h??ng</p>
                <ul className="table cart-right-items">
                  <li className="cart-right-header col-xl-12">
                    <span className="cart-right-header-item col-xl-4">
                      M?? ????n h??ng
                    </span>
                    <span className="cart-right-header-item col-xl-2">
                      S??? l?????ng
                    </span>
                    <span className="cart-right-header-item col-xl-3">
                      Ng??y mua
                    </span>
                    <span className="cart-right-header-item col-xl-3">
                      T???ng
                    </span>
                  </li>
                  {this.state.listHistory &&
                    this.state.listHistory.map((item) => {
                      console.log("item", item);
                      let sum = 0;
                      JSON.parse(item.listProduct).map((item) => {
                        sum += item.currentValue;
                      });
                      return (
                        <li
                          className="cart-right-item col-xl-12"
                          key={item.token}
                        >
                          <span className={"cart-right-item-header col-xl-4"}>
                            {item.token}
                          </span>
                          <span className={"cart-right-item-header col-xl-2"}>
                            {sum}
                          </span>

                          <span className={"col-xl-3"}> {item.createdAt}</span>
                          <span className={"col-xl-3 sumPrice"}>
                            {item.price} VND
                          </span>
                        </li>
                      );
                    })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    started: state.app.started,
    userInfo: state.user.userInfo,
    listProduct: state.user.listProductInCart,
    listHistory: state.admin.listHistory,
    listCurrentOrder: state.admin.listCurrentOrder,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getUserCurrent: (id) => {
      dispatch(actions.getUserCurrent(id));
    },
    userLogout: () => {
      dispatch(actions.userLogout());
    },
    updateUser: (user) => {
      dispatch(actions.updateUser(user));
    },
    addProductToCart: (item) => {
      dispatch(actions.addProductToCart(item));
    },
    changeValueProductInCart: (index, number) => {
      dispatch(actions.changeValueProductInCart(index, number));
    },
    historyOrderUser: (id) => {
      dispatch(actions.historyOrderUser(id));
    },
    currentOrderUser: (id) => {
      dispatch(actions.currentOrderUser(id));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(InforProduct);
