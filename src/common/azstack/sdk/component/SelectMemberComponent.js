import React from 'react';
import {
    BackHandler,
    Platform,
    View,
    SectionList,
    Text
} from 'react-native';

import ScreenBlockComponent from './part/screen/ScreenBlockComponent';
import ScreenHeaderBlockComponent from './part/screen/ScreenHeaderBlockComponent';
import ScreenBodyBlockComponent from './part/screen/ScreenBodyBlockComponent';
import SearchBlockComponent from './part/common/SearchBlockComponent';
import EmptyBlockComponent from './part/common/EmptyBlockComponent';
import SelectMemberBlockComponent from './part/select/SelectMemberBlockComponent';
import ConnectionBlockComponent from './part/common/ConnectionBlockComponent';

class SelectMemberComponent extends React.Component {
    constructor(props) {
        super(props);

        this.coreInstances = props.getCoreInstances();
        this.subscriptions = {};

        let members = props.members ? [...props.members] : [];
        members.map((member) => {
            member.searchString = this.coreInstances.Diacritic.clear(member.fullname).toLowerCase();
        });
        this.state = {
            members: members,
            searchText: ''
        };

        this.onHardBackButtonPressed = this.onHardBackButtonPressed.bind(this);

        this.onSearchTextChanged = this.onSearchTextChanged.bind(this);
        this.onSearchTextCleared = this.onSearchTextCleared.bind(this);

        this.onMemberPressed = this.onMemberPressed.bind(this);
    };

    onHardBackButtonPressed() {
        this.props.onBackButtonPressed();
        return true;
    };

    addSubscriptions() {

    };
    clearSubscriptions() {
        for (let subscriptionName in this.subscriptions) {
            this.subscriptions[subscriptionName].remove();
        }
    };

    onSearchTextChanged(newText) {
        this.setState({ searchText: newText });
    };
    onSearchTextCleared() {
        this.setState({ searchText: '' });
    };
    getGroupedMembers() {
        let availableMembers = this.state.members;

        if (this.props.ignoreMembers) {
            availableMembers = this.state.members.filter((member) => {
                return this.props.ignoreMembers.indexOf(member.userId) === -1;
            });
        }

        let filteredMembers = availableMembers;
        if (this.state.searchText) {
            let searchParts = this.coreInstances.Diacritic.clear(this.state.searchText).toLowerCase().split(' ');
            filteredMembers = availableMembers.filter((member) => {
                let matched = false;
                for (let i = 0; i < searchParts.length; i++) {
                    if (member.searchString.indexOf(searchParts[i]) > -1) {
                        matched = true;
                        break;
                    }
                }
                return matched;
            });
        }

        let groupedMembers = [];
        filteredMembers.map((member) => {
            let firstLetter = member.fullname[0].toUpperCase();
            let foundGroupedMember = false;
            for (let i = 0; i < groupedMembers.length; i++) {
                let groupedMember = groupedMembers[i];
                if (groupedMember.title === firstLetter) {
                    groupedMember.data.push(member);
                    foundGroupedMember = true;
                    break;
                }
            }
            if (!foundGroupedMember) {
                groupedMembers.push({
                    title: firstLetter,
                    data: [member]
                })
            }
        });

        groupedMembers.sort((a, b) => {
            return a.title > b.title ? 1 : -1;
        });
        groupedMembers.map((groupedMember) => {
            groupedMember.data.sort((a, b) => {
                return a.fullname > b.fullname ? 1 : -1;
            });
        });

        return groupedMembers;
    };

    onMemberPressed(event) {
        this.props.onSelectDone({ selected: event.member });
        this.props.onDoneClose();
    };

    componentDidMount() {
        this.addSubscriptions();
        if (this.props.withBackButtonHandler) {
            BackHandler.addEventListener('hardwareBackPress', this.onHardBackButtonPressed);
        }
    };
    componentWillUnmount() {
        this.clearSubscriptions();
        if (this.props.withBackButtonHandler) {
            BackHandler.removeEventListener('hardwareBackPress', this.onHardBackButtonPressed);
        }
    };

    render() {
        let groupedMembers = this.getGroupedMembers();
        return (
            <ScreenBlockComponent
                fullScreen={false}
                withStatusbar={this.props.withStatusbar}
                screenStyle={this.props.screenStyle}
                statusbarStyle={this.props.statusbarStyle}
                getCoreInstances={this.props.getCoreInstances}
            >
                {
                    (this.props.withHeader || (this.props.withHeader === undefined && this.coreInstances.defaultLayout.withHeader)) && (
                        <ScreenHeaderBlockComponent
                            getCoreInstances={this.props.getCoreInstances}
                            onBackButtonPressed={this.props.onBackButtonPressed}
                            title={this.props.headerTitle}
                        />
                    )
                }
                <ScreenBodyBlockComponent
                    getCoreInstances={this.props.getCoreInstances}
                >
                    <SearchBlockComponent
                        getCoreInstances={this.props.getCoreInstances}
                        containerStyle={this.coreInstances.CustomStyle.getStyle('SELECT_MEMBER_SEARCH_BLOCK_STYLE')}
                        onSearchTextChanged={this.onSearchTextChanged}
                        onSearchTextCleared={this.onSearchTextCleared}
                        placeholder={this.coreInstances.Language.getText('SELECT_MEMBER_SEARCH_PLACEHOLDER_TEXT')}
                    />
                    {
                        groupedMembers.length === 0 && <EmptyBlockComponent
                            getCoreInstances={this.props.getCoreInstances}
                            emptyText={this.coreInstances.Language.getText('SELECT_MEMBER_EMPTY_TEXT')}
                        />
                    }
                    {
                        groupedMembers.length > 0 && <SectionList
                            style={this.coreInstances.CustomStyle.getStyle('SELECT_MEMBER_LIST_STYLE')}
                            sections={groupedMembers}
                            keyExtractor={(item, index) => ('select_member_' + item.userId)}
                            renderSectionHeader={({ section }) => {
                                return (
                                    <Text
                                        style={this.coreInstances.CustomStyle.getStyle('SELECT_MEMBER_SECTION_TITLE_TEXT_STYLE')}
                                    >
                                        {section.title}
                                    </Text>
                                );
                            }}
                            renderItem={({ item }) => {
                                return (
                                    <SelectMemberBlockComponent
                                        getCoreInstances={this.props.getCoreInstances}
                                        member={item}
                                        isSelected={false}
                                        onMemberPressed={this.onMemberPressed}
                                    />
                                );
                            }}
                            contentContainerStyle={this.coreInstances.CustomStyle.getStyle('SELECT_MEMBER_LIST_CONTENT_CONTAINER_STYLE')}
                            keyboardDismissMode={Platform.select({ ios: 'interactive', android: 'on-drag' })}
                        />
                    }
                    <ConnectionBlockComponent
                        getCoreInstances={this.props.getCoreInstances}
                    />
                </ScreenBodyBlockComponent>
            </ScreenBlockComponent>
        );
    };
};

export default SelectMemberComponent;