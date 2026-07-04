import {WrapperCateName, WrapperContain} from "./Style";
import {Col, Row, Pagination} from "antd";
import Caption from "../../components/Caption/Caption";
import {RSSFeed} from "../../service/rssService";
import {useLoaderData} from "react-router";
import Item from "../../components/Item";
import React, {useEffect, useState} from "react";
import AdBanner from "../../components/Banner/AdBanner";
import GoogleAdsense from "../../components/Banner/GoogleAdsense";
import {useTranslation} from "react-i18next";

export async function loadRss({params}: any) {
    let url = "";
    switch (params.nameCate) {
        case "trang-chu":
            url = "https://dantri.com.vn/rss/home.rss";
            break;
        case "kinh-doanh":
            url = "https://dantri.com.vn/rss/kinh-doanh.rss";
            break;
        case "xa-hoi":
            url = "https://dantri.com.vn/rss/xa-hoi.rss";
            break;
        case "the-gioi":
            url = "https://dantri.com.vn/rss/the-gioi.rss";
            break;
        case "giai-tri":
            url = "https://dantri.com.vn/rss/giai-tri.rss";
            break;
        case "bat-dong-san":
            url = "https://dantri.com.vn/rss/bat-dong-san.rss";
            break;
        case "the-thao":
            url = "https://dantri.com.vn/rss/the-thao.rss";
            break;
        default:
            return url;
    }
    const data = await RSSFeed(url);
    return [data, params.nameCate];
}

function CategoryPage() {
    const {t} = useTranslation();
    const data: any = useLoaderData();
    const feed = data[0];
    const nameCate = data[1];
    const categoryTitle = t(`categories.${nameCate}`);

    const [windowSize, setWindowSize] = useState({ width: window.innerWidth });
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5; // Số bài mỗi trang phân trang

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isSmallScreen = windowSize.width < 1200;
    const parser = new DOMParser();

    // Bài báo nổi bật
    const topArticle = feed[0];
    const topImage = parser.parseFromString(topArticle.content, 'text/html')
        .querySelector('img')?.getAttribute('src') || "";

    //  4 bài tiếp theo
    const midArticles = feed.slice(1, 5);

    // Phân trang từ bài báo 5
    const paginatedArticles = feed.slice(5);
    const startIndex = (currentPage - 1) * pageSize;
    const currentArticles = paginatedArticles.slice(startIndex, startIndex + pageSize);

    return (
        <WrapperContain>
            <Row>
                <Col span={24}>
                    <WrapperCateName>{categoryTitle}</WrapperCateName>
                    <div style={{width: isSmallScreen ? "90%" : "100%", margin: "20px auto"}}>
                        <Item
                            title={topArticle.title}
                            description={topArticle.contentSnippet}
                            imageUrl={topImage}
                            newsUrl={topArticle.link.replace("https://dantri.com.vn/", "")}
                            style={{width: "100%", height: "100%"}}
                            styleBody={{fontSize: "130%"}}
                            col1={9} col2={15}
                        />
                    </div>
                </Col>
            </Row>

            {/* Hiển thị 4 bài báo kế tiếp */}
            <Row>
                {midArticles.map((item: any, index: number) => {
                    const image = parser.parseFromString(item.content, 'text/html')
                        .querySelector('img')?.getAttribute('src') || "";
                    return (
                        <Col xl={6} lg={8} md={8} sm={24} key={index} style={{margin: "10px auto"}}>
                            <Item
                                title={item.title}
                                description={""}
                                imageUrl={image}
                                newsUrl={item.link.replace("https://dantri.com.vn/", "")}
                                style={{width: "100%", height: "100%"}}
                                styleBody={{}}
                                col1={30} col2={30}
                            />
                        </Col>
                    );
                })}
            </Row>

            {/* Quảng cáo */}
            <AdBanner adUrl="https://www.facebook.com/nhanstp2108" imageUrl="/img.png" height="120px"/>
            <GoogleAdsense/>
            <Caption title={t("caption.moi-nhat")}/>
            <Row>
                {currentArticles.map((item: any, index: number) => {
                    const image = parser.parseFromString(item.content, 'text/html')
                        .querySelector('img')?.getAttribute('src') || "";
                    return (
                        <Col span={24} key={index} style={{marginBottom: "15px"}}>
                            <Item
                                title={item.title}
                                description={item.contentSnippet}
                                imageUrl={image}
                                newsUrl={item.link.replace("https://dantri.com.vn/", "")}
                                style={{width: "100%", height: "100%"}}
                                styleBody={{}}
                                col1={isSmallScreen ? 9 : 6}
                                col2={isSmallScreen ? 15 : 18}
                            />
                        </Col>
                    );
                })}
            </Row>

            {/* Phân trang */}
            <Row justify="center" style={{margin: "20px 0"}}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={paginatedArticles.length}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                />
            </Row>
        </WrapperContain>
    );
}

export default CategoryPage;
