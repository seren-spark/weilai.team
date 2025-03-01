<script lang="ts" setup>
import HorizontalBar from "./salary/HorizontalBar.vue";
import MultipeBar from "./salary/MultipeBar.vue";
import AreaChart from "./salary/AreaChartBar.vue";
</script>
<template>
  <div class="statistics">
    <div class="statistics-title">历届成员动向</div>
    <div class="statistics-content">
      <HorizontalBar />
      <AreaChart />
      <MultipeBar />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.statistics {
  width: 100%;
  background-color: white;
  margin-top: 20px;

  .statistics-title {
    font-size: 1.2rem;
    letter-spacing: 10px;
    color: #767676;
    margin-bottom: 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 10px;
  }

  .statistics-content {
    padding: 10px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 15px 0;
  }
}

@media screen and (max-width: 992px) {
  .statistics {
    .statistics-content {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr 1fr;
    }
  }
}
</style>
