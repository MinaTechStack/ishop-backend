const generateUniqueName = (originalName) => {
    return Math.floor(Math.random() * 1000) + new Date().getTime() + originalName;
}
module.exports = { generateUniqueName }