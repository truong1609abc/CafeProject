import bcrypt from "bcryptjs";
import db from "../models/index";
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";
require("dotenv").config();

var salt = bcrypt.genSaltSync(10);

const checkLoginUser = (username, password) => {
  return new Promise(async (resolve, resject) => {
    try {
      let userData = {};
      let isExist = await checkUserName(username);
      // Username da dung
      let user = await checkPassword(username);
      if (isExist) {
        let result = await bcrypt.compareSync(password, user.password);
        // Pass dung
        if (result) {
          userData.errCode = 0;
          userData.errMess = "Bruh qu4";
          delete user.password;
          userData.user = user;
          resolve(userData);
        } else {
          userData.errCode = 2;
          userData.errMess = "Erro password bruh bruh lmao";
          resolve(userData);
        }
        resolve(userData);
      } else {
        userData.errCode = 2;
        userData.errMess = "Erro username bruh bruh lmao";
        resolve(userData);
      }
      resolve(userData);
    } catch (e) {
      resject("loi cmnr");
    }
  });
};
const checkUserName = (username) => {
  return new Promise(async (resolve, resject) => {
    try {
      let isUsername = await db.User.findOne({
        where: { email: username },
        raw: true,
      });
      // User dung
      if (isUsername) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      resject(e);
    }
  });
};
const checkPassword = (username) => {
  return new Promise(async (resolve, resject) => {
    try {
      let user = await db.User.findOne({
        where: { email: username },
        raw: true,
      });
      if (user) {
        resolve(user);
      } else {
        resolve({});
      }
    } catch (e) {
      resject(e);
    }
  });
};

