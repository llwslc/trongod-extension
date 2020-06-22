import React from 'react';
import styled from 'styled-components';
import { Switch } from 'antd';

import { getGodModeValue, setGodModeValue } from '../utils';

import Logo from '../logo.png';

const Option = styled.div`
  display: inline;
  margin-right: 0.5em;
`;

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { godModeFlag: false };
  }

  componentDidMount = () => {
    getGodModeValue(value => {
      this.setState({ godModeFlag: value });
    });
  };

  godModeChange = checked => {
    setGodModeValue(checked, () => {});
    this.setState({ godModeFlag: checked });
  };

  render() {
    return (
      <div style={{ margin: '1em' }}>
        <div style={{ float: 'right' }}>
          <Option>God Mode:</Option>
          <Switch onChange={this.godModeChange} checked={this.state.godModeFlag} size="small" />
        </div>
        <img src={Logo} alt="" style={{ marginTop: '-1.5em', marginLeft: '10%', width: '80%' }} />
      </div>
    );
  }
}

export default Settings;
