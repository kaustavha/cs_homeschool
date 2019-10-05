import React, { Component } from 'react';

class Launch extends Component {

  render() {

    let launch = this.props.launch;

    return (
      <li>
        <h2> { launch.mission_name } </h2>
        <div> Flight Number: { launch.flight_number } </div>
      </li>
    );
  }
}

export default Launch;
