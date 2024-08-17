<template>
  <div>
    <button @click="startBoxSelect"
      style="position: absolute; top: 10px; left: 50px; height: 100px; width: 100px; z-index: 10;">启用拉框查询</button>
    <div id="map"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useMap, map } from './assets/map';

function startBoxSelect() {
  // 切换到绘制矩形模式
  map[0].draw.changeMode('draw_rectangle');
}

useMap();
</script>

<style>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>