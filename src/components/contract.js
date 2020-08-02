import React from 'react';
import styled from 'styled-components';
import { CopyOutlined, SearchOutlined } from '@ant-design/icons';
import { Divider, Typography, Space, Tooltip } from 'antd';

import { getContractValue } from '../utils';

const { Text, Link } = Typography;

const Info = styled.div`
  width: 100%;
  min-height: ${props => (props.rows ? props.rows * 32 : 32)}px;
  border: 1px solid transparent;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
  padding: 4px 0.5em;
  border-radius: 2px;
  color: rgba(0, 0, 0, 0.65);
  border-color: #d9d9d9;
  overflow-wrap: break-word;
`;

const RLink = styled(Link)`
  float: right;
`;

class CopyIcon extends React.Component {
  render() {
    return <CopyOutlined style={{ color: 'rgba(0, 0, 0, 0.65)' }} />;
  }
}

class SearchIcon extends React.Component {
  render() {
    return <SearchOutlined style={{ color: 'rgba(0, 0, 0, 0.65)' }} />;
  }
}

class Contract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addr: '',
      func: '',
      args: '',
      val: 0,
      tid: 0,
      tname: '',
      tabbr: '',
      tval: 0
    };
  }

  componentDidMount = () => {
    getContractValue(d => {
      this.setState({
        addr: d.addr ? d.addr : '',
        func: d.func ? d.func : '',
        args: d.args ? d.args : '',

        val: d.val ? d.val : 0,
        tid: d.tid ? d.tid : 0,
        tname: d.tname ? d.tname : '',
        tabbr: d.tabbr ? d.tabbr : '',
        tval: d.tval ? d.tval : 0

        // addr: d.addr ? d.addr : 'addr',
        // func: d.func ? d.func : 'func',
        // args: d.args ? d.args : 'arg',
        // val: d.val ? d.val : 1,
        // tid: d.tid ? d.tid : 1002000,
        // tname: d.tname ? d.tname : 'BitTorrent',
        // tabbr: d.tabbr ? d.tabbr : 'BTT',
        // tval: d.tval ? d.tval : 1
      });
    });
  };

  render() {
    return (
      <div style={{ margin: '0 1em 1em 1em' }}>
        <Divider style={{ margin: 0 }} />
        <Space direction="vertical" style={{ margin: '1em 0', width: '100%' }}>
          <Text>
            Contract Address: <Text copyable={{ text: this.state.addr, icon: <CopyIcon /> }} />
          </Text>
          <Info>
            {this.state.addr}
            <RLink href={`https://tronscan.io/#/contract/${this.state.addr}/code`} target="_blank">
              <SearchIcon />
            </RLink>
          </Info>

          <Text>
            Function Selector: <Text copyable={{ text: this.state.func, icon: <CopyIcon /> }} />
          </Text>
          <Info>{this.state.func}</Info>

          {this.state.val ? (
            <Text>
              Call Value: <Text type="danger">{this.state.val} TRX</Text>
            </Text>
          ) : null}
          {this.state.tval ? (
            <Tooltip title={`ID: ${this.state.tid}`}>
              <Text>Call Token {this.state.tname}: </Text>
              <Text type="danger">
                {this.state.tval} {this.state.tabbr}
              </Text>
            </Tooltip>
          ) : null}

          <Text>
            Argument Encoding: <Text copyable={{ text: this.state.args, icon: <CopyIcon /> }} />
          </Text>
          <Info rows={4}>{this.state.args}</Info>
        </Space>
      </div>
    );
  }
}

export default Contract;
