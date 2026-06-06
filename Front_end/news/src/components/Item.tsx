import {NewsItem} from './NewsItem';
import {Card, Col, Row} from "antd";
import {Link} from "react-router-dom";

interface Item extends NewsItem{
    styleBody: any
    style : any,
    col1 : number,
    col2: number
}
export  default function Item({ title, description , imageUrl , newsUrl,style , styleBody, col1, col2}  : Item){
    return (
        <>
            <Link to={`/${newsUrl}`}>
                <Card hoverable style={style}>
                    <Row gutter={16} align="middle">
                        <Col span={col1}>
                            <img alt="news" src={imageUrl} style={{ width: '100%' }} />
                        </Col>
                        <Col span={col2}>
                            <div style={styleBody ||{ padding: '0 16px' }}>
                                <h2>{title}</h2>
                                <p>{description}</p>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </Link>
        </>
    )
}
