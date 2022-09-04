const { map } = require("jquery");
import {form} from '../templates/form'
export {mapInit}
document.addEventListener('DOMContentLoaded', () => ymaps.ready(mapInit));

let clusterer;

function mapInit() {
    ymaps.ready(() => {
        let city = new ymaps.Map('map', {
            center: [55.76, 37.65],
            zoom: 12,
            controls: ['zoomControl'],
            behavoirs:['drag']
        });
      
    city.events.add('click', function (e) {
        var coords = e.get('coords');
        
        openBalloon(city, coords, []);

    })
    clusterer = new ymaps.Clusterer({clusterDisableClickZoom:true})
    clusterer.options.set('hasBalloon', false);
    renderGeoObjects(city);

    clusterer.events.add('click', function(e){
        let geoObjectsInClaster = e.get('target').getGeoObjects()
        openBalloon(city, e.get('coords'), geoObjectsInClaster)
    })

})
}

function getReviewsFromLS(){
    const reviews = localStorage.reviews
    return JSON.parse(reviews || '[]')
}

function getReviewList(currentGeoObjects){
    let reviewListHTML =''

    for(const review of getReviewsFromLS()){
        if(currentGeoObjects.some(geoObject => JSON.stringify(geoObject.geometry._coordinates) === JSON.stringify(review.coords))){
            reviewListHTML += `
            <div class='review'>
            <span class='author-name'> ${review.author }  </span><span class='place-name'>${review.place}</span>
            <div class='place-name'>${review.reviewText}</div>
            </div>    
            `
    }
}
return reviewListHTML;
}

function renderGeoObjects(map) {
    const geoObjects = [];

    for(const review of getReviewsFromLS()){
        const placemark = new ymaps.Placemark(review.coords)
        placemark.events.add('click', e => {
            e.stopPropagation()
            openBalloon(map, e.get('coords'), [e.get('target')] )
        })
        geoObjects.push(placemark)
    }
    clusterer.removeAll()
    map.geoObjects.remove(clusterer)
    clusterer.add(geoObjects)
    map.geoObjects.add(clusterer)
}

async function openBalloon(map, coords, currentGeoObjects){
    await map.balloon.open(coords, {
                        
                            content:
                                `<div class='content'><div class='reviews'>${getReviewList(currentGeoObjects)}</div></div> 
                                <div class='content'><h3>Отзыв:</h3>` + form
                                
                        });
document.querySelector('#add-form').addEventListener('submit', function(e){
    e.preventDefault();
    const review = {
        coords,
        author: this.elements.author.value,
        place: this.elements.place.value,
        reviewText: this.elements.review.value,
    }
    localStorage.reviews = JSON.stringify([...getReviewsFromLS(), review])

    renderGeoObjects(map)

    map.balloon.close();
})

}





