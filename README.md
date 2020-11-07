# next-biz-date
Provides a comprehensive way to find next business day by skipping an array of target (previously sorted) holidays and weekends.

# example test:

```
mkdir nbd-test
cd nbd-test
npm i next-biz date
cd node_modules
cd next-biz-date
npm test
```

If you have nyc and mocha installed (`npm i nyc -g` and `npm i mocha -g`) you can also run `npm test` to execute the unit tests.

You can look at the test folder for a examples on usage, which consists in creating an array of dates (strings with yyyy-mm-dd format) that then is passed to the `FindNextBizDate()` function along with a cadidateDate specification.

The basic outline is:
1. Define Initial Date (String with YYYY-MM-DD format. I.e. `"2020-12-24"`)
2. Define array of holidays (strings with YYYY-MM-DD format). I.e.: `["2020-12-25","2020-12-28","2021-01-01"]`
3. Define an offset (integer >=0) and a direction (`"FORWARD"` or `"BACKWARDS"`). I.e.: `1`
4. Call the `FindNextBizDate()` function passing the `candidateDate`, the `holidaysArray`, `offset` and `direction` you defined.
5. The function will determine if the proposed date (i.e.: 2020-12-24) plus offset (1) on the corresponding direction (FORWARD) is a business day (not a weekend day,not a holiday). If it is not, then it will scan for the next business day.
6. Result: For `InitialDate=2020-12-24, offset=1, direction=FORWARD and holidays = ["2020-12-25","2020-12-28","2021-01-01"]` the result will be `*2020-12-29*`


# Example Code:

See the file example-use.js within the package as an example of how to use it. Notice `require('../next-biz-date');` would be changed to `require('next-biz-date');`  under normal conditions.

For our example nbd-test folder you can create the following example.js file in the root of the nbd-test package.

```
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
```