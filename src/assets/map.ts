import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { onMounted } from "vue";
import { addLayer } from "./addLayer";
import mapboxgl from "mapbox-gl";
import PointJson from "../data/point.json";
import LineJson from "../data/line.json";
import PolygonJson from "../data/polygon.json";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYm9ibzlvayIsImEiOiJja3cxZjU1Z2UwMnFnMzBvajh4Y29iZTBiIn0.NcOkYbGRCj-C-gm1my6NZg";
let map: any[] = [];

export function useMap() {
  onMounted(() => {
    const mapInstance = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/standard-satellite",
      center: [102.02766942384574, 35.93929805265708], // 地图中心
      zoom: 12,
    });

    // 添加图层
    mapInstance.on("load", () => {
      // 添加点图层
      addLayer(mapInstance, "point", PointJson);
      // 添加线图层
      addLayer(mapInstance, "line", LineJson);
      // 添加面图层
      addLayer(mapInstance, "polygon", PolygonJson);

      // 添加绘制工具
      const draw = new MapboxDraw({
        displayControlsDefault: false, // 是否显示默认控件
        controls: {
          polygon: true, // 是否显示多边形绘制工具
          trash: true, // 是否显示删除工具
        },
        boxSelect: true, // 是否显示框选工具
      });
      mapInstance.addControl(draw); // 添加绘制工具

      // 监听绘制完成事件
      mapInstance.on("draw.create", (e: any) => {
        const bbox = e.features[0].geometry.coordinates[0];
        const features = mapInstance.queryRenderedFeatures(bbox, {
          layers: ["point"], // 查询的图层 ID
        });

        console.log("Selected features:", features); // 输出查询结果
      });

      map.push({ instance: mapInstance, draw });
    });
  });
}

export { map };
