import React, { Component } from 'react';

import {fetchRocket} from "../actions/Rockets";

function LaunchClickCtrl(props) {
  const {isClicked} = props;
  return <div>
    <LaunchInfo {...props} />
    {isClicked ? <RocketInfo {...props}/> : null}
  </div>
}

function LaunchInfo(props) {
  const {launch} = props;
  return (
    <div>
    <h2> { launch.mission_name } </h2>
    <div> Flight Number: { launch.flight_number } </div>
    </div>
  )
}

function RocketInfo(props) {
  const {rocket} = props;
  if (!rocket || rocket.fetching) {
    return <div> LOADING </div>;
  }

  return (
    <div>
      <p>{ rocket.description }</p>
      <p> Cost per Launch: {rocket.cost_per_launch}</p>
    </div>
    );
}
class Launch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isClicked: false,
      rocket: {}
    }
  }

  componentDidMount() {
    this.setState({isClicked: false})
  }

  expand(dispatch, rocketId) {
    const {isClicked} = this.state;
    if (isClicked) {
      return this.setState({isClicked: false})
    }
    return fetchRocket(dispatch, rocketId).then((res) => {
      this.setState({
        rocket: res.payload.rocket,
        isClicked: true
      })
    })
  }

  render() {
    const {isClicked, rocket} = this.state;
    const { dispatch, rocketId } = this.props;
    return (
        <li>
          <button type='button' onClick={() => this.expand(dispatch, rocketId)}>
            <LaunchClickCtrl isClicked={isClicked} rocket={rocket} {...this.props} />
          </button>
        </li>
    );
  }
}


export default Launch;
