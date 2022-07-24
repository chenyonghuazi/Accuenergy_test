import { onMounted } from "vue";

function autoCompleteInitMapAPI(map,marker,initialLocation){
    onMounted(()=>{
            
        function initMap() {
            map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: initialLocation.gps.lat, lng: initialLocation.gps.lng },
                zoom: 8,
            });

             // The marker, positioned at Uluru
            marker = new google.maps.Marker({
                position: { lat: initialLocation.gps.lat, lng: initialLocation.gps.lng },
                map: map,
            });

            // Create the search box and link it to the UI element.
            const input = document.getElementById("pac-input");
            
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            var autocomplete = new google.maps.places.Autocomplete(input,{
              types:['establishment'],
              componentRestrictions:{"country":['NA','CA']},
              fields:['place_id', 'name', 'types','geometry']
            });
            // Bias the SearchBox results towards current map's viewport.
            //autocomplete.bindTo('bounds', map);
            map.addListener("bounds_changed", () => {
              autocomplete.setBounds(map.getBounds());
            });

            //search box event
            autocomplete.addListener("place_changed", ()=>{
              const place = autocomplete.getPlace();
              
              //console.log(places.length());
              if(!place.geometry || !place.geometry.location){
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                window.alert("No details available for input: '" + place.name + "'");
                return;
              }

              // If the place has a geometry, then present it on a map.
              if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
              } else {
                map.setCenter(place.geometry.location);
                map.setZoom(8);
              }

              marker.setPosition(place.geometry.location);
              marker.setVisible(true);

              
            })
        }

        window.initMap = initMap;
    })


}

export default autoCompleteInitMapAPI