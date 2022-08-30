// import { map } from "jquery";
ymaps.ready(mapInit);

function mapInit() {
    ymaps.ready(() => {
        let city = new ymaps.Map('map', {
            center: [55.76, 37.65],
            zoom: 12,
            controls: ['zoomControl'],
            behavoirs:['drag']
        });
        // function placemarkInit() {
        //     document.addEventListener('click', () =>{
              
        //         var placemark = new ymaps.Placemark([55.76, 37.64], {
        //             // hintContent:'this is hint', 
        //             balloonContent: [
        //               '  <div class = \'form\'>',
        //                 '<h3>Отзыв:</h3>',
        //                 '<input placeholder=\'Укажите ваше имя\'> </input>',
        //                 '<input placeholder=\'Укажите ваше место\'> </input>',
        //                 '<textarea placeholder=\'Укажите ваше место\'></textarea>',
        //                 '</div>'
        //             ].join('')
        //     });
        //     city.geoObjects.add(placemark);
        //     })
        // }
        // placemarkInit();
    city.events.add('click', function (e) {

            if (!city.balloon.isOpen()) {
               
                var coords = e.get('coords');
                
            city.balloon.open(coords, {
                    contentHeader:'Отзывы:',
                    contentBody:[
                        '<div class = \'form\'>',
                        '<input placeholder=\'Укажите ваше имя\'> </input>',
                        '<input placeholder=\'Укажите ваше место\'> </input>',
                        '<textarea placeholder=\'Укажите ваше место\'></textarea>',
                        '</div>'
                      ].join('')
                });
            }
            else {
                city.balloon.close();
                placemark = new ymaps.Placemark(city.getCenter(), {
                    hintContent: 'Собственный значок метки',
                    balloonContent: 'Это красивая метка'
                } )
                city.geoObjects.add(placemark);

            }
        });

})

}
