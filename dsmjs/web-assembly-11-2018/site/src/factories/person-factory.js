import React from 'react';

export const jobTitleProperty = 'jobTitle';
export const departmentProperty = 'department';

const createPerson = (personAsArray) => {
    return {
        id: personAsArray[0],
        name: personAsArray[8],
        [jobTitleProperty]: personAsArray[9],
        [departmentProperty]: personAsArray[10],
        fullOrPartTime: personAsArray[11],
        salaryOrHourly: personAsArray[12],
        typicalHours: personAsArray[13],
        annualSalary: personAsArray[14]
    }
};

export const createPeople = (peopleArray) => {
    return peopleArray.map(createPerson);
};