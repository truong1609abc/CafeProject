import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import CommonUtils from "../../../utils/CommonUtils";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import * as services from "../../../services/index";
import { toast } from "react-toastify";
const mdParser = new MarkdownIt();
// Finish!
// noinspection JSCheckFunctionSignatures
class EditProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      contentMarkdown: "",
      contentHTML: "",
      reviewImg: null,
      price: '',
      roleId: '',
      name: '',
      imgBase64: '',
      listProduct: [],
      selectedProduct: '',
      idProduct: '',
      avatar: '',
    };
  }

  componentDidMount() {
    this.props.getAllProduct()
  }
  handleChange = async (selectedOption) => {

    this.setState({ selectedProduct: selectedOption });
    let data = this.props.listProduct;
    let value = data.find((item) => {
      return item.id === selectedOption.value;
    });

    this.setState({
      name: value.name,
      idProduct: value.id,
      price: value.price,
      roleId: value.roleID,
      imgBase64: value.img,
      contentMarkdown: value.descriptionMarkdown,
      contentHTML: value.descriptionHTML
    })

  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentMarkdown: text,
      contentHTML: html,
    });
    console.log(this.state);
  };

  buildDataInputSlect = (inputData) => {
    let result = [];
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        let labelVi = `${item.name}`;
        object.label = labelVi;
        object.value = item.id;
        result.push(object)
      })
    }
    return result;
  }



  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.listProduct !== this.props.listProduct) {
      let dataselect = this.buildDataInputSlect(this.props.listProduct);
      this.setState({
        listProduct: dataselect
      })
    }

  }

  onChangeFormInput = (e) => {
    let target = e.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      [name]: value,
    });
  };

  handleFile = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      this.setState({
        previewIMGURL: objectUrl,
        avatar: base64
      })
    }
  };


  changeSelect = (e) => {
    this.setState({
      roleId: e.target.value,
    });

  };

  deleteProduct = async () => {
    alert('B???n c?? ch???c ch???n mu???n x??a s???n ph???m n??y');
    let res = await services.userServices.deleteProduct({
      id: this.state.idProduct
    });
    if (res && res.data.errCode === 0) {
      toast.success('X??a S???n Ph???m Th??nh C??ng');
      this.setState({
        price: '',
        roleId: '',
        imgBase64: '',
        selectedProduct: '',
      })
    } else {
      toast.warn('X??a S???n Ph???m Th???t B???i')
    }
  }

  editProduct = async () => {
    if (window.confirm('B???n c?? h??y ki???m tra th??ng tin s???n ph???m tr?????c khi s???a') === true) {

      let res = await services.userServices.editProduct({
        id: this.state.idProduct,
        name: this.state.name,
        descriptionHTML: this.state.contentHTML,
        descriptionMarkdown: this.state.contentMarkdown,
        img: this.state.avatar,
        roleID: this.state.roleId,
        price: this.state.price
      })
      if (res && res.data.errCode === 0) {
        toast.success("C??p Nh???t S???n Ph???m Th??nh C??ng");

        this.setState({
          id: "",
          name: "",
          descriptionHTML: "",
          descriptionMarkdown: "",
          img: "",
          roleID: "",
          price: "",
          selectedProduct: ''
        })
      } else {
        toast.warn('C???p Nh???t S???n Ph???m Th???t B???i')
      }
    } else {
      toast.warn('H???y C???p Nh???t S???n Ph???m Th??nh C??ng')
    }




  }
  saveForm = async () => {
    let value = await services.userServices.addProduct({
      name: this.state.name,
      descriptionHTML: this.state.contentHTML,
      descriptionMarkdown: this.state.contentMarkdown,
      img: this.state.avatar,
      roleID: this.state.roleID,
      price: this.state.price,
    });
    if (value.data && value.data.errCode === 0) {
      this.setState({
        isOpen: false,
        contentMarkdown: "",
        contentHTML: "",
        reviewImg: null,
        roleID: "",
        name: "",
        price: "",
        avatar: "",
      });
      toast.success("Th??m s???n ph???m th??nh c??ng!!!");
    } else {
      toast.warn("Th??m s???n ph???m th??nh c??ng!!!");
    }
  };
  render() {
    return (
      <React.Fragment>
        {this.state.isOpen && (
          <Lightbox
            mainSrc={this.state.reviewImg}
            onCloseRequest={() => this.setState({ isOpen: !this.state.isOpen })}
          />
        )}
        <div className="col-xl-8">
          <p className="admin-title mt-4">S???a X??a s???n ph???m</p>
          <div className="admin">
            <div className="admin-right ">
              <p className="admin-right-text">Nh???p v??o ????y: </p>
              <form className="form-group col-xl-12">
                <div className="form-group col-xl-12">
                  <label htmlFor="exampleInputPassword1">T??n s???n ph???m:</label>
                  <Select
                    value={this.state.selectedProduct}
                    onChange={this.handleChange}
                    options={this.state.listProduct}
                  />
                </div>
                <div className="d-flex">
                  <div className="form-group col-xl-6">
                    <label htmlFor="exampleInputPassword1">T??n:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleInputPassword1"
                      name="name"
                      value={this.state.name}
                      onChange={this.onChangeFormInput}
                      placeholder="T??n S???n Ph???m B???n Mu???n S???a"
                      required
                    />
                  </div>
                  <div className="form-group col-xl-6">
                    <label htmlFor="exampleInputPassword1">Gi??:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleInputPassword1"
                      name="price"
                      value={this.state.price}
                      onChange={this.onChangeFormInput}
                      placeholder="Gi??"
                      required
                    />
                  </div>
                </div>
                <div className="d-flex">
                  <div className="form-group col-xl-6">
                    <label htmlFor="exampleInputPassword1">Lo???i:</label>
                    <select
                      class="form-control"
                      id="exampleFormControlSelect1"
                      value={this.state.roleId}
                      onChange={this.changeSelect}
                    >
                      <option value={0}>---Ch???n---</option>
                      <option value={1}>C?? ph??</option>
                      <option value={2}>S???a</option>
                      <option value={3}>Th???c ??n</option>
                    </select>
                  </div>
                  <div className="form-group col-xl-6">
                    <p htmlFor="exampleInputEmail1">Image:</p>
                    <input
                      type="file"
                      name="reviewImg"
                      className="inputImg"
                      onChange={this.handleFile}
                    />
                    <div
                      className="reviewimg"
                      onClick={() => {
                        this.setState({ isOpen: !this.state.isOpen });
                      }}
                    >
                      {this.state.reviewImg !== null ? (
                        <img
                          src={this.state.reviewImg}
                          className="img"
                          alt="reviewImg"
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
                <MdEditor
                  style={{ height: "400px" }}
                  renderHTML={(text) => mdParser.render(text)}
                  onChange={this.handleEditorChange}
                  value={this.state.contentMarkdown}
                />
              </form>
              <div className={"div-btn"}>
                {this.state.selectedProduct ?
                  <>
                    <button
                      type="submit"
                      className="btn btn-submit btn-danger"
                      onClick={this.deleteProduct}
                    >
                      X??a S???n Ph???m
                    </button>
                    <button
                      type="submit"
                      className="btn btn-submit btn-primary"
                      onClick={this.editProduct}
                    >
                      L??u Th??ng Tin
                    </button>
                  </>

                  :
                  ''
                }
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listProduct: state.admin.listProduct
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllProduct: () => {
      dispatch(actions.getAllProduct());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProduct);
