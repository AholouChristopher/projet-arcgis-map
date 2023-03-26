import WebMap from "@arcgis/core/WebMap";
import Bookmarks from '@arcgis/core/widgets/Bookmarks';
import Expand from '@arcgis/core/widgets/Expand';
import MapView from "@arcgis/core/views/MapView";

const noop = () => {};

export const webMap =  new WebMap({
    portalItem: {
        id : "4f2e99ba65e34bb8af49733d9778fb8e"
    }
  });


export const view = new MapView({
    map: webMap
  });

export const bookmarks = new Bookmarks({
    view,
    // allows bookmarks to be added, edited, or deleted
    editingEnabled: true
  });
export const bkExpand = new Expand({
    view,
    content: bookmarks,
    expanded: true
  });
view.ui.add(bkExpand, "top-right");

export const initialize = (container) => {
    view.container = container;
    view
        .when()
        .then(_ => {
            console.log("Map and view are ready");
        })
        .catch(noop);
    return () => {
         view.container = null;
    }
  };