import styled from "styled-components";
import {Link} from "react-router-dom";

export const WrapperUl = styled.ul`
    list-style: none;
    display: flex;
    gap: 10px;
    color: white;
    font-size: 12px;
    border-bottom: 4px solid  #0E6830;
    height: 40px;
    align-items: center;
    font-weight: 400;
    padding: 0;
    width: 1200px;
    margin:  0 auto;
`

export const WrapperLink = styled(Link)`
    text-decoration: none;
    padding: 0 5.5px;
    margin-bottom: 10px;
    line-height: 40px;
    height: 40px;
    display: block;
    color: #0E6830;
    border-left: 1px solid  #0E6830;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 400;
    &:hover {
        color: red;
        cursor: pointer;
        transition: 0.4s;
    }
`
