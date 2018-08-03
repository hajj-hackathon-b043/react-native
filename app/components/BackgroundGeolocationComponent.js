import React, {Component} from 'react';
import {View, Switch, Text} from 'react-native';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';

export default class BackgroundGeolocationComponent extends Component<Props> {

    state = {
        tracking: true
    }

    componentDidMount() {
        BackgroundGeolocation.configure({
            desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
            stationaryRadius: 50,
            distanceFilter: 50,
            notificationTitle: 'Background tracking',
            notificationText: 'DISABLED',
            debug: true,
            startOnBoot: false,
            stopOnTerminate: false,
            locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
            interval: 10000,
            fastestInterval: 5000,
            activitiesInterval: 10000,
            stopOnStillActivity: false,
            // url: 'http://localhost:3000/tracking/locations',
            url: 'https://desolate-caverns-43961.herokuapp.com/tracking/locations',
            // syncUrl: 'http://localhost:3000/tracking/sync',
            syncUrl: 'https://desolate-caverns-43961.herokuapp.com/tracking/sync',
            syncThreshold: 100,
            httpHeaders: {
                'X-AUTHORIZATION': this.props.group
            },
            // customize post properties
            postTemplate: {
                latitude: '@latitude',
                longitude: '@longitude',
                group: this.props.group // you can also add your own properties
            }
        });

        BackgroundGeolocation.on('location', (location) => {
            // handle your locations here
            // to perform long running operation on iOS
            // you need to create background task
            BackgroundGeolocation.startTask(taskKey => {
                // execute long running task
                // eg. ajax post location
                // IMPORTANT: task has to be ended by endTask
                BackgroundGeolocation.endTask(taskKey);
            });
        });

        BackgroundGeolocation.on('stationary', (stationaryLocation) => {
            // handle stationary locations here
            Actions.sendLocation(stationaryLocation);
        });

        BackgroundGeolocation.on('error', (error) => {
            console.log('[ERROR] BackgroundGeolocation error:', error);
        });

        BackgroundGeolocation.on('start', () => {
            console.log('[INFO] BackgroundGeolocation service has been started');
        });

        BackgroundGeolocation.on('stop', () => {
            console.log('[INFO] BackgroundGeolocation service has been stopped');
        });

        BackgroundGeolocation.on('authorization', (status) => {
            console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
            if (status !== BackgroundGeolocation.AUTHORIZED) {
                // we need to set delay or otherwise alert may not be shown
                setTimeout(() =>
                    Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
                        {text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings()},
                        {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'}
                    ]), 1000);
            }
        });

        BackgroundGeolocation.on('background', () => {
            console.log('[INFO] App is in background');
        });

        BackgroundGeolocation.on('foreground', () => {
            console.log('[INFO] App is in foreground');
        });

        BackgroundGeolocation.checkStatus(status => {
            console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
            console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
            console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

            // you don't need to check status before start (this is just the example)
            if (!status.isRunning) {
                BackgroundGeolocation.start(); //triggers start on start event
            }
        });
        // you can also just start without checking for status
        // BackgroundGeolocation.start();
    }

    componentWillUnmount() {
        // unregister all event listeners
        BackgroundGeolocation.events.forEach(event => BackgroundGeolocation.removeAllListeners(event));
    }

    render() {
        return (
            <View style={{paddingTop: 35, width: '100%'}}>
                <View style={{margin: 15, justifyContent: 'space-between', flexDirection: 'row'}}>
                    <Switch onValueChange={(value) => {
                        this.setState({tracking: value})

                        if(value)
                            BackgroundGeolocation.start();
                        else
                            BackgroundGeolocation.stop();

                    }}
                            value={this.state.tracking}/>
                    <Text> تفعيل التتبع:</Text>
                </View>
            </View>
        )
    }

}