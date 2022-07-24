


function getLocation(callback) {
    
    if (navigator.geolocation) {
       
        

        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        function success(pos) {
            var crd = pos.coords;

            
            callback(crd)
            
        };

        function error(err) {
            console.log('ERROR(' + err.code + '): ' + err.message);
        };

        
        window.navigator.geolocation.getCurrentPosition(success, error, options)

    } else {
        alert("You Brower does not support getting gps location.");
    }
    console.log('return')
    
}

export default getLocation