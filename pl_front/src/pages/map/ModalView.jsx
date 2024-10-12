import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CancelIcon from '@mui/icons-material/Cancel';


function ModalView(
    {show, handleClose, content, myLat, myLng}
) {
    const img = content.img;
    const name = content.name;
    const address = content.address;
    const homepage = content.homepage;
    const open = content.open;
    const closed = content.closed;
    const description = content.description;
    const lat = content.latitude;
    const lng = content.longitude;

    let route
    if (myLat == 0 || myLng == 0) {
        route = `http://map.naver.com/index.nhn?` +
            `slng=&slat=&stext=&elng=${lng}&elat=${lat}&pathType=0&showMap=true&etext=${name}&showMap=true&menu=route&pathType=1`
    } else {
        route = `http://map.naver.com/index.nhn?slng=${myLng}&slat=${myLat}&stext=내위치&elng=${lng}&elat=${lat}&etext=${name}&menu=route&pathType=1`
    }

    // 홈페이지로 이동
    function openDetailPage() {
        window.open(homepage, "_blank");
    }

    function openFindRoute() {
        window.open(route, "_blank");
    }

    return (
        <Modal show={show}
               onHide={handleClose}
               centered
               dialogClassName="modal-90w">
            <Modal.Header closeButton>
                <Modal.Title
                    style={{
                        // fontFamily: "JalnanGothic",
                        fontSize: "25px"
                    }}
                >
                    {name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{
                textAlign: 'center'
                // , fontFamily: "GmarketSansMedium"
            }}>
                {/*이미지, 주소 가운데 정렬 + 간격 두기*/}
                {img &&
                    <div style={{
                        width: '29rem', // 가로 크기 설정
                        height: '20rem', // 세로 크기 설정
                        backgroundColor: '#f0f0f0', // 배경색 추가
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '0.5rem' // 모서리 둥글게 (선택 사항)
                    }}>
                        <Image
                            src={img}
                            style={{
                                width: '100%', // 가로 크기를 100%로 설정
                                height: '100%', // 세로 크기를 100%로 설정
                                objectFit: 'contain', // 비율 유지하며 맞추기
                                borderRadius: '0.5rem' // 모서리 둥글게 (선택 사항)

                            }}
                        />
                    </div>}
                <br/>
                <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>
                    <p style={{fontSize: "18px", flexBasis: "30%"}}>
                        <PlaceIcon/> 주소
                    </p>
                    <p style={{fontSize: "18px", flexBasis: "70%"}}>
                        {address}
                    </p>

                    {open && (
                        <>
                            <p style={{fontSize: "18px", flexBasis: "30%"}}>
                                <AccessTimeFilledIcon/> 운영
                            </p>
                            <p style={{fontSize: "18px", flexBasis: "70%"}}>
                                {open}
                            </p>
                        </>
                    )}

                    {closed && (
                        <>
                            <p style={{fontSize: "18px", flexBasis: "30%"}}>
                                <CancelIcon/> 휴무/휴관
                            </p>
                            <p style={{fontSize: "18px", flexBasis: "70%"}}>
                                {closed}
                            </p>
                        </>
                    )}
                </div>
                {description && (
                    <p style={{color: "gray"}}>
                        {description}
                    </p>
                )}

                <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>
                    {homepage && (
                        <p style={{color: "gray", flexBasis: "50%"}}>
                            더 자세한 정보는?
                            <button onClick={openDetailPage}
                                    style={{
                                        border: "none",
                                        backgroundColor: "transparent",
                                        color: "blue",
                                        // fontFamily: "GmarketSansMedium",
                                        fontSize: "15px",
                                        marginTop: "1rem"
                                    }}>
                                홈페이지로 이동
                            </button>
                        </p>

                    )}
                    <p style={{color: "gray", flexBasis: "50%"}}>
                        대중교통 길찾기
                        <button onClick={openFindRoute}
                                style={{
                                    border: "none",
                                    backgroundColor: "transparent",
                                    color: "blue",
                                    // fontFamily: "GmarketSansMedium",
                                    fontSize: "15px",
                                    marginTop: "1rem"
                                }}>
                            이동
                        </button>
                    </p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalView;