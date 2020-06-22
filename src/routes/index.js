import React from 'react';

import Settings from '../components/settings';
import Contract from '../components/contract';

import './index.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { popup: false };
  }

  componentDidMount = () => {
    if (window.location.hash) {
      this.setState({ popup: true });
    }
  };

  render() {
    return (
      <div className="app" style={{ width: '360px', padding: 0, overflowY: 'scroll' }}>
        {this.state.popup ? null : <Settings />}
        <Contract />
      </div>
    );
  }
}

export default App;
