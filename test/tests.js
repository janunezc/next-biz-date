const assert = require("assert");
const moment = require("moment");
const nbd = require("../main");

const holidays = [
  "2020-12-18",
  "2020-12-25",
  "2020-12-28",
  "2021-01-01",
  "2021-01-04"
];

describe("findBizDate(candidateDate, holidaysArray, direction)", () => {

  console.log("HOLIDAYS: ", holidays);

  it("Should Find Biz Date based on CandidateDate", () => {

    const happyPathCases = [
      {candidateDate: "2020-12-20" /*SUN W*/, expectedResult: "2020-12-21"},
      {candidateDate: "2020-12-21" /*MON B*/, expectedResult: "2020-12-21"},
      {candidateDate: "2020-12-22" /*TUE B*/, expectedResult: "2020-12-22"},
      {candidateDate: "2020-12-23" /*WED B*/, expectedResult: "2020-12-23"},
      {candidateDate: "2020-12-24" /*THU B*/, expectedResult: "2020-12-24"},
      {candidateDate: "2020-12-25" /*FRI H*/, expectedResult: "2020-12-29"},
      {candidateDate: "2020-12-26" /*SAT W*/, expectedResult: "2020-12-29"},
      {candidateDate: "2020-12-27" /*SUN W*/, expectedResult: "2020-12-29"},
      {candidateDate: "2020-12-28" /*MON H*/, expectedResult: "2020-12-29"},
      {candidateDate: "2020-12-29" /*TUE B*/, expectedResult: "2020-12-29"},
      {candidateDate: "2020-12-30" /*WED B*/, expectedResult: "2020-12-30"},
      {candidateDate: "2020-12-31" /*THU B*/, expectedResult: "2020-12-31"},
      {candidateDate: "2021-01-01" /*FRI H*/, expectedResult: "2021-01-05"},
      {candidateDate: "2021-01-02" /*SAT W*/, expectedResult: "2021-01-05"},
      {candidateDate: "2021-01-03" /*SUN W*/, expectedResult: "2021-01-05"},
      {candidateDate: "2021-01-04" /*MON H*/, expectedResult: "2021-01-05"},
      {candidateDate: "2021-01-05" /*TUE B*/, expectedResult: "2021-01-05"}
    ];

    happyPathCases.forEach((caseItem, i) => {
      let candidateDate = moment(caseItem.candidateDate);
      let result = nbd.FindBizDate(candidateDate, holidays);

      console.log("RESULT", caseItem, {result});
      assert.equal(result.isSame(moment(caseItem.expectedResult)), true);
    });
  });
});

