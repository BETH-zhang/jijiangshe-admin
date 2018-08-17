import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import filter from 'lodash/filter';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  Progress,
  Button,
  Checkbox,
  Select,
  DatePicker,
  message,
} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Tasks.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
// const { Search } = Input;
const { Option } = Select;
const STATUS = ['active', 'exception', 'normal'];

@connect(({ list, tasks, tags, loading }) => ({
  list,
  tasks,
  tags,
  loading: loading.models.list,
  tasksLoading: loading.effects['tasks/fetchTasks'],
  tagsLoading: loading.effects['tags/fetchAllTags'],
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
      type: 'tags/fetchAllTags',
    });
  }

  getCurrentProgress = (status, deadline, createdAt) => {
    if (status === 1) {
      return 100;
    } else if (moment().format('X') - moment(deadline).format('X') > 0) {
      return 99;
    } else {
      const currentTime = moment().format('X');
      const createAtTime = moment(createdAt).format('X');
      const deadlineTime = moment(deadline).format('X');
      return Math.floor(((currentTime - createAtTime) / (deadlineTime - createAtTime)) * 100);
    }
  };

  getCurrentStatus = (status, deadline, createdAt) => {
    const currentProgress = this.getCurrentProgress(status, deadline, createdAt);
    if (currentProgress === 99) {
      return STATUS[1];
    } else if (currentProgress === 100) {
      return STATUS[0];
    }
    return STATUS[2];
  };

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

  updateTask = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tasks/fetchUpdateTask',
      payload,
    });
  };

  deleteTask = id => {
    console.log(id);
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'tasks/fetchDeleteTask',
    //   payload: { id },
    // });
  };

  radioGroupChange = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tasks/updateStatus',
      payload: Number(e.target.value),
    });
  };

  render() {
    const {
      tasks: { list, addTask, data, status },
      tasksLoading,
      tags,
    } = this.props;

    const listByStatus = [];
    list.forEach(item => {
      if (status === -1) {
        listByStatus.push(item);
      } else if (item.status === status) {
        listByStatus.push(item);
      }
    });

    console.log(filter(list, item => status === -1 || item.status === status), '==');
    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent} onChange={this.radioGroupChange}>
        <RadioGroup defaultValue="progress" value={status}>
          <RadioButton value={-1}>全部</RadioButton>
          <RadioButton value={0}>进行中</RadioButton>
          <RadioButton value={1}>已完成</RadioButton>
        </RadioGroup>
        {/* <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} /> */}
      </div>
    );

    const paginationProps = null;

    const ListContent = ({ userId, createdAt, deadline, ...rest }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>Owner</span>
          <p>{userId || 'BETH'}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>截止时间</span>
          <p>{moment(deadline).format('YYYY-MM-DD HH:mm')}</p>
        </div>
        <div className={styles.listContentItem}>
          <Progress
            percent={this.getCurrentProgress(rest.status, deadline, createdAt)}
            status={this.getCurrentStatus(rest.status, deadline, createdAt)}
            strokeWidth={6}
            style={{ width: 180 }}
          />
        </div>
      </div>
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
                  value={data.tagId ? tags.data[data.tagId][0].name : '请选择分类'}
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
                  value={data.deadline && moment(data.deadline)}
                  style={{ width: '100%' }}
                  onChange={m => this.addTaskData({ deadline: m.format() })}
                />
              </Col>

              <Col sm={24} style={{ textAlign: 'center' }}>
                <Button
                  type={data.task && data.tagId && data.deadline && 'primary'}
                  onClick={
                    data.task && data.tagId && data.deadline
                      ? this.addTask
                      : () => message.error('提交字段有空值')
                  }
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
            title={
              <div>
                任务列表&nbsp;&nbsp;
                <Button
                  type="dashed"
                  onClick={this.openAddTask}
                  style={{ marginBottom: 8 }}
                  icon="plus"
                >
                  {addTask ? '取消添加' : '添加'}
                </Button>
              </div>
            }
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              loading={tasksLoading}
              pagination={paginationProps}
              dataSource={listByStatus}
              renderItem={item => (
                <List.Item
                  actions={[<a>编辑</a>, <a onClick={() => this.deleteTask(item.id)}>删除</a>]}
                >
                  <List.Item.Meta
                    avatar={
                      <Checkbox
                        checked={item.status}
                        onClick={e =>
                          this.updateTask({
                            status: e.target.checked ? 1 : 0,
                            id: item.id,
                          })
                        }
                      />
                    }
                    title={<span>{item.task}</span>}
                    description={item.description}
                  />
                  <ListContent {...item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
