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
1. Define candidate date
2. Define array of holidays (strings with yyyy-mm-dd format)
3. Define an offset (integer >=0) and a direction ("FORWARD" or "BACKWARDS")
3. Call the FindNextBizDate() function passing the candidateDate, the holidaysArray, offset and direction you defined.
