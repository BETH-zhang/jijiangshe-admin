import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Select, Input, Button } from 'antd';
import assign from 'lodash/assign';
import marked from '../../assets/marked.min';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { frames } from '../../common/constant';
import { parseFunc } from '../../utils/utils';

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
const Option = Select.Option;
@connect(({ frame, loading }) => ({
  frame,
  submitting: loading.effects['form/submitRegularForm'],
}))
export default class Document extends PureComponent {
  getPreviewContent = content => {
    if (content) {
      const html = marked(content, markedOptions);
      return html.replace(
        /class="language-/g,
        'style="overflow-x: auto;padding: 20px" class="hljs language-'
      );
    }
    return null;
  };

  getFunContent = (funcName, data) => {
    const content = parseFunc(funcName, data);
    return this.getPreviewContent(content);
  };

  changeContent = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'frame/changeFrame',
      payload,
    });
  };

  changeContentLink = e => {
    const link = e.target.value;
    const scriptFrame = document.getElementById('scriptFrame');
    if (scriptFrame) {
      scriptFrame.src = link;
    } else {
      const ma = document.createElement('script');
      ma.type = 'text/javascript';
      ma.id = 'scriptFrame';
      ma.async = true;
      ma.src = link;
      document.body.appendChild(ma);
    }
    this.changeContent({ newFrameLink: link });
  };

  changeFrame = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'frame/addFrame',
    });
  };

  render() {
    const {
      frame: { data, funcName, previewContent, newFrame, newFrameLink, newFrames },
    } = this.props;

    const allFrames = assign(newFrames, frames);
    return (
      <PageHeaderLayout title="查看各种类库，长点心吧！" content="没有永远的框架，只有永远的类库。">
        <Card bordered={false}>
          <Row>
            <Col sm={4}>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="选择类库"
                optionFilterProp="children"
                onChange={value =>
                  this.changeContent({
                    data: value,
                    funcName: '',
                    previewContent: '',
                  })
                }
              >
                {Object.keys(allFrames).map(key => <Option value={key}>{key}</Option>)}
              </Select>
            </Col>
            <Col sm={4} offset={1}>
              <Input
                placeholder="添加js库名"
                value={newFrame}
                onChange={e => this.changeContent({ newFrame: e.target.value })}
              />
            </Col>
            <Col sm={4} offset={1}>
              <Input
                placeholder="添加js库链接"
                value={newFrameLink}
                onChange={this.changeContentLink}
              />
            </Col>
            <Col sm={4} offset={1}>
              <Button onClick={this.changeFrame}>添加库</Button>
            </Col>
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Col sm={6}>
              {data &&
                allFrames[data] &&
                Object.keys(allFrames[data]).map(key => (
                  <div style={{ display: 'inline-block', marginRight: '20px' }}>
                    <a
                      style={{ color: key === funcName ? 'red' : '' }}
                      onClick={() =>
                        this.changeContent({
                          funcName: key,
                          previewContent: this.getFunContent(key, allFrames[data]),
                        })
                      }
                    >
                      {key}
                    </a>
                  </div>
                ))}
            </Col>
            <Col sm={18}>
              {data &&
                allFrames[data] && (
                  <h2>
                    {data}包含
                    <span style={{ color: 'red' }}>
                      {Object.keys(allFrames[data]).length}
                    </span>个方法
                  </h2>
                )}
              {funcName && (
                <p>
                  {`【key：${funcName}】【typeof: ${typeof allFrames[data][
                    funcName
                  ]}】【Function: ${allFrames[data][funcName] instanceof Function}】`}
                </p>
              )}
              <div dangerouslySetInnerHTML={{ __html: previewContent }} />
            </Col>
          </Row>
        </Card>
      </PageHeaderLayout>
    );
  }
}
