import React, { useRef, useEffect } from "react";

function WebMap() {
    const mapDiv = useRef();

    useEffect ( _ => {
        import("./ConfigWebmap").then(
            app => app.initialize(mapDiv.current)
        );
    });

    return (<div className="mapDiv" ref={mapDiv}></div>);  
}