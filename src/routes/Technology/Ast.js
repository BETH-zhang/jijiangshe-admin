import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Button } from 'antd';
// import acorn from '../../assets/acorn';
// import assign from 'lodash/assign';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Document.less';
// import { frames } from '../../common/constant';

const acorn = require('../../assets/acorn').acorn;

const d3 = window.d3;

console.log(acorn, '???', d3);

@connect(({ ast }) => ({
  ast,
  // submitting: loading.effects['form/submitRegularForm'],
}))
export default class AST extends PureComponent {
  componentDidMount() {
    this.initD3();

    const {
      ast: { content },
    } = this.props;
    const data = this.formatData(acorn.parse(content));

    console.log('data', data);
    this.createD3(data);
  }

  createD3 = root => {
    this.svg.each(orientation => {
      const ele = document.querySelector('g');
      const svg = d3.select(ele);
      const o = orientation.value;

      // Compute the layout.
      const tree = d3.layout.tree().size(o.size);
      const nodes = tree.nodes(root);
      const links = tree.links(nodes);

      // Create the link lines.
      svg
        .selectAll('.link')
        .data(links)
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr(
          'd',
          d3.svg.diagonal().projection(d => {
            return [o.x(d), o.y(d)];
          })
        )
        .attr('style', 'fill: none;stroke: #000;');

      // Create the node circles.
      svg
        .selectAll('.node')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('class', 'node')
        .attr('r', 10)
        .attr('cx', o.x)
        .attr('cy', o.y)
        .attr('style', 'stroke: #fff;');

      svg
        .selectAll('.MyText')
        .data(nodes)
        .enter()
        .append('text')
        .attr('class', 'text')
        .attr('x', item => {
          return item.x + 12;
        })
        .attr('y', item => {
          return item.y - 20;
        })
        .attr('dy', '2em')
        .text(d => {
          return d.type;
        })
        .attr('style', 'shape-rendering: crispEdges; stroke: #000');
    });
  };

  formatData = nodes => {
    console.log(1, nodes);

    if (!nodes.type) {
      return {};
    }

    if (nodes.type && nodes.type !== 'Literal') {
      const type = nodes.type;
      console.log(2, Object.keys(nodes));

      const children = [];

      Object.keys(nodes).forEach(key => {
        console.log(3, key, nodes[key]);

        if (isArray(nodes[key])) {
          nodes[key].forEach(item => {
            children.push(this.formatData(item));
          });
        } else if (isObject(nodes[key])) {
          children.push(this.formatData(nodes[key]));
        }
      });

      return {
        type,
        children,
      };
    }

    return {};
  };

  initD3 = () => {
    const margin = { top: 10, right: 10, bottom: 100, left: 10 };
    const width = 700 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const orientations = {
      'top-to-bottom': {
        size: [width, height],
        x: d => {
          return d.x;
        },
        y: d => {
          return d.y;
        },
      },
    };

    this.svg = d3
      .select('#svgRoot')
      .selectAll('svg')
      .data(d3.entries(orientations))
      .enter()
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  };

  changeContent = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ast/addData',
      payload,
    });
  };

  handleClick = () => {
    const {
      ast: { content },
    } = this.props;

    const ele = document.querySelector('g');
    ele.innerHTML = '';
    const data = this.formatData(acorn.parse(content));
    console.log('data', data);
    this.createD3(data);
  };

  render() {
    const {
      ast: { content },
    } = this.props;
    return (
      <PageHeaderLayout title="JS解析成AST" content="我猜你不肯定不会！">
        <Card bordered={false}>
          <Row>
            <Col sm={12}>
              <Button onClick={this.handleClick}>解析</Button>
              <div>{content}</div>
              <div
                className={styles.docContent}
                style={{ border: '1px solid #ccc', height: '500px' }}
                contentEditable="plaintext-only"
                defaultValue={content}
                onInput={e =>
                  this.changeContent({
                    content: e.target.innerText,
                  })
                }
              />
            </Col>
            <Col sm={12}>
              <div id="svgRoot" />
            </Col>
          </Row>
        </Card>
      </PageHeaderLayout>
    );
  }
}
