(() => {
  const moment = require("moment");


  /***
   * Caluclates next applicable business of counting from a provided base dateby counting 1 by one skipping holidays from holidaysArray and weekendays.
   * @param {type} baseDate
   * @param {type} holidaysArray
   * @param {type} countTarget
   * @param {type} direction
   * @returns {undefined}
   */
  function crawlBizDates(baseDate, holidaysArray, countTarget, direction) {
    if (!countTarget) {
      countTarget = 0;
    }

    if (!direction) {
      direction = "FORWARD";
    }

    if (countTarget === 0) {
      return findBizDate(baseDate, holidaysArray, direction);
    } else {
      return _crawlForCount(baseDate, holidaysArray, countTarget, direction);
    }
  }

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
  exports.FindNextBizDate = crawlBizDates;
})();
