import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import { Col, Row } from 'antd';
import Caption from '../../components/Caption/Caption';
import { RSSFeed } from '../../service/rssService';
import Item from '../../components/Item';
import { DetailFeed } from '../../service/detailService';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './style.css';
import CommentBox from "../../components/Comment/CommentBox";
import { useTranslation } from 'react-i18next';

export async function loadUrl({ params }: any) {
    const { category, articleSlug } = params;
    const url = `/${category}/${articleSlug}`; // Cập nhật URL để bao gồm category và articleSlug
    const articleContent = await DetailFeed(`https://dantri.com.vn${url}`); // Cập nhật URL để không thêm slash
    const data = [url, articleContent];
    return data;
}

const DetailPage = () => {
    const { t } = useTranslation();
    const parser = new DOMParser();
    const data: any = useLoaderData();
    const url = `https://dantri.com.vn${data[0]}`;
    const articleContent: any = data[1];
    const cate = useSelector((state: any) => state.cate);
    const [cateName, setCateName] = useState('');
    const [cateItem, setCateItem] = useState([]);
    useEffect(() => {
        let foundCategoryName = '';
        let foundItem = [];
        for (let category of cate.cates) {
            for (let item of category.items) {
                if (item.link === url) {
                    foundCategoryName = category.name;
                    foundItem = category.items;
                    break;
                }
            }
            if (foundCategoryName) break;
        }
        if (foundCategoryName && foundItem) {
            setCateName(foundCategoryName);
            setCateItem(foundItem);
        }
    }, [cate, url]);

    const [newFeed, setNewFeed] = useState([]);
    useEffect(() => {
        async function setFeed() {
            setNewFeed(await RSSFeed("https://dantri.com.vn/rss/home.rss"));
        }
        setFeed();
    }, []);

    const categoryMap: { [key: string]: string } = {
        "Trang chủ": "/trang-chu",
        "Kinh doanh": "/kinh-doanh",
        "Xã hội": "/xa-hoi",
        "Thế giới": "/the-gioi",
        "Giải trí": "/giai-tri",
        "Bất động sản": "/bat-dong-san",
        "Thể thao": "/the-thao",
    };
    let toUrl = `/category${categoryMap[cateName] || ''}`;

    return (
        <div style={{ backgroundColor: '#f2f2f2', padding: '20px 0' }}>
            <div style={{ maxWidth: 1200, margin: "auto", padding: "0 0 20px 15px" }}>
                <Link style={{ textDecoration: "none", color: "black", fontSize: 30 }} to="/">{t('categories.trang-chu')}</Link>
                <Link style={{ textDecoration: "none", fontSize: 25 ,color:"#0E6830"}} to={toUrl}>{" > " + t(cateName)}</Link>
            </div>
            <div style={{ maxWidth: 1200, margin: 'auto', textAlign: 'start', padding: '0px 15px', backgroundColor: 'white' }}>
                <Row>
                    <Col lg={17} md={24}>
                        <h1 className="big_title">{articleContent[0]}</h1>
                        <h3 className="author_name">{t('author')}: {articleContent[1]}</h3>
                        <div className="date" style={{fontStyle:"italic"}}>{articleContent[2]}</div>
                        {/* Đảm bảo nội dung HTML của bài viết được hiển thị đúng */}
                        <div dangerouslySetInnerHTML={{ __html: articleContent[3] }} />
                    </Col>
                    <Col lg={7} md={0} sm={0} xs={0} style={{ paddingTop: 15, paddingLeft: 10 }}>
                        <Row>
                            <Col span={24}>
                                    <Caption title={t('tin-lien-quan')} link={`category/${cateName.toLowerCase()}`} />
                                {cateItem.slice(0, 4).map((item: any, index: any) => {
                                    let imageUrl: any = "";
                                    const doc = parser.parseFromString(item.content, 'text/html');
                                    const imgElement = doc.querySelector('img');
                                    if (imgElement) {
                                        imageUrl = imgElement.getAttribute('src');
                                    }
                                    return (
                                        <div key={index} style={{ marginBottom: "15px" }}>
                                            <Item title={item.title} description={""} imageUrl={imageUrl} newsUrl={item.link.replace("https://dantri.com.vn/", "")} style={{ width: "100%", height: "100%" }} styleBody={{ fontSize: "10px" }} col1={10} col2={14} />
                                        </div>
                                    );
                                })}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <CommentBox articleId={url} />

                <Row>
                    <Col lg={18}>
                        <Caption title={t('moi-nhat')} />
                        {newFeed.slice(1, 10).map((item: any, index: any) => {
                            let imageUrl: any = "";
                            const doc = parser.parseFromString(item.content, 'text/html');
                            const imgElement = doc.querySelector('img');
                            if (imgElement) {
                                imageUrl = imgElement.getAttribute('src');
                            }
                            return (
                                <div key={index} style={{ marginBottom: "15px" }}>
                                    <Item title={item.title} description={item.contentSnippet} imageUrl={imageUrl} newsUrl={item.link.replace("https://dantri.com.vn/", "")} style={{ width: "100%", height: "100%" }} styleBody={""} col1={6} col2={18} />
                                </div>
                            );
                        })}
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default DetailPage;
