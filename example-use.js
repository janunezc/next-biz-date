const moment = require("moment");
const nbd = require("../next-biz-date");

const holidays = [
    "2020-12-17",
    "2020-12-25",
    "2020-12-28",
    "2021-01-01",
    "2021-01-04"
];

const initialDate = "2020-12-24";
const offset = 1;
const direction = "FORWARD";

const result = nbd.FindNextBizDate(initialDate, holidays, offset, direction);

console.log("RESULT: ", result);
console.log("INPUTS:",{initialDate, offset, direction});