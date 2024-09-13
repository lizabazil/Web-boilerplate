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
function getFormattedUsers(randomUserMock, additionalUsers) {
    let formattedUserMock = randomUserMock.map(currentUser => ({
        "id": uuidv4(),
        "favorite": Math.random() < 0.5, // generating random True/False
        "course": generateUserCourse(),
        "bg_color": generateUserBgColor(),
        "note": `Note about ${currentUser.name.first}`,
        "gender": currentUser.gender,
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

    // join two arrays (formatted array from randomUserMock and additionalUsers
    let joinedArrays = formattedUserMock.concat(additionalUsers)

    joinedArrays = joinedArrays.filter((obj, index, self) =>
        index === self.findIndex((t) =>
            t.gender === obj.gender && t.title === obj.title && t.full_name === obj.full_name))
    return joinedArrays
}


// task 2
// TODO: finish validation - by gender and phone
function validateUser(user) {
    return isStringAndStartsWithCapitalLetter(user.full_name)
   /* && isStringAndStartsWithCapitalLetter(user.gender)
    && isStringAndStartsWithCapitalLetter(user.note)
    && isStringAndStartsWithCapitalLetter(user.state)
    && isStringAndStartsWithCapitalLetter(user.city)
    && isStringAndStartsWithCapitalLetter(user.country)*/
    && isANumber(user.age)
    && isEmail(user.email)
}

function isStringAndStartsWithCapitalLetter(value) {
    return typeof value === 'string' && value.charAt(0) === value.charAt(0).toUpperCase()
}

function isANumber(value) {
    return typeof value === 'number'
}

function isEmail(value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(value)
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


const formatted = getFormattedUsers(randomUserMock, additionalUsers)

console.log(formatted)
console.log(`size of randomUsers = ${randomUserMock.length}`)
console.log(`size of additionalUsers = ${additionalUsers.length}`)
console.log(`size of formatted array = ${formatted.length}`)

console.log(`${isStringAndStartsWithCapitalLetter('9')}`)

console.log(formatted[0])
console.log(`validating Norbert = ${validateUser(formatted[0])}`)

let filtered = filterUsers(formatted, 'Germany', undefined, 'female')
console.log('FILTERED')
console.log(filtered)

console.log('SORT BY AGE ASC')
let sorted = sortUsers(formatted, 'b_date', 'asc')
console.log(sorted)