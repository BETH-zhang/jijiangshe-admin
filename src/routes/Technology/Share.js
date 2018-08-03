import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';
import moment from 'moment';

@connect(({ share, loading }) => ({
  share,
  loading: loading.models.share,
}))
export default class Share extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'share/fetchShare',
    });
  }

  render() {
    const { share, loading } = this.props;
    const { list } = share;
    console.log(list, loading);

    return (
      <Row gutter={24}>
        {list.map(item => (
          <Col xs={8} style={{ marginBottom: 24 }}>
            <Card bordered={false}>
              <img src={item.cover} alt="" width="100%" />
              <h3>{item.title}</h3>
              <h3>{item.subTitle}</h3>
              <hr />
              <p>分享人：{item.masterCeremonies}</p>
              <p>地点：{item.address}</p>
              <p>
                分享时间：<br />
                {moment(item.schedule).format('YYYY/MM/DD HH:mm')}
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }
}
