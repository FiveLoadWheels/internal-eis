/// <reference types="jquery" />

let app = $('#app');

// ====== OrderPageController ======

buildGetById(app, 'OrderPage', 'order');
buildActionForm(app, 'OrderPage', 'order');

// ====== ProductPageController ======

buildGetById(app, 'ProductPage', 'product');
buildActionForm(app, 'ProductPage', 'product');


// ====== Helpers ======

function postJson(url, data) {
    return Promise.resolve($.post({
        url: url,
        data: JSON.stringify(data),
        contentType: 'application/json'
    }));
}

// ====== Control Builders ======

function buildGetById(app, controller, baseRoute) {
    app.on('keyup', `.${controller} .getById`, (e) => {
        if (e.keyCode === 13) {
            location.href = `/${baseRoute}/view/` + e.target.value + '?filter=1';
        }
    });
}

function buildActionForm(app, controller, baseRoute) {
    app.on('submit', `.${controller} form.handleOrder`, (e) => {
        e.preventDefault();
        let form = e.target;
        let action = form.dataset.action;
        let payload = {};
        Array.from($(form).find('input[action-payload]')).forEach(el => {
            payload[el.name] = el.value;
        });

        postJson(`/${baseRoute}/handle/` + form.dataset.id, { type: action, payload })
        .then(result => {
            console.log(result);
            // store.dispatch({ action: 'HANDLE_COMPLETE' });
            location.reload();
        })
        .catch(err => {
            console.error(err);
            // store.dispatch({ action: 'HANDLE_FAIL' });
        })
    });
}
