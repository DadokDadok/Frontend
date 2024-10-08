import { useState } from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";

const types = ["전체", "도서관", "서점", "문화공간"];

const TypeDropdown = ({ onTypeSelect }) => {
    const [selectedType, setSelectedType] = useState('');
    const [showPopover, setShowPopover] = useState(false);

    const handleTypeSelect = (type) => {
        setSelectedType(type);
    };

    const handleConfirmSelection = () => {
        if (selectedType == "전체"){
            onTypeSelect(null);
        }
        else if (selectedType) {
            onTypeSelect(selectedType);
        }
    };

    const handleTogglePopover = () => {
        setShowPopover((prev) => !prev);
    };

    const handleClosePopover = () => {
        setShowPopover(false);
    };

    const popoverContent = (
        <Popover id="popover-types" style={{ width: '400px' }}>
            <Popover.Body style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '150px', overflowY: 'auto' }}>
                    <h6>타입</h6>
                    {types.map((type) => (
                        <button
                            key={type}
                            onClick={() => handleTypeSelect(type)}
                            style={{
                                margin: '0.3rem',
                                background: selectedType === type ? '#007bff' : '#fff',
                                color: selectedType === type ? '#fff' : '#000',
                                border: 'none',
                                borderBottom: '1px solid #bdcdd6',
                                cursor: 'pointer',
                            }}
                        >
                            {type}
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        onClick={handleConfirmSelection}
                        disabled={!selectedType} // 타입이 선택되어야 활성화
                        style={{ marginTop: '1rem', alignSelf: 'center' }}
                    >
                        선택 완료
                    </Button>
                    <Button
                        onClick={handleClosePopover}
                        style={{ marginTop: '1rem', alignSelf: 'center' }}
                    >
                        닫기
                    </Button>
                </div>
            </Popover.Body>
        </Popover>
    );

    return (
        <div className="sidebar">
            <OverlayTrigger
                trigger="click"
                placement="bottom"
                overlay={popoverContent}
                rootClose
                show={showPopover}
                onToggle={handleTogglePopover}
            >
                <button className="btn btn-primary">타입 선택 {selectedType && `: ${selectedType}`}</button>
            </OverlayTrigger>
        </div>
    );
};

export default TypeDropdown;