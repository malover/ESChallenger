import React from "react";
import { Button, Container, Menu } from "semantic-ui-react";

interface Props
{
    openForm: () => void;
}

export default function NavBar({ openForm} : Props)
{
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item header>
                    <img src="/assets/logowhite.png" alt="logo" style={{margin: '10px'}}/>
                    ESChallenger
                </Menu.Item>

                <Menu.Item name='ESChallenger' />

                <Menu.Item>
                    <Button onClick={openForm} positive content='Create tournament'/>
                </Menu.Item>
            </Container>
        </Menu>
    )
}