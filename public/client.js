/// <reference types="jquery" />

let app = $('#app');

app.on('keyup', '.OrderPage .getById', (e) => {
    if (e.keyCode === 13) {
        location.href = '/order/view/' + e.target.value + '?filter=1';
    }
});

app.on('submit', '.OrderPage form.handleOrder', (e) => {
    e.preventDefault();
    let form = e.target;
    let action = form.dataset.action;
    let payload = {};
    Array.from($(form).find('input[action-payload]')).forEach(el => {
        payload[el.name] = el.value;
    });

    postJson('/order/handle/' + form.dataset.orderid, { type: action, payload })
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


function postJson(url, data) {
    return Promise.resolve($.post({
        url: url,
        data: JSON.stringify(data),
        contentType: 'application/json'
    }));
}