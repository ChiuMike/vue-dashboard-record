<template>
  <nav class="col-md-2 d-done d-md-block bg-light">
    <div class="sidebar-sticky pt-3">
      <h6 class="sidebar-heading d-flex justify-content-between
       align-items-center px-3 mt-4 mb-1 text-muted">
        <span>管理員</span>
        <a
          class="d-flex align-items-center text-muted"
          href="#"
          aria-label="Add a new report"
        >
          <span data-feather="plus-circle"></span>
        </a>
      </h6>
      <ul class="nav flex-column mb-2">
        <li class="nav-item">
          <router-link class="nav-link font-weight-bold" to="/admin/products">
          <i class="fas fa-boxes"></i>
            產品列表
          </router-link>
          <router-link class="nav-link font-weight-bold" to="/admin/backorder">    
            <span data-feather="file-text"></span>
            <i class="fas fa-list"></i>
            訂單列表
          </router-link>
          <router-link class="nav-link font-weight-bold" to="/admin/cupon">
            <span data-feather="file-text"></span>
            優惠券
          </router-link>
        </li>
      </ul>
      <h6 class="sidebar-heading d-flex justify-content-between
       align-items-center px-3 mt-4 mb-1 text-muted">
        <span>模擬功能</span>
        <a
          class="d-flex align-items-center text-muted"
          href="#"
          aria-label="Add a new report"
        >
          <span data-feather="plus-circle"></span>
        </a>
      </h6>
      <ul class="nav flex-column mb-2">
        <li class="nav-item">
            <router-link class="nav-link font-weight-bold" to="/customerorders">
            <i class="fas fa-shopping-cart"></i>
            模擬訂單
            </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>