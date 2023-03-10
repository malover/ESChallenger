import { observer } from 'mobx-react-lite';
import React from 'react';
import { Tab } from 'semantic-ui-react';
import { useStore } from '../../app/api/stores/store';
import { Profile } from '../../app/models/profile';
import ProfileAbout from './ProfileAbout';
import ProfileFollowing from './ProfileFollowing';
import ProfilePhotos from './ProfilePhotos';
import ProfileTournaments from './ProfileTournaments';

interface Props
{
    profile: Profile;
}

export default observer(function ProfileContent({ profile }: Props)
{
    const { profileStore } = useStore();

    const panes = [
        { menuItem: 'About', render: () => <ProfileAbout /> },
        { menuItem: 'Photos', render: () => <ProfilePhotos profile={profile} /> },
        { menuItem: 'Tournaments', render: () => <ProfileTournaments /> },
        { menuItem: 'Followers', render: () => <ProfileFollowing /> },
        { menuItem: 'Following', render: () => <ProfileFollowing /> },
    ]
    return (
        <Tab
            menu={{ fluid: true, vertical: true }}
            menuPosition='right'
            panes={panes}
            onTabChange={(e, data) => profileStore.setActiveTab(data.activeIndex)}
        />
    )
})