# next-biz-date
Provides a comprehensive way to find next business day by skipping an array of target (previously sorted) holidays and weekends.

# example test:

```
mkdir nbd-test
cd nbd-test
npm i next-biz date
cd node_modules
cd next-biz-date
npm run test-old
```

If you have mocha installed (`npm i mocha -g`) you can also run `npm test` or simply `mocha` to execute the unit tests.

You can look at the test.js file there for an example on usage, which consists in creating an array of dates (strings with yyyy-mm-dd format) that then is passed to the `FindNextBizDate()` function along with a cadidateDate specification.

The basic outline is:
1. Define candidate date
2. Define array of holidays (strings with yyyy-mm-dd format)
3. Call the FindNextBizDate() function passing the candidateDate and the holidaysArray you defined.


```
const moment = require("moment");
const nbd = require("next-biz-date");

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
    let rDate = nbd.FindNextBizDate(tDate, holidaysArray);
    if(rDate.isSame(expectedResults[i])){
      console.log(tDate, rDate, "OK");
    } else {
      console.error("FAIL",tDate, rDate);
    }
    results.push({tDate, rDate});
  });
}
test();
```
