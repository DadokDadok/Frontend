import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";

const KeywordCloud = () => {
    const svgRef = useRef();
    const [activeKey, setActiveKey] = useState("0");
    const [selectedKeyword, setSelectedKeyword] = useState(null);
    const [allBooks, setAllBooks] = useState([]); // 전체 도서 데이터
    const [visibleBooks, setVisibleBooks] = useState([]); // 현재 보이는 도서 데이터
    const [modalShow, setModalShow] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [itemsToShow, setItemsToShow] = useState(14);
    const [keywords, setKeywords] = useState([]);

    useEffect(() => {
        const fetchKeywords = async () => {
            try {
                const response = await axios.get(`http://data4library.kr/api/monthlyKeywords?authKey=${process.env.REACT_APP_LIBRARY_CLIENT_KEY}&format=json&month=${year+"-"+month}`);
                setKeywords(response.data.response.keywords);

                const words = response.data.response.keywords.map(({ keyword }) => ({
                    text: keyword.word,
                    size: Math.sqrt(keyword.weight) * 7
                }));

                const layout = cloud()
                    .size([1200, 400])
                    .words(words)
                    .padding(5)
                    .rotate(() => (Math.random() > 0.5 ? 90 : 0))
                    .fontSize(d => d.size)
                    .font("sans-serif")
                    .on("end", draw);

                layout.start();

                function draw(words) {
                    d3.select(svgRef.current).selectAll("*").remove();

                    const g = d3.select(svgRef.current)
                        .append("g")
                        .attr("transform", "translate(600, 200)");

                    g.selectAll("text")
                        .data(words)
                        .enter().append("text")
                        .style("font-size", d => `${d.size}px`)
                        .style("fill", (d, i) => d3.schemeCategory10[i % 10])
                        .attr("text-anchor", "middle")
                        .attr("transform", d => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
                        .text(d => d.text)
                        .on("click", (event, d) => handleKeywordClick(d.text)); // 수정된 부분
                }
            } catch (error) {
                console.error("Error fetching keywords", error);
            }
        };

        fetchKeywords();
    }, []);

    const handleKeywordClick = async (keyword) => {
        setSelectedKeyword(keyword);
        setActiveKey("1"); // 아코디언 열기

        try {
            const response = await axios.get(`http://data4library.kr/api/srchBooks?authKey=${process.env.REACT_APP_LIBRARY_CLIENT_KEY}&pageNo=1&pageSize=100&format=json&exactMatch=true&keyword=${keyword}`);
            const bookList = response.data.response.docs;


            const formattedBooks = bookList.map(item => {
                const doc = item.doc; // item에서 doc 속성을 추출
                return {
                    bookname: doc.bookname || "정보 없음", // 기본값 설정
                    authors: doc.authors || "저자 정보 없음", // 기본값 설정
                    publisher: doc.publisher || "출판사 정보 없음", // 기본값 설정
                    publication_year: doc.publication_year || "발행년도 정보 없음", // 기본값 설정
                    isbn13: doc.isbn13 || "ISBN 정보 없음", // 기본값 설정
                    vol: doc.vol || "권 정보 없음", // 기본값 설정
                    bookImageURL: doc.bookImageURL || "https://via.placeholder.com/150", // 기본 이미지 URL
                    bookDtlUrl: doc.bookDtlUrl || "#", // 기본 링크
                    loan_count: doc.loan_count || "0" // 기본값 설정
                };
            });

            setAllBooks(formattedBooks);
            setVisibleBooks(formattedBooks.slice(0, itemsToShow)); // 처음 N개 보이기

        } catch (error) {
            console.error("Error fetching books", error);
            setAllBooks([]); // 에러 발생 시 빈 배열 설정
            setVisibleBooks([]); // 에러 발생 시 빈 배열 설정
        }
    };

    const handleLoadMore = () => {
        setItemsToShow(prev => Math.min(prev + 14, allBooks.length));
        setVisibleBooks(allBooks.slice(0, itemsToShow + 14)); // 업데이트된 개수에 맞게 보이는 도서 데이터 설정
    };

    const handleImageClick = (book) => {
        setSelectedBook(book);
        setModalShow(true);
    };

    const getLastMonth = () => {
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);

        const year = lastMonth.getFullYear();
        const month = String(lastMonth.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 해줍니다.

        return { year, month };
    };

    const { year, month } = getLastMonth();

    return (
        <Background>
            <TypographyTitle>
                이 달의 키워드
            </TypographyTitle>
            <TypographyContainer>
                <svg ref={svgRef} width="80rem" height="400px"></svg>
            </TypographyContainer>
            <BookAccordion activeKey={activeKey}>
                <BookAccordionItem eventKey="1">
                    <BookAccordionHeader onClick={() => setActiveKey("1")}>
                        {(selectedKeyword && "선택된 키워드: " + selectedKeyword) || "키워드를 클릭해주세요"}
                    </BookAccordionHeader>
                    <BookAccordionBody>
                        {visibleBooks.length > 0 ? (
                            <ImageGrid>
                                {visibleBooks.map((book, index) => (
                                    <ImageContainer key={index} onClick={() => handleImageClick(book)}>
                                        <Image src={book.bookImageURL} alt={book.bookname} />
                                        <Overlay>
                                            <OverlayP>{book.bookname}</OverlayP>
                                        </Overlay>
                                    </ImageContainer>
                                ))}
                            </ImageGrid>
                        ) : (
                            <p>책 정보가 없습니다.</p>
                        )}
                        {visibleBooks.length < allBooks.length && (
                            <LoadMoreButton onClick={handleLoadMore}>10개 더 보기</LoadMoreButton>
                        )}
                    </BookAccordionBody>
                </BookAccordionItem>
            </BookAccordion>
            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{selectedBook?.bookname}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>저자: {selectedBook?.authors}</p>
                    <p>출판사: {selectedBook?.publisher}</p>
                    <p>발행년도: {selectedBook?.publication_year}</p>
                    <p>ISBN: {selectedBook?.isbn13}</p>
                    <p>대출 횟수: {selectedBook?.loan_count}</p>
                    <a href={selectedBook?.bookDtlUrl} target="_blank" rel="noopener noreferrer">자세히 보기</a>
                </Modal.Body>
            </Modal>
        </Background>
    );
};

export default KeywordCloud;

const TypographyContainer = styled.div`
    display: flex;
    height: auto;
    justify-content: center;
    text-align: center;
    margin-bottom: 5rem;
`;

const TypographyTitle = styled.h1`
    padding-top: 2rem;
    padding-bottom: 4rem;
    display: flex;
    justify-content: center;
`;

const Background = styled.div`
    background-color: #FAF7F0;
    padding-top: 80px;
    height: 75vh;
`;

const ImageGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 10px;
`;

const ImageContainer = styled.div`
    position: relative;
`;

const Image = styled.img`
    width: 90%;
    height: auto;
    margin: auto;
    aspect-ratio: 3 / 4;
    transition: transform 0.2s;
`;

const BookAccordion = styled(Accordion)`
    background-color: #FAF7F0;
    height: 30rem;
`;

const BookAccordionItem = styled(Accordion.Item)`
    background-color: #FAF7F0;
`;

const BookAccordionHeader = styled(Accordion.Header)`
    background-color: #FAF7F0;
`;

const BookAccordionBody = styled(Accordion.Body)`
    background-color: #FAF7F0;
    padding-bottom: 10rem;
`;

const Overlay = styled.div`
    width: 90%;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;

    ${ImageContainer}:hover & {
        opacity: 1;
    }
`;

const OverlayP = styled.p`
    display: flex;
    justify-content: center;
    text-align: center;
    margin: 15px;
`;

const LoadMoreButton = styled.button`
    margin: 20px auto;
    display: block;
    padding: 10px 20px;
    background-color: #335061;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #335061;
    }
`;
