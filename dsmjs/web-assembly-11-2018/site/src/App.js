import React, {Component, Fragment} from 'react';
import './App.css';
import {createPeople, departmentProperty, jobTitleProperty} from './factories/person-factory';

const peoplePerPage = 50;

function filterPeopleBySearchText(searchText, people) {
    if (searchText === '') {
        return people;
    }

    return people.filter((person) => person.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
}

function compare(a, b) {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}


function getPeoplePaginated(peopleFilteredBySearchText) {
    const start = this.state.page * peoplePerPage;
    const end = start + peoplePerPage;

    return peopleFilteredBySearchText.filter((person, index) => start < index  && index < end);
}

function getPeopleFilteredByFacets(people, filteredFacets) {
    const noFacetsAreCurrentlySelected = filteredFacets.every((facetType) => facetType.selections.length === 0);

    if (noFacetsAreCurrentlySelected) {
        return people;
    }

    return people.filter((person) => {
        return filteredFacets.reduce((shouldInclude, facetType) => {
            if (facetType.selections.length === 0) {
                return shouldInclude;
            }

            const includePersonForCurrentFacetType = facetType.selections.includes(person[facetType.property]);


            return shouldInclude && includePersonForCurrentFacetType;
        }, true)
    })
}

function renderFacetList(filterableFacet, filterableFacetCounts) {
    const filterableFacetCountsForFacet = filterableFacetCounts[filterableFacet.property];
    return (
        <Fragment>
            <div>{filterableFacet.text}
                <button onClick={this.onClearFacetList.bind(this, filterableFacet.property)}>clear</button>
            </div>
            <ul className={"facet-list"}>
                {
                    Object.keys(filterableFacetCountsForFacet).sort(compare).map((facetProperty) => {
                        const numberOfOccurences = filterableFacetCountsForFacet[facetProperty];

                        const display = numberOfOccurences > 0 ? "block" : 'none';

                        return (
                            <li style={{display}} key={facetProperty}>
                                {`${facetProperty} (${numberOfOccurences}) `}
                                <input
                                    type="checkbox"
                                    checked={filterableFacet.selections.includes(facetProperty)}
                                    name={facetProperty}
                                    onChange={this.onFacetClick.bind(this, filterableFacet.property)}
                                />
                            </li>
                        )
                    })
                }
            </ul>
        </Fragment>
    )
}

function allOtherFilterableFacetsAreNotSelected(filterableFacets, filterableFacet) {
    return filterableFacets.every(({selections, property}) => {
        return selections.length === 0 || property === filterableFacet.property;
    })
}

function personContainsAnotherSelectedFacetValue(person, filterableFacets) {
    return filterableFacets.reduce((doesContain, filterableFacet) => {
        if (doesContain) {
            return doesContain;
        }

        if (filterableFacet.selections.includes(person[filterableFacet.property])) {
            return true;
        }

        return doesContain;

    }, false)
}

function allFacetSelectionsAreEmpty(facetSelections) {
    return facetSelections.every(({selections}) => selections.length === 0);
}

function getFacetCounts(people, filterableFacets) {
    return filterableFacets.reduce((facetCounts, filterableFacet) => {
        const reduce = people.reduce((filterableFacetValueCount, person) => {
            const valueForProperty = person[filterableFacet.property];
            const valueIsSelected = filterableFacet.selections.includes(valueForProperty);

            let increment = 0;

            if (allFacetSelectionsAreEmpty(filterableFacets)) {
                increment = 1;
            } else  {
                if (valueIsSelected) {
                    if (allOtherFilterableFacetsAreNotSelected(filterableFacets, filterableFacet)) {
                        increment = 1;
                    } else if (personContainsAnotherSelectedFacetValue(person, filterableFacets)) {
                        increment = 1
                    }
                } else if (personContainsAnotherSelectedFacetValue(person, filterableFacets)) {
                    increment = 1
                }
            }

            if (filterableFacetValueCount[valueForProperty]) {
                return {
                    ...filterableFacetValueCount,
                    [valueForProperty]: filterableFacetValueCount[valueForProperty] + increment
                }
            }

            return {
                ...filterableFacetValueCount,
                [valueForProperty]: increment
            }
        }, {});

        return {
            ...facetCounts,
            [filterableFacet.property]: reduce
        }
    }, {})
}

class App extends Component {
    constructor() {
        super();

        this.state = {
            people: [],
            searchText: '',
            page: 0,
            filteredFacets: [
                {
                    text: 'Department',
                    property: departmentProperty,
                    selections: []
                },
                {
                    text: 'Job Title',
                    property: jobTitleProperty,
                    selections: []
                }
            ]
        };
        this.searchTextChanged = this.searchTextChanged.bind(this);
    }

    async componentDidMount() {
        const response = await fetch('Employee-city-of-Chicago.json');
        const data = await response.json();

        this.setState({
            people: createPeople(data.data)
        });
    }

    searchTextChanged(event) {
        this.setState({
            searchText: event.target.value
        });
    }

    onClearFacetList(facetType) {
        this.setState({
            filteredFacets: {
                ...this.state.filteredFacets,
                [facetType]: []
            }
        });
    }

    onFacetClick(facetType, event) {
        const facetValueSelected = event.target.name;
        const facetSelected = this.state.filteredFacets.find(({property}) => property === facetType);
        const facetsNotSelected = this.state.filteredFacets.filter(({property}) => property !== facetType);

        if (event.target.checked) {
            facetSelected.selections.push(facetValueSelected);
        } else {
            facetSelected.selections = facetSelected.selections.filter((selection) => selection !== facetValueSelected)
        }

        this.setState({
            filteredFacets: [...facetsNotSelected, facetSelected].sort((a,b) => compare(a.text, b.text))
        });
    }

    render() {
        let time = new Date().getTime();
        const peopleFilteredByFacetSelection = getPeopleFilteredByFacets(this.state.people, this.state.filteredFacets);
        const peopleFilteredBySearchText = filterPeopleBySearchText(this.state.searchText, peopleFilteredByFacetSelection);
        const peoplePaginated = getPeoplePaginated.call(this, peopleFilteredBySearchText);

        const facetCounts = getFacetCounts(this.state.people, this.state.filteredFacets);
        console.log('getFacetCounts() ', facetCounts);

        console.log('new Date().getTime() - time ', new Date().getTime() - time);
        return (
            <div className="App">
                {`Count: ${peopleFilteredBySearchText.length}`}
                <label>
                    Search:
                    <input type="text" onChange={this.searchTextChanged} value={this.state.searchText}/>
                </label>
                <section className={"facets-container"}>
                    <h2>Facets</h2>
                    {this.state.filteredFacets.map((filterableFacet) => {
                        return renderFacetList.call(this, filterableFacet, facetCounts)
                    })}
                </section>
                <div className={'table-container'}>
                    <table>
                        <thead>
                        <tr>
                            <td>
                                Name
                            </td>
                            <td>
                                Job Title
                            </td>
                            <td> Full or Part-Time</td>
                            <td>Department</td>
                            <td> Salary or Hourly</td>
                            <td> Typical Hours</td>
                            <td> Annual Salary</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            peoplePaginated.map((person) => {
                                return (
                                    <tr key={person.id}>
                                        <td>
                                            {person.name}
                                        </td>
                                        <td>
                                            {person.jobTitle}
                                        </td>
                                        <td>
                                            {person.department}
                                        </td>
                                        <td>
                                            {person.fullOrPartTime}
                                        </td>
                                        <td>
                                            {person.salaryOrHourly}
                                        </td>
                                        <td>
                                            {person.typicalHours}
                                        </td>
                                        <td>
                                            {person.annualSalary}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>

                    </table>

                </div>
            </div>
        );
    }
}

export default App;
