import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Row, Col, Input } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
export default class Document extends PureComponent {
  changeContent = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tasks/addData',
      payload,
    });
  };

  render() {
    return (
      <PageHeaderLayout
        title="写点东西吧，开心每一天！"
        content="Innovation distinguishes between a leader and a follower.领袖和跟风者的区别就在于创新。"
      >
        <Card bordered={false}>
          <Row>
            <Col sm={7}>
              <Input
                placeholder="为你的文档起一个好名字吧"
                onChange={e => this.changeContent({ task: e.target.value })}
              />
            </Col>
          </Row>
          <Button type="primary">提交</Button>
        </Card>
      </PageHeaderLayout>
    );
  }
}
