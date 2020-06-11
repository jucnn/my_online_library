const nodeApiUrl = 'http://localhost:6985/api';

const loginForm = document.querySelector('#loginForm');
const loginEmail = document.querySelector('[name="loginEmail"]');
const loginPassword = document.querySelector('[name="loginPassword"]');

const registerForm = document.querySelector('#registerForm');
const registerName = document.querySelector('[name="registerName"]');
const registerEmail = document.querySelector('[name="registerEmail"]');
const registerPassword = document.querySelector('[name="registerPassword"]');


const checkUserToken = () => {
    console.log(localStorage.getItem('token'));
    new FETCHrequest(
        `${nodeApiUrl}/me`,
        'GET',
        null,
        localStorage.getItem('token')
    )
    .fetch()
    .then(fetchData => {
        console.log(fetchData);
    })
    .catch(fetchError => {
        console.log(fetchError);
    })
};
registerForm.addEventListener('submit', event => {
    event.preventDefault();

    let formError = 0;

    if (registerEmail.value.length < 5) {
        formError++
    };
    if (registerPassword.value.length < 5) {
        formError++
    };

    if (formError === 0) {
        new FETCHrequest(`${nodeApiUrl}/register`, 'POST', {
                name: registerName.value,
                email: registerEmail.value,
                password: registerPassword.value,
            })
            .fetch()
            .then(fetchData => {
                console.log(fetchData)
            })
            .catch(fetchError => {
                console.log(fetchError)
            })
    } else {
        displayError('Check mandatory fields')
    }
});

loginForm.addEventListener('submit', event => {
    // Stop event propagation
    event.preventDefault();

    // Check form data
    let formError = 0;

    if (loginEmail.value.length < 5) {
        formError++
    };
    if (loginPassword.value.length < 5) {
        formError++
    };

    if (formError === 0) {
        new FETCHrequest(`${nodeApiUrl}/login`, 'POST', {
                email: loginEmail.value,
                password: loginPassword.value
            })
            .fetch()
            .then(fetchData => {
                console.log(fetchData)

                localStorage.setItem('token', fetchData.data.token);
                checkUserToken();
            })
            .catch(fetchError => {
                console.log(fetchError);
            })
    } else {
        displayError('Check mandatory fields')
    }
});