import { WrapperLink, WrapperUl } from "./style";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { RSSFeed } from "../../service/rssService";
import { loadCate } from "../../store/cateReducer";
import { useTranslation } from "react-i18next";

function Menu() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [trangChu, setTrangChu] = useState(null);
    const [kinhDoanh, setKinhDoanh] = useState(null);
    const [xaHoi, setXaHoi] = useState();
    const [theGioi, setTheGioi] = useState(null);
    const [giaiTri, setGiaiTri] = useState(null);
    const [batDongSan, setBatDongSan] = useState(null);
    const [theThao, setTheThao] = useState(null);

    useEffect(() => {
        async function setFeed() {
            setTrangChu(await RSSFeed("https://dantri.com.vn/rss/home.rss"));
            setKinhDoanh(await RSSFeed("https://dantri.com.vn/rss/kinh-doanh.rss"));
            setXaHoi(await RSSFeed("https://dantri.com.vn/rss/xa-hoi.rss"));
            setTheGioi(await RSSFeed("https://dantri.com.vn/rss/the-gioi.rss"));
            setGiaiTri(await RSSFeed("https://dantri.com.vn/rss/giai-tri.rss"));
            setBatDongSan(await RSSFeed("https://dantri.com.vn/rss/bat-dong-san.rss"));
            setTheThao(await RSSFeed("https://dantri.com.vn/rss/the-thao.rss"));
        }
        setFeed();
    }, []);

    useEffect(() => {
        if (trangChu && kinhDoanh && xaHoi && theGioi && giaiTri && batDongSan && theThao) {
            dispatch(loadCate([
                { name: "Trang chủ", items: trangChu },
                { name: "Kinh doanh", items: kinhDoanh },
                { name: "Xã hội", items: xaHoi },
                { name: "Thế giới", items: theGioi },
                { name: "Giải trí", items: giaiTri },
                { name: "Bất động sản", items: batDongSan },
                { name: "Thể thao", items: theThao },
            ]));
        }
    }, [trangChu, kinhDoanh, xaHoi, theGioi, giaiTri, batDongSan, theThao, dispatch]);

    return (
        <div style={{ background: "#fff" }}>
            <WrapperUl>
                <li><WrapperLink to={"/category/trang-chu"}>{t("categories.trang-chu")}</WrapperLink></li>
                <li><WrapperLink to={"/category/kinh-doanh"}>{t("categories.kinh-doanh")}</WrapperLink></li>
                <li><WrapperLink to={"/category/xa-hoi"}>{t("categories.xa-hoi")}</WrapperLink></li>
                <li><WrapperLink to={"/category/the-gioi"}>{t("categories.the-gioi")}</WrapperLink></li>
                <li><WrapperLink to={"/category/giai-tri"}>{t("categories.giai-tri")}</WrapperLink></li>
                <li><WrapperLink to={"/category/bat-dong-san"}>{t("categories.bat-dong-san")}</WrapperLink></li>
                <li><WrapperLink to={"/category/the-thao"}>{t("categories.the-thao")}</WrapperLink></li>
            </WrapperUl>
        </div>
    );
}

export default Menu;
