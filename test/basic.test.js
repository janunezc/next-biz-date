const assert = require("assert");
const moment = require("moment");
const nbd = require("../main");

describe("Base Test Scenario", () => {
  it("Should properly do happy-path cases", () => {
    const happyPathCases = [
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

    const holidays = [
      "2020-12-25",
      "2020-12-28",
      "2021-01-01",
      "2021-01-04"
    ];

    console.log("TEST:", {happyPathCases, holidays, expectedResults});

    let results = [];

    happyPathCases.forEach((item, i) => {
      let tDate = moment(item);
      let rDate = nbd.FindNextBizDate(tDate, holidays);

      console.log("Testing", tDate, expectedResults[i], rDate);
      assert.equal(rDate.isSame(expectedResults[i]), true);
      results.push({tDate, rDate});
    });
  });
});