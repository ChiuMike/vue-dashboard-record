<template>
  <div>
    <loading :active.sync="isLoading" />
    <Alert />
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <div
            style="
              height: 150px;
              background-size: cover;
              background-position: center;
            "
            :style="{ backgroundImage: `url(${item.imageUrl})` }"
          ></div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{
              item.category
            }}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{ item.title }}</a>
            </h5>
            <p class="card-text">{{ item.content }}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <!-- <div class="h5">2,800 元</div> -->
              <del class="h6">原價 {{ item.origin_price | currency }} 元</del>
              <div class="h5">現在只要 {{ item.price | currency }} 元</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click="getMore(item.id)"
            >
              <i
                class="fas fa-spinner fa-spin"
                v-if="status.loadingItem === item.id"
              ></i>
              查看更多
            </button>
            <button
              type="button"
              class="btn btn-outline-danger btn-sm ml-auto"
              @click="addToCart(item.id)"
            >
              <i
                class="fas fa-spinner fa-spin"
                v-if="status.loadingItem === item.id"
              ></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <table class="table">
      <thead>
        <th></th>
        <th>品名</th>
        <th>數量</th>
        <th>單價</th>
      </thead>
      <tbody>
        <tr v-for="item in cart.carts" :key="item.id">
          <td class="align-middle">
            <button
              type="button"
              class="btn btn-outline-danger btn-sm"
              @click="cancelCart(item.id)"
            >
              <i class="far fa-trash-alt"></i>
            </button>
          </td>
          <td class="align-middle">
            {{ item.product.title }}
            <!-- <div class="text-success" v-if="item.coupon">
          已套用優惠券
        </div> -->
          </td>
          <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
          <td class="align-middle text-right">{{ item.final_total }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" class="text-right">總計</td>
          <td class="text-right">{{ cart.total }}</td>
        </tr>
        <tr v-if="cart.final_total != cart.total">
          <td colspan="3" class="text-right text-success">折扣價</td>
          <td class="text-right text-success">{{ cart.final_total }}</td>
        </tr>
      </tfoot>
    </table>
    <div class="input-group mb-3 input-group-sm">
      <input
        type="text"
        class="form-control"
        placeholder="請輸入優惠碼"
        v-model="coupon_code"
      />
      <div class="input-group-append">
        <button
          class="btn btn-outline-secondary"
          type="button"
          @click="addCouponCode"
        >
          套用優惠碼
        </button>
      </div>
    </div>
    <validation-observer v-slot="{ handleSubmit }">
      <div class="my-5 row justify-content-center">
        <form class="col-md-6" @submit.prevent="handleSubmit(createOrder)">
          <div class="form-group">
            <label for="useremail">Email</label>
            <validation-provider rules="email" v-slot="{ errors }">
              <input
                type="email"
                class="form-control"
                name="email"
                id="useremail"
                v-model="form.user.email"
                placeholder="請輸入 Email"
                required
              />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </div>
          <div class="form-group">
            <label for="username">收件人姓名</label>
            <validation-provider rules="required" v-slot="{ errors }">
              <input
                type="text"
                class="form-control"
                name="name"
                id="username"
                v-model="form.user.name"
                placeholder="輸入姓名"
              />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </div>
          <div class="form-group">
            <label for="usertel">收件人手機</label>
            <validation-provider rules="phoneNum" v-slot="{ errors }">
              <input
                type="tel"
                class="form-control"
                id="usertel"
                v-model="form.user.tel"
                placeholder="請輸入電話"
              />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </div>

          <div class="form-group">
            <label for="useraddress">收件人地址</label>
            <validation-provider rules="required" v-slot="{ errors }">
              <input
                type="text"
                class="form-control"
                name="address"
                id="useraddress"
                v-model="form.user.address"
                placeholder="請輸入地址"
              />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </div>

          <div class="form-group">
            <label for="comment">留言</label>
            <textarea
              name=""
              id="comment"
              class="form-control"
              cols="30"
              rows="10"
              v-model="form.message"
            ></textarea>
          </div>
          <div class="text-right">
            <button class="btn btn-danger">送出訂單</button>
          </div>
          -->
        </form>
      </div>
    </validation-observer>
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              {{ product.title }}
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
            <img :src="product.imageUrl" class="img-fluid" alt="" />
            <blockquote>
              <p class="mb-0">{{ product.content }}</p>
              <footer class="blockquote-footer text-right">
                {{ product.description }}
              </footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!product.price">
                {{ product.origin_price }}
              </div>
              <div class="h6" v-if="product.price">
                原價{{ product.origin_price }}
              </div>
              <div class="h4" v-if="product.price">
                現在只要{{ product.price }}
              </div>
            </div>
            <select name="" class="form-control mt-3" v-model="product.num">
              <option :value="num" v-for="num in 10" :key="num">
                選購 {{ num }} {{ product.unit }}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計<strong>{{ product.num * product.price }}</strong
              >元
            </div>
            <button
              type="button"
              class="btn btn-primary"
              @click="addToCart(product.id, product.num)"
            >
              加到購物車
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
      product: {},
      status: {
        loadingItem: "",
      },
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        messages: "",
      },
      cart: [],
      isLoading: false,
      coupon_code: "",
    };
  },
  methods: {
    getGoods() {
      const vm = this;
      vm.isLoading = true;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products?`;
      this.$http.get(api).then((response) => {
        vm.isLoading = false;
        console.log("購物車api=", response.data);
        if (response.data.success) {
          response.data.products.forEach(function (item) {
            vm.products.push(item);
          });
          vm.isLoading = false;
        }
      });
    },
    getMore(id) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`;
      vm.status.loadingItem = id;
      this.$http.get(api).then((response) => {
        if (response.data.success) {
          vm.product = response.data.product;
          $("#productModal").modal("show");
          vm.status.loadingItem = "";
        }
      });
    },
    addToCart(id, qty = 1) {
      //如果忘了傳qty參數那就會預設為1
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      vm.status.loadingItem = id;
      const cart = {
        product_id: id,
        qty,
      };
      this.$http.post(api, { data: cart }).then((response) => {
        console.log("add=", response.data);
        vm.status.loadingItem = "";
        if (response.data.success) {
          vm.getCart();
          $("#productModal").modal("hide");
        }
      });
    },
    getCart() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      vm.isLoading = true;
      this.$http.get(api).then((response) => {
        vm.isLoading = false;
        vm.cart = response.data.data;
        console.log("vm", vm.cart);
      });
    },
    cancelCart(id) {
      const vm = this;
      vm.isLoading = true;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
      this.$http.delete(api).then((response) => {
        vm.getCart();
        vm.isLoading = false;
      });
    },
    addCouponCode() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
      vm.isLoading = true;
      const coupon = {
        code: vm.coupon_code,
      };
      this.$http.post(api, { data: coupon }).then((response) => {
        if (response.data.success) {
          vm.getCart();
          vm.isLoading = false;
        } else {
          this.$bus.$emit("message:push", response.data.message, "danger");
          vm.isLoading = false;
        }
      });
    },
    createOrder() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`;
      vm.isLoading = true;
      const order = vm.form;
      this.$http.post(api, { data: order }).then((response) => {
        console.log("訂單已建立", response.data);
        if(response.data.success){
            vm.$router.push(`/customercheckout/${response.data.orderId}`)
        }
        vm.isLoading = false;
      });
    },
  },
  created() {
    this.getGoods();
    this.getCart();
  },
};
</script>