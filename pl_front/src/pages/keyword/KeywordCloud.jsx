import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import PlaceIcon from "@mui/icons-material/Place";

const KeywordCloud = () => {
    const svgRef = useRef();
    const [activeKey, setActiveKey] = useState("0");
    const [keyword, setKeyword] = useState(null);
    const [allBooks, setAllBooks] = useState([]);
    const [visibleBooks, setVisibleBooks] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [itemsToShow, setItemsToShow] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    useEffect(() => {
        const fetchKeywords = async () => {
            const { year, month } = getLastMonth();
            try {
                const response = await axios.get(`http://data4library.kr/api/monthlyKeywords?authKey=${process.env.REACT_APP_LIBRARY_CLIENT_KEY}&format=json&month=${year}-${month}`);

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
                        .on("mousedown", (event, d) => {
                            event.preventDefault();
                            handleKeywordClick(d.text);
                        })
                        .style("cursor", "default");
                }
            } catch (error) {
                console.error("Error fetching keywords", error);
            }
        };

        fetchKeywords();
    }, []);

    const handleKeywordClick = async (keyword) => {
        setKeyword(keyword);
        setActiveKey("1");
        setIsLoading(true);
        setItemsToShow(10);
        setVisibleBooks([]);

        try {
            const allBooks = [];
            const maxResults = 40;
            const totalRequests = 8;

            const requests = Array.from({ length: totalRequests }, (_, i) => {
                const startIndex = i * maxResults;
                return axios.get(`https://www.googleapis.com/books/v1/volumes?key=${process.env.REACT_APP_GOOGLE_BOOKS_CLIENT_KEY}&hl=ko&startIndex=${startIndex}&maxResults=${maxResults}&orderBy=relevance&q=${keyword}`);
            });

            const responses = await Promise.all(requests);

            responses.forEach(response => {
                if (response.data.items) {
                    allBooks.push(...response.data.items);
                }
            });

            const filteredBooks = allBooks.filter(item =>
                item.saleInfo.saleability !== "NOT_FOR_SALE" &&
                item.accessInfo.epub.isAvailable === true &&
                item.accessInfo.pdf.isAvailable === true &&
                item.volumeInfo.maturityRating === "NOT_MATURE"
            );

            const formattedBooks = filteredBooks.map(item => {
                const info = item.volumeInfo;
                return {
                    bookname: info.title || "정보 없음",
                    authors: info.authors ? info.authors.join(", ") : "저자 정보 없음",
                    publisher: info.publisher || "출판사 정보 없음",
                    publication_year: info.publishedDate || "발행년도 정보 없음",
                    isbn13: (info.industryIdentifiers && info.industryIdentifiers.find(id => id.type === "ISBN_13")?.identifier) || "ISBN 정보 없음",
                    vol: info.pageCount || "권 정보 없음",
                    bookImageURL: info.imageLinks?.thumbnail || "",
                    description: info.description || "설명 없음",
                    bookDtlUrl: info.previewLink || "#",
                    infoLink: info.infoLink || "#",
                };
            });

            setAllBooks(formattedBooks);
            setVisibleBooks(formattedBooks.slice(0, itemsToShow));

        } catch (error) {
            console.error("Error fetching books", error);
            setAllBooks([]);
            setVisibleBooks([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadMore = () => {
        const newItemsToShow = itemsToShow + 10;
        setItemsToShow(newItemsToShow);
        setVisibleBooks(allBooks.slice(0, newItemsToShow));
    };

    const handleImageClick = (book) => {
        setSelectedBook(book);
        setIsDescriptionExpanded(false);  // 초기 상태로 리셋
        setModalShow(true);
    };

    const getLastMonth = () => {
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
        const year = lastMonth.getFullYear();
        const month = String(lastMonth.getMonth() + 1).padStart(2, '0');
        return { year, month };
    };

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
                        {(keyword && "선택된 키워드: " + keyword) || "키워드를 클릭해주세요"}
                    </BookAccordionHeader>
                    <BookAccordionBody>
                        {isLoading ? (
                            <p>{keyword}와(과) 관련된 도서를 가져오는 중입니다...</p>
                        ) : visibleBooks.length > 0 ? (
                            <ImageGrid>
                                {visibleBooks.map((book, index) => (
                                    <ImageContainer key={index} onClick={() => handleImageClick(book)}>
                                        <div style={{ position: 'relative', display: 'inline-block' }}>
                                            {book.bookImageURL ? (
                                                <Image src={book.bookImageURL} alt={book.bookname} />
                                            ) : (
                                                <>
                                                    <Image src="/img/book_img.png" />
                                                    <BookTitle>{book.bookname}</BookTitle>
                                                    <BookAuthor>{book.authors}</BookAuthor>
                                                </>
                                            )}
                                        </div>
                                        <Overlay>
                                            <OverlayP>{book.bookname}</OverlayP>
                                        </Overlay>
                                    </ImageContainer>
                                ))}
                            </ImageGrid>
                        ) : (
                            <p>책 정보가 없습니다.</p>
                        )}
                        {visibleBooks.length < allBooks.length && !isLoading && (
                            <KeywordButton onClick={handleLoadMore}>10개 더 보기</KeywordButton>
                        )}
                    </BookAccordionBody>
                </BookAccordionItem>
            </BookAccordion>
            <Modal show={modalShow} onHide={() => { setModalShow(false); setSelectedBook(null); }} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedBook?.bookname}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ModalContent>
                        <BookImageContainer>
                            <img src={selectedBook?.bookImageURL || "/img/book_img.png"} alt={selectedBook?.bookname} />
                        </BookImageContainer>
                        <BookDetails>
                            <DetailRow>
                                <DetailLabel>저자</DetailLabel>
                                <DetailValue>{selectedBook?.authors}</DetailValue>
                            </DetailRow>
                            <DetailRow>
                                <DetailLabel>출판사</DetailLabel>
                                <DetailValue>{selectedBook?.publisher}</DetailValue>
                            </DetailRow>
                            <DetailRow>
                                <DetailLabel>발행년도</DetailLabel>
                                <DetailValue>{selectedBook?.publication_year}</DetailValue>
                            </DetailRow>
                            <DetailRow>
                                <DetailLabel>ISBN</DetailLabel>
                                <DetailValue>{selectedBook?.isbn13}</DetailValue>
                            </DetailRow>
                        </BookDetails>
                    </ModalContent>
                    <hr />
                    <p>
                        {isDescriptionExpanded ? selectedBook?.description : selectedBook?.description.slice(0, 100) + '...'}
                    </p>
                    {selectedBook?.description.length > 100 && (
                        <a
                            style={{ color: "gray" }}
                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}>
                            {isDescriptionExpanded ? "접기" : "더보기"}
                        </a>
                    )}
                    <hr />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <KeywordButton as="a" href={selectedBook?.infoLink} target="_blank">자세히 보기</KeywordButton>
                        <KeywordButton as="a" href={selectedBook?.bookDtlUrl} target="_blank">도서 미리보기</KeywordButton>
                    </div>
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
    padding-bottom: 5rem;
    background-color: #FAF7F0;
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
`;

const ImageGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
`;

const ImageContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
`;

const Image = styled.img`
    width: 8rem;
    height: auto;
    aspect-ratio: 3 / 4;
    transition: transform 0.2s;
    display: flex;
    justify-content: center;
    text-align: center;
`;

const BookTitle = styled.div`
    position: absolute;
    top: 60px;
    left: 20px;
    width: 100px;
    font-size: 15px;
`;

const BookAuthor = styled.div`
    position: absolute;
    bottom: 25px;
    left: 20px;
    width: 100px;
    font-size: 12px;
`;

const BookAccordion = styled(Accordion)`
    background-color: #FAF7F0;
    height: auto;
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
    width: 8rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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

const KeywordButton = styled.button`
    margin: 20px auto;
    display: block;
    padding: 10px 20px;
    background-color: #335061;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-decoration: none;

    &:hover {
        background-color: #2a4b4f;
    }
`;

const ModalContent = styled.div`
    display: flex;
    justify-content: space-between;
`;

const BookImageContainer = styled.div`
    flex-basis: 30%;
    margin-left: 2rem;
`;

const BookDetails = styled.div`
    flex-basis: 65%;
    display: flex;
    flex-direction: column;
`;

const DetailRow = styled.div`
    display: flex;
    justify-content: space-around;
    margin-bottom: 10px;
`;

const DetailLabel = styled.p`
    font-size: 18px;
    width: 25%;
`;

const DetailValue = styled.p`
    font-size: 18px;
    width: 65%;
`;
