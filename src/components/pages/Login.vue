<template>
  <div>
    <form class="form-signin" @submit.prevent="signin">
      <center>
          <h1 class="h3 mb-3 fw-normal">請先登入</h1>
      </center>
      <div class="form-floating">
        <input
          type="email"
          class="form-control"
          id="floatingInput"
          v-model="user.username"
          placeholder="name@example.com"
        />
        <label for="floatingInput">請輸入電子郵件</label>
      </div>
      <div class="form-floating">
        <input
          type="password"
          class="form-control"
          id="floatingPassword"
          v-model="user.password"
          placeholder="password@example.com"
        />
        <label for="floatingPassword">請輸入密碼</label>
      </div>
      <div class="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me" /> 記住我
        </label>
      </div>
      <button class="w-100 btn btn-lg btn-secondary" type="submit">
        Sign in
      </button>
      <p class="mt-5 mb-3 text-muted">&copy; 2017–2021</p>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    signin() {
      const api = `${process.env.APIPATH}/admin/signin`;
      const vm=this;
      //post傳送帳密到後端
      vm.$http.post(api,vm.user).then((response) => {
        console.log("有沒有登入成功?=",response.data);
        if(response.data.success) {
            const token=response.data.token;
            const expired=response.data.expired;
            console.log("token,expired=",token,expired);
            document.cookie=`hexToken=${token}; expires=${new Date(expired)};`; //將cookie存入前端
            vm.$router.push('/admin/products')
        }
      });
    },
  },
};
</script>
<style scoped>
html,
body {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}

.form-signin .checkbox {
  font-weight: 400;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>