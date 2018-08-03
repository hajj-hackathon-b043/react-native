import React, {Component} from 'react';
import {View, Text, TextInput, Alert} from 'react-native';
import {FormLabel, FormInput, FormValidationMessage, Button} from 'react-native-elements'

export default class PushAnnouncement extends Component<Props> {

    state = {
        text: "",
    }

    async sendNotification() {

        if(this.state.text.length < 3){
            Alert.alert(
                'إرسال إشعار',
                'الرسالة قصيرة جداً .. الرجاء كتابة رسالة كاملة',
                [
                    {text: 'موافق', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: true }
            );

            return;
        }

        const requestOptions = {
            method: 'POST',
            // url: 'http://localhost:3000/notifications/notify-topic',
            url: 'https://desolate-caverns-43961.herokuapp.com/notifications/notify-topic',
            headers: {'Content-Type': 'application/json'},
            body: {
                "message": {
                    "title": "إعلان من حملة رقم b-45",
                    "body": this.state.text,
                },
                "topic":"b-45"
            }
        };

        console.log(requestOptions);
        try {
            const result = await fetch(requestOptions.url, {
                method: requestOptions.method,
                headers: requestOptions.headers,
                body: JSON.stringify(requestOptions.body)
            });

            if(result){
                this.setState({text: ""})

                Alert.alert(
                    'إرسال إشعار',
                    'تم إرسال إشعار إلى جميع أفراد الحملة',
                    [
                        {text: 'موافق', onPress: () => console.log('OK Pressed')},
                    ],
                    { cancelable: true }
                );
            }


            // console.log(result);
            // if (!result)
            // throw "No Response";

        } catch (error) {
            throw error
        }
    }

    render() {
        return (
            <View style={{paddingTop: 35, width: '100%'}}>
                <View style={{margin: 15}}>
                    <Text style={{textAlign: 'right'}}>الرسالة</Text>

                    <TextInput
                        style={{height: 180, borderColor: '#ababab', borderRadius: 15, borderWidth: 1, marginTop: 10, padding: 15}}
                        onChangeText={(text) => this.setState({text})}
                        value={this.state.text}
                        multiline={true}
                    />
                </View>

                <Button
                    onPress={()=>this.sendNotification()}
                    small
                    containerViewStyle={{margin: 0, padding:0, paddingTop: 15}}
                    buttonStyle={{margin: 0, borderRadius: 15}}
                    icon={{name: 'send-o', type: 'font-awesome'}}
                    title='إرسال'
                />

            </View>
        )
    }
}