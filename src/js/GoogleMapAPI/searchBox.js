import { onMounted } from "vue";
import axios from 'axios'
import localTime from '@/js/Home/getLocalTime'

function searchBoxAPI(map,markers,initialLocation){
    onMounted(()=>{
        function initMap(){
            map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: initialLocation.gps.lat, lng: initialLocation.gps.lng },
                zoom: 8,
            });
    
            // Create the search box and link it to the UI element.
            const input = document.getElementById("pac-input");
            const searchBox = new google.maps.places.SearchBox(input,{
                //types:['establishment'],
                //componentRestrictions:{"country":['NA','CA']},
                fields:['place_id', 'name', 'types']
            });
    
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    
            // Bias the SearchBox results towards current map's viewport.
            map.addListener("bounds_changed", () => {
                searchBox.setBounds(map.getBounds());
            });

            //result from search box
            let areaMarkers = [];
    
            searchBox.addListener("places_changed",()=>{
                const places = searchBox.getPlaces()

                //clean searchBox value
                input.value = ''

                //no result
                if (places.length == 0) {
                    console.log("no result!")
                    return;
                }

                //search for a town, city, province or country
                else if(places.length == 1){

                    if(!places[0].geometry || !places[0].geometry.location){
                        // User entered the name of a Place that was not suggested and
                        // pressed the Enter key, or the Place Details request failed.
                        console.log("No details available for input: '" + place.name + "'");
                        return;
                    }

                    const content = `<h3>${places[0].name}</h3>`

                    const infowindow = new google.maps.InfoWindow({content});
                    
                    let marker = new google.maps.Marker({
                        position: places[0].geometry.location,
                        map: map,
                        title:places[0].name
                    });

                    marker.addListener('mouseover',()=>{
                        infowindow.open({
                            anchor:marker,
                            map,
                            shouldFocus:false
                        })
                    })

                    marker.addListener('mouseout',()=>{
                        
                        infowindow.close();
                    })

                    if (places[0].geometry.viewport) {
                        map.fitBounds(places[0].geometry.viewport);
                      } else {
                        map.setCenter(places[0].geometry.location);
                        map.setZoom(8);
                    }

                    marker.setPosition(places[0].geometry.location);
                    marker.setVisible(true);
                    
                    
                    const latitude = places[0].geometry.location.lat();
                    const longitude = places[0].geometry.location.lng();
                    

                    //get time zone
                    var config = {
                        method: 'get',
                        url: `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude}%2C${longitude}&timestamp=1331161200&key=AIzaSyChONld_m3ony9S6JJ9IufN-ADd9EtA1Gk`,
                        headers: {}
                    };
                    axios(config)
                        .then(function (response) {
                            //give it back to HomePage
                            markers.value.push({name:places[0].name,TimeZone:response.data.timeZoneId,localTime:localTime((response.data.rawOffset+3600)/3600)})
                            //console.log(response)
                        })
                        .catch(function (error) {
                            console.log(error);
                    });
                }

                //search for a specific business
                else{
                    // Clear out the old markers.
                    areaMarkers.forEach((searchedMarker) => {
                        searchedMarker.setMap(null);
                    });
                    areaMarkers = [];

                    //create a bound area for coming adjusted map
                    const bounds = new google.maps.LatLngBounds();

                    places.forEach((place)=>{

                        if(!place.geometry || !place.geometry.location){
                            // User entered the name of a Place that was not suggested and
                            // pressed the Enter key, or the Place Details request failed.
                            console.log("No details available for input: '" + place.name + "'");
                            return;
                        }

                        const content = `<h3>${place.name}</h3>` +
                                        `<p>Click the marker to be added in table below</p>`

                        const infowindow = new google.maps.InfoWindow({content});
                
                        // Create a marker for each place.
                        const newMarker = new google.maps.Marker({
                            map,
                            
                            title: place.name,
                            position: place.geometry.location,
                        });
                        newMarker.addListener('mouseover',()=>{
                            infowindow.open({
                                anchor:newMarker,
                                map,
                                shouldFocus:false
                            })
                        })

                        newMarker.addListener('mouseout',()=>{
                            
                            infowindow.close();
                        })

                        newMarker.addListener('click',()=>{
                            areaMarkers.forEach(oldMarker=>{
                                if(oldMarker !== newMarker) oldMarker.setVisible(false)
                            })

                            const latitude = place.geometry.location.lat();
                            const longitude = place.geometry.location.lng();

                            //get time zone
                            var config = {
                                method: 'get',
                                url: `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude}%2C${longitude}&timestamp=1331161200&key=AIzaSyChONld_m3ony9S6JJ9IufN-ADd9EtA1Gk`,
                                headers: {}
                            };
                            axios(config)
                                .then(function (response) {
                                    //give it back to HomePage
                                    markers.value.push({name:place.name,TimeZone:response.data.timeZoneId,localTime:localTime((response.data.rawOffset+3600)/3600)})
                                    
                                })
                                .catch(function (error) {
                                    console.log(error);
                            });
                            
                        })
                        areaMarkers.push(newMarker);

                        if (place.geometry.viewport) {
                            // Only geocodes have viewport.
                            bounds.union(place.geometry.viewport);
                            } else {
                            bounds.extend(place.geometry.location);
                        }
                    })

                    //adjust the map area
                    map.fitBounds(bounds);
                    map.setZoom(8);
                }
    
                
            })
        }
        window.initMap = initMap
    })

}

export default searchBoxAPI