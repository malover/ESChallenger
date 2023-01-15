import { NavLink } from "react-router-dom";
import { Button, Container, Menu } from "semantic-ui-react";

export default function NavBar()
{    
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={NavLink} to='/' header>
                    <img src="/assets/logowhite.png" alt="logo" style={{margin: '10px'}}/>
                    ESChallenger
                </Menu.Item>

                <Menu.Item as={NavLink} to='/tournaments' name='ESChallenger' />
                <Menu.Item as={NavLink} to='/errors' name='Errors' />

                <Menu.Item>
                    <Button as={NavLink} to='/createTournament' positive content='Create tournament'/>
                </Menu.Item>
            </Container>
        </Menu>
    )
}