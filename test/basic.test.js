const assert = require("assert");
const moment = require("moment");
const nbd = require("../main");

const holidays = [
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
            {initialDate: "2020-12-19", offset: 0, expectedDate: "2020-12-21"},
            {initialDate: "2020-12-19", offset: 1, expectedDate: "2020-12-21"},
            {initialDate: "2020-12-19", offset: 2, expectedDate: "2020-12-21"},
            {initialDate: "2020-12-19", offset: 3, expectedDate: "2020-12-22"}
        ];

        forwardCases.forEach((caseItem, i) => {
            let result = nbd.FindNextBizDate(caseItem.initialDate, holidays, caseItem.offset, "FORWARD");
            console.log("RESULT", moment(caseItem.initialDate), caseItem.offset, moment(caseItem.expectedDate), result);
            assert.equal(result.isSame(caseItem.expectedDate), true);
        });
    });
});