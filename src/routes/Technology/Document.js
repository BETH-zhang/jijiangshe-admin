import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Row, Col, Input } from 'antd';
import marked from '../../assets/marked.min';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Document.less';

window.hljs.initHighlightingOnLoad();
const rendererMD = new marked.Renderer();
const markedOptions = {
  renderer: rendererMD,
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight: code => {
    return window.hljs.highlightAuto(code).value;
  },
};

@connect(({ docs, loading }) => ({
  docs,
  submitting: loading.effects['form/submitRegularForm'],
}))
export default class Document extends PureComponent {
  getPreviewContent = content => {
    const html = marked(content, markedOptions);
    return html.replace(/language-/g, 'hljs language-');
  };

  changeContent = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'docs/addData',
      payload,
    });
  };

  wheelHandler = (e, target) => {
    if (target === 'left') {
      this.right.scrollTop = this.left.scrollTop;
    } else {
      this.left.scrollTop = this.right.scrollTop;
    }
  };

  keepLastIndex = obj => {
    if (window.getSelection) {
      // ie11 10 9 ff safari
      obj.focus(); // 解决ff不获取焦点无法定位问题
      const range = window.getSelection(); // 创建range
      range.selectAllChildren(obj); // range 选择obj下所有子内容
      range.collapseToEnd(); // 光标移至最后
    } else if (document.selection) {
      // ie10 9 8 7 6 5
      const range = document.selection.createRange(); // 创建选择对象
      // var range = document.body.createTextRange();
      range.moveToElementText(obj); // range定位到obj
      range.collapse(false); // 光标移至最后
      range.select();
    }
  };

  render() {
    const {
      docs: {
        data: { content, previewContent },
      },
    } = this.props;

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
          <Row className={styles.docContainer}>
            <Col sm={12}>
              <div
                ref={node => {
                  this.left = node;
                }}
                className={styles.docContent}
                contentEditable="plaintext-only"
                defaultValue={content}
                onInput={e =>
                  this.changeContent({
                    content: e.target.innerText,
                    previewContent: this.getPreviewContent(e.target.innerText),
                  })
                }
                onWheel={e => this.wheelHandler(e, 'left')}
                onScroll={e => this.wheelHandler(e, 'left')}
              />
            </Col>
            <Col sm={12}>
              <div
                ref={node => {
                  this.right = node;
                }}
                className={styles.docContent}
                onWheel={e => this.wheelHandler(e, 'right')}
                onScroll={e => this.wheelHandler(e, 'right')}
                dangerouslySetInnerHTML={{ __html: previewContent }}
              />
            </Col>
          </Row>
          <Button type="primary">提交</Button>
        </Card>
      </PageHeaderLayout>
    );
  }
}
