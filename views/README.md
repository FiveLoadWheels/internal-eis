# Views

layout.ejs - 布局

order.ejs - 订单页面

product.ejs - 产品页面

order-forms/*.ejs - 订单操作表单

product-forms/*.ejs - 产品操作表单

## 操作表单

操作表单用于对 Order 或者 Product 发出动作(Action), 以下是一个简单的动作表单:

```html
  <form class="handleAction" data-action="SOME_ACTION" id="<%= id %>">
    <input action-payload name="prop1">
    <input action-payload name="prop2">
  </form>
```

这个表单会产生以下调用:

```javascript
  handleOrder(order, {
    type: 'SOME_ACTION', // 表单所做的动作 
    payload: {
      prop1: '...',
      prop2: '...'
    } // 表单内容
  })；
```

表单文件名与 Action 名称对应，如 end-delivery.ejs 对应 END_DELIVERY

**TODO:** 表单项目要有明确的JSON类型.