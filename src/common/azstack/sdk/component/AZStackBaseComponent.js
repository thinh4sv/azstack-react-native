import React from 'react';
import {
    StatusBar,
    Dimensions,
    View,
} from 'react-native';

import ConversationsListComponent from './ConversationsListComponent';
import OnCallComponent from './OnCallComponent';
import ContactComponent from './ContactComponent';
import NumberPadComponent from './NumberPadComponent';
import VideoCallComponent from './VideoCallComponent';

const NavigationEnum = {
    ConversationsListComponent: 'ConversationsListComponent',
    OnCallComponent: 'OnCallComponent',
    ContactComponent: 'ContactComponent',
    NumberPadComponent: 'NumberPadComponent',
    VideoCallComponent: 'VideoCallComponent',
}

export default class AZStackBaseComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            navigation: [],
        };
        const { width, height } = Dimensions.get('window');
        this.Sizes = {
            width,
            height: height - StatusBar.currentHeight
        };
    };

    render() {
        let screens = [];
        this.state.navigation.map((value, index) => {
            switch(value.screen) {
                case 'ConversationsListComponent': 
                    screens.push(this.renderConversationsList(value.options, index));
                    break;
                case 'OnCallComponent': 
                    screens.push(this.renderOnCall(value.options, index));
                    break;
                case 'ContactComponent': 
                    screens.push(this.renderContact(value.options, index));
                    break;
                case 'NumberPadComponent': 
                    screens.push(this.renderNumberPad(value.options, index));
                    break;
                case 'VideoCallComponent': 
                    screens.push(this.renderVideoCall(value.options, index));
                    break;
                default: 
                    break;
            }
        });

        if(screens.length === 0) {
            return null;
        }

        return screens;
    }

    /* Navigation functions */ 
    navigate(screen, options) {
        let newNavigation = [...this.state.navigation];
        newNavigation.push({screen, options});
        this.setState({navigation: newNavigation});
    }

    dismiss() {
        this.setState({
            navigation: []
        })
    }

    getNavigation() {
        return NavigationEnum;
    }

    pop() {
        let newNavigation = [...this.state.navigation];
        newNavigation.splice(-1, 1);
        this.setState({navigation: newNavigation});
    }

    push(screen, options) {
        let newNavigation = [...this.state.navigation];
        newNavigation.push({screen, options});
        this.setState({navigation: newNavigation});
    }

    /* Render component */
    renderConversationsList(options, key) {
        return <ConversationsListComponent
            key={key}
            Sizes={this.Sizes}
            Language={this.Language}
            CustomStyle={this.CustomStyle}
            eventConstants={this.eventConstants}
            AZStackCore={this.AZStackCore}
            EventEmitter={this.EventEmitter}
            onBackButtonPressed={options.onBackButtonPressed ? options.onBackButtonPressed : () => {
                this.pop();
            }}
        />;
    };

    renderOnCall(options, key) {
        return <OnCallComponent
            key={key}
            Sizes={this.Sizes}
            Language={this.Language}
            CustomStyle={this.CustomStyle}
            eventConstants={this.eventConstants}
            AZStackCore={this.AZStackCore}
            EventEmitter={this.EventEmitter}
            {...options}
        />;
    }

    renderContact(options, key) {
        return <ContactComponent
            key={key}
            Sizes={this.Sizes}
            Language={this.Language}
            CustomStyle={this.CustomStyle}
            eventConstants={this.eventConstants}
            AZStackCore={this.AZStackCore}
            EventEmitter={this.EventEmitter}
            {...options}
            onBackButtonPressed={options.onBackButtonPressed ? options.onBackButtonPressed : () => {
                this.pop();
            }}
        />;
    }

    renderNumberPad(options, key) {
        return <NumberPadComponent
            key={key}
            Sizes={this.Sizes}
            Language={this.Language}
            CustomStyle={this.CustomStyle}
            eventConstants={this.eventConstants}
            AZStackCore={this.AZStackCore}
            EventEmitter={this.EventEmitter}
            {...options}
            onBackButtonPressed={options.onBackButtonPressed ? options.onBackButtonPressed : () => {
                this.pop();
            }}
        />;
    }

    renderVideoCall(options, key) {
        return <VideoCallComponent
            key={key}
            Sizes={this.Sizes}
            Language={this.Language}
            CustomStyle={this.CustomStyle}
            eventConstants={this.eventConstants}
            AZStackCore={this.AZStackCore}
            EventEmitter={this.EventEmitter}
            {...options}
            onBackButtonPressed={options.onBackButtonPressed ? options.onBackButtonPressed : () => {
                this.pop();
            }}
        />;
    }
};