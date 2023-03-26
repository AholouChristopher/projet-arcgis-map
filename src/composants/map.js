import React, { useRef, useEffect } from "react";
import Map from "@arcgis/core/Map.js";
import Bookmarks from '@arcgis/core/widgets/Bookmarks';
import Expand from '@arcgis/core/widgets/Expand';
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';


    

function MapArcgis(){
      const mapDiv = useRef(null);

      useEffect(() => {
        if (mapDiv.current) {
          /**
           * Initialize application
           */
          const map =  new Map({
            basemap: "topo-vector"
          });   
          const view = new MapView({
            container: mapDiv.current,
            map: map,
            center: [-118.805, 34.027],
            zoom: 1, // scale: 72223.819286,
            constraints: {
                snapToZoom: false
            }
          });
    
          const bookmarks = new Bookmarks({
            view,
            // allows bookmarks to be added, edited, or deleted
            editingEnabled: true
          });
          const bkExpand = new Expand({
            view,
            content: bookmarks,
            expanded: true
          });
          // Add the widget to the top-right corner of the view
          view.ui.add(bkExpand, "top-right");
          
          const graphicLayer = new GraphicsLayer();
          map.add(graphicLayer);

          fetch("https://opensky-network.org/api/states/all").then((res) => {
              return res.json()
        }).then((res1)=> {
              setInterval(function(){
                fetch(`https://opensky-network.org/api/tracks/all?icao24=${res1.states[0][0]}&time=0`)
                  .then((res2) => 
                     res2.json
                  ).then((res3) =>{
                    console.log(res3)
                    let pointArcraft = 0;
                    var planeIconUrl = 'https://ago-item-storage.s3.us-east-1.amazonaws.com/f967b42f2d38463190272fcd34c94261/kisspng-airplane-icon-aircraft-model-5a9929199e7f90.5525375315199869696492.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIBhHh8NBSJGUwJ5ajA7Qml%2BMXYb2cg2lLfd59nmiriFjAiEA90rGn548Ploi0zg1SrMX0%2BrTWm3izYcQph3CmTjzR4cqvAUIr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2MDQ3NTgxMDI2NjUiDGGXd3FaLfPHr0oyOSqQBZNXP7%2FRztJ3umY6bhP6adoV6eiRsqgFFwkF%2FVEl%2BcR7arVcb%2B0rbSPSdihM3atkPV9SZuuCL9XDZZPrG0VoRyaFNto1DH5QyifQWFvyfQpIltGMZy19NyB2L9Qv1JdN8tgzqktl246w3DsrZDr8BIwh4bKVeuht69oHpDugKkCr4OmH9RfYBwv8FgXPX4xZYOJehY3irXjOLJGgmHbBhBJGdADjdiZ%2BZAGZcxN5wDlZKWZ%2BOAvyi39poyX8Ic9Ef5sIiUlxwoQWxsvwZlG1Jhrs0TieUUv2LYCIy74fnn%2F0yP9np61WV%2FpCkW9IKKeRjMInI43OhSp9mY4TIcbBFM8DmzpxWv8qqgrisrAMqLSormm6MbRF9q46Qy2XhKXseo0G5Q4Y67ZIuSIN40ajbkkGE2u1PNX0386z7BgmGniFycnlwL1qXsjdoPYOiStDOrYntUZZW0Ci5JzygSW5%2Fm9xPu%2BbftqmfFTFkWBVoMY75QP0JmDc%2FWbCWErdJTZICA5JCTA%2F%2FvniELSOCzDngA3f8qvaU88yYNE2NUKhvH9%2FQI4JCf87Lngj9GpkLUNrgIZ2DdLFIiim3UouQFpNTU3w6zqMN1uAtebsmAMAcuNr5GZsQ7ANjvNz5UmhNetsU9axhElbd9lKX2Ocmwv3GazBB1%2BmGH42QDd4EBOnw8r4INiI7zxp1AodYm54zTFWRgL%2BAwxnxiUq8NgNhZYM60YoVsyRFWVXL6Oly6xV%2Bws3TTN3ixoSTfcMSw4ufWzX6BMJoxvjY1sx2Pp4iI7dhOtwPOlBmiME1L279qlLQJcdAt2NH3yfXOJILHQHWmGEtctaW29VPII%2FEP5oBxWgZssiZIO2piEI59u%2F5bKBtAsQMOXq7aAGOrEB7316BV7qsceICAWfCxzRxZCSJK28U%2FpLhYXrynABO%2FT1kgNVjP9neThQEtnsedzNvvSna53%2Brs5gVrJXl7VLP56c7OLUMtWcQgk9FHAEy9JQPTlFVBOB6qM6Ff0VxIpQh4EPHojQDRd3GM0kd2L1%2FQKCzqOPp2hUpGkTfw8Iksiyf4srTNmQFM4fIF0eBvcCVYHQ2DApg3ru%2BNhqZPbAacHVpaw5KsRnwvWcnhWFSsFB&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230322T215253Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAYZTTEKKEXEQIJSGJ%2F20230322%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=61015beaad758aae93af75f7fd6cc93a61c94de80a6381d53c8bde81d279f8b9';    
                    while( pointArcraft < res1.path.length) {

                    const point = {
                      type: "point",
                      longitude: res2.path[pointArcraft][2],
                      latitude: res2.path[pointArcraft][1]
                    };                      
                    const markerSymbol = {
                      type: "picture-marker",
                      url: planeIconUrl,
                      width: "32px",
                      height: "32px",
                    };             
                    const pointGraphic = new Graphic({
                      geometry: point,
                      symbol: markerSymbol
                    });
                    
                    graphicLayer.add(pointGraphic);
                    pointArcraft++

                   }
                })
              }, 1000)   
            })
            
          
      
        }
      }, []);
    
      return <div className="mapDiv" ref={mapDiv}></div>;   

}


function WebMap() {
    const mapDiv = useRef();

    useEffect ( _ => {
        import("../composants/Map2").then(
            app => app.initialize(mapDiv.current)
        );
    });

    return (<div className="mapDiv" ref={mapDiv}></div>);  
}

export default MapArcgis;