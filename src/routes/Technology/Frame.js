import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Select } from 'antd';
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
      return html.replace(/language-/g, 'hljs language-');
    }
    return null;
  };

  getFunContent = (funcName, data) => {
    const tmp = '```';
    console.log(data[funcName], '===');
    const func = parseFunc(data[funcName]);
    const content = func && `${tmp}js\n${func}\n${tmp}`;
    return this.getPreviewContent(content);
  };

  changeContent = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'frame/changeFrame',
      payload,
    });
  };

  render() {
    const {
      frame: { data, funcName, previewContent },
    } = this.props;
    console.log(data, frames[data], data && frames[data] && Object.keys(frames[data]));
    return (
      <PageHeaderLayout title="查看各种类库，长点心吧！" content="没有永远的框架，只有永远的类库。">
        <Card bordered={false}>
          <Row>
            <Col sm={7}>
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
                {Object.keys(frames).map(key => <Option value={key}>{key}</Option>)}
              </Select>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              {data &&
                frames[data] &&
                Object.keys(frames[data]).map(key => (
                  <div style={{ display: 'inline-block', marginRight: '20px' }}>
                    <a
                      style={{ color: key === funcName ? 'red' : '' }}
                      onClick={() =>
                        this.changeContent({
                          funcName: key,
                          previewContent: this.getFunContent(key, frames[data]),
                        })
                      }
                    >
                      {key}
                    </a>
                  </div>
                ))}
            </Col>
            <Col sm={12}>
              {data &&
                frames[data] && (
                  <h2>
                    {data}包含
                    <span style={{ color: 'red' }}>{Object.keys(frames[data]).length}</span>个方法
                  </h2>
                )}
              {funcName && (
                <p>
                  {`【key：${funcName}】【typeof: ${typeof frames[data][
                    funcName
                  ]}】【Function: ${frames[data][funcName] instanceof Function}】`}
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
