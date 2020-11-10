const nbd = require("./main");

console.log("SMALL TEST");

const holidays = [
  "2020-12-18",
  "2020-12-25",
  "2020-12-28",
  "2021-01-01",
  "2021-01-04"
];

const forwardCase = {
  baseDate: "2020-12-19",
  offset: 1,
  expectedResult: "2020-12-21"
};

let fwResult = nbd.FindNextBizDate(forwardCase.baseDate, holidays, forwardCase.offset, "FORWARD");

console.log("FORWARD CASE", {forwardCase, fwResult});

const backwardsCase = {
  baseDate: "2020-12-27",
  offset: 1,
  expectedResult: "2020-12-24"
};

let bwresult = nbd.FindNextBizDate(backwardsCase.baseDate, holidays, backwardsCase.offset, "BACKWARDS");

console.log("BACKWARDS CASE", {backwardsCase, bwresult});



