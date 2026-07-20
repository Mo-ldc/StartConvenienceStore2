/**日期对象 */
interface NewDate {
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    milliSecond: number
};

export default class DateUtils {
    /**获取当日日期对象 */
    public static getDate(): NewDate {
        let curDate: Date = new Date();
        let newDate: NewDate = { year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0, milliSecond: 0 };
        newDate.year = curDate.getFullYear();
        newDate.month = curDate.getMonth() + 1;
        newDate.day = curDate.getDate();
        newDate.hour = curDate.getHours();
        newDate.minute = curDate.getMinutes();
        newDate.second = curDate.getSeconds();
        newDate.milliSecond = curDate.getMilliseconds();
        return newDate;
    }

    /**获取1970年1月1日至今的毫秒数 */
    public static getTime(): number {
        return new Date().getTime();
    }

    /**
     * 检测日期的年月日是否匹配
     * @param curDate   日期1
     * @param tarDate   日期2
     */
    public static checkDate(curDate: NewDate, tarDate: NewDate): boolean {
        if (curDate.year == tarDate.year
            && curDate.month == tarDate.month
            && curDate.day == tarDate.day) {
            return true
        }
        return false
    }

    /**
     * 根据秒数换算时钟单位
     * @param time 
     */
    public static clock(time: number): string {
        time = Math.floor(time);

        let hour: number = 0;
        let minute: number = 0;
        let second: number = 0;

        hour = Math.floor(time / 3600);
        time -= hour * 3600;

        minute = Math.floor(time / 60);
        time -= minute * 60;

        second = Math.floor(time);

        let hour_string: string = hour < 10 ? `0${hour}` : `${hour}`;
        let minute_string: string = minute < 10 ? `0${minute}` : `${minute}`;
        let second_string: string = second < 10 ? `0${second}` : `${second}`;

        return hour_string + ":" + minute_string + ":" + second_string
    }
    public static floor_clock(time: number):string{
        time = Math.floor(time);

        let hour: number = 0;
        let minute: number = 0;
        let second: number = 0;

        hour = Math.floor(time / 3600);
        time -= hour * 3600;

        minute = Math.floor(time / 60);
        time -= minute * 60;

        second = Math.floor(time);

        let hour_string: string = hour > 0 ?(hour < 10 ? `0${hour}:` : `${hour}:`):"";
        let minute_string: string = minute > 0 ?(minute < 10 ? `0${minute}:` : `${minute}:`):"";
        let second_string: string = second > 0 ?(second < 10 ? `0${second}` : `${second}`):"";
        let time_str = hour_string + minute_string + second_string;
        return time_str;
    }
}