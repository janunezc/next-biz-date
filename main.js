(() => {
  const moment = require("moment");

/**
 * Find a business date by shifting a base date by a provided offset in the provided direction. It leverages the findBizDate() function.
 * @param {String} baseDate String of YYYY-MM-DD format or Moment object
 * @param {Array} holidaysArray Array of strings of YYYY-MM-DD format
 * @param {Int} offset
 * @param {String} direction with content of "FORWARD" or "BACKWARDS"
 * @returns {main=>#1.findBizDate.mCandidateDate|moment}
 */
  function findNextBizDate(baseDate, holidaysArray, offset, direction) {
    if (!offset) {
      offset = 0;
    }

    if (!direction) {
      direction = "FORWARD";
    }

    if (direction === "FORWARD") {
      let initialCandidateDate = moment(baseDate).add(offset, 'days');
      return findBizDate(initialCandidateDate, holidaysArray, direction);
    } else {
      let initialCandidateDate = moment(baseDate).add(-1 * offset, 'days');
      return findBizDate(initialCandidateDate, holidaysArray, direction);
    }
  }

  /**
   * Returns the next applicable business day for a given candidate day.
   * If candidateDate is a buisness day then it returns the same provided candidateDate.
   * @param {moment} candidateDate Date to evaluate first for being bizdate (moment or string on yyyy-mm-dd format)
   * @param {moment} holidaysArray Array of holidays (strings on yyyy-mm-dd format)
   * @param {string} direction FORWARD or BACKWARDS
   * @returns {moment}
   */
  function findBizDate(candidateDate, holidaysArray, direction) {
    let mCandidateDate = moment(candidateDate);
    let dow = mCandidateDate.day();
    if (!direction) {
      direction = "FORWARD";
    }

    //FIX WEEKENDS
    if (dow === 6/*SATURDAY*/ || dow === 0/*SUNDAY*/) {
      if (dow === 0 /*SUNDAY*/)
        mCandidateDate = direction === "FORWARD" ? mCandidateDate.add(1, 'day') : mCandidateDate.add(-2, 'day');
      else /*SATURDAY*/
        mCandidateDate = direction === "FORWARD" ? mCandidateDate.add(2, 'day') : mCandidateDate.add(-1, 'day');
    }

    //REACT TO NO HoliDays array
    if (holidaysArray === undefined || holidaysArray.length === undefined || holidaysArray.length === 0) {
      return mCandidateDate;
    }

    //SCAN the HolyDays array and use recursion
    let initial, increment, exitCondition;
    if (direction === "FORWARD") {
      initial = 0;
      increment = 1;
      exitCondition = (value) => {
        return value < holidaysArray.length;
      };
    } else {
      initial = holidaysArray.length - 1;
      increment = -1;
      exitCondition = (value) => {
        return value >= 0;
      };
    }
    
    for (var i = initial; exitCondition(i); i += increment) {
      let item = holidaysArray[i];
      const mHoliday = moment(item);

      if (mHoliday.isSameOrAfter(mCandidateDate)) {
        if (mCandidateDate.isSame(mHoliday)) {
          let remainingHolidays;
          if (direction === "FORWARD") {
            remainingHolidays = holidaysArray.slice(i + 1);
            return findBizDate(mCandidateDate.add(1, 'day'), remainingHolidays, direction);
          } else {
            remainingHolidays = holidaysArray.slice(0, holidaysArray.length - 2);
            return findBizDate(mCandidateDate.add(-1, 'day'), remainingHolidays, direction);
          }
        }
      }
    }

    return mCandidateDate;
  }
  
  exports.FindBizDate = findBizDate;
  exports.FindNextBizDate = findNextBizDate;
})();
