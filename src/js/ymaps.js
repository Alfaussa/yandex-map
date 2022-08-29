import { map } from "jquery";

function mapInit() {
    ymaps.ready(() => {
        let city = new ymaps.Map('map', {
            center: [55.76, 37.65],
            zoom: 12,
            controls: ['zoomControl'],
            behavoirs:['drag']
        });
        var placemark = new ymaps.Placemark([55.76, 37.30], {
        
    });
})
map.geoObjects.add(placemark);

}
export {
    mapInit
}