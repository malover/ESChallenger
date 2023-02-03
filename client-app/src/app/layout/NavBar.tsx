import { observer } from "mobx-react-lite";
import { Link, NavLink } from "react-router-dom";
import { Button, Container, Dropdown, Image, Menu } from "semantic-ui-react";
import { useStore } from "../api/stores/store";

export default observer(function NavBar()
{
    const { userStore: { user, logout } } = useStore();

    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={NavLink} to='/' header>
                    <img src="/assets/logowhite.png" alt="logo" style={{ margin: '10px' }} />
                    ESChallenger
                </Menu.Item>

                <Menu.Item as={NavLink} to='/tournaments' name='Tournaments' />
                <Menu.Item as={NavLink} to='/errors' name='Errors' />

                <Menu.Item>
                    <Button as={NavLink} to='/createTournament' positive content='Create tournament' />
                </Menu.Item>
                <Menu.Item position="right">
                    <Image src={user?.image || '/assets/user.png'} avatar spaced='right' />
                    <Dropdown pointing='top left' text={user?.displayName}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to={`/profile/${user?.username}`} text="My profile" icon='user' />
                            <Dropdown.Item onClick={logout} text="Logout" icon='log out' />
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
            </Container>
        </Menu>
    )
})