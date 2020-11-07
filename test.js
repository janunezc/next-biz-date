const moment = require("moment");
const nbd = require("./main");

function test() {
  console.log("--------------------------------------------");
  console.log("--------------------------------------------");
  console.log("--------------------------------------------");

  const targetCases = [
    "2020-12-20",
    "2020-12-21",
    "2020-12-22",
    "2020-12-23",
    "2020-12-24",
    "2020-12-25",
    "2020-12-26",
    "2020-12-27",
    "2020-12-28",
    "2020-12-29",
    "2020-12-30",
    "2020-12-31",
    "2021-01-01",
    "2021-01-02",
    "2021-01-03",
    "2021-01-04",
    "2021-01-05"
  ];
  
  const expectedResults = [
    "2020-12-21",
    "2020-12-21",
    "2020-12-22",
    "2020-12-23",
    "2020-12-24",
    "2020-12-29",
    "2020-12-29",
    "2020-12-29",
    "2020-12-29",
    "2020-12-29",
    "2020-12-30",
    "2020-12-31",
    "2021-01-05",
    "2021-01-05",
    "2021-01-05",
    "2021-01-05",
    "2021-01-05"
  ];  

  const holidaysArray = [
    "2020-12-25",
    "2020-12-28",
    "2021-01-01",
    "2021-01-04"
  ];

  console.log("TEST:", {targetCases, holidaysArray});

  let results = [];

  targetCases.forEach((item, i) => {
    let tDate = moment(item);
    let rDate = nbd.NextBizDay(tDate, holidaysArray);
    if(rDate.isSame(expectedResults[i])){
      console.log(tDate, rDate, "OK");
    } else {
      console.error("FAIL",tDate, rDate);
    }
    results.push({tDate, rDate});
  });
}
test();