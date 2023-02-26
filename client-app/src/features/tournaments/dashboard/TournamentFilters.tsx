import { observer } from "mobx-react-lite";
import React from "react";
import { Calendar } from "react-calendar";
import { Header, Menu } from "semantic-ui-react";
import { useStore } from "../../../app/api/stores/store";

export default observer(function TournamentFilters()
{
    const { tournamentStore: { predicate, setPredicate } } = useStore();
    return (
        <>
            <Menu vertical size="large" style={{ width: '100%', marginTop: 28 }}>
                <Header icon='filter' attached color='teal' content='Filters' />
                <Menu.Item content='All tournaments'
                    active={predicate.has('all')}
                    onClick={() => setPredicate('all', 'true')}
                />
                <Menu.Item content="I'm taking part"
                    active={predicate.has('isGoing')}
                    onClick={() => setPredicate('isGoing', 'true')}
                />
                <Menu.Item content="I'm hosting"
                    active={predicate.has('isHosting')}
                    onClick={() => setPredicate('isHosting', 'true')}
                />
            </Menu>
            <Header />
            <Calendar
                onChange={(date: any) => setPredicate('startDate', date as Date)}
                value={predicate.get('startDate') || new Date()}
            />
        </>
    )
})