import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import Modal from './KeywordModal'; // 모달 컴포넌트 가져오기

const TypographyContainer = styled.div`
    width: 100%;
    height: 79vh; /* 컨테이너 높이 설정 */
    position: relative;
`;

const KeywordCloud = ({ keywords }) => {
    const svgRef = useRef();
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedKeyword, setSelectedKeyword] = useState(null);

    useEffect(() => {
        const words = keywords.map(item => ({
            text: item.keyword,
            size: item.weight
        }));

        const layout = cloud()
            .size([800, 400])
            .words(words)
            .padding(5)
            .rotate(() => (Math.random() > 0.5 ? 90 : 0))
            .fontSize(d => d.size)
            .on("end", draw);

        layout.start();

        function draw(words) {
            d3.select(svgRef.current).selectAll("*").remove();

            const g = d3.select(svgRef.current)
                .append("g")
                .attr("transform", "translate(400, 200)");

            g.selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", d => `${d.size}px`)
                .style("fill", (d, i) => d3.schemeCategory10[i % 10])
                .attr("text-anchor", "middle")
                .attr("transform", d => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
                .text(d => d.text)
                .on("click", (event, d) => {  // event, d 형태로 파라미터 수정
                    setSelectedKeyword({
                        text: d.text
                    });
                    setModalOpen(true); // 모달 열기
                });
        }
    }, [keywords]);

    const closeModal = () => {
        setModalOpen(false);
        setSelectedKeyword(null); // 선택된 키워드 초기화
    };

    return (
        <TypographyContainer>
            <svg ref={svgRef} width="100%" height="100%"></svg>
            {isModalOpen && selectedKeyword && (
                <Modal
                    show={isModalOpen}
                    handleClose={closeModal}
                    keyword={selectedKeyword.text} // 키워드 텍스트 전달
                />
            )}
        </TypographyContainer>
    );
};

export default KeywordCloud;
