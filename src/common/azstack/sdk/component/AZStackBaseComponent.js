import React from 'react';
import {
    StatusBar,
    Dimensions,
    View,
} from 'react-native';

import ConversationsComponent from './ConversationsComponent';
import ChatComponent from './ChatComponent';
import OnCallComponent from './OnCallComponent';
import ContactComponent from './ContactComponent';
import NumberPadComponent from './NumberPadComponent';
import VideoCallComponent from './VideoCallComponent';
import CallLogsComponent from './CallLogsComponent';
import UserComponent from './UserComponent';
import GroupComponent from './GroupComponent';
import SelectMembersComponent from './SelectMembersComponent';
import SelectMemberComponent from './SelectMemberComponent';
import NewGroupComponent from './NewGroupComponent';
import ImageGalleryComponent from './ImageGalleryComponent';
import LocationSelectingComponent from './LocationSelectingComponent';
import SketchDrawingComponent from './SketchDrawingComponent';


const NavigationEnum = {
    ConversationsComponent: 'ConversationsComponent',
    ChatComponent: 'ChatComponent',
    OnCallComponent: 'OnCallComponent',
    ContactComponent: 'ContactComponent',
    NumberPadComponent: 'NumberPadComponent',
    VideoCallComponent: 'VideoCallComponent',
    CallLogsComponent: 'CallLogsComponent',
    UserComponent: 'UserComponent',
    GroupComponent: 'GroupComponent',
    SelectMembersComponent: 'SelectMembersComponent',
    SelectMemberComponent: 'SelectMemberComponent',
    NewGroupComponent: 'NewGroupComponent',
    ImageGalleryComponent: 'ImageGalleryComponent',
    LocationSelectingComponent: 'LocationSelectingComponent',
    SketchDrawingComponent: 'SketchDrawingComponent'
};

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

    renderScreens() {
        let screens = [];
        this.state.navigation.map((value, index) => {
            screens.push(this.renderScreen(value.screen, value.options, index));
        });

        return screens;
    };

    renderScreen(screen, options, index) {
        switch (screen) {
            case 'ConversationsComponent':
                return this.renderConversations(options, index);
            case 'ChatComponent':
                return this.renderChat(options, index);
            case 'OnCallComponent':
                return this.renderOnCall(options, index);
            case 'ContactComponent':
                return this.renderContact(options, index)
            case 'NumberPadComponent':
                return this.renderNumberPad(options, index);
            case 'VideoCallComponent':
                return this.renderVideoCall(options, index);
            case 'CallLogsComponent':
                return this.renderCallLogs(options, index);
            case 'UserComponent':
                return this.renderUser(options, index);
            case 'GroupComponent':
                return this.renderGroup(options, index);
            case 'SelectMembersComponent':
                return this.renderSelectMembers(options, index);
            case 'SelectMemberComponent':
                return this.renderSelectMember(options, index);
            case 'NewGroupComponent':
                return this.renderNewGroup(options, index);
            case 'ImageGalleryComponent':
                return this.renderImageGallery(options, index); 
            case 'LocationSelectingComponent':
                return this.renderLocationSelecting(options, index);
            case 'SketchDrawingComponent':
                return this.renderSketchDrawing(options, index);
            default:
                break;
        }
    };

    /* Navigation functions */
    navigate(screen, options) {
        let newNavigation = [...this.state.navigation];
        newNavigation.push({ screen, options });
        this.setState({ navigation: newNavigation });
    };

    dismiss() {
        this.setState({
            navigation: []
        })
    };

    getNavigation() {
        return NavigationEnum;
    };

    pop() {
        let newNavigation = [...this.state.navigation];
        newNavigation.splice(-1, 1);
        this.setState({ navigation: newNavigation });
    };

    push(screen, options) {
        let newNavigation = [...this.state.navigation];
        newNavigation.push({ screen, options });
        this.setState({ navigation: newNavigation });
    };

    /* Render component */
    renderConversations(options, key) {
        return <ConversationsComponent
            key={key}
            Sizes={this.Sizes}
            getCoreInstances={this.getCoreInstances}
            {...options}
        />;
    };

    renderChat(options, key) {
        return <ChatComponent
            key={key}
            Sizes={this.Sizes}
            getCoreInstances={this.getCoreInstances}
            {...options}
        />;
    };

    renderOnCall(options, key) {
        return <OnCallComponent
            key={key}
            Sizes={this.Sizes}
            getCoreInstances={this.getCoreInstances}
            {...options}
        />;
    };

    renderContact(options, key) {
        return <ContactComponent
            key={key}
            Sizes={this.Sizes}
            getCoreInstances={this.getCoreInstances}
            {...options}
        />;
    };

    renderNumberPad(options, key) {
        return <NumberPadComponent
            key={key}
            Sizes={this.Sizes}
            getCoreInstances={this.getCoreInstances}
            {...options}
        />;
    };

    renderVideoCall(options, key) {
        return <VideoCallComponent
            key={key}
            Sizes={this.Sizes}
            getCoreInstances={this.getCoreInstances}
            {...options}
        />;
    };

    renderCallLogs(options, key) {
        return <CallLogsComponent
            key={key}
            Sizes={this.Sizes}
            getCoreInstances={this.getCoreInstances}
            {...options}
        />;
    };

    renderUser(options, key) {
        return <UserComponent
            key={key}
            Sizes={this.Sizes}
            getCoreInstances={this.getCoreInstances}
            {...options}
        />;
    };

    renderGroup(options, key) {
        return <GroupComponent
            key={key}
            Sizes={this.Sizes}
            getCoreInstances={this.getCoreInstances}
            {...options}
        />;
    };

    renderSelectMembers(options, key) {
        return <SelectMembersComponent
            key={key}
            Sizes={this.Sizes}
            getCoreInstances={this.getCoreInstances}
            {...options}
        />;
    };

    renderSelectMember(options, key) {
        return <SelectMemberComponent
            key={key}
            Sizes={this.Sizes}
            getCoreInstances={this.getCoreInstances}
            {...options}
        />;
    };

    renderNewGroup(options, key) {
        return <NewGroupComponent
            key={key}
            Sizes={this.Sizes}
            getCoreInstances={this.getCoreInstances}
            {...options}
        />;
    };

    renderImageGallery(options, key) {
        return <ImageGalleryComponent
            key={key}
            Sizes={this.Sizes}
            getCoreInstances={this.getCoreInstances}
            {...options}
        />;
    };

    renderLocationSelecting(options, key) {
        return <LocationSelectingComponent
            key={key}
            Sizes={this.Sizes}
            getCoreInstances={this.getCoreInstances}
            {...options}
        />;
    };

    renderSketchDrawing(options, key) {
        return <SketchDrawingComponent
            key={key}
            Sizes={this.Sizes}
            getCoreInstances={this.getCoreInstances}
            {...options}
        />;
    };
};