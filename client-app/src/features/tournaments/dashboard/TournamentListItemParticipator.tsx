import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { List, Image, Popup } from "semantic-ui-react";
import { Profile } from "../../../app/models/profile";
import ProfileCard from "../../profiles/ProfileCard";

interface Props
{
    participators: Profile[];
}

export default observer(function TournamentParticipator({ participators }: Props)
{
    return (
        <List horizontal>
            {participators.map(participator =>
            {
                return (
                    <Popup hoverable key={participator.userName} trigger={
                        <List.Item as={Link} to={`/profiles/${participator.userName}`}>
                            <Image size="mini" circular src={participator.image || "/assets/user.png"} />
                        </List.Item>
                    }>
                        <Popup.Content>
                            <ProfileCard profile={participator} />
                        </Popup.Content>
                    </Popup>
                );
            })}
        </List>
    );
})