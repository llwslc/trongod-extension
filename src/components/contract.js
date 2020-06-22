import React from 'react';
import styled from 'styled-components';
import { CopyOutlined, CheckOutlined, SearchOutlined } from '@ant-design/icons';
import { Divider, Input } from 'antd';
import copy from 'copy-to-clipboard';

import { getContractValue } from '../utils';

const { TextArea } = Input;

const Title = styled.div`
  margin: 1em 0;
`;

class CopyTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false
    };
  }

  componentDidMount = () => {};

  copyToClipboard = () => {
    copy(this.props.text);

    this.setState({ copied: true });

    setTimeout(() => {
      this.setState({ copied: false });
    }, 3000);
  };

  render() {
    return (
      <div style={{ display: 'inline' }}>
        {this.state.copied ? (
          <span>
            <CheckOutlined /> copied!
          </span>
        ) : (
          <CopyOutlined onClick={this.copyToClipboard} />
        )}
      </div>
    );
  }
}

class Contract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addr: '',
      func: '',
      args: ''
    };
  }

  componentDidMount = () => {
    getContractValue(d => {
      this.setState({
        addr: d.addr,
        func: d.func,
        args: d.args
      });
    });
  };

  gotoAddr = () => {
    window.open(`https://tronscan.io/#/contract/${this.state.addr}/code`);
  };

  render() {
    return (
      <div style={{ margin: '0 1em 1em 1em' }}>
        <Divider style={{ margin: 0 }} />
        <Title>
          Contract Address: <CopyTag text={this.state.addr} />
        </Title>
        <Input value={this.state.addr} suffix={<SearchOutlined onClick={this.gotoAddr} />} />
        <Title>
          Function Selector: <CopyTag text={this.state.func} />
        </Title>
        <Input value={this.state.func} />
        <Title>
          Argument Encoding: <CopyTag text={this.state.args} />
        </Title>
        <TextArea rows={4} value={this.state.args} />
      </div>
    );
  }
}

export default Contract;
