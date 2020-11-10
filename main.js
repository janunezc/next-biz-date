(() => {
  const moment = require("moment");

  /***
   * Caluclates next applicable business day out of counting bizdates starting from a provided base date up to a provided countTarget by skipping holidays and weekends.
   * @param {String} baseDate date to start counting. Also conceptualized as day 0.
   * @param {Array} holidaysArray Array of holidays to consider.
   * @param {Int} countTarget Number of biz dates count.
   * @param {String} direction FORWARD or BACKWARDS to count to the future or to the past respectively.
   * @returns {MomentJS Date}  
   */
  function findNextBizDate(baseDate, holidaysArray, countTarget, direction) {
    if (!countTarget) {
      countTarget = 0;
    }

    if (!direction) {
      direction = "FORWARD";
    }

    if (countTarget === 0) { //DEFAULT TO NEXT BIZ DATE
      return findBizDate(baseDate, holidaysArray, direction);
    } else { //CRAWL FOR COUNT
      return _crawlForCount(baseDate, holidaysArray, countTarget, direction);
    }
  }

  /**
   * Crawls day by day to find countTarget number of business days after baseDate.
   * @param {String} baseDate Date to start countinf from
   * @param {Array} holidaysArray Holidays to consider
   * @param {Int} countTarget Number of business days to count for.
   * @param {String} direction FORWARD or BACKWARDS
   * @returns {main=>#1._crawlForCount.mResultDate}
   */
  function _crawlForCount(baseDate, holidaysArray, countTarget, direction) {
    const mBaseDate = moment(baseDate);
    let mResultDate = mBaseDate;
    let actualCount = 0;
    let dayIncrement = isDirectionForward(direction) ? 1 : -1;

    while (actualCount < countTarget) {
      mResultDate = mResultDate.add(dayIncrement, "days");

      if (isBusinessDay(mResultDate, holidaysArray)) {
        actualCount++;
      }
    }
    return mResultDate;
  }

  /**
   * Deterimnes if provided candidateDate exists in the holidays array
   * @param {String or Moment Object} candidateDate
   * @param {Array of strings} holidaysArray
   * @returns {Boolean} TRUE if candidateDate is a Business Day
   */
  function isBusinessDay(candidateDate, holidaysArray) {
    let mCandidateDate = moment(candidateDate);
    let dow = mCandidateDate.day();
    if (dow === 6 || dow === 0) {
      return false;
    }

    for (i = 0; i < holidaysArray.length; i++) {
      let mHolidayAtStake = moment(holidaysArray[i]);
      if (mHolidayAtStake.isSame(mCandidateDate)) {
        return false;
      }
    }

    return true;
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
        mCandidateDate = isDirectionForward(direction) ? mCandidateDate.add(1, 'day') : mCandidateDate.add(-2, 'day');
      else /*SATURDAY*/
        mCandidateDate = isDirectionForward(direction) ? mCandidateDate.add(2, 'day') : mCandidateDate.add(-1, 'day');
    }

    //REACT TO NO HoliDays array
    if (holidaysArray === undefined || holidaysArray.length === undefined || holidaysArray.length === 0) {
      return mCandidateDate;
    }

    return _scanForBizDate(mCandidateDate, holidaysArray, direction);

  }

  function _scanForBizDate(mCandidateDate, holidaysArray, direction) {
    let directionLogic = holidayScanDirectionLogic(direction, holidaysArray);

    for (var i = directionLogic.initial; directionLogic.exitCondition(i); i += directionLogic.increment) {
      let item = holidaysArray[i];
      const mHoliday = moment(item);

      if (mHoliday.isSameOrAfter(mCandidateDate)) {
        if (mCandidateDate.isSame(mHoliday)) {
          let remainingHolidays;
          if (isDirectionForward(direction)) {
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

  function holidayScanDirectionLogic(direction, holidaysArray) {
    let result = {};
    if (isDirectionForward(direction)) {
      result.initial = 0;
      result.increment = 1;
      result.exitCondition = (value) => {
        return value < holidaysArray.length;
      };
    } else {
      result.initial = holidaysArray.length - 1;
      result.increment = -1;
      result.exitCondition = (value) => {
        return value >= 0;
      };
    }
    return result;
  }

  function isDirectionForward(directionString) {
    if (directionString && directionString !== "" && directionString.startsWith("FORWARD")) {
      return true;
    } else {
      return false;
    }
  }

  exports.FindBizDate = findBizDate;
  exports.FindNextBizDate = findNextBizDate;
})();
