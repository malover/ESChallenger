import React from 'react'
import { Segment, List, Label, Item, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Profile } from '../../../app/models/profile'
import { Tournament } from '../../../app/models/tournament'

interface Props
{
    tournament: Tournament;
}

export default observer(function ActivityDetailedSidebar({ tournament: { participators, host } }: Props)
{
    if (!participators) return null;
    return (
        <>
            <Segment
                textAlign='center'
                style={{ border: 'none' }}
                attached='top'
                secondary
                inverted
                color='teal'
            >
                {participators.length} {participators.length === 1 ? "Person" : "People"} going
            </Segment>
            <Segment attached>
                <List relaxed divided>
                    {participators.map(participator => (
                        <Item style={{ position: 'relative' }} key={participator.userName}>
                            {participator.userName === host?.userName &&
                                <Label
                                    style={{ position: 'absolute' }}
                                    color='orange'
                                    ribbon='right'
                                >
                                    Host
                                </Label>}
                            <Image size='tiny' src={participator.image || '/assets/user.png'} />
                            <Item.Content verticalAlign='middle'>
                                <Item.Header as='h3'>
                                    <Link to={`/profiles/${participator.userName}`}>{participator.displayName}</Link>
                                </Item.Header>
                                {participator.following &&
                                    <Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>}
                            </Item.Content>
                        </Item>
                    ))}
                </List>
            </Segment>
        </>
    )
})
