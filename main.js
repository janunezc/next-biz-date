(() => {
  const moment = require("moment");
  
  /**
   * Returns the next applicable business day for a given candidate day.
   * If candidateDate is a buisness day then it returns the same provided candidateDate.
   * @param {moment} candidateDate
   * @param {moment} holidaysArray
   * @returns {moment}
   */
  function findNextBizDate(candidateDate, holidaysArray) {
    let mCandidateDate = moment(candidateDate);
    let dow = mCandidateDate.day();

    //FIX WEEKENDS
    if (dow === 6 || dow === 0) {
      if (dow === 0)
        mCandidateDate = mCandidateDate.add(1, 'day');
      else
        mCandidateDate = mCandidateDate.add(2, 'day');
    }

    //REACT TO NO HoliDays array
    if (holidaysArray === undefined || holidaysArray.length === undefined || holidaysArray.length === 0) {
      return mCandidateDate;
    }

    //SCAN the HolyDays array and use recursion
    for (var i = 0; i < holidaysArray.length; i++) {
      let item = holidaysArray[i];
      const mHoliday = moment(item);

      if (mHoliday.isSameOrAfter(mCandidateDate)) {
        if (mCandidateDate.isSame(mHoliday)) {
          let remainingHolidays = holidaysArray.slice(i + 1);
          return findNextBizDate(mCandidateDate.add(1, 'day'), remainingHolidays);
        }
      }
    }

    return mCandidateDate;
  }

  exports.FindNextBizDate = findNextBizDate;
})();
