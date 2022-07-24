<template>
  <button @click="getLatitudeLongitude(callback)">
    Click me to get location
  </button>
  <span style="margin-left:20px">{{coord}}</span>
  <input id="pac-input"
      class="controls"
      type="text"
      placeholder="Search Box">
  
  <div id="map"></div>

  
  <HomePageTable
    
    :tableData="tableData"
    :tableLabel="tableLabel"
    :pagination="pagination"
    @pageChange="toChangeTableData"
    @deleteRow="toDeleteRow"
  />
</template>

<script>


import {ref,reactive,watch} from 'vue'
import getLatitudeLongitude from '@/js/Home/getLocation'
import HomePageTable from '@/components/HomePageTable'
import searchBoxAPI from '@/js/GoogleMapAPI/searchBox'

export default {
    setup(){
        //register user local gps coords 
        let coord = ref('')
        
        const gpsLocation = reactive({gps:{lat: 44.03852009, lng: -79.447195}})
        function callback(data){
            console.log(`Latitude: ${data[';atitude']}, Longitude: ${data['longitude']}`)
            gpsLocation.gps = data
            coord.value = `Latitude: ${data['latitude']}, Longitude: ${data['longitude']}`
        }
        
        
        //register google map
        let map;
        let markers = ref([])
        searchBoxAPI(map,markers,gpsLocation)

        //prepare table for markers
        let tableData = ref([])
        
        const tableLabel = ['name','TimeZone','localTime']
        const pagination = reactive({
          tableDataLength:markers.value.length,
          page:1,
          pageSize:10
        })

        //update table
        function toChangeTableData(){
          
          tableData.value = markers.value.slice((pagination.page-1) * pagination.pageSize,(pagination.page-1) * pagination.pageSize + pagination.pageSize)
          
          pagination.tableDataLength = markers.value.length
        }

        //initialize
        toChangeTableData()

        // update table when user add a marker
        watch(() => [...markers.value],(value,oldValue,onInvalidate)=>{
          
          toChangeTableData()
        })

        //delete row
        function toDeleteRow(data){
          data.forEach(selectedMarker => {
            const index = markers.value.findIndex(marker => JSON.stringify(marker) == JSON.stringify(selectedMarker))
            if(index >= 0) markers.value.splice(index,1)
          });
          
        }

        return {coord,markers,tableData,tableLabel,pagination,toChangeTableData,toDeleteRow,getLatitudeLongitude,callback}
    },
    components:{HomePageTable}
}
</script>

<style lang="less" scoped>
img{
    display: block;
}


#map {
  height: 400px;
}
#description {
  font-family: Roboto;
  font-size: 15px;
  font-weight: 300;
}

#infowindow-content .title {
  font-weight: bold;
}

#infowindow-content {
  display: none;
}

#map #infowindow-content {
  display: inline;
}

.pac-card {
  background-color: #fff;
  border: 0;
  border-radius: 2px;
  box-shadow: 0 1px 4px -1px rgba(0, 0, 0, 0.3);
  margin: 10px;
  padding: 0 0.5em;
  font: 400 18px Roboto, Arial, sans-serif;
  overflow: hidden;
  font-family: Roboto;
  padding: 0;
}

#pac-container {
  padding-bottom: 12px;
  margin-right: 12px;
}

.pac-controls {
  display: inline-block;
  padding: 5px 11px;
}

.pac-controls label {
  font-family: Roboto;
  font-size: 13px;
  font-weight: 300;
}

#pac-input {
  background-color: #fff;
  font-family: Roboto;
  font-size: 15px;
  font-weight: 300;
  margin-left: 12px;
  padding: 0 11px 0 13px;
  text-overflow: ellipsis;
  width: 400px;
}

#pac-input:focus {
  border-color: #4d90fe;
}

#title {
  color: #fff;
  background-color: #4d90fe;
  font-size: 25px;
  font-weight: 500;
  padding: 6px 12px;
}

#target {
  width: 345px;
}

</style>