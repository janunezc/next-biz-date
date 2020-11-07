const nbd = require("../next-biz-date");

const holidays = [
  "2020-12-17",
  "2020-12-25",
  "2020-12-28",
  "2021-01-01",
  "2021-01-04"
];

const testCases = [
  {initialDate: "2020-12-24", offset: 1, direction: "FORWARD", expected_result: "2020-12-29"},
  {initialDate: "2020-12-29", offset: 1, direction: "BACKWARDS", expected_result: "2020-12-24"}
];

testCases.forEach((item, idx)=>{
  console.log(`CASE #${idx}: `,item);
  console.log("  RESULT: ", nbd.FindNextBizDate(item.initialDate, holidays, item.offset, item.direction));
});
