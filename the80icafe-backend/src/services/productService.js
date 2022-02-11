import db from "../models/index";

require('dotenv').config()
const deleteProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data.id) {
                await db.Product.destroy({
                    where: { id: data.id },
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
    })
};

let editProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.id || !data.name || !data.descriptionHTML || !data.descriptionMarkdown ||
                !data.roleID || !data.price) {
                resolve({
                    errCode: 1,
                    errMess: "1 trong 7 trường rỗng"
                })
            } else {
                let product = await db.Product.findOne({
                    where: { id: data.id },
                    raw: false
                })

                if (product) {
                    product.name = data.name;
                    product.descriptionHTML = data.descriptionHTML;
                    product.descriptionMarkdown = data.descriptionMarkdown;
                    product.roleID = data.roleID;
                    product.price = data.price;
                    product.img = data.img;
                    await product.save();
                    resolve({
                        errCode: 0,
                        errMessage: `Cập Nhật Thành Công`
                    })
                }


            }
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = {
    deleteProduct: deleteProduct,
    editProduct: editProduct
}