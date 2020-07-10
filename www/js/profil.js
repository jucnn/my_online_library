document.addEventListener('DOMContentLoaded', () => {
    const nodeApiUrl = 'http://localhost:6985/api';

    const userNav = document.querySelector("header nav");

    //Bookmarks sections
    const myBookmarks = document.querySelector("#myBookmarks div");
    console.log(myBookmarks);
    const favorite = document.querySelector("#bookmarksFavorite");
    const have_read = document.querySelector("#bookmarksHaveRead");
    const reading = document.querySelector("#bookmarksReading");
    const to_buy = document.querySelector("#bookmarksToBuy");
    const to_sell = document.querySelector("#bookmarksToSell");

    const displayNav = (name, id) => {
        userNav.innerHTML = `
                <h2 user-id="${id}">Hello ${name}</h2>
                <div style="display:flex">
                    <button id="accueilBtn">Accueil</button>
                    <button id="logoutBtn">Déconnexion</button>
                </div>
            `;

        userNav.classList.remove('hidden');

        document.querySelector('#logoutBtn').addEventListener('click', () => {
            // Delete LocalStorage
            localStorage.removeItem('token');
            window.location.href = '/';

        })

        document.querySelector('#accueilBtn').addEventListener('click', () => {
            window.location.href = '/';
        })
    }

    const checkUserToken = () => {

        new FETCHrequest(
                `${nodeApiUrl}/profil`,
                'GET',
                null,
                localStorage.getItem('token')
            )
            .fetch()
            .then(fetchData => {
                displayNav(fetchData.data.name, fetchData.data._id);
                getBookmarks(fetchData.data._id);
            })
            .catch(fetchError => {
                console.log(fetchError);
            })

    }

    const getBookmarks = userId => {
        console.log(userId);
        new FETCHrequest(`${nodeApiUrl}/profil/bookmarks`, 'POST', {
                userId: userId
            }, localStorage.getItem('token'))
            .fetch()
            .then(fetchData => {
                // console.log(fetchData);
                displayBookmarks(fetchData.data);
            })
            .catch(fetchError => {
                console.log(fetchError)
            })
    }

    const displayBookmarks = bookmarks => {
        for (let bookmark of bookmarks) {
            console.log(bookmark.options[0]);
            new FETCHrequest(`${nodeApiUrl}/book/${bookmark.book_id}`, 'POST', {
                    id: bookmark.book_id
                })
                .fetch()
                .then(fetchData => {
                    // console.log(bookmark.options[0]);
                    displayBookmarksPerSection('favorite', bookmark.options[0], fetchData.items[0]);
                    displayBookmarksPerSection('have_read', bookmark.options[0], fetchData.items[0]);
                    displayBookmarksPerSection('reading', bookmark.options[0], fetchData.items[0]);
                    displayBookmarksPerSection('to_buy', bookmark.options[0], fetchData.items[0]);
                    displayBookmarksPerSection('to_sell', bookmark.options[0], fetchData.items[0]);

                    //     if (bookmark.options[0] === 'favorite') {
                    //         bookmarksFavorite.innerHTML += `
                    //     <div style="display:flex">
                    //          <img src="${fetchData.items[0].volumeInfo.imageLinks.thumbnail}"
                    //             alt="${fetchData.items[0].volumeInfo.title}" >
                    //         <div>
                    //             <p>${bookmark.options[0].charAt(0).toUpperCase() + bookmark.options[0].slice(1).replace('_', ' ')}</p>
                    //             <p>${fetchData.items[0].volumeInfo.title}</p>
                    //         </div>
                    //     </div>
                    // `;
                    //     }

                    //     myBookmarks.innerHTML += `
                    //     <div style="display:flex">
                    //          <img src="${fetchData.items[0].volumeInfo.imageLinks.thumbnail}"
                    //             alt="${fetchData.items[0].volumeInfo.title}" >
                    //         <div>
                    //             <p>${bookmark.options[0].charAt(0).toUpperCase() + bookmark.options[0].slice(1).replace('_', ' ')}</p>
                    //             <p>${fetchData.items[0].volumeInfo.title}</p>
                    //         </div>
                    //     </div>
                    // `;
                })
                .catch(fetchError => {
                    console.log(fetchError)
                })

        }
    }

    const displayBookmarksPerSection = (section, bookmark, data) => {
        console.log(section)
        if (bookmark === section) {
            eval(section).innerHTML += `
                    <div style="display:flex">
                         <img src="${data.volumeInfo.imageLinks.thumbnail}"
                            alt="${data.volumeInfo.title}" >
                        <div>
                            <p>${data.volumeInfo.title}</p>
                        </div>
                    </div>
                `;
        }
    }

    checkUserToken();



})