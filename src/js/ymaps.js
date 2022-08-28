function mapInit() {
    ymaps.ready(() => {
        let city = new ymaps.Map('map', {
            center: [55.76, 37.65],
            zoom: 9
        })
    })
}

export {
    mapInit
}