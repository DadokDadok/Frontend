import React, { useState, useEffect } from 'react';
import './navBar.css';
import { useNavigate } from 'react-router-dom';

function NavBar() {
    const [lastScrollY, setLastScrollY] = useState(0);
    const navigate = useNavigate();

    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY) {
            document.querySelector('.app-header').style.top = '-100px'; // 헤더가 위로 사라짐
        } else {
            document.querySelector('.app-header').style.top = '0'; // 헤더가 다시 나타남
        }
        setLastScrollY(currentScrollY);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <div className="background">
            <div className="app-header">
                <div className="header-logo" onClick={() => navigate('/')}>
                    <img src="/img/dadok_title_rm.png" alt="Logo" className="logo-img"/>
                </div>
                <div className="catch">
                    <h6>독서를 쉽게, 다독다독</h6>
                </div>
                <div className="header-nav">
                    <ul className="NavMenu">
                        <li><a href="/map"><h5>도서 지도</h5></a></li>
                        <li><a href="/keyword"><h5>이달의 키워드</h5></a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default NavBar;
