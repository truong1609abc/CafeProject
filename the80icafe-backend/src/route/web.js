import express from "express";
import homeController from "./../controllers/homeController";
import userController from "./../controllers/userController";
import adminController from "./../controllers/adminController";



import productController from "../controllers/productController"
let router = express.Router();

let initWebRouter = (app) => {
  router.get("/dangky", homeController.trangphu);
  router.get("/edit", homeController.editUser)
  router.get("/getUser", homeController.getUser);
  router.post("/putUser", homeController.putUser);
  router.post("/createUser", homeController.createUser);


  router.post("/api/login", userController.apiLogin);
  router.post("/api/get-user", userController.getUser);
  router.post("/api/crate-user", userController.createUser);
  router.put("/api/edit-user", userController.editUser);
  router.delete("/api/delete-user", userController.deleteUser);
  router.post("/api/add-product", adminController.addProduct);
  //Thêm ds sản phẩm có trang Cart vào bảng các món hàng được đặt
  router.post("/api/add-list-product", userController.addListProduct);
  router.get('/api/get-full-product', userController.getFullProduct);
  router.get('/api/get-full-booking-product', adminController.getFullBookingProduct);
  router.post("/api/access-order", adminController.accessOrder);

  router.post('/api/verify-booking', userController.verifyToken);
  router.post('/api/get-history-order-user', userController.getHistoryOrderUser);
  router.post('/api/get-current-order-user', userController.getCurrentOrderUser);




  router.post('/api/deleteProduct', productController.deleteProduct);

  router.post('/api/editProduct', productController.editProduct);






  router.get("/", homeController.homePage);


  return app.use("/", router);
};

module.exports = initWebRouter;