describe("findNextBizDate(baseDate, holidaysArray, offset, direction)", () => {
  it("Should be able to handle offset COUNTING forward cases", () => {
    let forwardCases = [
      {baseDate: "2020-12-17", offset: 0 /*  0                     */, expectedResult: "2020-12-17"},
      {baseDate: "2020-12-17", offset: 1 /*  0HWW1                 */, expectedResult: "2020-12-21"},

      {baseDate: "2020-12-19", offset: 0 /*  WW0                   */, expectedResult: "2020-12-21"},
      {baseDate: "2020-12-19", offset: 1 /*  WW1                   */, expectedResult: "2020-12-21"},
      {baseDate: "2020-12-19", offset: 2 /*  WW12                  */, expectedResult: "2020-12-22"},
      {baseDate: "2020-12-19", offset: 3 /*  WW123                 */, expectedResult: "2020-12-23"},
      {baseDate: "2020-12-19", offset: 4 /*  WW1234                */, expectedResult: "2020-12-24"},
      {baseDate: "2020-12-19", offset: 5 /*  WW1234HWWH5           */, expectedResult: "2020-12-29"},
      {baseDate: "2020-12-19", offset: 6 /*  WW1234HWWH56          */, expectedResult: "2020-12-30"},
      {baseDate: "2020-12-19", offset: 7 /*  WW1234HWWH567         */, expectedResult: "2020-12-31"},
      {baseDate: "2020-12-19", offset: 8 /*  WW1234HWWH567HWWH8    */, expectedResult: "2021-01-05"},
      {baseDate: "2020-12-19", offset: 9 /*  WW1234HWWH567HWWH89   */, expectedResult: "2021-01-06"},
      {baseDate: "2020-12-19", offset: 10 /* WW1234HWWH567HWWH890  */, expectedResult: "2021-01-07"},
      {baseDate: "2020-12-19", offset: 11 /* WW1234HWWH567HWWH8901 */, expectedResult: "2021-01-08"},
    ];

    let results = [];
    forwardCases.forEach((caseItem, i) => {
      let result = nbd.FindNextBizDate(caseItem.baseDate, holidays, caseItem.offset, "FORWARD");
      console.log("RESULT", caseItem, {result});
      results.push({caseItem, result});
    });

    results.forEach((item) => {
      assert.equal(item.result.isSame(item.caseItem.expectedResult), true);
    });
  });

  it("Should be able to handle offset backward cases", () => {
    let backwardsCases = [
      {baseDate: "2020-12-30", offset: 0 /*                      0  */, expectedResult: "2020-12-30"},
      {baseDate: "2020-12-30", offset: 1 /*                     10  */, expectedResult: "2020-12-29"},
      {baseDate: "2020-12-30", offset: 2 /*                2HWWH10  */, expectedResult: "2020-12-24"},
      {baseDate: "2020-12-30", offset: 3 /*               32HWWH10  */, expectedResult: "2020-12-23"},
      {baseDate: "2020-12-30", offset: 4 /*              432HWWH10  */, expectedResult: "2020-12-22"},
      {baseDate: "2020-12-30", offset: 5 /*             5432HWWH10  */, expectedResult: "2020-12-21"},
      {baseDate: "2020-12-30", offset: 6 /*         6HWW5432HWWH10  */, expectedResult: "2020-12-17"},

      {baseDate: "2021-01-07", offset: 7 /*       76HWWH543HWWH210  */, expectedResult: "2020-12-23"},
      {baseDate: "2021-01-07", offset: 8 /*      876HWWH543HWWH210  */, expectedResult: "2020-12-22"},
      {baseDate: "2021-01-07", offset: 9 /*     9876HWWH543HWWH210  */, expectedResult: "2020-12-21"},

      {baseDate: "2021-01-03", offset: 8 /*     8HWW7654HWWH321HWW  */, expectedResult: "2020-12-17"},

      {baseDate: "2020-12-27", offset: 0 /*                   0HWW  */, expectedResult: "2020-12-24"},
      {baseDate: "2020-12-27", offset: 1 /*                   1HWW  */, expectedResult: "2020-12-24"},
      {baseDate: "2020-12-27", offset: 2 /*                  21HWW  */, expectedResult: "2020-12-23"},
      {baseDate: "2020-12-27", offset: 3 /*                 321HWW  */, expectedResult: "2020-12-22"},
      {baseDate: "2020-12-27", offset: 4 /*                4321HWW  */, expectedResult: "2020-12-21"},
      {baseDate: "2020-12-27", offset: 5 /*            5HWW4321HWW  */, expectedResult: "2020-12-17"}
    ];

    let results = [];
    backwardsCases.forEach((caseItem, i) => {
      let result = nbd.FindNextBizDate(caseItem.baseDate, holidays, caseItem.offset, "BACKWARDS");
      console.log("RESULT", caseItem, {result});
      results.push({caseItem, result});
    });

    results.forEach((item) => {
      assert.equal(item.result.isSame(item.caseItem.expectedResult), true);
    });
  });

  it("Should properly handle the case default offset and direction parameters.", () => {
    const result = nbd.FindNextBizDate("2020-12-24", holidays);
    const result2 = nbd.FindNextBizDate("2020-12-25", holidays, 0);

    assert.equal(result.isSame(moment("2020-12-24")), true);
    assert.equal(result2.isSame(moment("2020-12-29")), true);
    console.log(result, result2);
  });

  it("Should process backwards from saturday", () => {
    const cornerCase = {baseDate: "2020-12-19", expectedResult: "2020-12-17"};
    const result = nbd.FindNextBizDate(cornerCase.baseDate, holidays, 0, "BACKWARDS");
    console.log({cornerCase, result});
    assert.equal(result.isSame(moment(cornerCase.expectedResult)), true);
  });
});