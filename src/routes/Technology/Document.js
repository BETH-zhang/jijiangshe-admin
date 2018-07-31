import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Row, Col, Input, Select } from 'antd';
import config from '../../common/config';
import marked from '../../assets/marked.min';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Document.less';
import { markdownStyle } from '../../common/constant';

const markdownPath = `${config.api}/markdown-css-themes/index.html`;

window.hljs.initHighlightingOnLoad();

const Option = Select.Option;
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
  componentWillMount() {
    this.changeContent({ previewContent: '' });
    // const markdownLink = document.getElementById('markdownStyle');
    // markdownLink.href = `${markdownPath}/markdown.css`;
  }

  getPreviewContent = content => {
    const html = marked(content, markedOptions);
    return html.replace(/language-/g, 'hljs language-');
  };

  saveDoc = preview => {
    const { dispatch } = this.props;
    dispatch({
      type: 'docs/fetchAddDoc',
      payload: { preview },
    });
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

  scrollToY = (toY, step = 10) => {
    const diff = this.right.scrollTop - toY;
    const realStep = diff > 0 ? -step : step;
    if (Math.abs(diff) > step) {
      this.right.scrollTop = this.right.scrollTop + realStep;
      requestAnimationFrame(() => {
        this.scrollToY(toY, step);
      });
    } else {
      this.right.scrollTop = toY;
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
                onChange={e => this.changeContent({ title: e.target.value })}
              />
            </Col>
            <Col sm={7} offset={1}>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="选择文档样式"
                optionFilterProp="children"
                onChange={value => this.changeContent({ style: value })}
              >
                {markdownStyle.map(item => <Option value={item}>{item}</Option>)}
              </Select>
            </Col>
            <Col sm={7} offset={1}>
              <a href={markdownPath} target="_blank" without rel="noopener noreferrer">
                查看文档样式库
              </a>
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
                style={{ background: 'rgba(255, 193, 7, 0.13)' }}
                onWheel={e => this.wheelHandler(e, 'right')}
                onScroll={e => this.wheelHandler(e, 'right')}
                dangerouslySetInnerHTML={{ __html: previewContent }}
              />
            </Col>
          </Row>
          <Button type="primary" onClick={() => this.saveDoc()}>
            提交
          </Button>&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={() => this.saveDoc('preview')}>
            预览
          </Button>&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={() => this.saveDoc('print')}>
            打印
          </Button>
        </Card>
      </PageHeaderLayout>
    );
  }
}
