import React from "react";
import { Calendar } from "react-calendar";
import { Header, Menu } from "semantic-ui-react";

export default function TournamentFilters()
{
    return (
        <>
            <Menu vertical size="large" style={{ width: '100%', marginTop: 28 }}>
                <Header icon='filter' attached color='teal' content='Filters' />
                <Menu.Item content='All tournaments' />
                <Menu.Item content="I'm taking part" />
                <Menu.Item content="I'm hosting" />
            </Menu>
            <Header />
            <Calendar />
        </>
    )
}