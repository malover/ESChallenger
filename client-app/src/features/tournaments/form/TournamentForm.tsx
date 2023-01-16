import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/api/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Tournament } from "../../../app/models/tournament";
import { Formik, Form } from "formik";
import * as Yup from 'yup';
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/CategoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { v4 as uuid } from 'uuid';

export default observer(function TournamentForm()
{
    const { tournamentStore } = useStore();
    const { selectedTournament, createTournament, updateTournament,
        loading, loadTournament, loadingInitial } = tournamentStore;

    const { id } = useParams();

    const navigate = useNavigate();

    const [tournament, setTournament] = useState<Tournament>(
        {
            id: '',
            title: '',
            category: '',
            description: '',
            date: null,
            country: '',
            city: '',
            venue: '',
            prizePool: null
        });

    const validationSchema = Yup.object({
        title: Yup.string().required('The tournament title is required'),
        description: Yup.string().required('The description is required'),
        category: Yup.string().required('The category is required'),
        date: Yup.string().required('The date is required').nullable(),
        country: Yup.string().required('The country is required'),
        city: Yup.string().required('The city is required'),
        venue: Yup.string().required('The venue is required'),
        prizePool: Yup.number().required('The prize pool is required')

    })

    useEffect(() =>
    {
        if (id) loadTournament(id).then(tournament => setTournament(tournament!))
    }, [id, loadTournament]);

    function handleFormSubmit(tournament: Tournament)
    {
        if (!tournament.id)
        {
            tournament.id = uuid();
            createTournament(tournament).then(() => navigate(`/tournaments/${tournament.id}`));
        }
        else
        {
            updateTournament(tournament).then(() => navigate(`/tournaments/${tournament.id}`));
        }
    }

    // function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)
    // {
    //     const { name, value } = event.target;
    //     setTournament({ ...tournament, [name]: value })
    // }

    if (loadingInitial) return <LoadingComponent content='Loading tournament...' />

    return (
        <Segment clearing>
            <Header content='Tournament details' sub color='teal' />
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={tournament}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput name="title" placeholder="Title" />
                        <MyTextArea rows={3} placeholder='Description' name='description' />
                        <MySelectInput options={categoryOptions} placeholder='Category' name='category' />
                        <MyDateInput
                            placeholderText='Date'
                            name='date'
                            showTimeSelect
                            timeCaption="time"
                            dateFormat='MMMM d, yyyy h:mm aa'
                        />
                        <Header content='Tournament details' sub color='teal' />
                        <MyTextInput placeholder='Country' name='country' />
                        <MyTextInput placeholder='City' name='city' />
                        <MyTextInput placeholder='Venue' name='venue' />
                        <Header content='Prize pool' sub color='teal' />
                        <MyTextInput placeholder='$$$' name='prizePool' />
                        <Button
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={loading} floated="right"
                            positive
                            type='submit'
                            content='Submit' />
                        <Button as={Link} to='/tournaments' floated="right" type='button' content='Cancel' />
                    </Form>
                )}
            </Formik>
        </Segment>
    )
})