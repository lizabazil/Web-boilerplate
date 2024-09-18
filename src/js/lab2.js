import {additionalUsers, randomUserMock} from "./FE4U-Lab2-mock.js";
import {v4 as uuidv4 } from 'uuid';

// list of all courses
const courses = ["Mathematics", "Physics", "English", "Computer Science", "Dancing", "Chess", "Biology", "Chemistry",
    "Law", "Art", "Medicine", "Statistics"]

function generateUserCourse() {
    return courses[Math.floor((Math.random() * courses.length))]
}

function generateUserBgColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// task 1
// to format array randomUserMock and add two arrays, then delete duplicates if they are
function getFormattedUsers(randomUserMock, additionalUsers) {
    let formattedUserMock = randomUserMock.map(currentUser => ({
        "id": uuidv4(),
        "favorite": Math.random() < 0.5, // generating random True/False
        "course": generateUserCourse(),
        "bg_color": generateUserBgColor(),
        "note": `Note about ${currentUser.name.first}`,
        "gender": currentUser.gender.charAt(0).toUpperCase().concat(currentUser.gender.slice(1)),
        "title": `${currentUser.name.title}`,
        "full_name": `${currentUser.name.first} ${currentUser.name.last}`,
        "city": currentUser.location.city,
        "state": currentUser.location.state,
        "country": currentUser.location.country,
        "postcode": currentUser.location.postcode,
        "coordinates": currentUser.location.coordinates,
        "timezone": currentUser.location.timezone,
        "email": currentUser.email,
        "b_date": currentUser.dob.date,
        "age": currentUser.dob.age,
        "phone": currentUser.phone,
        "picture_large": currentUser.picture.large,
        "picture_thumbnail": currentUser.picture.thumbnail
    }))

    additionalUsers.forEach(user => {
        user.gender = user.gender.charAt(0).toUpperCase().concat(user.gender.slice(1))
    })

    // join two arrays (formatted array from randomUserMock and additionalUsers)
    let joinedArrays = formattedUserMock.concat(additionalUsers)

    joinedArrays = joinedArrays.filter((obj, index, self) =>
        index === self.findIndex((t) =>
            t.gender === obj.gender && t.title === obj.title && t.full_name === obj.full_name))
    return joinedArrays
}


// task 2
function validateUser(user) {
    return isStringAndStartsWithCapitalLetter(user.full_name)
    && isStringAndStartsWithCapitalLetter(user.gender)
    && isStringAndStartsWithCapitalLetter(user.note)
    && isStringAndStartsWithCapitalLetter(user.state)
    && isStringAndStartsWithCapitalLetter(user.city)
    && isStringAndStartsWithCapitalLetter(user.country)
    && typeof user.age === 'number'
        && isValidPhoneNumber(user.phone)
    && isValidEmail(user.email)
}

function isStringAndStartsWithCapitalLetter(value) {
    return typeof value === 'string' && value.charAt(0) === value.charAt(0).toUpperCase()
}


function isValidEmail(value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(value)
}

function isValidPhoneNumber(phoneNumber) {
    const regex = /^[+\d\s\-]+$/
    return regex.test(phoneNumber)
}


// task 3
//filter the array of users by specified values
function filterUsers(arrayOfUsers, chosenCountry, chosenAge, chosenGender, chosenFavorite) {
    return arrayOfUsers.filter(user => {
        return (
            (chosenCountry === undefined || chosenCountry === user.country)
            && (chosenAge === undefined || chosenAge === user.age)
            && (chosenGender === undefined || chosenGender === user.gender)
            && (chosenFavorite === undefined || chosenFavorite === user.favorite)
        )
        })
}


// task 4
function sortUsers(arrayOfUsers, sortBy, order='asc') {
    if(sortBy === 'full_name') {
        if(order === 'asc')
            return arrayOfUsers.sort((a, b) => a.full_name.localeCompare(b.full_name))
        else return arrayOfUsers.sort((a, b) => b.full_name.localeCompare(a.full_name))
    }

    else if (sortBy === 'age') {
        if(order === 'asc')
            return arrayOfUsers.sort((a, b) => a.age - b.age)
        else return arrayOfUsers.sort((a, b) => b.age - a.age)
    }

    else if (sortBy === 'b_date') {
        if (order === 'asc')
            return arrayOfUsers.sort((a, b) => new Date(a.b_date) - new Date(b.b_date))
        else return arrayOfUsers.sort((a, b) => new Date(b.b_date) - new Date(a.b_date))
    }

    else if (sortBy === 'country') {
        if(order === 'asc')
            return arrayOfUsers.sort((a, b) => a.country.localeCompare(b.country))
        else return arrayOfUsers.sort((a, b) => b.country.localeCompare(a.country))
    }
}


// task 5
function searchByNameNoteOrAge(searchValue, arrayOfUsers) {
    if(typeof searchValue === 'string') searchValue = searchValue.toLowerCase()
    let resultArray = []
    for(let user of arrayOfUsers) {
        if (
            (user.full_name != null && user.full_name.toLowerCase().includes(searchValue))
        || (user.note != null && user.note.toLowerCase().includes(searchValue))
        || (user.age != null && user.age == searchValue)
        )
            resultArray.push(user)
    }

    return resultArray
}


// task 6
function getPercentageOfUsersInSearching(searchValue, users) {
   let arrayOfUsersOfSearching = searchByNameNoteOrAge(searchValue, users)
    return (arrayOfUsersOfSearching.length / users.length) * 100
}



// task 1
const formatted = getFormattedUsers(randomUserMock.slice(0), additionalUsers.slice(0))
console.log(formatted)

// task 2
//console.log(`validating Norbert = ${validateUser(formatted[0])}`)

// task 3
const filterCountry = 'Germany'
const filterAge = undefined
const filterGender = 'female'
const filterFavorite = true

let filtered = filterUsers(formatted, filterCountry, filterAge, filterGender, filterFavorite)
console.log(`FILTERED by country=${filterCountry}, age=${filterAge}, gender=${filterGender}, favorite=${filterFavorite}`)
console.log(filtered)

// task 4
console.log('sorted by age')
let sorted = sortUsers(formatted, 'age', 'desc')
console.log(sorted)

// task 5
const searchParameter = 'esat'
console.log(`searching by name/note/age, parameter = ${searchParameter}`)
console.log(searchByNameNoteOrAge(searchParameter, formatted))

// task 6
const searchValueForStats = '65'
console.log(getPercentageOfUsersInSearching(searchValueForStats, formatted))