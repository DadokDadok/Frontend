import Modal from "react-bootstrap/Modal";
import React, {useEffect, useState} from "react";
import styled from "styled-components";
import Accordion from "react-bootstrap/Accordion";
import axios from "axios";

const KeywordBooks = ({keyword}) => {
    const [activeKey, setActiveKey] = useState("0");
    const [allBooks, setAllBooks] = useState([]);
    const [visibleBooks, setVisibleBooks] = useState([]);
    const [itemsToShow, setItemsToShow] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [modalShow, setModalShow] = useState(false);


    useEffect(() => {
        const fetchBooks = async () => {
            if (!keyword) return;

            setActiveKey("0");
            setIsLoading(true);
            setItemsToShow(10);
            setVisibleBooks([]);

            try {
                const allBooks = [];
                const maxResults = 40;
                const totalRequests = 5;

                const requests = Array.from({length: totalRequests}, (_, i) => {
                    const startIndex = i * maxResults;
                    const url = `https://www.googleapis.com/books/v1/volumes?key=${process.env.REACT_APP_GOOGLE_BOOKS_CLIENT_KEY}&hl=ko&startIndex=${startIndex}&maxResults=${maxResults}&orderBy=relevance&q=${keyword}`;
                    return axios.get(url);
                });
                const responses = await Promise.all(requests);

                responses.forEach(response => {
                    if (response.data.items) {
                        allBooks.push(...response.data.items);
                    }
                });

                const filteredBooks = allBooks.filter(item =>
                    item.saleInfo.saleability !== "NOT_FOR_SALE" &&
                    item.accessInfo.epub.isAvailable &&
                    item.accessInfo.pdf.isAvailable &&
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
                alert("도서 정보를 가져오는 데 실패했습니다."); // 사용자 피드백 추가
                setAllBooks([]);
                setVisibleBooks([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooks();
    }, [keyword]); // keyword가 변경될 때마다 fetchBooks를 실행

    const handleLoadMore = () => {
        const newItemsToShow = itemsToShow + 10;
        setItemsToShow(newItemsToShow);
        setVisibleBooks(allBooks.slice(0, newItemsToShow));
    };

    const handleImageClick = (book) => {
        setSelectedBook(book);
        setIsDescriptionExpanded(false); // 초기 상태로 리셋
        setModalShow(true);
    };

    return (
        <Background>
            <SelectedKeyword>
                <h4>
                    {keyword ? "# " + keyword : "키워드를 클릭해주세요"}
                </h4>
            </SelectedKeyword>
            {isLoading ? (
                <p>{keyword}와(과) 관련된 도서를 가져오는 중입니다...</p>
            ) : visibleBooks.length > 0 ? (
                <ImageGrid>
                    {visibleBooks.map((book, index) => (
                        <ImageContainer key={index} onClick={() => handleImageClick(book)}>
                            <div style={{position: 'relative', display: 'inline-block'}}>
                                {book.bookImageURL ? (
                                    <Image src={book.bookImageURL} alt={book.bookname}/>
                                ) : (
                                    <>
                                        <Image src="/img/book_img.png"/>
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
            <Modal show={modalShow} onHide={() => {
                setModalShow(false);
                setSelectedBook(null);
            }} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedBook?.bookname}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ModalContent>
                        <BookImageContainer>
                            <img src={selectedBook?.bookImageURL || "/img/book_img.png"} alt={selectedBook?.bookname}/>
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
                    <hr/>
                    <p>
                        {isDescriptionExpanded ? selectedBook?.description : selectedBook?.description.slice(0, 100) + '...'}
                    </p>
                    {selectedBook?.description.length > 100 && (
                        <a
                            style={{color: "gray"}}
                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}>
                            {isDescriptionExpanded ? "접기" : "더보기"}
                        </a>
                    )}
                    <hr/>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <KeywordButton as="a" href={selectedBook?.infoLink} target="_blank">자세히 보기</KeywordButton>
                        <KeywordButton as="a" href={selectedBook?.bookDtlUrl} target="_blank">도서 미리보기</KeywordButton>
                    </div>
                </Modal.Body>
            </Modal>
        </Background>
    );
}

export default KeywordBooks;

const Background = styled.div`
    padding-bottom: 10rem;
`

const SelectedKeyword = styled.div`
    width: 100%;
    height: 3.5rem;
    background-color: #6096B4;
    color: white;
    padding-left: 3rem;
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
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
