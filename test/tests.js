const assert = require("assert");
const moment = require("moment");
const nbd = require("../main");

const holidays = [
  "2020-12-17",
  "2020-12-25",
  "2020-12-28",
  "2021-01-01",
  "2021-01-04"
];

describe("FindBizDate", () => {
  it("Should Find Biz Date based on CandidateDate", () => {
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

    console.log("TEST:", {happyPathCases, holidays, expectedResults});

    let results = [];

    happyPathCases.forEach((item, i) => {
      let tDate = moment(item);
      let rDate = nbd.FindBizDate(tDate, holidays);

      console.log("Testing", tDate, expectedResults[i], rDate);
      assert.equal(rDate.isSame(expectedResults[i]), true);
      results.push({tDate, rDate});
    });
  });
});

describe("FindNextBizDate", () => {
  it("Should be able to handle offset forward cases", () => {
    let forwardCases = [
      {initialDate: "2020-12-19", offset: 0 /* SAT 12/19  w*/, expectedDate: "2020-12-21"},
      {initialDate: "2020-12-19", offset: 1 /* SUN 12/20  w*/, expectedDate: "2020-12-21"},
      {initialDate: "2020-12-19", offset: 2 /* MON 12/21  b*/, expectedDate: "2020-12-21"},
      {initialDate: "2020-12-19", offset: 3 /* TUE 12/22  b*/, expectedDate: "2020-12-22"},
      {initialDate: "2020-12-19", offset: 4 /* WED 12/23  b*/, expectedDate: "2020-12-23"},
      {initialDate: "2020-12-19", offset: 5 /* THU 12/24  b*/, expectedDate: "2020-12-24"},
      {initialDate: "2020-12-19", offset: 6 /* FRI 12/25  h*/, expectedDate: "2020-12-29"},
      {initialDate: "2020-12-19", offset: 7 /* SAT 12/26  w*/, expectedDate: "2020-12-29"},
      {initialDate: "2020-12-19", offset: 8 /* SUN 12/27  w*/, expectedDate: "2020-12-29"},
      {initialDate: "2020-12-19", offset: 9 /* MON 12/28  h*/, expectedDate: "2020-12-29"},
      {initialDate: "2020-12-19", offset: 10 /*TUE 12/29  b*/, expectedDate: "2020-12-29"}
    ];

    forwardCases.forEach((caseItem, i) => {
      let result = nbd.FindNextBizDate(caseItem.initialDate, holidays, caseItem.offset, "FORWARD");
      console.log("RESULT", moment(caseItem.initialDate), caseItem.offset, moment(caseItem.expectedDate), result);
      assert.equal(result.isSame(caseItem.expectedDate), true);
    });
  });

  it("Should be able to handle offset backward cases", () => {
    let backwardsCases = [
      {initialDate: "2020-12-26", offset: 0 /*SAT 12/26  w*/, expectedDate: "2020-12-24"},
      {initialDate: "2020-12-26", offset: 1 /*FRI 12/25  h*/, expectedDate: "2020-12-24"},
      {initialDate: "2020-12-26", offset: 2 /*THU 12/24  b*/, expectedDate: "2020-12-24"},
      {initialDate: "2020-12-26", offset: 3 /*WED 12/23  b*/, expectedDate: "2020-12-23"},
      {initialDate: "2020-12-26", offset: 4 /*TUE 12/22  b*/, expectedDate: "2020-12-22"},
      {initialDate: "2020-12-26", offset: 5 /*MON 12/21  b*/, expectedDate: "2020-12-21"},
      {initialDate: "2020-12-26", offset: 6 /*SUN 12/20  w*/, expectedDate: "2020-12-18"},
      {initialDate: "2020-12-26", offset: 7 /*SAT 12/19  w*/, expectedDate: "2020-12-18"},
      {initialDate: "2020-12-26", offset: 8 /*FRI 12/18  b*/, expectedDate: "2020-12-18"},
      {initialDate: "2020-12-26", offset: 9 /*THU 12/17  h*/, expectedDate: "2020-12-16"},
      {initialDate: "2020-12-26", offset: 10 /*WED 12/16 b*/, expectedDate: "2020-12-16"}
    ];

    backwardsCases.forEach((caseItem, i) => {
      let result = nbd.FindNextBizDate(caseItem.initialDate, holidays, caseItem.offset, "BACKWARDS");
      console.log("RESULT", moment(caseItem.initialDate), caseItem.offset, moment(caseItem.expectedDate), result);
      assert.equal(result.isSame(caseItem.expectedDate), true);
    });
  });

  it("Should properly handle the case default offset and direction parameters.", () => {
    const result = nbd.FindNextBizDate("2020-12-24", holidays);
    const result2 = nbd.FindNextBizDate("2020-12-25", holidays, 0);

    assert.equal(result.isSame(moment("2020-12-24")), true);
    assert.equal(result2.isSame(moment("2020-12-29")), true);
    console.log(result, result2);
  });
});