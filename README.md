# Internal EIS System

Internal part of the EIS system.

This project is written in Javascript and use express.js as the web application platform.

The order/product handling logics are packed as a standalone software package, which is located here: 
https://github.com/FiveLoadWheels/eis-order-handling.

## Install

```shell
    git clone https://github.com/FiveLoadWheels/internal-eis
    cd internal-eis
    npm install
```
The standalone `eis-order-handling` package will be automatically installed during `npm install`.

## Run

```shell
    npm start
```