const findUser = (id) => {
  return new Promise(async (resolve, resject) => {
    try {
      let users = "";
      if (id === "ALL") {
        users = await db.User.findAll({
          where: { roleID: 0 },
        });
      }
      if (id && id !== "ALL") {
        users = await db.User.findOne({
          where: { id: id },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(users);
    } catch (e) {
      resject(e);
    }
  });
};

const createUser = (user) => {
  return new Promise(async (resolve, resject) => {
    try {
      let check = await checkUserName(user.email);
      if (!check) {
        var hasPasword = await bcrypt.hashSync(user.password, salt);
        await db.User.create({
          email: user.email,
          password: hasPasword,
          fullname: user.fullname,
          address: user.address,
          roleID: user.roleID,
          numberPhone: user.numberPhone,
        });
        resolve({
          errCode: 0,
          errMess: "Create 1 user suscces",
        });
      } else {
        resolve({
          errCode: 1,
          errMess: "Email already exists",
        });
      }
    } catch (e) {
      resject(e);
    }
  });
};
const editUser = (user) => {
  return new Promise(async (resolve, reject) => {
    let mess = "";
    user.id = +user.id;
    await db.User.findOne({
      where: { id: +user.id },
      raw: false,
    })
      .then(async (value) => {
        if (user.password) {
          let hasPasword = await bcrypt.hashSync(user.password, salt);
          value.password = hasPasword;
        }
        value.address = user.address;
        value.fullname = user.fullname;
        value.numberPhone = user.numberPhone;
        await value.save().then(() => {
          mess = "Update User succes";
          resolve({
            mess,
            errCode: 0,
          });
        });
      })
      .catch(() => {
        mess = "Update dont finded user";
        resolve({
          mess,
          errCode: 1,
        });
      });
  });
};
const deleteUser = (userID) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (userID) {
        await db.User.destroy({
          where: { id: userID },
        });
        resolve({
          errCode: 0,
          errMess: "Delete succses",
        });
      } else {
        resolve({ errCode: 1, mess: "Dont finded userID" });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const getFullProduct = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let products = await db.Product.findAll({
        raw: true,
      });
      if (products) {
        resolve({
          errCode: 0,
          value: products,
        });
      } else {
        resolve({ errCode: 1, errMess: "Kh??ng t??m th???y s???n ph???m n??o" });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const addListProduct = (listInCart) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(listInCart);
      // Ng?????i d??ng c?? tk ?????t h??ng
      // userID, listProduct,price, email, sdt,name
      let token = uuidv4();
      console.log("token", token);
      let result;
      if (listInCart && listInCart.userID) {
        result = `${process.env.URL_REACT}/verify-booking?token=${token}&userID=${listInCart.userID}`;
        await db.Cart.create({
          userID: listInCart.userID,
          name: listInCart.name,
          listProduct: listInCart.listProduct,
          price: listInCart.price,
          numberPhone: listInCart.numberPhone,
          address: listInCart.address,
          email: listInCart.email,
          token: token,
          roleID: 0,
        });

        resolve({
          errCode: 0,
          errMess: "X??c nh???n ???? ?????t h??ng!",
        });
      }
      // Ng?????i d??ng ch??a c?? tk ?????t b???ng x??c nh???n ngo??i form
      //listProduct,price, email, sdt, name

      if (listInCart && !listInCart.userID) {
        result = `${process.env.URL_REACT}/verify-booking?token=${token}&userID=${listInCart.numberPhone}`;
        await db.Cart.create({
          userID: listInCart.numberPhone,
          name: listInCart.name,
          listProduct: listInCart.listProduct,
          price: listInCart.price,
          address: listInCart.address,
          numberPhone: listInCart.numberPhone,
          email: listInCart.email,
          token: token,
          roleID: 0,
        });
        resolve({
          errCode: 0,
          errMess: "X??c nh???n ???? ?????t h??ng!",
        });
      } else {
        resolve({
          errCode: 1,
          errMess: "Thi???u th??ng tin c???n thi???t",
        });
      }
      console.log("listInCart", listInCart);
      await emailService.sendEmail({
        reciverEmail: listInCart.email,
        patientName: listInCart.name,
        redirectLink: result,
        price: listInCart.price,
        listProduct: JSON.parse(listInCart.listProduct),
      });
    } catch (e) {
      reject(e);
    }
  });
};
const verifyBooking = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.userID || !data.token) {
        resolve({
          errCode: 2,
          errMess: "UserID ho???c Token r???ng!",
        });
      } else {
        let appointment = await db.Cart.findOne({
          where: {
            userID: data.userID,
            token: data.token,
            roleID: 0,
          },
          raw: false,
        });
        if (appointment) {
          appointment.roleID = 1;
          await appointment.save();
          resolve({
            errCode: 0,
            errMess: "C???p nh???t tr???ng th??i th??nh c??ng!!!",
          });
        } else {
          resolve({
            errCode: 1,
            errMess: "????n h??ng ???? ???????c x??c nh???n ho???c kh??ng t???n t???i!!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getHistoryOrderUser = (currentUserID) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!currentUserID) {
        resolve({
          errCode: 1,
          errMess: "userID = null",
        });
      } else {
        let listHistory = []
        if (currentUserID) {
          if (currentUserID === "ALL") {
            listHistory = await db.Cart.findAll({
              where: { roleID: 2 },
            });
            console.log('listHistory', listHistory)
          } else {
            listHistory = await db.Cart.findAll({
              where: { roleID: 2, userID: +currentUserID },
            });
          }

        }
        if (listHistory) {
          resolve({
            errCode: 0,
            listHistory,
          });
        } else {
          resolve({
            errCode: 1,
            errMess: "Kh??ng t??m th???y l???ch s??? ????n h??ng",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
const getCurrentOrderUser = (currentUserID) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!currentUserID) {
        resolve({
          errCode: 1,
          errMess: "userID = null",
        });
      } else {
        let listHistory = []
        if (currentUserID) {
          listHistory = await db.Cart.findAll({
            where: { roleID: 1, userID: +currentUserID },
          });

        }
        if (listHistory) {
          resolve({
            errCode: 0,
            listHistory,
          });
        } else {
          resolve({
            errCode: 1,
            errMess: "Kh??ng t??m th???y l???ch s??? ????n h??ng",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  checkLoginUser,
  findUser,
  createUser,
  editUser,
  deleteUser,
  getFullProduct,
  addListProduct,
  verifyBooking,
  getHistoryOrderUser,
  getCurrentOrderUser
};
