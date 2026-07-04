import React from 'react';
import { Card } from 'antd';
import {Link} from "react-router-dom";

const { Meta } = Card;
export interface NewsItem {
    title : string,
    description ?: string,
    imageUrl : string,
    newsUrl : string,
}
export const NewsItem = ({ title, description, imageUrl, newsUrl} : NewsItem) => {
    // console.log(title);
    return (
        <>
            <Link to={newsUrl}>
                <Card
                    hoverable
                    style={{ width: "100%", height: "100%", margin: '20px auto' }}
                    cover={imageUrl && <img alt="news" src={imageUrl} />}
                >
                    <Meta
                        description={
                            <>
                                <h3 style={{color : "black"}}>{title}</h3>
                                {!description ? '' : <p>{description}</p>}
                            </>
                        }
                    />
                </Card>
            </Link>
        </>

    );
};