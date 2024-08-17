export function addLayer(
    map: mapboxgl.Map,
    layerType: "point" | "line" | "polygon",
    Geojson: any
  ) {
    // // 将 Geojson 字符串转换为 JSON 对象
    // const geojsonData = JSON.parse(Geojson);
  
    // 根据 layerType 动态生成数据源 ID
    const sourceId = `${layerType}-source`;
  
    // 检查数据源是否已经存在，如果存在则不再添加
    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data: Geojson,
      });
    }
  
    let layerConfig: mapboxgl.Layer;
  
    switch (layerType) {
      case "point":
        layerConfig = {
          id: "points",
          type: "circle",
          source: sourceId,
          paint: {
            "circle-radius": 6, // 圆点半径
            "circle-color": "#B42222", // 圆点颜色
          },
        };
        break;
      case "line":
        layerConfig = {
          id: "lines",
          type: "line",
          source: sourceId,
          paint: {
            "line-width": 2, // 线宽
            "line-color": "#007cbf", // 线颜色
          },
        };
        break;
      case "polygon":
        layerConfig = {
          id: "polygons",
          type: "fill",
          source: sourceId,
          paint: {
            "fill-color": "#088", // 填充颜色
            "fill-opacity": 0.8, // 填充透明度
          },
        };
        break;
      default:
        throw new Error("Unsupported layer type");
    }
  
    map.addLayer(layerConfig);
  }