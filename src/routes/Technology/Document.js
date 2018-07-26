import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
export default class Document extends PureComponent {
  render() {
    return (
      <PageHeaderLayout
        title="写点东西吧，开心每一天！"
        content="Innovation distinguishes between a leader and a follower.领袖和跟风者的区别就在于创新。"
      >
        <Card bordered={false}>
          <Button type="primary">提交</Button>
        </Card>
      </PageHeaderLayout>
    );
  }
}
