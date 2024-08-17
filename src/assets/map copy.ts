import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { onMounted } from "vue";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";

// 定义大地2000坐标系
import * as proj4 from "proj4";
// import * as proj4leaflet from 'proj4leaflet';
// 定义 CGCS2000 坐标系的投影
// proj4.defs('EPSG:4490', '+proj=longlat +datum=WGS84 +no_defs');
// const crs = new proj4leaflet.CRS('EPSG:4490', proj4('EPSG:4490'));
// 定义大地2000坐标系
// 定义 CGCS2000 坐标系的投影
// import '@cgcs2000/mapbox-gl/dist/mapbox-gl.css';
// import mapboxgl from "@cgcs2000/mapbox-gl";
// // 修改为EPSG:4490坐标系
// map.setProjection({
//   name: 'EPSG:4490',
//   parallels: [30, 660],
// });

mapboxgl.accessToken =
  "pk.eyJ1IjoiYm9ibzlvayIsImEiOiJja3cxZjU1Z2UwMnFnMzBvajh4Y29iZTBiIn0.NcOkYbGRCj-C-gm1my6NZg";
let map: any;
export function useMap() {
  onMounted(() => {
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-zh-v1",
      center: [102.02766942384574, 35.93929805265708], // 地图中心
      zoom: 12,
      preserveDrawingBuffer: true, // 保存绘图缓冲区
    });
    
    // // CGCS2000坐标
    // const cgcs2000Coords = [102.03248847785397, -51.44141462673369];

    // // 将CGCS2000坐标转换为WGS84坐标
    // const wgs84Coords = proj4("EPSG:4490", "EPSG:4326", cgcs2000Coords);

    // console.log("wgs84Coords", wgs84Coords); // 输出转换后的WGS84坐标

    // // 打印底图的坐标系
    // // window.console.log('chk', map.getProjection());

    // 添加控制组件
    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: true }),
      "top-left"
    );
    // 添加地理定位控件
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }),
      "top-left"
    );
    // // 添加自定义定位控件到地图
    // map.addControl(new CoordinateInputControl(), 'top-left');
    // 添加全屏控件
    map.addControl(new mapboxgl.FullscreenControl(), "top-left");

    // 添加比例尺控件
    map.addControl(
      new mapboxgl.ScaleControl({ maxWidth: 80, unit: "metric" }),
      "bottom-right"
    );

    // 面积量算控件
    const measureControl = new MapboxDraw({
      displayControlsDefault: false,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
        polygon: true, // 面积
        line_string: true, // 长度
        trash: true, // 删除按钮
      },
      // Set mapbox-gl-draw to draw by default.
      // The user does not have to click the polygon control button first.
      defaultMode: "simple_select", // 默认模式
    });
    map.addControl(measureControl, "top-left");

    // 查看当前地图的坐标系
    // window.console.log('chk', map.getProjection());
    // 面积
    function updateArea() {
      const data = measureControl.getAll();
      if (data.features.length > 0) {
        const area = turf.area(data);
        const roundedArea = Math.round(area * 100) / 100;
        alert(`面积: ${roundedArea} 平方米`);
      }
    }

    // 长度
    function updateLength() {
      const data = measureControl.getAll();
      if (data.features.length > 0) {
        const line = data.features[0];
        const length = turf.length(line, { units: "kilometers" });
        const roundedLength = Math.round(length * 100) / 100;
        alert(`长度: ${roundedLength} 公里`);
      }
    }

    map.on("draw.create", (e: any) => {
      const featureType = e.features[0].geometry.type;
      if (featureType === "Polygon") {
        updateArea();
      } else if (featureType === "LineString") {
        updateLength();
      }
    });

    map.on("draw.update", (e: any) => {
      const featureType = e.features[0].geometry.type;
      if (featureType === "Polygon") {
        updateArea();
      } else if (featureType === "LineString") {
        updateLength();
      }
    });

    map.on("draw.delete", () => {
      alert("已删除");
    });

    map.on("click", (e: any) => {
      window.console.log(e.lngLat);
    });
    // 地图点击事件
    map.on("click", "points", (e: any) => {
      window.console.log(e.features);
    });

    // 鼠标移入移出事件
    map.on("mouseenter", "points", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "points", () => {
      map.getCanvas().style.cursor = "";
    });
  });
}
export { map };
