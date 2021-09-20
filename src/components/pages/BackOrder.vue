<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <h3 class="my-4">訂單管理</h3>
    <!-- 訂單列表 -->
    <table class="table mt-4">
      <thead>
        <tr>
          <td>序號</td>
          <td>訂單日期</td>
          <td>訂購人</td>
          <td>訂單內容</td>
          <td>訂單金額</td>
          <td>是否付款</td>
          <td>編輯</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in orders" :key="item.id">
          <td>{{ item.num }}</td>
          <td>{{ item.create_at }}</td>
          <td>
            <ul class="list-unstyled">
              <li>姓名：{{ item.user.name }}</li>
              <li>電話：{{ item.user.tel }}</li>
              <li>信箱：{{ item.user.email }}</li>
              <li>地址：{{ item.user.address }}</li>
            </ul>
          </td>
          <td>
            <ul class="list-unstyled">
              <li v-for="(product, i) in item.products" :key="i">
                {{ product.product.title }} 數量：{{ product.qty }}
                {{ product.product.unit }}
              </li>
            </ul>
          </td>
          <td>{{ item.total | currency }}</td>
          <td v-if="item.is_paid" class="text-success text-center">已付款</td>
          <td v-else class="text-danger text-center">未付款</td>
          <td class="text-center">
            <button
              class="btn btn-outline-primary btn-sm"
              @click="openEditOrderModal(item)"
            >
              編輯
            </button>

            <button
              class="btn btn-outline-primary btn-sm"
              @click="openDelOrderModal(item)"
            >
              刪除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 編輯訂單Modal -->
    <div
      class="modal fade"
      id="editOrderModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>修改訂單</span>
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
              <div class="col-sm-12">
                <div class="form-group">
                  <h6>訂購人資訊</h6>
                  <label for="title">訂購人姓名</label>
                  <input
                    type="text"
                    v-model="tempOrder.user.name"
                    class="form-control"
                    id="title"
                  />
                  <label for="title">聯絡電話</label>
                  <input
                    type="text"
                    v-model="tempOrder.user.tel"
                    class="form-control"
                    id="title"
                  />
                  <label for="title">電子信箱</label>
                  <input
                    type="text"
                    v-model="tempOrder.user.email"
                    class="form-control"
                    id="title"
                  />
                  <label for="title">收件地址</label>
                  <input
                    type="text"
                    v-model="tempOrder.user.address"
                    class="form-control"
                    id="title"
                  />
                </div>
                <hr />
                <div class="form-group">
                  <h6>結帳資訊</h6>
                  <label for="title">訂單金額</label>
                  <input
                    type="text"
                    v-model="tempOrder.total"
                    class="form-control"
                    id="order-total"
                  />

                  <label for="message">訂單備註</label>
                  <textarea
                    v-model="tempOrder.message"
                    cols="5"
                    rows="3"
                    class="form-control"
                    id="message"
                  ></textarea>
                  <label class="form-check-label" for="is_paid">是否付款</label>
                  <input
                    type="checkbox"
                    v-model="tempOrder.is_paid"
                    class="form-check-input"
                    id="is_paid"
                    :true-value="1"
                    :false-value="0"
                  />
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
            <button type="button" class="btn btn-primary" @click="updateOrder">
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 刪除訂單Modal -->
    <div
      class="modal fade"
      id="delOrderModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除訂單</span>
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
            是否刪除
            <strong class="text-danger"
              >序號 {{ tempOrder.num }}，購買人{{
                tempOrder.user.name
              }}的</strong
            >
            訂單(刪除後將無法恢復)。
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
              class="btn btn-danger"
              @click="removeOrder(tempOrder.id)"
            >
              確認刪除
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
  name: "BackOrder",
  data() {
    return {
      isLoading: false,
      orders: [
        {
          create_at: "", //訂單建立日期
          is_paid: false, //是否付款
          message: "", //訂單備註
          paid_date: "", //付款日期
          payment_method: "credit_card",
          products: [], //購買列表
          total: "", //訂單金額
          num: "", //購買數量
          user: {
            address: "", //地址
            email: "", //信箱
            name: "", //姓名
            tel: "", //電話
          },
        },
      ],
      tempOrder: {
        user: {
          address: "",
          email: "",
          name: "",
          tel: "",
        },
      },
    };
  },
  methods: {
    getOrders(page = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/orders?page=${page}`;
      const vm = this;
      vm.isLoading = true;
      console.log(process.env.APIPATH, process.env.CUSTOMPATH);
      this.$http.get(api).then((response) => {
        console.log("取得客戶訂單=", response.data);
        vm.isLoading = false;
        vm.orders = response.data.orders;
      });
    },
    updateOrder() {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/order/${vm.tempOrder.id}`; //路徑
      this.$http.put(url, { data: vm.tempOrder }).then(response => {
        if (response.data.success) {
          vm.getOrders();
          $("#editOrderModal").modal("hide");
        } else {
          console.log(response);
        }
      });
    },
    openEditOrderModal(item) {
      this.tempOrder = item;
      $("#editOrderModal").modal("show");
    },
    openDelOrderModal(item) {
      this.tempOrder = item;
      console.log("temp", this.tempOrder);
      $("#delOrderModal").modal("show");
    },
  },
  created() {
    this.getOrders();
  },
};
</script>