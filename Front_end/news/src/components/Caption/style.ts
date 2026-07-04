import styled from "styled-components";
import {Link} from "react-router-dom";

export const WrapperCaption = styled.div`
    border-bottom: 1px solid #0E6830;
    height: 22px;
    margin-bottom: 15px;
    overflow: hidden;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
`
export const WrapperLink = styled(Link) `
    padding: 0 10px;
    background-color: #0E6830;
    position: relative;
    &:before {
        content: "";
        position: absolute;
        z-index: 0;
        left: 33%;
        top: 0;
        width: 200px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        height: 26px;
    }
    &:hover {
        cursor: pointer;
    }
`
export const WrapperTitle = styled.span `
    z-index: 1;
    position: relative;
    font-size: 14px;
    line-height: 24px;
    text-transform: uppercase;
    color: #fff;
    font-weight: 600;
    display: inline-block;

`