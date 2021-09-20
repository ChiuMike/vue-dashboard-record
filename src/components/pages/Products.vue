<template>
  <div>
    <loading :active.sync="isLoading" />
    <h1 class="text-right">
      <button type="button" class="btn btn-secondary" @click="openModal(true)">
        建立新的產品
      </button>
    </h1>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="80">原價</th>
          <th width="80">售價</th>
          <th width="100">是否啟用</th>
          <th width="100">編輯</th>
        </tr> 
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td class="text-right">{{ item.origin_price |currency|dollarsigns }}</td>
          <td class="text-right">{{ item.price |currency|dollarsigns}}</td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <button
              class="btn btn-outline-primary btn-sm"
              @click="openModal(false, item)"
            >
              編輯
            </button>
            <button
              class="btn btn-outline-primary btn-sm"
              @click="cancelProduct(item)"
            >
              刪除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{'disabled':!pagination.has_pre}">
          <a class="page-link" href="#" aria-label="Previous"
           @click.prevent="getProducts(pagination.current_page-1)">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item" v-for="page in pagination.total_pages" :key="page"
         :class="{'active':pagination.current_page===page}">
            <a class="page-link" href="#" @click.prevent="getProducts(page)">{{page}}</a></li>
        <li class="page-item" :class="{'disabled':!pagination.has_next}">
          <a class="page-link" href="#" aria-label="Next"
           @click.prevent="getProducts(pagination.current_page+1)">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增產品</span>
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input
                    type="text"
                    class="form-control"
                    id="image"
                    placeholder="請輸入圖片連結"
                    v-model="tempProducts.imageUrl"
                  />
                </div>
                <div class="form-group">
                  <label for="customFile"
                    >或 上傳圖片
                    <i
                      class="fas fa-spinner fa-pulse"
                      v-if="status.fileUpLoading"
                    ></i>
                  </label>
                  <input
                    type="file"
                    id="customFile"
                    class="form-control"
                    ref="files"
                    @change="upLoadFile"
                  />
                </div>
                <img
                  img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
                  class="img-fluid"
                  :src="tempProducts.imageUrl"
                  alt=""
                />
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    placeholder="請輸入標題"
                    v-model="tempProducts.title"
                  />
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input
                      type="text"
                      class="form-control"
                      id="category"
                      placeholder="請輸入分類"
                      v-model="tempProducts.category"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input
                      type="unit"
                      class="form-control"
                      id="unit"
                      placeholder="請輸入單位"
                      v-model="tempProducts.unit"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="origin_price">原價</label>
                    <input
                      type="number"
                      class="form-control"
                      id="origin_price"
                      placeholder="請輸入原價"
                      v-model="tempProducts.origin_price"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input
                      type="number"
                      class="form-control"
                      id="price"
                      placeholder="請輸入售價"
                      v-model="tempProducts.price"
                    />
                  </div>
                </div>
                <hr />

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="description"
                    placeholder="請輸入產品描述"
                    v-model="tempProducts.description"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="content"
                    placeholder="請輸入產品說明內容"
                    v-model="tempProducts.content"
                  ></textarea>
                </div>
                <div class="form-group">
                  <div class="form-row align-items-center">
                    <div class="col-auto">
                      <label for="num">庫存數量</label>
                      <input
                        type="number"
                        class="form-control mb-4"
                        id="num"
                        placeholder="請輸入庫存"
                        v-model="tempProducts.num"
                      />
                    </div>
                    <div class="col-auto">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="is_enabled"
                          v-model="tempProducts.is_enabled"
                          :true-value="1"
                          :false-value="0"
                        />
                        <label class="form-check-label" for="is_enabled">
                        是否啟用
                        </label>
                      </div>                     
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              data-dismiss="modal"
            >
              取消
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="updateProducts"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";

export default {
  data() {
    return {
      products: [],
      pagination: {},
      tempProducts: {}, //新增商品的欄位內容
      isNew: false,
      isLoading: false,
      status: {
        fileUpLoading: false,
      },
    };
  },
  methods: {
    getProducts(page=1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products?page=${page}`;
      console.log(process.env.APIPATH, process.env.CUSTOMPATH);
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then((response) => {
        console.log("成功getProducts", response.data);
        vm.isLoading = false;
        vm.products = response.data.products;
        vm.pagination = response.data.pagination;
      });
    },
    openModal(isNew, item) {
      const vm = this;
      if (isNew) {
        vm.tempProducts = {};
        vm.isNew = true;
      } else {
        vm.tempProducts = Object.assign({}, item); //將item的值寫到一個空的物件{}
        vm.isNew = false;
      }
      $("#productModal").modal("show");
    },
    updateProducts() {
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product`;
      const vm = this;
      let httpMethod = "post";
      if (!vm.isNew) {
        api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProducts.id}`;
        httpMethod = "put";
      }
      this.$http[httpMethod](api, { data: vm.tempProducts }).then(
        (response) => {
          console.log("Update=", response.data);
          if (response.data.success) {
            //close Modal
            $("#productModal").modal("hide");
            vm.getProducts();
          } else {
            $("#productModal").modal("hide");
            vm.getProducts();
            console.log("失敗");
          }
        }
      );
    },
    cancelProduct(item) {
      const vm = this;
      let api = `
        ${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${item.id}`;
      this.$http.delete(api).then((response) => {
        console.log("Delete=", response.data);
        if (response.data.success) {
          vm.getProducts();
        } else {
          vm.getProducts();
          console.log("刪除失敗");
        }
      });
    },
    upLoadFile() {
      const uploadedFile = this.$refs.files.files[0];
      const vm = this;
      const formData = new FormData();
      formData.append("file-to-upload", uploadedFile);
      console.log("formData", formData);
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`;
      vm.status.fileUpLoading = true;
      this.$http
        .post(url, formData, {
          //傳送「檔案」必須使用表單的形式所以在此把傳送的類型改為 form-data 的格式
          //Content-type 表頭資訊 (header) 是指告訴客戶端實際返回的內容的內容類型
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Upload Success?=", response.data);
          if (response.data.success) {
            //因為沒有預先定義imageUrl所以沒辦法雙向綁定到畫面
            vm.$set(vm.tempProducts, "imageUrl", response.data.imageUrl);
            vm.status.fileUpLoading = false;
          } else {
            vm.status.fileUpLoading = false;
            this.$bus.$emit("message:push", response.data.message, "danger");
          }
        });
    },
  },
  created() {
    this.getProducts();
  },
};
</script>