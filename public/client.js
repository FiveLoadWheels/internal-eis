/// <reference types="jquery" />

let app = $(document);

// ====== Layout ======

function render(href) {
    let prog = new ToProgress({ color: '#8bb', duration: 0.2, height: '2px' }, '#progbar');
    prog.increase(30);
    let jqXhr = $.get(href, null, 'html');
    return Promise.resolve(jqXhr).then(html => {
        setDOM(document, html);
    }, () => {
        setDOM(document, jqXhr.responseText);
    }).then(() => {
        prog.finish();
        ~function (prog) { setTimeout(() => $(prog.progressBar).remove(), 5000); }(prog);
    });
}

function renderSubmit(form) {
    let xhr = new XMLHttpRequest();
    let data = Array.from($(form).find('input[name],select[name]')).map(i => [i.name, i.value]);
    let url;
    if (form.method.toLowerCase() === 'post') {
        url = form.action
        xhr.open(form.method, url);
        xhr.send(form);
    }
    else {
        url = form.action + '?' + data.map(e => `${e[0]}=${e[1]}`).join('&');
        
        xhr.open(form.method, url);
        xhr.send(null);
    }
    xhr.onload = () => {
        setDOM(document, xhr.responseText);
        console.log(url);
        history.pushState(null, null, url);
    };
    xhr.onerror = (err) => alert(err);
}

app.on('click', 'a[href]', (e) => {
    let a = e.target.tagName.toLowerCase() === 'a' ? $(e.target) : $(e.target).parents('a');
    let href = a.attr('href');
    if (href.indexOf('/') !== 0) {
        return;
    }

    e.preventDefault();
    console.log(href);
    render(href).then(() => history.pushState(null, null, href));
});

window.onpopstate = (e) => {
    render(location.href);
};

// ====== OrderPageController ======

buildGetById(app, 'OrderPage', 'order');
buildActionForm(app, 'OrderPage', 'order');

// ====== ProductPageController ======

buildGetById(app, 'ProductPage', 'product');
buildActionForm(app, 'ProductPage', 'product');

// ====== PersonnelPageController ======

buildGetById(app, 'PersonnelPage', 'personnel');
buildActionForm(app, 'PersonnelPage', 'personnel');

// ====== FinancePageController =====

buildActionForm(app, 'FinancePage', 'finance');
app.on('click', '.FinancePage .modifyRec', (e) => {
    let rec = JSON.parse(e.target.dataset.rec);
    console.log('rec', rec);
    // *** Apply rec to the modal ***
    $('#modify-record-modal form[name=id]').attr("data-id", rec.id);
    $('#modify-record-modal input[name=id]').val(rec.id);
    $('#modify-record-modal select[name=type]').val(rec.type);
    $('#modify-record-modal input[name=amount]').val(rec.amount);
    $('#modify-record-modal input[name=description]').val(rec.description);

});
window.addEventListener('mount', (e) => {
    $('#fin-table').bootstrapTable();
}, true);

// ====== Helpers ======

function postJson(url, data) {
    return Promise.resolve($.post({
        url: url,
        data: JSON.stringify(data),
        contentType: 'application/json',
        headers: {
            accept: 'application/json'
        }
    })).catch(jqXhr => {
        throw JSON.parse(jqXhr.responseText).err;
    });
}

// ====== Control Builders ======

function buildGetById(app, controller, baseRoute) {
    app.on('keyup', `.${controller} .getById`, (e) => {
        if (e.keyCode === 13) {
            if (e.target.value.trim()) {
                render(`/${baseRoute}/view/` + e.target.value.trim() + '?filter=1');
            }
            else {
                render(location.pathname);
            }
        }
    });
}

function buildActionForm(app, controller, baseRoute) {
    app.on('submit', `.${controller} form.handleAction`, (e) => {
        e.preventDefault();
        let form = e.target;
        let modal = $(form).parents('.modal');
        let actionType = form.dataset.action;
        let payload = {};
        Array.from($(form).find('input[action-payload],select[action-payload]')).forEach(el => {
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
            // alert('Action completed.');
            modal.modal('hide');
            modal.one('hidden.bs.modal', () => render(''));
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