(() => {
    const moment = require("moment");

    function findNextBizDate(baseDate, holidaysArray, offset, direction) {
        if (!offset) {
            offset = 0;
        }

        if (!direction) {
            direction = "FORWARD";
        }

        if (direction === "FORWARD") {
            let targetDate = moment(baseDate).add(offset, 'days');
            return findBizDate(targetDate, holidaysArray, direction);
        } else {
            let targetDate = moment(baseDate).add(-1 * offset, 'days');
            return findBizDate(targetDate, holidaysArray, direction);
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

        console.log("DIRECTION:", direction);
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
        console.log({initial, increment, exitCondition});
        for (var i = initial; exitCondition(i); i += increment) {
            let item = holidaysArray[i];
            const mHoliday = moment(item);

            if (mHoliday.isSameOrAfter(mCandidateDate)) {
                if (mCandidateDate.isSame(mHoliday)) {
                    let remainingHolidays;
                    if (direction === "FORWARD") {
                        remainingHolidays = holidaysArray.slice(i + 1);
                    } else {
                        remainingHolidays = holidaysArray.slice(0, holidaysArray.length - 2);
                    }

                    return findBizDate(mCandidateDate.add(1, 'day'), remainingHolidays, direction);
                }
            }
        }

        return mCandidateDate;
    }

    exports.FindBizDate = findBizDate;
    exports.FindNextBizDate = findNextBizDate;
})();
