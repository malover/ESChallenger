import { Link } from "react-router-dom";
import { Button, Container, Header, Image, Segment } from "semantic-ui-react";

export default function HomePage()
{
    return (
        <Segment inverted textAlign="center" vertical className="masthead">
            <Container text>
                <Header as='h1' inverted>
                    <Image size="massive" src="/assets/logowhite.png" alt="logo" style={{ marginBottom: 12 }} />
                    ESChallenger
                </Header>
                <Header as='h2' inverted content='Welcome to ESChallenger'/>
                    <Button as={Link} to="/tournaments" size="huge" inverted>
                        Take me to the Tournaments!
                    </Button>
            </Container>
        </Segment>
    )
}