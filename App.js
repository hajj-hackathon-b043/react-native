/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import BackgroundGeolocationComponent from './app/components/BackgroundGeolocationComponent';
import PushAnnouncement from './app/components/PushAnnouncement';


type Props = {};
export default class App extends Component<Props> {

    render() {
        return (

            <View style={styles.container}>
                <BackgroundGeolocationComponent group='testGroup' />

                <PushAnnouncement />


            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'rgb(241, 241, 241)',
    },
});
