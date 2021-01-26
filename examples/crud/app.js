import { app } from 'https://unpkg.com/hyperapp'
import html from 'https://unpkg.com/hyperlit'
import * as collection from '../../lib/data/collection-store.js'
import demoList from './data.js'
import list from '../../lib/components/selectable-list.js'
import layout from '../../lib/components/crud-layout.js'

const canCreate = (state) => !!state.firstName && !!state.lastName

const canUpdate = (state) => canDelete(state) && canCreate(state)

const canDelete = (state) => !!state.selected

const SetFilter = (state, filter) => ({ ...state, filter })

const SetLastName = (state, lastName) => ({ ...state, lastName })

const SetFirstName = (state, firstName) => ({ ...state, firstName })

const Select = (state, selected) => {
    const { firstName, lastName } = collection.get(state.people, selected)
    return { ...state, selected, firstName, lastName }
}

const Create = (state) => {
    if (!canCreate(state)) return state
    const { firstName, lastName } = state
    const people = collection.add(state.people, { firstName, lastName })
    const selected = collection.lastId(people)
    return { ...state, selected, people }
}

const Update = (state) =>
    !canUpdate(state)
        ? state
        : {
              ...state,
              people: collection.set(state.people, state.selected, {
                  firstName: state.firstName,
                  lastName: state.lastName,
              }),
          }

const Delete = (state) =>
    !canDelete(state)
        ? state
        : {
              ...state,
              selected: null,
              people: collection.remove(state.people, state.selected),
          }

const input = ({ value, oninput, label }) => html`
    <label>
        <span>${label}:</span>
        <input
            type="text"
            value=${value}
            oninput=${(_, e) => [oninput, e.target.value]}
        />
    </label>
`

const personForm = (state) => html`
    <div>
        <p>
            <${input}
                label="First name"
                value=${state.firstName}
                oninput=${SetFirstName}
            />
        </p>
        <p>
            <${input}
                label="Last name"
                value=${state.lastName}
                oninput=${SetLastName}
            />
        </p>
    </div>
`

const filter = (state) =>
    input({
        value: state.filter,
        oninput: SetFilter,
        label: 'Filter',
    })

const personList = (state) => {
    const people = collection
        .map(state.people, (id, p) => ({
            id,
            name: p.lastName + ', ' + p.firstName,
        }))
        .filter(
            ({ id, name }) =>
                name.toLowerCase().indexOf(state.filter.toLowerCase()) > -1
        )
        .sort((l, r) => {
            if (l.name < r.name) return -1
            if (l.name > r.name) return 1
            return 0
        })
    const ids = people.map(({ id }) => id)
    return list({
        items: people.map(({ name }) => name),
        selected: ids.indexOf(state.selected),
        onselect: (_, index) => [Select, ids[index]],
    })
}

const toolbar = (state) => html`
    <button onclick=${Create} disabled=${!canCreate(state)}>Create</button>
    <button onclick=${Update} disabled=${!canUpdate(state)}>Update</button>
    <button onclick=${Delete} disabled=${!canDelete(state)}>Delete</button>
`

export default (node) =>
    app({
        node,
        init: {
            people: collection.init(demoList()),
            selected: null,
            firstName: '',
            lastName: '',
            filter: '',
        },

        view: (state) => html`
            <div class="app app-crud">
                <${layout}
                    filter=${filter(state)}
                    list=${personList(state)}
                    detail=${personForm(state)}
                    controls=${toolbar(state)}
                />
            </div>
        `,
    })
