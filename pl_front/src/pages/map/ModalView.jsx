import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CancelIcon from '@mui/icons-material/Cancel';


function ModalView(
    {show, handleClose, content}
) {
    const img = content.img;
    const name = content.name;
    const address = content.address;
    const homepage = content.homepage;
    const operatingTime = content.operatingTime;
    const closed = content.closed;
    const description = content.description;

    // 홈페이지로 이동
    function openDetailPage() {
        window.open(homepage, "_blank");
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
                    {/*<span style={{*/}
                    {/*    fontSize: '15px',*/}
                    {/*    fontFamily: "GmarketSansMedium",*/}
                    {/*    padding: '0.25em 0.5em',*/}
                    {/*    borderRadius: "8px",*/}
                    {/*    display: "inline-block",*/}
                    {/*    verticalAlign: "middle",*/}
                    {/*    lineHeight: "normal",*/}
                    {/*    marginLeft: "0.8rem" // title과의 간격 조절*/}
                    {/*}}>{cat}_{catkr}</span>*/}
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

                    {operatingTime && (
                        <>
                            <p style={{fontSize: "18px", flexBasis: "30%"}}>
                                <AccessTimeFilledIcon/> 운영
                            </p>
                            <p style={{fontSize: "18px", flexBasis: "70%"}}>
                                {operatingTime}
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

                {homepage && (
                    <p style={{color: "gray"}}>
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
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalView;