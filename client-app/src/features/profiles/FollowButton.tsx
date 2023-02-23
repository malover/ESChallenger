import { observer } from "mobx-react-lite";
import { SyntheticEvent } from "react";
import { Button, Reveal } from "semantic-ui-react";
import { useStore } from "../../app/api/stores/store";
import { Profile } from "../../app/models/profile";

interface Props
{
    profile: Profile;
}

export default observer(function FollowButton({ profile }: Props)
{
    const { profileStore, userStore } = useStore();
    const { updateFollowing, loading } = profileStore;

    if (userStore.user?.username === profile.userName) return null;

    function HandleFollow(e: SyntheticEvent, username: string)
    {
        e.preventDefault();
        profile.following ? updateFollowing(username, false) : updateFollowing(username, true);
    }


    return (
        <Reveal animated='move'>
            <Reveal.Content visible style={{ width: '100%' }}>
                <Button fluid color='teal' content={profile.following ? 'Following' : 'Not following'} />
            </Reveal.Content>
            <Reveal.Content hidden style={{ width: '100%' }}>
                <Button
                    fluid
                    basic
                    color={profile.following ? 'red' : 'green'}
                    content={profile.following ? 'Unfollow' : 'Follow'}
                    loading={loading}
                    onClick={(e) => HandleFollow(e, profile.userName)}
                />
            </Reveal.Content>
        </Reveal>
    )
})
