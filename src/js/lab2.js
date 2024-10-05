import {additionalUsers, randomUserMock} from "./FE4U-Lab2-mock.js";
import {v4 as uuidv4 } from 'https://jspm.dev/uuid';
//import {v4 as uuidv4 } from 'uuid'

// list of all courses
const courses = ["Mathematics", "Physics", "English", "Computer Science", "Dancing", "Chess", "Biology", "Chemistry",
    "Law", "Art", "Medicine", "Statistics"]

function generateUserCourse() {
    return courses[Math.floor((Math.random() * courses.length))]
}

export function generateColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// task 1
// to format array randomUserMock and add two arrays, then delete duplicates if they are
export function getFormattedUsers(arrayOfRandomUsers, moreUsers) {
    let formattedUserMock = arrayOfRandomUsers.map(currentUser => ({
        "id": uuidv4(),
        "favorite": false, // generating random True/False
        "course": generateUserCourse(),
        "bg_color": generateColor(),
        "note": currentUser.note ? currentUser.note : `Note about ${currentUser.name.first}`,
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

    moreUsers.forEach(user => {
        user.gender = user.gender.charAt(0).toUpperCase().concat(user.gender.slice(1))
    })

    // join two arrays (formatted array from randomUserMock and additionalUsers)
    let joinedArrays = formattedUserMock.concat(moreUsers)

    joinedArrays = joinedArrays.filter((obj, index, self) =>
        index === self.findIndex((t) =>
            t.gender === obj.gender && t.title === obj.title && t.full_name === obj.full_name))
    return joinedArrays
}


// task 2
export function validateUser(user) {
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
    const regex = /^[()+\d\s\-]+$/
    return regex.test(phoneNumber)
}


// task 3
//filter the array of users by specified values
export function filterUsers(arrayOfUsers, chosenCountry, chosenAge, chosenGender, isPhoto, chosenFavorite) {
    return arrayOfUsers.filter(user => {
        return (
            (chosenCountry === undefined || chosenCountry === 'all' || chosenCountry === user.country)
            && (chosenAge === undefined || chosenAge === 'all' || checkAgeInRange(chosenAge, user.age))
            && (chosenGender === undefined || chosenGender === 'all' || chosenGender === user.gender)
                && (isPhoto === undefined || (user.picture_large != null && user.picture_thumbnail != null))
            && (chosenFavorite === undefined || chosenFavorite === user.favorite)
        )
        })
}

function checkAgeInRange(chosenAge, userAge) {
    const [minAge, maxAge] = chosenAge.split('-').map(Number)
    return userAge >= minAge && userAge <= maxAge
}


// task 4
export function sortUsers(arrayOfUsers, sortBy, order='asc') {
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

    else if(sortBy === 'course') {
            return arrayOfUsers.sort( (a, b) =>  {
                const courseA = a.course === null ? '' : a.course;
                const courseB = b.course === null ? '' : b.course;

                if (order === 'asc')
                    return courseA.localeCompare(courseB);
                 else
                    return courseB.localeCompare(courseA);

            })
    }
}


// task 5
// search by name, note or age and return array with those users
export function searchByNameNoteOrAge(searchValue, arrayOfUsers) {
    if(typeof searchValue === 'string') searchValue = searchValue.toLowerCase()
    let resultArray = []

    if(searchValue.charAt(0) === '>' || searchValue.charAt(0) === '<' || searchValue.charAt(0) === '=') {
        let number = parseInt(searchValue.slice(1))
        let firstChar = searchValue.charAt(0)

        if(!isNaN(number)) {
            if (firstChar === '>')
               return arrayOfUsers.filter(user => user.age > number)
            else if (firstChar === '<')
                return arrayOfUsers.filter(user => user.age < number)
            else
                return arrayOfUsers.filter(user => user.age == number)
        }
    }
    else
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
   const firstChar = searchValue[0]
    let arrayOfUsersOfSearching
    if (firstChar === '>' || firstChar === '<' || firstChar === '=') {
        let number = parseInt(searchValue.slice(1))

        if (!isNaN(number)) {
            if (firstChar === '>')
                arrayOfUsersOfSearching = users.filter(user => user.age > number)
             else if (firstChar === '<')
                arrayOfUsersOfSearching = users.filter(user => user.age < number)
            else
                arrayOfUsersOfSearching = users.filter(user => user.age == number)
        }
    } else
        arrayOfUsersOfSearching = searchByNameNoteOrAge(searchValue, users)
    return (arrayOfUsersOfSearching.length / users.length) * 100
}



// task 1
console.log('TASK 1-------------------------------------------------------------------------')
console.log('array of formatted users')
const formatted = getFormattedUsers(randomUserMock, additionalUsers)
console.log(formatted)


// task 2

/*
console.log('-----------------------------------------------------------------------')
console.log('validating user')
console.log(formatted[38])
console.log(`result of validating = ${validateUser(formatted[38])}`)

console.log('-----------------------------------------------------------------------')
let userForValidating = {
    "id": uuidv4(),
    "favorite": Math.random() < 0.5, // generating random True/False
    "course": generateUserCourse(),
    "bg_color": generateUserBgColor(),
    "note": `Note about someone`,
    "gender": 'male',
    "title": null,
    "full_name": `someone`
}


console.log('validating user')
console.log(userForValidating)
console.log(`result of validating = ${validateUser(userForValidating)}`)

console.log('-----------------------------------------------------------------------')

userForValidating = {
    id: uuidv4(),
    favorite: Math.random() < 0.5, // generating random True/False
    course: generateUserCourse(),
    bg_color: generateUserBgColor(),
    note: 'Note about someone',
    gender: 'Male',
    state: 'New Jersey',
    city: 'Norwalk',
    country: 'USA',
    title: null,
    full_name: 'Someone',
    phone: '+067689i',
    email: 'someone@gmail.com',
    age: 33
}

console.log('validating user')
console.log(userForValidating)
console.log(`result of validating = ${validateUser(userForValidating)}`)

console.log('-----------------------------------------------------------------------')
userForValidating = {
    id: uuidv4(),
    favorite: Math.random() < 0.5, // generating random True/False
    course: generateUserCourse(),
    bg_color: generateUserBgColor(),
    note: 'Note about someone',
    gender: 'Male',
    state: 'new Jersey',
    city: 'Norwalk',
    country: 'USA',
    title: null,
    full_name: 'Someone',
    phone: '+067689',
    email: 'someonegmail.com',
    age: 33
}

console.log('validating user')
console.log(userForValidating)
console.log(`result of validating = ${validateUser(userForValidating)}`)

console.log('-----------------------------------------------------------------------')
console.log('validating user')
console.log(formatted[38])
console.log(`result of validating = ${validateUser(formatted[38])}`)
 */


// task 3

/*
filterCountry = 'Norway'
filterAge = 28
filterGender = 'Female'
filterFavorite = undefined

filtered = filterUsers(formatted, filterCountry, filterAge, filterGender, filterFavorite)
console.log(`FILTERED by country=${filterCountry}, age=${filterAge}, gender=${filterGender}, favorite=${filterFavorite}`)
console.log(filtered)

console.log('----------------------------------------------')

filterCountry = 'Ireland'
filterAge = undefined
filterGender = 'Male'
filterFavorite = undefined

filtered = filterUsers(formatted, filterCountry, filterAge, filterGender, filterFavorite)
console.log(`FILTERED by country=${filterCountry}, age=${filterAge}, gender=${filterGender}, favorite=${filterFavorite}`)
console.log(filtered)
 */


// task 4
///*


/*
console.log('-------------------------------------------------')
console.log('sorted by country asc')
let sorted = sortUsers(formatted, 'country')
console.log(sorted)
*/

/*
console.log('-------------------------------------------------')
console.log('sorted by full name asc')
let sorted = sortUsers(formatted, 'full_name')
console.log(sorted)
*/

/*
console.log('-------------------------------------------------')
console.log('sorted by d_date asc')
let sorted = sortUsers(formatted, 'b_date')
console.log(sorted)
*/


// */

// task 5
console.log('TASK 5-------------------------------------------------------------------------')

/*
searchParameter = 'luc'
console.log(`searching by name/note/age, parameter = ${searchParameter}`)
console.log(searchByNameNoteOrAge(searchParameter, formatted))

searchParameter = '36'
console.log(`searching by name/note/age, parameter = ${searchParameter}`)
console.log(searchByNameNoteOrAge(searchParameter, formatted))

searchParameter = 'cats'
console.log(`searching by name/note/age, parameter = ${searchParameter}`)
console.log(searchByNameNoteOrAge(searchParameter, formatted))
*/


// task 6
/*
console.log('TASK 6-------------------------------------------------------------------------')
console.log('Search value => 65')
console.log(getPercentageOfUsersInSearching('65', formatted))

console.log('Search value => tessa')
console.log(getPercentageOfUsersInSearching('tessa', formatted))


console.log('Search value =>  >70')
console.log(getPercentageOfUsersInSearching('>70', formatted))

console.log('Search value => =24')
console.log(getPercentageOfUsersInSearching('=24', formatted))

console.log('Search value => <38')
console.log(getPercentageOfUsersInSearching('<38', formatted))
 */
