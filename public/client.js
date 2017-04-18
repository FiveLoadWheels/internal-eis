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
    app.on('submit', `.${controller} form.handleAction`, (e) => {
        e.preventDefault();
        let form = e.target;
        let actionType = form.dataset.action;
        let payload = {};
        Array.from($(form).find('input[action-payload]')).forEach(el => {
            let dataType = JSONTypes[el.dataset.type];
            payload[el.name] = dataType(el.value);
        });

        // build action object
        let action = { type: actionType, payload };

        // passwordConfirm
        action.passwordConfirm = $(form).find('input[name=passwordConfirm]').val();
        console.log('passwordConfirm', action.passwordConfirm);

        postJson(`/${baseRoute}/handle/` + form.dataset.id, action)
        .then(result => {
            if (result.err) {
                throw result.err;
            }
            console.log(result);
            // store.dispatch({ action: 'HANDLE_COMPLETE' });
            alert('Action completed.');
            location.reload();
        })
        .catch(err => {
            console.error(err);
            alert('ActionError: ' + err);
            // store.dispatch({ action: 'HANDLE_FAIL' });

        })
    });
}

var JSONTypes = {
    String: String,
    Number: Number,
    Boolean: Boolean,
    DateTime: Date.parse.bind(Date)
}