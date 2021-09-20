<template>
  <div>
    <div class="text-right">
      <br/>
      <button class="btn btn-primary" @click="openModal(true)">
        建立新的優惠卷
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="180">名稱</th>
          <th width="180">折扣百分比</th>
          <th width="180">優惠代碼</th>
          <th width="180">到期日</th>
          <th width="180">是否啟用</th>
          <th width="180">編輯</th>
          <th width="180">刪除</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in coupons" :key="item.id">
          <td width="180">{{ item.title }}</td>
          <td class="text-left" width="180">{{ item.percent }}</td>
          <td class="text-left" width="180">{{ item.code }}</td>
          <td class="text-left" width="180">{{ item.due_date }}</td>
          <td>
            <span class="text-success" v-if="item.is_enabled" width="180"
              >啟用</span
            >
            <span v-else>未啟用</span>
          </td>
          <td>
            <button
              class="btn btn-outline-primary btn-sm"
              width="180"
              @click="openModal(false, item)"
            >
              編輯
            </button>
          </td>
          <td>
            <button
              class="btn btn-outline-primary btn-sm"
              width="180"
              @click="openDelModal(item)"
            >
              刪除
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 新增優惠卷Modal -->
    <div
      class="modal fade"
      id="couponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增優惠卷</span>
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
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">折價券名稱</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    v-model="tempCoupons.title"
                    placeholder="折價卷名稱"
                  />
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">折扣百分比</label>
                    <input
                      type="number"
                      class="form-control"
                      id="percent"
                      v-model="tempCoupons.percent"
                      placeholder="請輸入折扣百分比"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">優惠代碼</label>
                    <input
                      type="text"
                      class="form-control"
                      id="code"
                      v-model="tempCoupons.code"
                      placeholder="請輸入優惠卷代碼"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">到期日</label>
                    <input
                      type="date"
                      class="form-control"
                      id="due_date"
                      v-model="tempCoupons.due_date"
                    />
                  </div>
                </div>

                <hr />

                <div class="form-group">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="tempCoupons.is_enabled"
                      :true-value="1"
                      :false-value="0"
                      id="is_enabled"
                    />
                    <label class="form-check-label" for="is_enabled"
                      >是否啟用</label
                    >
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

            <button type="button" class="btn btn-primary" @click="updateCoupon">
              確認
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 刪除優惠卷Modal -->
    <div
      class="modal fade"
      id="delCouponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除優惠卷</span>
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
            <strong class="text-danger">{{ tempCoupons.title }}</strong>
            商品(刪除後將無法恢復)。
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
              @click="removeCoupon(tempCoupons.id)"
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
  name: "Coupon",
  data() {
    return {
      coupons: [],
      tempCoupons: {
        title: "",
        is_enabled: 0,
        percent: "",
        due_date: 0,
        code: "",
      },
      isNew: false,
      isLoading: false,
    };
  },
  methods: {
    getCoupons() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons`;
      const vm = this; //確保取得資料之後可以再存回vm裡面
      console.log(process.env.APIPATH, process.env.CUSTOMPATH);
      vm.isLoading = true;
      this.$http.get(api).then((response) => {
        console.log(response.data);
        vm.isLoading = false;
        vm.coupons = response.data.coupons;
      });
    },
    openModal(isNew, item) {
      if (isNew) {
        this.tempCoupons = {};
        this.isNew = true;
      } else {
        this.tempCoupons = Object.assign({}, item);
        console.log(this.tempCoupons);
        this.isNew = false;
      }
      $("#couponsModal").modal("show");
      $("#couponModal").modal("show");
    },
    updateCoupon() {
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
      const vm = this;
      let httpMethod = "post";
      if (!vm.isNew) {
        api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${this.tempCoupons.id}`;
        httpMethod = "put";
      }
      this.$http[httpMethod](api, { data: vm.tempCoupons }).then((response) => {
        console.log(response.data);
        if (response.data.success) {
          $("#couponModal").modal("hide");
          vm.getCoupons();
        } else {
          $("#couponModal").modal("hide");
          vm.getCoupons();
          console.log("新增失敗");
        }
      });
    },
    openDelModal(item) {
      this.tempCoupons = Object.assign({}, item);
      $("#delCouponModal").modal("show");
    },
    removeCoupon(id) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${id}`;
      const vm = this; //確保取得資料之後可以再存回vm裡面
      vm.isLoading = true;
      console.log(process.env.APIPATH, process.env.CUSTOMPATH);
      this.$http.delete(api).then((response) => {
        console.log(response.data);
        vm.isLoading = false;
        $("#delCouponModal").modal("hide");
        vm.getCoupons();
      });
    },
  },
  created() {
    this.getCoupons();
  },
};
</script>