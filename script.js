window.onload = () => {

// pagination

    let ajaxDone;

    loadPosts();

    initFilter();

    loadMorePosts();

}

function loadMorePosts() {

    let loadMoreBtn = document.getElementById('load-more');

    loadMoreBtn.addEventListener('click', (event) => {

        event.preventDefault();

        loadPosts();

    });

}

function initFilter() {

    let filterBtn = document.getElementById('filter');
    let filterInput = document.getElementById('input');
    filterInput.value = '';

    filterBtn.addEventListener('click', (event) => {
        
        event.preventDefault();

        setTimeout(() => {

            filterTitles(filterInput.value);

        }, 1000);

    });

}

function loadPosts() {

    let preloader = document.getElementById('preloader');

    preloader.classList.remove('hide');

    ajaxDone = false;

    getAjax(

        `http://jsonplaceholder.typicode.com/posts?_limit=5`,

        (reply) => {

            let data = Array.from(JSON.parse(reply));

            let html = '';

            data.forEach((post) => {

                html += `
                    <div class="post p-20 border-radius-medium bg-light-gray">
                        <h3 class="post-title">${post.title}</h3>
                        <p class="text-justify post-body">${post.body}</p>
                    </div>
                `;

            });

            document.getElementById('posts').innerHTML += html;

            ajaxDone = true;

            setTimeout(() => {
                preloader.classList.add('hide');
            }, 500);

            loadMore();

        }

    );

}

function loadMore() {

    window.addEventListener('scroll', () => {

        if (window.scrollY >= (window.scrollMaxY - 100)) {
    
            if (ajaxDone === true) {

                loadPosts();

            }

        }

    });

}

function filterTitles(value) {

    if (ajaxDone === false) return;

    let titles = Array.from(document.querySelectorAll('.post-title'));

    titles.forEach((title) => {

        let matches = 0;

        let titleParts = title.innerHTML.split(' ');

        titleParts.forEach((part) => {

            if (value == part) {

                matches++;

                return;

            }

        });

        if (matches > 0) {

            title.style.color = 'green';

        }
        else {

            // title.style.color = 'red';
            title.parentElement.classList.add('hide');

        }

    });

}

function getAjax(url, success = null, fail = null) {

    let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

    xhr.open('GET', url);

    xhr.onreadystatechange = function () {

        if (xhr.readyState > 3 && xhr.status == 200 && typeof success == 'function') {

            success(xhr.responseText);

        }
        else {

            if (typeof fail == 'function') fail();

        }

    };

    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    xhr.send();

    return xhr;

}