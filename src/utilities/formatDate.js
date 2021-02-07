
//takes in a date object and returns a formatted, human-readable date string
const formatDate = (date) => {
    const dateString = date.toDateString()
    const dateSections = dateString.split(" ")

    return `${dateSections[1]} ${dateSections[2]}, ${dateSections[3]}`
}

export default formatDate