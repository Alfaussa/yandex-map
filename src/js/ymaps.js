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
        
        openBallon(city, coords, []);

    })
    clusterer = new ymaps.Clusterer({clusterDisableClickZoom:true})
    renderGeoObjects(city);

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
                <div> <strong> Место: </strong> ${review.place}</div>
                <div> <strong> Имя: </strong> ${review.author}</div>
                <div> <strong> Отзыв: </strong> ${review.reviewText}</div>
            </div>    
            `
    }
}
return reviewListHTML;
}

function renderGeoObjects(city) {
    const geoObjects = [];

    for(const review of getReviewsFromLS()){
        const placemark = new ymaps.Placemark(review.coords)
        placemark.events.add('click', e => {
            e.stopPropagation()
            openBallon(city, e.get('coords'), [e.get('target')] )
        })
        geoObjects.push(placemark)
    }
    clusterer.removeAll()
    city.geoObjects.remove(clusterer)
    clusterer.add(geoObjects)
    city.geoObjects.add(clusterer)
}

async function openBallon(city, coords, currentGeoObjects){
    await city.balloon.open(coords, {
                            contentHeader:'Отзывы:',
                            contentBody:
                                `<div class='reviews'>${getReviewList(currentGeoObjects)}</div>` + form
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

    renderGeoObjects(city)

    city.balloon.close();
})

}





