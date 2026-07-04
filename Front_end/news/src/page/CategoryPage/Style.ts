import styled from "styled-components";

export const WrapperContain = styled.div`
    margin: auto;
    width: 100%;

    @media (min-width: 576px) {
        width: 95%;
    }

    @media (min-width: 768px) {
        width: 95%;
    }

    @media (min-width: 1200px) {
        width: 1200px;
    }
`;

export const WrapperCateName = styled.h1`
    color: #0e6830;
    font-size: 30px;
    font-weight: 400;
    display: block;
    margin: 0 0 10px 20px;
`;
