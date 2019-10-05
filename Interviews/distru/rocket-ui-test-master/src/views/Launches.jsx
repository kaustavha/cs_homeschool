import React, { Component } from 'react';
import ConnectedView from './ConnectedView';
import {fetchLaunchesIfNeeded} from "../actions/Launches";
// import {fetchRocket} from "../actions/Rockets";
import Launch from '../components/Launch';
 
class LaunchesView extends Component {
  componentDidMount() {
    const { dispatch, launchesCollection } = this.props;
    fetchLaunchesIfNeeded({ dispatch, launchesCollection });
  }

  getContent() {
    const { launchCollection, dispatch } = this.props;

    if (!launchCollection || launchCollection.fetching) {
      return <div> LOADING </div>;
    }

    if (!launchCollection.launches.length) {
      return <div> NO DATA </div>;
    }

    let launches = [];

    for (let i = 0; i < launchCollection.launches.length; i++) {
      const launch = launchCollection.launches[i];
      /*
      * cost per launch 
      * rocket descr
      */
      launches.push(
          <Launch {...{
            key: launch.launch_id,
            rocketId: launch.rocket.rocket_id,
            dispatch,
            launch
          }} />
      )
    }

    return <ul>{launches}</ul>;
  }

  expand() {
    const { dispatch, rocketId } = this.props;
    fetchRocket(dispatch, rocketId).then((res) => {
      this.setState({
        rocket: res.payload.rocket,
        isClicked: true
      })
    })
  }

  render() {
    return (
      <div>
        <h2> SpaceX launches </h2>
        {this.getContent()}
      </div>
    );
  }
}

export default ConnectedView(LaunchesView, 'launches');
