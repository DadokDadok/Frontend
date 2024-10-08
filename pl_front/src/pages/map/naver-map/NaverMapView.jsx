import React from 'react';
import NaverMap from "./NaverMap";

function NaverMapView({data, myLat, myLng}) {

    const markerGroups = [];

    let centerLatitude = 0;
    let centerLongitude = 0;
    let length = 0;

    for (let i = 0; i < (data?.length || 0); i++) {
        const item = data[i]; // 각 데이터 항목을 가져옴
        const markers = {
            id: item.id,
            rowNum: item.rowNum,
            name: item.name,
            type: item.type,
            cityDo: item.cityDo,
            siGunGu: item.siGunGu,
            address: item.address,
            tel: item.tel,
            latitude: item.latitude,
            longitude: item.longitude,
            homepage: item.homepage,
            closed: item.closed,
            open: item.open,
            description: item.description,
            img: item.img,
            tag: item.tag,
        };

        markerGroups.push(markers); // markers 객체를 배열에 추가

        centerLatitude += parseFloat(item.latitude);
        centerLongitude += parseFloat(item.longitude);
        length += 1;
    }

    centerLatitude = centerLatitude / length;
    centerLongitude = centerLongitude / length;

    const center = {latitude: centerLatitude, longitude: centerLongitude};

    return <NaverMap markers={markerGroups} center={center} myLat={myLat} myLng={myLng}/>;

}

export default NaverMapView;