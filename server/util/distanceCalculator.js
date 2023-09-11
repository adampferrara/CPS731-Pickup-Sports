const distanceCalculator = (starPoint, allGames, unit) => {

    result = [];

    lat1 = starPoint[0];
    lon1 = starPoint[1];

    for (var i = 0; i < allGames.length; i++) {
        lat2 = allGames[i].coord[0];
        lon2 = allGames[i].coord[1];

        distance = getDistance(lat1, lon1, lat2, lon2, unit);
        result.push();
    }

    result.sort((a, b) => b - a);

    return result;
};

const getDistance = (lat1, lon1, lat2, lon2, unit) => {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") { dist = dist * 1.609344; }
    if (unit == "N") { dist = dist * 0.8684; }
    return dist;
};

module.exports = distanceCalculator;