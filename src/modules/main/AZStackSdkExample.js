import React from 'react';
import {
    Dimensions,
    ScrollView,
    View,
    Text,
    Button,
    Platform
} from 'react-native';

import AZStackSdk from '../../common/azstack/sdk/';

class AZStackSdkExample extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            authenticatedUser: null,
        };
    };

    showConversations() {
        this.refs.AZStackSdk.showConversations({});
    };

    startChatUser(options) {
        this.refs.AZStackSdk.startChat({
            chatType: this.refs.AZStackSdk.AZStackCore.chatConstants.CHAT_TYPE_USER,
            chatId: 387212
        });
    };

    startChatGroup(options) {
        this.refs.AZStackSdk.startChat({
            chatType: this.refs.AZStackSdk.AZStackCore.chatConstants.CHAT_TYPE_GROUP,
            chatId: 7436
        });
    };

    showNumberPad() {
        this.refs.AZStackSdk.showNumberPad({});
    };

    audioCall() {
        this.refs.AZStackSdk.startAudioCall({
            callData: {
                fullname: 'Test User 2',
                toUserId: 387212,
            },
            onEndCall: () => { }
        });
    };

    videoCall() {
        this.refs.AZStackSdk.startVideoCall({
            callData: {
                fullname: 'Test User 2',
                toUserId: 387212,
            },
            onEndCall: () => { }
        });
    };

    showCallLogs() {
        this.refs.AZStackSdk.showCallLogs({});
    };

    showUser() {
        this.refs.AZStackSdk.showUser({ userId: 387212 });
    };

    showGroup() {
        this.refs.AZStackSdk.showGroup({ groupId: 7436 });
    };

    componentDidMount() {
        this.refs.AZStackSdk.connect().then((result) => {
            this.setState({ authenticatedUser: result });
        }).catch((error) => { });
    };

    componentWillUnmount() {
        this.refs.AZStackSdk.disconnect().then((result) => {
            this.setState({ authenticatedUser: null });
        }).catch((error) => { });
    };

    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <AZStackSdk
                ref={'AZStackSdk'}
                options={{
                    azstackConfig: this.props.azstackConfig,
                    defaultLayout: this.props.defaultLayout,
                    languageCode: this.props.languageCode,
                    themeName: this.props.themeName,
                    getInitialMembers: this.props.getInitialMembers,
                    getMoreMembers: this.props.getMoreMembers,
                    getFromPhoneNumbers: this.props.getFromPhoneNumbers,
                    getPaidCallTags: this.props.getPaidCallTags,
                    onBeforeMessageSend: this.props.onBeforeMessageSend,
                    onBeforeCalloutStart: this.props.onBeforeCalloutStart
                }}
            >
                <View
                    style={{
                        flex: 1,
                        ...Platform.select({
                            ios: {
                                paddingTop: 20
                            }
                        }),
                    }}
                >
                    <ScrollView>
                        <Text>{this.state.authenticatedUser ? 'Connected, ' + this.state.authenticatedUser.fullname : 'Connecting...'}</Text>
                        <Text>{'\n'}{'\n'}</Text>
                        <Button onPress={() => this.showConversations()} title='Show conversations'></Button>
                        <Button onPress={() => this.startChatGroup()} title='Chat with group'></Button>
                        <Button onPress={() => this.startChatUser()} title='Chat with user'></Button>
                        <Button onPress={() => this.audioCall()} title='Voice Call User 2'></Button>
                        <Button onPress={() => this.videoCall()} title='Video Call User 2'></Button>
                        <Button onPress={() => this.showNumberPad()} title='Show number pad'></Button>
                        <Button onPress={() => this.showCallLogs()} title='Show call logs'></Button>
                        <Button onPress={() => this.showUser()} title='Show user'></Button>
                        <Button onPress={() => this.showGroup()} title='Show group'></Button>
                    </ScrollView>
                </View>
            </AZStackSdk>
        );
    };
};

export default AZStackSdkExample;