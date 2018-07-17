import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  Progress,
  Button,
  Icon,
  Dropdown,
  Menu,
  Checkbox,
  Select,
  DatePicker,
} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Tasks.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;
const { Option } = Select;

@connect(({ list, tasks, tags, loading }) => ({
  list,
  tasks,
  tags,
  loading: loading.models.list,
  tasksLoading: loading.effects['tasks/fetchTasks'],
  tagsLoading: loading.effects['tags/fetchTags'],
}))
export default class Tasks extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 5,
      },
    });
    dispatch({
      type: 'tasks/fetchTasks',
    });
    dispatch({
      type: 'tags/fetchTags',
    });
  }

  openAddTask = () => {
    const {
      dispatch,
      tasks: { addTask },
    } = this.props;
    dispatch({
      type: 'tasks/addTask',
      payload: !addTask,
    });
    dispatch({
      type: 'tasks/cancelAddTask',
    });
  };

  addTaskData = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tasks/addData',
      payload,
    });
  };

  addTask = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tasks/fetchAddTask',
    });
  };

  render() {
    const {
      tasks: { list, addTask, data },
      tasksLoading,
      tags,
    } = this.props;

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="progress">进行中</RadioButton>
          <RadioButton value="waiting">等待中</RadioButton>
        </RadioGroup>
        <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
      </div>
    );

    const paginationProps = null;

    const ListContent = ({ data: { userId, createdAt, percent, status } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>Owner</span>
          <p>{userId}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>开始时间</span>
          <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
        </div>
        <div className={styles.listContentItem}>
          <Progress
            percent={percent || 100}
            status={status}
            strokeWidth={6}
            style={{ width: 180 }}
          />
        </div>
      </div>
    );

    const menu = (
      <Menu>
        <Menu.Item>
          <a>编辑</a>
        </Menu.Item>
        <Menu.Item>
          <a>删除</a>
        </Menu.Item>
      </Menu>
    );

    const MoreBtn = () => (
      <Dropdown overlay={menu}>
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );

    return (
      <PageHeaderLayout>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="我的待办" value="8个任务" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="本周任务平均处理时间" value="32分钟" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="本周完成任务数" value="24个任务" />
              </Col>
            </Row>
          </Card>

          <Card
            title="添加任务"
            bordered={false}
            style={{ display: addTask ? 'block' : 'none', marginTop: 24 }}
          >
            <Row>
              <Col sm={7} offset={1}>
                <Input
                  placeholder="添加任务"
                  value={data.task}
                  onChange={e => this.addTaskData({ task: e.target.value })}
                />
              </Col>
              <Col sm={7} offset={1}>
                <Select
                  value={data.tagId || '请选择分类'}
                  style={{ width: '100%' }}
                  onChange={val => this.addTaskData({ tagId: Number(val) })}
                >
                  {tags.list.map(
                    item =>
                      item.type === 'todo' ? <Option key={item.id}>{item.name}</Option> : null
                  )}
                </Select>
              </Col>
              <Col sm={7} offset={1}>
                <DatePicker
                  value={data.deadline ? moment(data.deadline) : moment()}
                  style={{ width: '100%' }}
                  onChange={m => this.addTaskData({ deadline: m.format() })}
                />
              </Col>

              <Col sm={24} style={{ textAlign: 'center' }}>
                <Button
                  type="primary"
                  onClick={this.addTask}
                  style={{ marginTop: '24px' }}
                  icon="plus"
                >
                  提交
                </Button>
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title="标准列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button
              type="dashed"
              onClick={this.openAddTask}
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
            >
              {addTask ? '取消添加' : '添加'}
            </Button>

            <List
              size="large"
              rowKey="id"
              loading={tasksLoading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <List.Item actions={[<a>编辑</a>, <MoreBtn />]}>
                  <List.Item.Meta
                    avatar={<Checkbox />}
                    title={<span>{item.task}</span>}
                    description={item.description}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
