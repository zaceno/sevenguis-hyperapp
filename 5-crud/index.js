import { h, app } from 'https://unpkg.com/hyperapp@beta'
import * as Collection from '../lib/data/collection/index.js'
import targetValue from '../lib/payload/targetvalue.js'
import demoList from './demo-people.js'

const enteredPerson = state => ({
    firstName: state.firstName,
    lastName: state.lastName,
})
const createAllowed = state => !!state.firstName && !!state.lastName
const updateAllowed = state =>
    !!state.firstName && !!state.lastName && !!state.selected
const deleteAllowed = state => !!state.selected

const fullName = person => person.lastName + ', ' + person.firstName
const mapPeople = (state, f) =>
    Collection.map(state.people, (id, person) => ({ ...person, id }))
        .filter(
            p =>
                fullName(p)
                    .toLowerCase()
                    .indexOf(state.filter.toLowerCase()) > -1
        )
        .sort((l, r) => {
            const lname = fullName(l)
            const rname = fullName(r)
            if (lname < rname) return -1
            if (lname > rname) return 1
            return 0
        })
        .map(f)

const Init = () => ({
    people: Collection.init(demoList()),
    selected: null,
    firstName: '',
    lastName: '',
    filter: '',
})

const Select = (state, selected) => {
    const { firstName, lastName } = Collection.get(state.people, selected)
    return { ...state, selected, firstName, lastName }
}

const InputFilter = (state, filter) => ({ ...state, filter })

const InputLastName = (state, lastName) => ({ ...state, lastName })

const InputFirstName = (state, firstName) => ({ ...state, firstName })

const Create = state => {
    if (!createAllowed(state)) return state
    const people = Collection.add(state.people, enteredPerson(state))
    const selected = Collection.lastId(people)
    return { ...state, selected, people }
}

const Update = state => {
    if (!updateAllowed(state)) return state
    return {
        ...state,
        people: Collection.set(
            state.people,
            state.selected,
            enteredPerson(state)
        ),
    }
}

const Delete = state => {
    if (!deleteAllowed) return state
    return {
        ...state,
        selected: null,
        people: Collection.remove(state.people, state.selected),
    }
}

const PeopleList = state =>
    h(
        'ul',
        { class: 'people' },
        mapPeople(state, p =>
            h(
                'li',
                {
                    onclick: [Select, p.id],
                    class: { selected: state.selected === p.id },
                },
                fullName(p)
            )
        )
    )

const TextInput = props =>
    h('input', {
        type: 'text',
        oninput: [props.oninput, targetValue],
        value: props.value,
    })

const Toolbar = state =>
    h('p', { class: 'toolbar' }, [
        h(
            'button',
            {
                onclick: Create,
                disabled: !createAllowed(state),
            },
            'Create'
        ),
        h(
            'button',
            {
                onclick: Update,
                disabled: !updateAllowed(state),
            },
            'Update'
        ),
        h(
            'button',
            {
                onclick: Delete,
                disabled: !deleteAllowed(state),
            },
            'Delete'
        ),
    ])

const PersonForm = state =>
    h('div', { class: 'personform' }, [
        h('label', {}, 'First name'),
        TextInput({
            value: state.firstName,
            oninput: InputFirstName,
        }),
        h('label', {}, 'Surname'),
        TextInput({
            value: state.lastName,
            oninput: InputLastName,
        }),
    ])

const PersonFinder = state =>
    h('div', { class: 'personfinder' }, [
        h('label', {}, 'Filter'),
        TextInput({ value: state.filter, oninput: InputFilter }),
        PeopleList(state),
    ])

app({
    node: document.getElementById('app-crud'),
    init: Init(),
    view: state =>
        h('div', { id: 'app-crud' }, [
            h('div', { class: 'left' }, PersonFinder(state)),
            h('div', { class: 'right' }, PersonForm(state)),
            h('div', { class: 'bottom' }, Toolbar(state)),
        ]),
})
