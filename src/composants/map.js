import React, { useRef, useEffect } from "react";
import Map from "@arcgis/core/Map.js";
import Bookmarks from '@arcgis/core/widgets/Bookmarks';
import Expand from '@arcgis/core/widgets/Expand';
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';


    

function MapArcgis(){
      const mapDiv = useRef(null);
      const openSkyUrl = "https://opensky-network.org/api/states/all"
      const validityPeriod = 60;
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

          let dataAvions;
          fetch(openSkyUrl).then((res) => {
              return res.json()
          }).then((data) => {
            dataAvions = data.states
            const filteredData = dataAvions.states.filter(state => !state[8] && state[3] !== null && (Date.now() / 1000 - state[4]) < validityPeriod); // a tester je sais pas si ça marche 
            console.log(filteredData)
            /*
            // Give a tab of aicraft now 
            setInterval(function(){
              fetch(`https://opensky-network.org/api/tracks/all?icao24=${dataAvions[0][0]}&time=0`)
                .then((res1) => 
                  res1.json() )
                  .then((res2) => {
                  let dataJsonAvion = res2
                  let pointArcraft = 0;
                  var planeIconUrl = 'https://ago-item-storage.s3.us-east-1.amazonaws.com/f967b42f2d38463190272fcd34c94261/kisspng-airplane-icon-aircraft-model-5a9929199e7f90.5525375315199869696492.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEQaCXVzLWVhc3QtMSJHMEUCIQD3ZT4AYIYi428SxKr3j4cJXB1e%2B1oj2nAskLzbYSxKCwIgeKgsLLgzv0ktBphu3sQP%2BBxk4EobM3wYL2MIMM71cf8qtAUIHRAAGgw2MDQ3NTgxMDI2NjUiDKNpl5gs3CwcOBi6QyqRBfXGmor2WEO047CrYCYoKNMQ9tWaZMneSPW%2B797Lw%2BjYG%2FRJzfvRt1tKxJw%2ByoZ3vEHbsyLmeRnX5qlPRnP7pIfZeNLbtUCN%2Fwg8ChaAKmdRdBjHtRWjqXwh%2FPXnufQzbCJ%2FKmvoTBDrCNIAE1BsWb34xtYor%2BZaTFLUm%2FQjMXh50p7X4KTSKPsn7cA15ygtOAcQ9G2LeRVy4ChEd%2ByLMlHNW%2BZvdxmT2020aDN5TGY6QMIjcalr3mf7JunK7opoFOlQ%2FxlPXnvc6gkIAYX%2B5iEd38yb6lPUiPRrRV2EvB9o%2Fuital%2FEbYVFJyq%2B9JjxGRSW3VpGFRs9p1AfRvIAaOBNbxgs323wEndNDTvl89pyahO%2BPkRPUeb73seLqN6tBPbGATSWzrTdr6YMQ2wKHYqThGP%2FuTyA%2FnKrkLVzqRAoOWULS6AZ8ybWxkZNqKql112XG55lBpPBkv6H7OVPIgfJapl2DKE%2FdPqqr2hUxY7woQ9UFN0WfHthifopUtXkSJLST9UOn65p4ITEvNvvKaxURHLiTlQ676AssWAHLJ0EudJlfqV0xcybOGZVI1bUyheBHoKEY0Emn5UfRuegDDfg7QTQqfmPxb87foFVNUAjQVJScFDB6yZyo7Mb6O6DJlNallFp4XWgjf2QwegOJJcmEbnilslLS39R2RMVwhiK9ZJ0nfmaXLeolLy%2F1r0yU14dMp6piDm89l%2F%2FKs3LxT4L1RbM41EigKT9XFzOhdRoHasIMHavNfZM8xn491qNb4dNyIpFOhylt0xT1XUwn5WaeGZxbOTRgs%2BqUz6mjzVWwVWzQNHnmxnUoJTM3q3enyOXo8TZVMLfbqTPFECJ2lF7e%2Fq5xsSW2yz954ztq9LE6TDkt4KhBjqxAeD4PSwFV5ICi%2B1dojkZ6H7x%2FLDm%2BwB3vzHr3DWKloPU%2FV8wSgCqPtSdm3jA4JCq3KDVKLqvAIpTXFN7Mir1Lb5h37bwfk2%2BAreph6OHEEY%2BTxTj9L6Ep%2FDh5oe0%2BgH0dsLUFHepjr43yZciZlq%2FykcQ1ch0RLFqmvYzyE2Ftm3I2y%2B9s9pEkW1Mbm6ZgLhF42Y0ujJWgonZvj5vEIKoS3JWFFkeqR4xMlgD34wED7TnOw%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230326T201544Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAYZTTEKKEV2G7VNZ3%2F20230326%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=da1c93f14dd9304889ef7e0a9a130af8db689747d57718636c64dfef599fcce3';    
                  console.log(dataJsonAvion.path)            

                  while( pointArcraft < dataJsonAvion.path.length) {

                    const point = {
                      type: "point",
                      longitude: dataJsonAvion.path[pointArcraft][2],
                      latitude: dataJsonAvion.path[pointArcraft][1]
                    };                      
                    const markerSymbol = {
                      type: "simple-marker",
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
            }, 10000) */
          })
        
        /*.then((res1)=> {
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
            })*/
            
          
      
        }
      }, []);
    
      return <div className="mapDiv" ref={mapDiv}></div>;   

}




export default MapArcgis;