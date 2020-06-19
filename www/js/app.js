document.addEventListener('DOMContentLoaded', () => {

    const nodeApiUrl = 'http://localhost:6985/api';

    // Variables login
    const loginForm = document.querySelector('#loginForm');
    const loginEmail = document.querySelector('[name="loginEmail"]');
    const loginPassword = document.querySelector('[name="loginPassword"]');

    // Variables register
    const registerForm = document.querySelector('#registerForm');
    const registerName = document.querySelector('[name="registerName"]');
    const registerEmail = document.querySelector('[name="registerEmail"]');
    const registerPassword = document.querySelector('[name="registerPassword"]');


    const userNav = document.querySelector("header nav");
    const searchForm = document.querySelector('#searchForm');
    const searchFormData = document.querySelector('#searchFormData');
    const searchButton = document.querySelector('#searchButton');

    const bookList = document.querySelector('#bookList');


    /* 
        Display functions
    */

    const displayNav = name => {
        userNav.innerHTML = `
                <h2>Hello ${name}</h2>
                <button id="logoutBtn">Log out</button>
            `;

        userNav.classList.remove('hidden');

        document.querySelector('#logoutBtn').addEventListener('click', () => {
            // Delete LocalStorage
            localStorage.removeItem('token');
            userNav.innerHTML = '';
            searchForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
            loginForm.classList.remove('hidden');
        })
    }

    const moreInfoBook = (books) => {
        for (let book of books) {
            book.addEventListener("click", event => {
                event.preventDefault();
                const bookId = book.getAttribute("bookId");
                console.log(bookId);
                new FETCHrequest(`${nodeApiUrl}/book`, 'POST', {
                        id: bookId
                    })
                    .fetch()
                    .then(fetchData => {
                        console.log(fetchData.items[0]);
                    })
                    .catch(fetchError => {
                        console.log(fetchError)
                    })

            });
        }
    }

    const displayBookList = collection => {
        searchFormData.value = '';
        bookList.innerHTML = '';

        for (let item of collection) {
            bookList.innerHTML += `
                    <article>
                        <figure>
                            <img src = "${item.volumeInfo.imageLinks.thumbnail}"
                            alt = "${item.volumeInfo.title}" >
                            <figcaption book-id="${item.id}">${item.volumeInfo.title}</figcaption>
                        </figure>
                        <button class="more-book" bookId="${item.id}"> Plus d'info </button>
                    </article>
                `;
        };
        const oneBookButton = document.querySelectorAll('.more-book');
        console.log(oneBookButton);
        moreInfoBook(oneBookButton);

    };

    /*
        Display auth user info
    */


    const checkUserToken = () => {
        new FETCHrequest(
                `${nodeApiUrl}/me`,
                'GET',
                null,
                localStorage.getItem('token')
            )
            .fetch()
            .then(fetchData => {
                searchForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
                loginForm.classList.add('hidden');
                displayNav(fetchData.data.name);
            })
            .catch(fetchError => {
                console.log(fetchError);
            })
    };

    /*
        Form functions
    */

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


    searchButton.addEventListener("click", event => {
        event.preventDefault();
        new FETCHrequest(`${nodeApiUrl}/books/search`, 'POST', {
                keywords: searchFormData.value
            })
            .fetch()
            .then(fetchData => {
                displayBookList(fetchData.items);
            })
            .catch(fetchError => {
                console.log(fetchError)
            })
    });




    //check if user is connected
    if (localStorage.getItem('token') !== null) {
        checkUserToken();

    } else {
        console.log("null")
    };
})