<template>
  <div>
    <Navbar/>
    <Alert/>
    <div class="container-fluid">
      <div class="row">
        <Sidebar/>
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <router-view/>
        </main>
      </div>
    </div>
  </div>
</template>
<script>
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Alert from "./AlertMessage";
export default {
    components:{
        Sidebar,
        Navbar,
        Alert,
    },
    created() {
        //將cookie提出往後端做發送
        const myCookie = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        //之後向後端發出的請求會預先加入Authorization這個欄位
        //this.$http==套用axios
        //加入後所有api都會套用這個操作
        this.$http.defaults.headers.common.Authorization = myCookie;
    }
}
</script>