import productService from "./../services/productService"

let deleteProduct = async (req, res) => {
    try {
        let data = await productService.deleteProduct(req.body)
        return res.status(200).json(data)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMess: 'SERVER sap nguon'
        })
    }
};


let editProduct = async (req, res) => {
    try {
        let data = await productService.editProduct(req.body);
        return res.status(200).json(data)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMess: 'SERVER sap nguon'
        })
    }
};
module.exports = {
    deleteProduct: deleteProduct,
    editProduct: editProduct
}