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
  it("Should be able to handle offset forward cases", () => {
    let forwardCases = [
      {baseDate: "2020-12-19", offset: 0 /* SAT 12/19  w*/, expectedResult: "2020-12-21"},
      {baseDate: "2020-12-19", offset: 1 /* SUN 12/20  w*/, expectedResult: "2020-12-21"},
      {baseDate: "2020-12-19", offset: 2 /* MON 12/21  b*/, expectedResult: "2020-12-21"},
      {baseDate: "2020-12-19", offset: 3 /* TUE 12/22  b*/, expectedResult: "2020-12-22"},
      {baseDate: "2020-12-19", offset: 4 /* WED 12/23  b*/, expectedResult: "2020-12-23"},
      {baseDate: "2020-12-19", offset: 5 /* THU 12/24  b*/, expectedResult: "2020-12-24"},
      {baseDate: "2020-12-19", offset: 6 /* FRI 12/25  h*/, expectedResult: "2020-12-29"},
      {baseDate: "2020-12-19", offset: 7 /* SAT 12/26  w*/, expectedResult: "2020-12-29"},
      {baseDate: "2020-12-19", offset: 8 /* SUN 12/27  w*/, expectedResult: "2020-12-29"},
      {baseDate: "2020-12-19", offset: 9 /* MON 12/28  h*/, expectedResult: "2020-12-29"},
      {baseDate: "2020-12-19", offset: 10 /*TUE 12/29  b*/, expectedResult: "2020-12-29"}
    ];

    forwardCases.forEach((caseItem, i) => {
      let result = nbd.FindNextBizDate(caseItem.baseDate, holidays, caseItem.offset, "FORWARD");
      console.log("RESULT", caseItem, {result});
      assert.equal(result.isSame(caseItem.expectedResult), true);
    });
  });

  it("Should be able to handle offset backward cases", () => {
    let backwardsCases = [
      {baseDate: "2020-12-26", offset: 0 /*SAT 12/26  w*/, expectedResult: "2020-12-24"},
      {baseDate: "2020-12-26", offset: 1 /*FRI 12/25  h*/, expectedResult: "2020-12-24"},
      {baseDate: "2020-12-26", offset: 2 /*THU 12/24  b*/, expectedResult: "2020-12-24"},
      {baseDate: "2020-12-26", offset: 3 /*WED 12/23  b*/, expectedResult: "2020-12-23"},
      {baseDate: "2020-12-26", offset: 4 /*TUE 12/22  b*/, expectedResult: "2020-12-22"},
      {baseDate: "2020-12-26", offset: 5 /*MON 12/21  b*/, expectedResult: "2020-12-21"},
      {baseDate: "2020-12-26", offset: 6 /*SUN 12/20  w*/, expectedResult: "2020-12-18"},
      {baseDate: "2020-12-26", offset: 7 /*SAT 12/19  w*/, expectedResult: "2020-12-18"},
      {baseDate: "2020-12-26", offset: 8 /*FRI 12/18  b*/, expectedResult: "2020-12-18"},
      {baseDate: "2020-12-26", offset: 9 /*THU 12/17  h*/, expectedResult: "2020-12-16"},
      {baseDate: "2020-12-26", offset: 10 /*WED 12/16 b*/, expectedResult: "2020-12-16"}
    ];

    backwardsCases.forEach((caseItem, i) => {
      let result = nbd.FindNextBizDate(caseItem.baseDate, holidays, caseItem.offset, "BACKWARDS");
      console.log("RESULT", caseItem, {result});
      assert.equal(result.isSame(caseItem.expectedResult), true);
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