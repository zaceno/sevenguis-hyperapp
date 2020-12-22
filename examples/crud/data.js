const names = [
    'Gal Gadot',
    'Melissa McCarthy',
    'Cate Blanchett',
    'Julia Roberts',
    'Mila Kunis',
    'Reese Witherspoon',
    'Jennifer Lawrence',
    'Jennifer Aniston',
    'Angelina Jolie',
    'Scarlett Johanson',
    'Chris Evans',
    'Salman Khan',
    'Adam Sandler',
    'Akshay Kumar',
    'Will Smith',
    'Jackie Chan',
    'Chris Hemsworth',
    'Robert Downey Jr',
    'Dwayne Johnson',
    'George Clooney',
]
export default function () {
    return names
        .map(n => n.replace(/ /, ':').split(':'))
        .map(([fn, ln]) => ({
            firstName: fn,
            lastName: ln,
        }))
}
