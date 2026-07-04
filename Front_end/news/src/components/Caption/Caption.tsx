import {WrapperCaption, WrapperLink, WrapperTitle} from "./style";

function Caption ({title, link}: any) {
    return(
        <WrapperCaption>
            <WrapperLink to={link}>
                <WrapperTitle>{title || "BONG DA QUOC TE"}</WrapperTitle>
            </WrapperLink>
        </WrapperCaption>
    );
}
export default Caption;