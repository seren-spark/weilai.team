import axios from 'axios'

// 获取GeoJSON数据
export const getGeoJson = (type: string, name: any) => {
    // 获取中国的geojson数据
    if (type === 'china') return axios.get('/geoJsonColl/china.json')

    // 获取省、直辖市、自治区的geojson数据
    if (type === 'province') return axios.get(`/geoJsonColl/province/${name}.json`)

    // 获取区、县的geojson数据
    return axios.get(`/geoJsonColl/city/${name}.json`)
}

// 获取地图数据
export const getMapData = (type: string, mapData: { adcode: number; value: number }[]) => {
    console.log(mapData);
    const data = {
        "data": mapData
    }
    console.log(data);
    // 获取中国数据
    if (type === 'china') return axios.get('/mock/china.json')

    // 获取省、直辖市、自治区的数据（山东省）
    if (type === 'province') return axios.get('/mock/province.json')


    // 获取区、县的数据（济南市）
    // return {
    //     "data": mapData
    // }

    return axios.get('/mock/city.json')


}
