import React from 'react';
import {
    Animated,
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';

class ConversationsListComponent extends React.Component {
    constructor(props) {
        super(props);

        this.subscriptions = {};

        this.state = {
            opacityAnimated: new Animated.Value(0),
            marginLeftAnimated: new Animated.Value(-this.props.Sizes.width),
            conversations: []
        };
    };

    addSubscriptions() {
        this.subscriptions.onAuthenticated = this.props.EventEmitter.addListener(this.props.eventConstants.EVENT_NAME_AUTHENTICATED_RETURN, ({ error, result }) => {
            if (error) {
                return;
            }
        });
    };
    clearSubscriptions() {
        for (let subscriptionName in this.subscriptions) {
            this.subscriptions[subscriptionName].remove();
        }
    };

    componentDidMount() {
        Animated.parallel([
            Animated.timing(
                this.state.opacityAnimated,
                {
                    toValue: 1,
                    duration: 1000,
                }
            ),
            Animated.timing(
                this.state.marginLeftAnimated,
                {
                    toValue: 0,
                    duration: 1000,
                }
            )
        ]).start();

        this.addSubscriptions();
    };

    componentWillUnmount() {
        Animated.parallel([
            Animated.timing(
                this.state.opacityAnimated,
                {
                    toValue: 0,
                    duration: 1000,
                }
            ),
            Animated.timing(
                this.state.marginLeftAnimated,
                {
                    toValue: -this.props.Sizes.width,
                    duration: 1000,
                }
            )
        ]).start();

        this.clearSubscriptions();
    };

    render() {
        return (
            <Animated.View
                style={{
                    ...this.props.CustomStyle.getStyle('CONVERSATIONS_LIST_BLOCK_STYLE'),
                    ...this.props.Sizes,
                    opacity: this.state.opacityAnimated,
                    marginLeft: this.state.marginLeftAnimated
                }}
            >
                <View
                    style={this.props.CustomStyle.getStyle('CONVERSATIONS_LIST_HEADER_BLOCK_STYLE')}
                >
                    <TouchableOpacity
                        style={this.props.CustomStyle.getStyle('CONVERSATIONS_LIST_HEADER_BACK_BUTTON_STYLE')}
                        activeOpacity={0.5}
                        onPress={this.props.onBackButtonPressed}
                    >
                        <Image
                            style={this.props.CustomStyle.getStyle('CONVERSATIONS_LIST_HEADER_BACK_BUTTON_IMAGE_STYLE')}
                            source={require('../static/image/back.png')}
                        />
                    </TouchableOpacity>
                    <Text
                        style={this.props.CustomStyle.getStyle('CONVERSATIONS_LIST_HEADER_TITLE_TEXT_STYLE')}
                    >
                        {this.props.Language.getText('CONVERSATIONS_LIST_HEADER_TITLE_TEXT')}
                    </Text>
                </View>
                {
                    this.state.conversations.length === 0 && <View
                        style={this.props.CustomStyle.getStyle('CONVERSATIONS_LIST_EMPTY_BLOCK_STYLE')}
                    >
                        <Text
                            style={this.props.CustomStyle.getStyle('CONVERSATIONS_LIST_EMPTY_TEXT_STYLE')}
                        >
                            {this.props.Language.getText('CONVERSATIONS_LIST_EMPTY_TEXT')}
                        </Text>
                    </View>
                }
            </Animated.View >
        );
    };
};

export default ConversationsListComponent;