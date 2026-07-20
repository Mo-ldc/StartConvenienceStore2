import { Texture2D, UIOpacity, UITransform, gfx, sys, v2, v3 } from "cc";
import { Vec3, bezier, tween, Node } from "cc";
let tempVec: Vec3 = v3()
let tempVec2: Vec3 = v3()
let tempVec3: Vec3 = v3()
let up = v3()

export class Utils 
{
    //#region 时间日期
    //返回今天的日期,格式20200101
    static getToday ()
    {
        let lt10 = ( v: number ) =>
        {
            return v < 10 ? "0" + v : "" + v;
        }
        let date = new Date();
        let str = date.getFullYear() + lt10( date.getMonth() + 1 ) + lt10( date.getDate() );
        return parseInt( str );
    }

    //计算两个日期的天数差 日期格式20200101
    static deltaDay ( date1: number, date2: number )
    {
        let str1 = date1.toString();
        let str2 = date2.toString();
        if ( str1.length == 8 && str2.length == 8 )
        {
            let d1 = new Date( str1.substring( 4, 2 ) + "/" + str1.substring( 6, 2 ) + "/" + str1.substring( 0, 4 ) );
            let d2 = new Date( str2.substring( 4, 2 ) + "/" + str2.substring( 6, 2 ) + "/" + str2.substring( 0, 4 ) );
            let days = Math.abs( d1.getTime() - d2.getTime() ) / ( 24 * 60 * 60 * 1000 );
            return Math.floor( days );
        } else
        {
            console.error( "日期格式不正确" );
            return -1;
        }
    }

    /**
     * 根据秒数换算时钟单位分：秒)
     * @param time 
     */
    public static ToMS ( time: number ): string
    {
        time = Math.floor( time );


        let minute: number = 0;
        let second: number = 0;

        minute = Math.floor( time / 60 );
        time -= minute * 60;

        second = Math.floor( time );

        let minute_string: string = minute < 10 ? `0${ minute }` : `${ minute }`;
        let second_string: string = second < 10 ? `0${ second }` : `${ second }`;

        return minute_string + ":" + second_string
    }

    /**
     * 根据秒数换算时钟单位(时：分：秒)
     * @param time 
     */
    public static clock ( time: number ): string
    {
        time = Math.floor( time );

        let hour: number = 0;
        let minute: number = 0;
        let second: number = 0;

        hour = Math.floor( time / 3600 );
        time -= hour * 3600;

        minute = Math.floor( time / 60 );
        time -= minute * 60;

        second = Math.floor( time );

        let hour_string: string = hour < 10 ? `0${ hour }` : `${ hour }`;
        let minute_string: string = minute < 10 ? `0${ minute }` : `${ minute }`;
        let second_string: string = second < 10 ? `0${ second }` : `${ second }`;

        return hour_string + ":" + minute_string + ":" + second_string
    }

    /**
    * 将事件戳转化为日期格式,适用于显示倒计时
    * @param timeMS 倒计时的时间戳(MS)
    * @param template 模板 1(HH:MM:SS) 2(HH时MM分SS秒) 3(HH?:MM:SS) 4(HH?时MM分SS秒)
    * @param separator 分隔符 默认(:)
    */
    static formatCountDownMS ( timeMS: number, template: 1 | 2 | 3 | 4, separator = ":" )
    {
        let str: string;
        let lt10 = v =>
        {
            return v < 10 ? "0" + v : v;
        }
        let date = new Date();
        let offset = date.getTimezoneOffset();//时区差异 minutes
        date.setTime( timeMS + offset * 60 * 1000 );
        let days = date.getDate() - 1;
        let hours = date.getHours() + days * 24;
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        if ( template == 1 )
        {
            str = `${ lt10( hours ) }${ separator }${ lt10( minutes ) }${ separator }${ lt10( seconds ) }`;
        } else if ( template == 2 )
        {
            str = `${ lt10( hours ) }时${ lt10( minutes ) }分${ lt10( seconds ) }秒`;
        } else if ( template == 3 )
        {
            str = hours > 0 ? `${ lt10( hours ) }${ separator }` : "";
            str += `${ lt10( minutes ) }${ separator }${ lt10( seconds ) }`;
        } else if ( template == 4 )
        {
            str = hours > 0 ? `${ lt10( hours ) }时` : "";
            str += `${ lt10( minutes ) }分${ lt10( seconds ) }秒`;
        }
        return str;
    }

    /**
     * 返回一个格式化的时间字符串
     * 占位符 YYYY:年 MM:月 DD:日 hh:时 mm:分 ss:秒
     * @param formatStr 格式化的字符串 例 YYYY-MM-DD hh:mm:ss 返回 2022-01-01 12:30:30
     */
    static formatTime ( formatStr: string, date?: Date )
    {
        if ( date == undefined )
        {
            date = new Date();
        }
        let lt10 = v =>
        {
            return v < 10 ? "0" + v : v;
        }
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        formatStr = formatStr.replace( "YYYY", year.toString() );
        formatStr = formatStr.replace( "MM", lt10( month ).toString() );
        formatStr = formatStr.replace( "DD", lt10( day ).toString() );
        formatStr = formatStr.replace( "hh", lt10( hour ).toString() );
        formatStr = formatStr.replace( "mm", lt10( minute ).toString() );
        formatStr = formatStr.replace( "ss", lt10( second ).toString() );
        return formatStr;
    }
    /**
     * 格式化时间戳，返回：XXXX年XX月XX日XX时XX分XX秒
     */
    static formatTime2 ( times: number )
    {
        const date = new Date( times );
        let lt10 = v =>
        {
            return v < 10 ? "0" + v : v;
        }
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        return `${ year }年${ lt10( month ) }月${ lt10( day ) }日${ lt10( hour ) }时${ lt10( minute ) }分${ lt10( second ) }秒`;;
    }

    /**
     * 格式化时间戳，返回：XXXX年XX月XX日
     */
    static formatTime3 ( times: number )
    {
        const date = new Date( times );
        let lt10 = v =>
        {
            return v < 10 ? "0" + v : v;
        }
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return `${ year }年${ lt10( month ) }月${ lt10( day ) }日`;;
    }
    //#endregion

    //#region 随机数

    //打乱数组
    public static shuffleArrayNums ( array: number[] ): number[]
    {
        for ( let i = array.length - 1; i > 0; i-- )
        {
            const j = Math.floor( Math.random() * ( i + 1 ) ); // 随机索引  
            [ array[ i ], array[ j ] ] = [ array[ j ], array[ i ] ]; // 交换元素  
        }
        return array;
    }

    //指定范围内随机,排除指定数
    public static generateShuffledArray ( rangeStart: number, rangeEnd: number, exclude: number ): number[]
    {
        // 生成范围内的数组  
        const array: number[] = [];
        for ( let i = rangeStart; i <= rangeEnd; i++ )
        {
            if ( i !== exclude )
            {
                array.push( i );
            }
        }

        // 打乱数组  
        const shuffledArray = Utils.shuffleArrayNums( array );
        return shuffledArray;
    }

    public static random ( min, max )
    {
        var r = Math.random();
        var rr = r * ( max - min + 1 ) + min;
        return Math.floor( rr );
    }

    public static rand ( arr: any )
    {
        let arrClone = this.clone( arr );
        // 首先从最大的数开始遍历，之后递减
        for ( let i = arrClone.length - 1; i >= 0; i-- )
        {
            // 随机索引值randomIndex是从0-arrClone.length中随机抽取的
            const randomIndex = Math.floor( Math.random() * ( i + 1 ) );
            // 下面三句相当于把从数组中随机抽取到的值与当前遍历的值互换位置
            const itemIndex = arrClone[ randomIndex ];
            arrClone[ randomIndex ] = arrClone[ i ];
            arrClone[ i ] = itemIndex;
        }
        // 每一次的遍历都相当于把从数组中随机抽取（不重复）的一个元素放到数组的最后面（索引顺序为：len-1,len-2,len-3......0）
        return arrClone;
    }

    /**
         * 获取一个随机数，区间[min,max]
         * @param min 最小值
         * @param max 最大值
         * @param isInteger 是否是整数 默认true
         */
    static randomNum ( min: number, max: number, isInteger = true )
    {
        let delta = max - min;
        let value = Math.random() * delta + min;
        if ( isInteger )
            value = Math.round( value );
        return value;
    }

    /**
  * 在某个区间内取一个整数
  * @param section1 区间1
  * @param section2 区间2，不输入则是0~section1
  */
    public static randomNumber ( section1, section2?: number ): number
    {
        if ( section2 )
            return Math.round( Math.random() * ( section2 - section1 ) ) + section1;
        else
            return Math.round( Math.random() * section1 );
    }

    /**
    * 在某个区间内取一个数
    * @param section1 区间1
    * @param section2 区间2，不输入则是0~section1
    */
    public static randomNumber_NoRound ( section1, section2?: number ): number
    {
        if ( section2 )
            return Math.random() * ( section2 - section1 ) + section1;
        else
            return Math.random() * section1;
    }

    // 根据权重,计算随机内容
    public static getWeightRandIndex ( weightArr: any, totalWeight: number )
    {
        const randWeight = Math.floor( Math.random() * totalWeight );
        let sum = 0;
        let weightIndex = 0;
        for ( weightIndex; weightIndex < weightArr.length; weightIndex++ )
        {
            sum += weightArr[ weightIndex ];
            if ( randWeight < sum )
            {
                break;
            }
        }

        return weightIndex;
    }

    /**
     * 从n个数中获取m个随机数
     * @param {Number} n   总数
     * @param {Number} m    获取数
     * @returns {Array} array   获取数列
     */
    public static getRandomNFromM ( n: number, m: number )
    {
        const array: number[] = [];
        let intRd = 0;
        let count = 0;

        while ( count < m )
        {
            if ( count >= n + 1 )
            {
                break;
            }

            intRd = this.getRandomInt( 0, n );
            let flag = 0;
            for ( let i = 0; i < count; i++ )
            {
                if ( array[ i ] === intRd )
                {
                    flag = 1;
                    break;
                }
            }

            if ( flag === 0 )
            {
                array[ count ] = intRd;
                count++;
            }
        }

        return array;
    }
    //随机数   

    static getRandomInt ( min: number, max: number ): number
    {
        return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
    }

    //从0到n-1的范围内生成x个不重复的数字
    static getRandomUniqueNumbers ( n: number, x: number ): number[]
    {
        if ( x > n )
        {
            throw new Error( "x cannot be greater than n" );
        }

        const result: number[] = [];
        const availableNumbers: number[] = Array.from( { length: n }, ( _, i ) => i );

        for ( let i = 0; i < x; i++ )
        {
            const randomIndex = Utils.getRandomInt( 0, availableNumbers.length - 1 );
            const randomNumber = availableNumbers.splice( randomIndex, 1 )[ 0 ];
            result.push( randomNumber );
        }
        return result;
    }

    public static getRandomNumbers ( min: number, max: number, count: number ): number[]
    {
        // 使用 Set 来存储随机数，确保不重复  
        const randomNumbers = new Set<number>();

        while ( randomNumbers.size < count )
        {
            // 生成随机数  
            const randomNum = Math.floor( Math.random() * ( max - min + 1 ) ) + min;
            randomNumbers.add( randomNum ); // 将随机数添加到 Set 中  
        }

        // 将 Set 转换为数组并返回  
        return Array.from( randomNumbers );
    }

    /**  
* 在给定范围内生成一个随机数，排除输入参数  
* @param min 范围的下限  
* @param max 范围的上限  
* @param exclude 排除的数  
* @returns 随机数  
*/
    public static getRandomNumber ( min: number, max: number, exclude: number ): number
    {
        if ( min > max )
        {
            throw new Error( "min应该小于或等于max" );
        }

        if ( exclude < min || exclude > max )
        {
            throw new Error( "exclude必须在给定范围内" );
        }

        let randomNumber: number;

        do
        {
            randomNumber = Math.floor( Math.random() * ( max - min + 1 ) ) + min;
        } while ( randomNumber === exclude );

        return randomNumber;
    }

    /**
        *  修正小数位数
        * @param fractionDigits 保留小数位数
        * @param canEndWithZero 是否需要用0填补小数位数 默认为false
        */
    static fixFloat ( value: number, fractionDigits: number, canEndWithZero = false )
    {
        if ( fractionDigits < 0 ) fractionDigits = 0;
        let str = value.toFixed( fractionDigits );
        if ( canEndWithZero )
            return str;
        else
        {
            while ( true )
            {
                if ( str.length > 1 && str.includes( "." ) )
                {
                    if ( str.endsWith( "0" ) || str.endsWith( "." ) )
                        str = str.substring( 0, str.length - 1 );
                    else
                        break;
                }
                else
                    break;
            }
        }
        return str;
    }

    /**
    * 从带权重的集合中随机获取指定数量的元素
    * @param list 集合
    * @param weight 获取item权重的方法
    * @param num 返回item数量
    * @param canRepeat item是否可以重复
    * @returns 
    */
    public static randomValueByWeight<T> ( list: T[], num = 1, weight?: ( item: T ) => number, canRepeat = false )
    {
        let result: T[] = [];
        if ( !list || list.length == 0 ) return result;
        if ( list.length < num ) console.warn( "需要返回的item数量大于集合长度" );
        if ( !weight ) weight = ( item: T ) => 1;

        let count: number = Math.min( list.length, num );
        let totalWeight = 0;

        for ( const item of list )
        {
            totalWeight += weight( item );
        }

        while ( result.length < count )
        {
            let randomV = Math.floor( Math.random() * totalWeight );;
            let tmpWeight = 0;

            for ( const item of list )
            {
                let w = weight( item );
                if ( randomV >= tmpWeight && randomV < tmpWeight + w )
                {
                    if ( !canRepeat ) //检查是否重复元素
                    {
                        var index = result.indexOf( item );
                        if ( index == -1 ) result.push( item );
                        else break;
                    }
                    else
                    {
                        result.push( item );
                    }
                }
                tmpWeight += w;
            }
        }
        return result;
    }

    //#endregion

    //#region 贝塞尔曲线
    //2阶贝塞尔
    static bezierCurve2 ( duration: number, startPos: Vec3, controlPos: Vec3, endPos: Vec3, targetGo: Node, func?: Function )
    {
        // 三维空间的缓动
        const quadraticCurve = ( t: number, p1: Vec3, cp: Vec3, p2: Vec3, out: Vec3 ) =>
        {
            out.x = ( 1 - t ) * ( 1 - t ) * p1.x + 2 * t * ( 1 - t ) * cp.x + t * t * p2.x;
            out.y = ( 1 - t ) * ( 1 - t ) * p1.y + 2 * t * ( 1 - t ) * cp.y + t * t * p2.y;
            out.z = ( 1 - t ) * ( 1 - t ) * p1.z + 2 * t * ( 1 - t ) * cp.z + t * t * p2.z;
        }
        const tempVec3 = new Vec3();

        tween( targetGo )
            .sequence
            (
                tween().to( duration,
                    { position: endPos },
                    {
                        onUpdate: ( target, ratio ) =>
                        {
                            quadraticCurve( ratio, startPos, controlPos, endPos, tempVec3 );
                            targetGo.setPosition( tempVec3 );
                        }
                    } ),
                tween().call( () =>
                {
                    func && func();
                } )
            )
            .start();
    }

    //3阶贝塞尔
    static bezierCurve3 ( duration: number, startPos: Vec3, controlPos1: Vec3, controlPos2: Vec3, endPos: Vec3, targetGo: Node )
    {
        // 三维空间的缓动
        const bezierCurve = ( t: number, p1: Vec3, cp1: Vec3, cp2: Vec3, p2: Vec3, out: Vec3 ) =>
        {
            out.x = bezier( p1.x, cp1.x, cp2.x, p2.x, t );
            out.y = bezier( p1.y, cp1.y, cp2.y, p2.y, t );
            out.z = bezier( p1.z, cp1.z, cp2.z, p2.z, t );
        }
        const tempVec3 = new Vec3();

        tween( targetGo ).to( duration,
            { position: endPos },
            {
                onUpdate: ( target, ratio ) =>
                {
                    bezierCurve( ratio, startPos, controlPos1, controlPos2, endPos, tempVec3 );
                    targetGo.setPosition( tempVec3 );
                }
            } )
            .start();
    }
    //#endregion

    //#region 字符串操作
    //string 转数组
    public static stringToArray ( string: string )
    {
        // 用于判断emoji的正则们
        var rsAstralRange = '\\ud800-\\udfff';
        var rsZWJ = '\\u200d';
        var rsVarRange = '\\ufe0e\\ufe0f';
        var rsComboMarksRange = '\\u0300-\\u036f';
        var reComboHalfMarksRange = '\\ufe20-\\ufe2f';
        var rsComboSymbolsRange = '\\u20d0-\\u20ff';
        var rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;
        var reHasUnicode = RegExp( '[' + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + ']' );

        var rsFitz = '\\ud83c[\\udffb-\\udfff]';
        var rsOptVar = '[' + rsVarRange + ']?';
        var rsCombo = '[' + rsComboRange + ']';
        var rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')';
        var reOptMod = rsModifier + '?';
        var rsAstral = '[' + rsAstralRange + ']';
        var rsNonAstral = '[^' + rsAstralRange + ']';
        var rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}';
        var rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]';
        var rsOptJoin = '(?:' + rsZWJ + '(?:' + [ rsNonAstral, rsRegional, rsSurrPair ].join( '|' ) + ')' + rsOptVar + reOptMod + ')*';
        var rsSeq = rsOptVar + reOptMod + rsOptJoin;
        var rsSymbol = '(?:' + [ rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral ].join( '|' ) + ')';
        var reUnicode = RegExp( rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g' );

        var hasUnicode = function ( val: string )
        {
            return reHasUnicode.test( val );
        };

        var unicodeToArray = function ( val: string )
        {
            return val.match( reUnicode ) || [];
        };

        var asciiToArray = function ( val: string )
        {
            return val.split( '' );
        };

        return hasUnicode( string ) ? unicodeToArray( string ) : asciiToArray( string );
    }

    /** 生成UUID */
    static genUUID ()
    {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function ( c )
        {
            let r = Math.random() * 16 | 0;
            let v = c == 'x' ? r : ( r & 0x3 | 0x8 );
            return v.toString( 16 );
        } );
    }

    // 模拟传msg的uuid
    public static simulationUUID ()
    {
        function s4 ()
        {
            return Math.floor( ( 1 + Math.random() ) * 0x10000 )
                .toString( 16 )
                .substring( 1 );
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    //裁剪前后指定的字符
    static trims ( source: string, ...strs: string[] )
    {
        if ( !source ) return source;
        if ( strs.length == 0 ) return source.trim();
        for ( const str of strs )
        {
            while ( source.startsWith( str ) )
            {
                source = source.substring( str.length );
            }
            while ( source.endsWith( str ) )
            {
                source = source.substring( 0, source.length - str.length );
            }
        }
        return source;
    }

    //去除输入字符串的前导空白和尾部空白
    public static trim ( str: string )
    {
        return str.replace( /(^\s*)|(\s*$)/g, "" );
    }

    public static getStringLength ( render: string )
    {
        const strArr = render;
        let len = 0;
        for ( let i = 0, n = strArr.length; i < n; i++ )
        {
            const val = strArr.charCodeAt( i );
            if ( val <= 255 )
            {
                len = len + 1;
            } else
            {
                len = len + 2;
            }
        }

        return Math.ceil( len / 2 );
    }

    /**
     * 格式化字符串,用args的内容替换str中的{i},i从0开始
     */
    static formatString ( str: string, ...args: any[] )
    {
        args.forEach( ( v, i ) =>
        {
            str = str.replace( `{${ i }}`, v );
        } );
        return str;
    }

    static upperFirst ( source: string )//输出大写字母
    {
        if ( !source ) return source;
        if ( source.length < 2 ) return source.toUpperCase();
        return source[ 0 ].toUpperCase() + source.substring( 1 );
    }

    static lowerFirst ( source: string )//输出小写字母
    {
        if ( !source ) return source;
        if ( source.length < 2 ) return source.toLowerCase();
        return source[ 0 ].toLowerCase() + source.substring( 1 );
    }

    //从arr中删除所有在item数组中出现的元素。
    static delItemFromArray<T> ( arr: T[], ...item: T[] )
    {
        if ( arr.length > 0 && item.length > 0 )
        {
            item.forEach( v =>
            {
                let index = arr.indexOf( v );
                if ( index > -1 )
                {
                    arr.splice( index, 1 );
                }
            } )
        }
    }

    /** 统计元素在数组中出现次数 */
    static countValueTimes<T> ( arr: T[], predicate: ( value: T ) => boolean )
    {
        let times = 0;
        arr.forEach( v =>
        {
            if ( predicate( v ) )
            {
                times++;
            }
        } )
        return times;
    }

    /**
     * 数据加密
     * @param {String} str 
     */
    public static encrypt ( str: string )
    {
        let b64Data = this.base64encode( str );

        let n = 6;
        if ( b64Data.length % 2 === 0 )
            n = 7;
        let encodeData = '';

        for ( let idx = 0; idx < ( b64Data.length - n + 1 ) / 2; idx++ )
        {
            encodeData += b64Data[ 2 * idx + 1 ];
            encodeData += b64Data[ 2 * idx ];
        }
        encodeData += b64Data.slice( b64Data.length - n + 1 );

        return encodeData;
    }

    /**
     * 数据解密
     * @param {String} b64Data 
     */
    public static decrypt ( b64Data: string | string[] )
    {
        let n = 6;
        if ( b64Data.length % 2 === 0 )
        {
            n = 7;
        }

        let decodeData = '';
        for ( var idx = 0; idx < b64Data.length - n; idx += 2 )
        {
            decodeData += b64Data[ idx + 1 ];
            decodeData += b64Data[ idx ];
        }

        decodeData += b64Data.slice( b64Data.length - n + 1 );

        decodeData = this.base64Decode( decodeData );

        return decodeData;
    }

    //将字符串进行base64编码
    public static base64encode ( input: string )
    {
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
        input = this.utf8Encode( input );
        while ( i < input.length )
        {
            chr1 = input.charCodeAt( i++ );
            chr2 = input.charCodeAt( i++ );
            chr3 = input.charCodeAt( i++ );
            enc1 = chr1 >> 2;
            enc2 = ( ( chr1 & 3 ) << 4 ) | ( chr2 >> 4 );
            enc3 = ( ( chr2 & 15 ) << 2 ) | ( chr3 >> 6 );
            enc4 = chr3 & 63;
            if ( isNaN( chr2 ) )
            {
                enc3 = enc4 = 64;
            } else if ( isNaN( chr3 ) )
            {
                enc4 = 64;
            }
            output = output +
                keyStr.charAt( enc1 ) + keyStr.charAt( enc2 ) +
                keyStr.charAt( enc3 ) + keyStr.charAt( enc4 );
        }
        return output;
    }

    // 将字符串进行 UTF-8 编码
    public static utf8Encode ( string: string )
    {
        string = string.replace( /\r\n/g, "\n" );
        var utftext = "";
        for ( var n = 0; n < string.length; n++ )
        {
            var c = string.charCodeAt( n );
            if ( c < 128 )
            {
                utftext += String.fromCharCode( c );
            } else if ( ( c > 127 ) && ( c < 2048 ) )
            {
                utftext += String.fromCharCode( ( c >> 6 ) | 192 );
                utftext += String.fromCharCode( ( c & 63 ) | 128 );
            } else
            {
                utftext += String.fromCharCode( ( c >> 12 ) | 224 );
                utftext += String.fromCharCode( ( ( c >> 6 ) & 63 ) | 128 );
                utftext += String.fromCharCode( ( c & 63 ) | 128 );
            }

        }
        return utftext;
    }
    //将字符串进行base64解码
    public static base64Decode ( input: string )
    {
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1;
        var chr2;
        var chr3;
        var enc1;
        var enc2;
        var enc3;
        var enc4;
        var i = 0;
        input = input.replace( /[^A-Za-z0-9\+\/\=]/g, "" );
        while ( i < input.length )
        {
            enc1 = keyStr.indexOf( input.charAt( i++ ) );
            enc2 = keyStr.indexOf( input.charAt( i++ ) );
            enc3 = keyStr.indexOf( input.charAt( i++ ) );
            enc4 = keyStr.indexOf( input.charAt( i++ ) );
            chr1 = ( enc1 << 2 ) | ( enc2 >> 4 );
            chr2 = ( ( enc2 & 15 ) << 4 ) | ( enc3 >> 2 );
            chr3 = ( ( enc3 & 3 ) << 6 ) | enc4;
            output = output + String.fromCharCode( chr1 );
            if ( enc3 != 64 )
            {
                output = output + String.fromCharCode( chr2 );
            }
            if ( enc4 != 64 )
            {
                output = output + String.fromCharCode( chr3 );
            }
        }
        output = this.utf8Decode( output );
        return output;
    }
    //将字符串进行UTF-8 解码
    public static utf8Decode ( utftext: string )
    {
        var string = "";
        var i = 0;
        var c = 0;
        var c1 = 0;
        var c2 = 0;
        var c3 = 0;
        while ( i < utftext.length )
        {
            c = utftext.charCodeAt( i );
            if ( c < 128 )
            {
                string += String.fromCharCode( c );
                i++;
            } else if ( ( c > 191 ) && ( c < 224 ) )
            {
                c2 = utftext.charCodeAt( i + 1 );
                string += String.fromCharCode( ( ( c & 31 ) << 6 ) | ( c2 & 63 ) );
                i += 2;
            } else
            {
                c2 = utftext.charCodeAt( i + 1 );
                c3 = utftext.charCodeAt( i + 2 );
                string += String.fromCharCode( ( ( c & 15 ) << 12 ) | ( ( c2 & 63 ) << 6 ) | ( c3 & 63 ) );
                i += 3;
            }
        }
        return string;
    }


    //#endregion

    //#region object,数组操作

    //将数组进行乱序输出
    public static shuffleArray<T> ( array: T[] ): T[]
    {
        let shuffledArray = array.slice(); // 创建数组的副本  
        for ( let i = shuffledArray.length - 1; i > 0; i-- )
        {
            // 生成一个随机索引  
            const j = Math.floor( Math.random() * ( i + 1 ) );
            // 交换元素  
            [ shuffledArray[ i ], shuffledArray[ j ] ] = [ shuffledArray[ j ], shuffledArray[ i ] ];
        }
        return shuffledArray;
    }

    //返回数组中的最大值
    public static max ( array )
    {
        if ( array && array.length )
        {
            var result;
            for ( var i = 0; i < array.length; i++ )
            {
                if ( i === 0 )
                {
                    result = array[ 0 ];
                } else if ( result < array[ i ] )
                {
                    result = array[ i ];
                }
            }
            return result;
        }
        return undefined;
    }

    //拷贝object
    public static clone ( sObj: any )
    {
        if ( sObj === null || typeof sObj !== "object" )
            return sObj;

        let s: any = {};
        if ( sObj.constructor === Array )
            s = [];

        for ( const i in sObj )
        {
            if ( sObj.hasOwnProperty( i ) )
                s[ i ] = this.clone( sObj[ i ] );
        }
        return s;
    }

    //深度拷贝
    public static cloneDeep ( sObj )
    {
        if ( sObj === null || typeof sObj !== "object" )
        {
            return sObj;
        }

        var s = {};
        if ( sObj.constructor === Array )
        {
            s = [];
        }

        for ( var i in sObj )
        {
            if ( sObj.hasOwnProperty( i ) )
            {
                s[ i ] = this.cloneDeep( sObj[ i ] );
            }
        }

        return s;
    }

    //在给定的集合中找到第一个满足断言函数条件的元素，然后返回这个元素
    public static find ( collection, predicate )
    {
        var result;
        if ( !Array.isArray( collection ) )
        {
            collection = this.toArray( collection );
        }

        result = collection.filter( predicate );
        if ( result.length )
        {
            return result[ 0 ];
        }

        return undefined;
    }

    //遍历给定的集合，并对集合中的每个元素执行迭代函数
    public static forEach ( collection, iteratee )
    {
        if ( !Array.isArray( collection ) )
        {
            var array = this.toArrayKey( collection );
            array.forEach( function ( value, index, arr )
            {
                var key1 = value[ 'key' ];
                var value1 = value[ 'value' ];
                iteratee( value1, key1, collection );
            } );
        } else
        {
            collection.forEach( iteratee );
        }
    }

    //遍历给定的集合，对集合中的每个元素执行迭代函数，并将迭代函数的返回值组成一个新的数组返回
    public static map ( collection, iteratee )
    {
        if ( !Array.isArray( collection ) )
        {
            collection = this.toArray( collection );
        }

        var arr = [];
        collection.forEach( function ( value, index, array )
        {
            arr.push( iteratee( value, index, array ) );
        } );

        return arr;
    }

    //将给定的对象转换为数组，数组的每个元素是一个包含键和值的对象
    public static toArrayKey ( srcObj )
    {
        var resultArr = [];
        // to array
        for ( var key in srcObj )
        {
            if ( !srcObj.hasOwnProperty( key ) )
            {
                continue;
            }

            resultArr.push( { key: key, value: srcObj[ key ] } );
        }

        return resultArr;
    }

    //将给定的对象转换为数组，数组的每个元素是对象的一个属性值
    public static toArray ( srcObj )
    {
        var resultArr = [];

        // to array
        for ( var key in srcObj )
        {
            if ( !srcObj.hasOwnProperty( key ) )
            {
                continue;
            }

            resultArr.push( srcObj[ key ] );
        }

        return resultArr;
    }

    //使用迭代函数数组对给定的集合进行过滤，并返回一个新的数组，其中包含满足迭代函数条件的元素
    public static filter ( collection, iteratees )
    {
        if ( !Array.isArray( collection ) )
        {
            collection = this.toArray( collection );
        }

        return collection.filter( iteratees );
    }

    //用于比较两个对象是否相等
    public static isEqual ( x, y )
    {
        var in1 = x instanceof Object;
        var in2 = y instanceof Object;
        if ( !in1 || !in2 )
        {
            return x === y;
        }

        if ( Object.keys( x ).length !== Object.keys( y ).length )
        {
            return false;
        }

        for ( var p in x )
        {
            var a = x[ p ] instanceof Object;
            var b = y[ p ] instanceof Object;
            if ( a && b )
            {
                return this.isEqual( x[ p ], y[ p ] );
            } else if ( x[ p ] !== y[ p ] )
            {
                return false;
            }
        }

        return true;
    }

    //在数组中查找满足特定条件的元素的索引
    public static findIndex ( array, predicate, fromIndex )
    {
        array = array.slice( fromIndex );
        var i;
        if ( typeof predicate === "function" )
        {
            for ( i = 0; i < array.length; i++ )
            {
                if ( predicate( array[ i ] ) )
                {
                    return i;
                }
            }
        } else if ( Array.isArray( predicate ) )
        {
            for ( i = 0; i < array.length; i++ )
            {
                var key = predicate[ 0 ];
                var vaule = true;
                if ( predicate.length > 1 )
                {
                    vaule = predicate[ 1 ];
                }

                if ( array[ i ][ key ] === vaule )
                {
                    return i;
                }
            }
        } else
        {
            for ( i = 0; i < array.length; i++ )
            {
                if ( array[ i ] === predicate )
                {
                    return i;
                }
            }
        }

        return -1;
    }

    //用于连接两个或多个数组。这个方法接受任意数量的参数，把它们全部连接在一起，然后返回一个新的数组
    public static concat ()
    {
        var length = arguments.length;
        if ( !length )
        {
            return [];
        }

        var array = arguments[ 0 ];
        var index = 1;
        while ( index < length )
        {
            array = array.concat( arguments[ index ] );
            index++;
        }

        return array;
    }

    //从数组中删除所有与给定值value匹配的元素。具体来说，它遍历给定的值value，对于每一个值，它会在数组中寻找与该值匹配的所有元素（通过比较函数comparator）。然后，它会从数组中删除这些匹配的元素
    public static pullAllWith ( array, value, comparator )
    {
        value.forEach( function ( item )
        {
            var res = array.filter( function ( n )
            {
                return comparator( n, item );
            } );

            res.forEach( function ( item )
            {
                var index = array.indexOf( item );
                if ( array.indexOf( item ) !== -1 )
                {
                    array.splice( index, 1 );
                }
            } );
        } );

        return array;
    }

    //从数组中删除所有与给定值value相等的元素。具体来说，它遍历给定的值value，对于每一个值，它会在数组中寻找与该值相等的元素。然后，它会从数组中删除这些相等的元素
    public static pullAll ( array, value )
    {
        value.forEach( function ( item )
        {
            var index = array.indexOf( item );
            if ( array.indexOf( item ) !== -1 )
            {
                array.splice( index, 1 );
            }
        } );

        return array;
    }

    //从后向前遍历集合中的每个元素，并对每个元素应用迭代函数
    public static forEachRight ( collection, iteratee )
    {
        if ( !Array.isArray( collection ) )
        {
            collection = this.toArray( collection );
        }

        for ( var i = collection.length - 1; i >= 0; i-- )
        {
            var ret = iteratee( collection[ i ] );
            if ( !ret ) break;
        }
    }

    //使用 substr 方法从输入的字符串中提取从指定位置开始的子串，然后使用 startsWith 方法检查这个子串是否以目标子串开始。如果子串以目标子串开始，那么返回 true，否则返回 false
    //同于使用原生JavaScript的 String.prototype.startsWith()
    public static startsWith ( str, target, position )
    {
        str = str.substr( position );
        return str.startsWith( target );
    }

    //使用 substr 方法从输入的字符串中提取从指定位置结束的子串，然后使用 endsWith 方法检查这个子串是否以目标子串结束。如果子串以目标子串结束，那么返回 true，否则返回 false
    //等同于使用原生JavaScript的 String.prototype.endsWith()
    public static endsWith ( str, target, position )
    {
        str = str.substr( position );
        return str.endsWith( target );
    }
    /**
     * 将object转化为数组。
     */
    public static objectToArray ( srcObj: any )
    {
        const resultArr = [];
        // to array
        for ( let key in srcObj )
        {
            if ( !srcObj.hasOwnProperty( key ) )
                continue;
            resultArr.push( srcObj[ key ] );
        }
        return resultArr;
    }

    /**
     * !#zh 将数组转化为object。
     */
    public static arrayToObject ( srcObj: any, objectKey: any )
    {
        const resultObj: any = {};
        // to object
        for ( let key in srcObj )
        {
            if ( !srcObj.hasOwnProperty( key ) || !srcObj[ key ][ objectKey ] )
                continue;
            resultObj[ srcObj[ key ][ objectKey ] ] = srcObj[ key ];
        }
        return resultObj;
    }
    /**
     * 判断传入的参数是否为空的Object。数组或undefined会返回false
     * @param obj
     */
    public static isEmptyObject ( obj: any )
    {
        let result = true;
        if ( obj && obj.constructor === Object )
        {
            for ( const key in obj )
            {
                if ( obj.hasOwnProperty( key ) )
                {
                    result = false;
                    break;
                }
            }
        } else
        {
            result = false;
        }

        return result;
    }

    //用于计算一个对象（Object）的属性数量
    public static getPropertyCount ( o: Object )
    {
        let n, count = 0;
        for ( n in o )
        {
            if ( o.hasOwnProperty( n ) )
            {
                count++;
            }
        }
        return count;
    }
    //在数组中查找指定值的索引
    public static indexOf ( array, value, fromIndex )
    {
        array = array.slice( fromIndex );
        return array.indexOf( value );
    }

    //将数组中的所有元素连接成一个字符串，元素之间用指定的分隔符隔开
    public static join ( array, separator )
    {
        if ( array === null ) return '';

        var result = '';
        array.forEach( function ( item )
        {
            result += item + separator;
        } );

        return result.substr( 0, result.length - 1 );
    }

    //将字符串按照指定的分隔符拆分为一个数组，并限制返回的数组的长度
    public static split ( string, separator, limit )
    {
        return string.split( separator, limit );
    }



    //接受一个数组（array）和一个数字（n）作为参数，并从原数组中删除前n个元素，然后返回一个新的数组
    public static drop ( array, n )
    {
        var length = array === null ? 0 : array.length;
        if ( !length )
        {
            return [];
        }

        return array.slice( n );
    }

    //接受一个数组（arr）作为参数，并返回一个新的一维数组，其中包含了原数组中的所有元素
    public static flattenDeep ( arr )
    {
        return arr.reduce( function ( prev, cur )
        {
            return prev.concat( Array.isArray( cur ) ? this.flattenDeep( cur ) : cur );
        }, [] );
    }

    //接受一个数组（array）作为参数，并返回一个新数组，其中包含了原数组中的所有唯一元素
    public static uniq ( array )
    {
        var result = [];
        array.forEach( function ( item )
        {
            if ( result.indexOf( item ) === -1 )
            {
                result.push( item );
            }
        } );

        return result;
    }

    //检查一个值是否为NaN
    public static isNaN ( value )
    {
        return this.isNumber( value ) && value !== +value;
    }

    //将原数组拆分成一个数组的数组，其中每个子数组的长度不超过指定的 size
    public static chunk ( array, size )
    {
        var length = array === null ? 0 : array.length;
        if ( !length || size < 1 )
        {
            return [];
        }

        var result = [];
        while ( array.length > size )
        {
            result.push( array.slice( 0, size ) );
            array = array.slice( size );
        }

        result.push( array );
        return result;
    }

    //将输入的 value 转换为一个有限的数字。如果 value 是 null、undefined、false、0、空字符串等，或者 value 是 NaN，那么这个方法将返回0
    public static toFinite ( value )
    {
        var INFINITY = 1 / 0;
        var MAX_INTEGER = 1.7976931348623157e+308;
        if ( !value )
        {
            return value === 0 ? value : 0;
        }
        value = Number( value );
        if ( value === INFINITY || value === -INFINITY )
        {
            var sign = ( value < 0 ? -1 : 1 );
            return sign * MAX_INTEGER;
        }
        return value === value ? value : 0;
    }

    //生成一个从 start 到 end（包含两端）的数字数组，其中数字的间隔为 step。如果 fromRight 为 true，那么将从右向左生成数组
    public static baseRange ( start, end, step, fromRight )
    {
        var nativeMax = Math.max;
        var nativeCeil = Math.ceil;
        var index = -1,
            length = nativeMax( nativeCeil( ( end - start ) / ( step || 1 ) ), 0 ),
            result = Array( length );

        while ( length-- )
        {
            result[ fromRight ? length : ++index ] = start;
            start += step;
        }
        return result;
    }

    //接受一个参数 value，并检查这个参数是否是一个对象。这个方法使用了 JavaScript 的 typeof 运算符来判断变量的类型
    public static isObject ( value )
    {
        var type = typeof value;
        return value !== null && ( type === 'object' || type === 'function' );
    }

    //接受一个参数 value，并检查这个参数是否是一个在有效范围内的长度值
    public static MAX_SAFE_INTEGER = 9007199254740991;
    public static isLength ( value )
    {
        return typeof value === 'number' &&
            value > -1 && value % 1 === 0 && value <= Utils.MAX_SAFE_INTEGER;
    }

    //接受一个参数 value，并检查这个参数是否类似于数组（即具有类似于数组的长度属性）
    public static isArrayLike ( value )
    {
        return value !== null && this.isLength( value.length ) /*&& !isFunction(value)*/;
    }

    //接受两个参数 value 和 other，并检查这两个参数是否相等
    public static eq ( value, other )
    {
        return value === other || ( value !== value && other !== other );
    }

    //接受两个参数：value 和 length。它检查 value 是否是一个有效的索引值，根据给定的 length 来决定索引的上限
    public static isIndex ( value, length )
    {
        var type = typeof value;
        length = length === null ? Utils.MAX_SAFE_INTEGER : length;
        var reIsUint = /^(?:0|[1-9]\d*)$/;
        return !!length &&
            ( type === 'number' ||
                ( type !== 'symbol' && reIsUint.test( value ) ) ) &&
            ( value > -1 && value % 1 === 0 && value < length );
    }

    //检查给定的值是否是给定对象的迭代调用
    public static isIterateeCall ( value, index, object )
    {
        if ( !this.isObject( object ) )
        {
            return false;
        }
        var type = typeof index;
        if ( type === 'number' ?
            ( this.isArrayLike( object ) && this.isIndex( index, object.length ) )
            : ( type === 'string' && index in object )
        )
        {
            return this.eq( object[ index ], value );
        }
        return false;
    }

    //接受三个参数：value、index 和 object，并检查它们是否满足迭代器调用（iteratee call）的条件
    public static createRange ( fromRight )
    {
        return function ( start, end, step )
        {
            if ( step && typeof step !== 'number' && this.isIterateeCall( start, end, step ) )
            {
                end = step = undefined;
            }
            // Ensure the sign of `-0` is preserved.
            start = this.toFinite( start );
            if ( end === undefined )
            {
                end = start;
                start = 0;
            } else
            {
                end = this.toFinite( end );
            }
            step = step === undefined ? ( start < end ? 1 : -1 ) : this.toFinite( step );
            return this.baseRange( start, end, step, fromRight );
        };
    }

    //找到数组中通过断言函数返回值最大的元素
    public static maxBy ( array, predicate )
    {
        if ( array && array.length )
        {
            var result;
            var objResult;
            for ( var i = 0; i < array.length; i++ )
            {
                if ( i === 0 )
                {
                    result = predicate( array[ 0 ] );
                    objResult = array[ 0 ];
                } else if ( result < array[ i ] )
                {
                    result = ( array[ i ] );
                    objResult = array[ i ];
                }
            }
            return objResult;
        }
        return undefined;
    }

    //找到数组中通过断言函数返回值最小的元素
    public static minBy ( array, predicate )
    {
        if ( array && array.length )
        {
            var result;
            var objResult;
            for ( var i = 0; i < array.length; i++ )
            {
                if ( i === 0 )
                {
                    result = predicate( array[ 0 ] );
                    objResult = array[ 0 ];
                } else if ( result > array[ i ] )
                {
                    result = predicate( array[ i ] );
                    objResult = array[ i ];
                }
            }
            return objResult;
        }
        return undefined;
    }

    //计算集合中所有元素通过断言函数返回值的总和
    public static sumBy ( collection, predicate )
    {
        var sum = 0;
        for ( var key in collection )
            sum += predicate( collection[ key ] );
        return sum;
    }

    //统计集合中每个元素通过断言函数返回值出现的次数
    public static countBy ( collection, predicate )
    {
        var objRet = {};
        for ( var key in collection )
        {
            var value = collection[ key ];
            if ( objRet.hasOwnProperty( value ) )
                objRet[ value ] += 1;
            else
                objRet[ value ] = 1;
        }
        return objRet;
    }

    //#endregion

    //#region 大数值处理
    public static GetSize ( num: number )
    {
        let unitIndex = 0;
        let result = 0;
        if ( num <= 0 )
            num = 0
        num = Math.round( num );
        while ( num >= 10000 )
        {
            num = Math.floor( num / 10000 );
            unitIndex++;
        }
        switch ( unitIndex )
        {
            case 0:
                result = 1;
                break;
            case 1:
                result = 3;
                break;
            case 2:
                result = 5;
                break;
            case 3:
                result = 7;
                break;
            case 4:
                result = 9;
                break;
            default:
                result = 10;
                break;
        }
        return result;
    }

    public static formatNumberStr ( numStr: string, level: number = 2 ): string
    {
        const unitChars = [ '', '万', '亿', '兆', '京', '垓', '秭', '穰', '钩', '涧', '正', '载' ];
        const unitLength = 4;
        const numLength = numStr.length;
        // 计算数字字符串的位数
        const numUnits = Math.ceil( numLength / unitLength );
        // 确定第一个单位字符的索引
        let currentUnitIndex = numUnits - 1;
        let formattedStr = '';
        // 处理首个数字的情况
        const firstUnitLength = numLength % unitLength;
        if ( firstUnitLength !== 0 )
        {
            formattedStr += numStr.slice( 0, firstUnitLength );
            if ( numUnits > 1 && currentUnitIndex > numUnits - level - 1 )
            {
                formattedStr += unitChars[ currentUnitIndex ];
            }
            currentUnitIndex--;
        }
        // 遍历剩余数字字符串，逐个处理单位
        let zerosFound = 0; // 记录连续的零的数量
        for ( let i = firstUnitLength; i < numLength && currentUnitIndex >= numUnits - level; i += unitLength )
        {
            const digits = numStr.slice( i, i + unitLength ); // 取出当前单位的数字

            // 如果当前单位全为零，则不输出
            if ( parseInt( digits ) === 0 )
            {
                zerosFound++;
                currentUnitIndex--;
                continue;
            }
            // 添加当前单位的数字和单位字符
            if ( zerosFound > 0 )
            {
                if ( formattedStr !== '' )
                {
                    formattedStr += '0'.repeat( zerosFound );
                }
                zerosFound = 0; // 重置连续零的计数
            }
            formattedStr += digits;
            formattedStr += unitChars[ currentUnitIndex ];
            currentUnitIndex--;
        }
        // 如果结果为空，说明输入的数字字符串全为零
        if ( formattedStr === '' )
        {
            return '0';
        }
        return formattedStr;
    }

    /**
     * 格式化数字，添加单位
     * @param num 数字
     * @param isMain 是否主单位
     * @returns 
     */
    public static formatNumber ( num: number, isMain = false ): string
    {
        let format = '';
        const units = [ '', '万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载' ];
        let unitIndex = 0;
        let result = '';
        if ( num <= 0 )
            num = 0
        num = Math.round( num );
        while ( num >= 10000 )
        {
            const remainder = num % 10000;
            if ( remainder !== 0 )
            {
                result = remainder.toString() + units[ unitIndex ] + result;
            }
            num = Math.floor( num / 10000 );
            unitIndex++;
        }

        if ( num > 0 )
        {
            result = num.toString() + units[ unitIndex ] + result;
        }

        if ( isMain )
        {
            switch ( unitIndex )
            {
                case 0://万以内
                case 1://万                   
                case 2://亿
                    format = '';
                    break;
                case 3://兆
                    format = '万';
                    break;
                case 4://京
                    format = '亿';
                    break;
                case 5://垓
                    format = '兆';
                    break;
                case 6://秭
                    format = '京';
                    break;
                case 7://穰
                    format = '垓';
                    break;
                case 8://沟
                    format = '秭';
                    break;
                case 9://涧
                    format = '穰';
                    break;
                case 10://正
                    format = '沟';
                    break;
                case 11://载
                    format = '涧';
                    break;
            }
        }
        else
        {
            switch ( unitIndex )
            {
                case 0://万以内
                case 1://万
                    format = '';
                    break;
                case 2://亿
                    format = '万';
                    break;
                case 3://兆
                    format = '亿';
                    break;
                case 4://京
                    format = '兆';
                    break;
                case 5://垓
                    format = '京';
                    break;
                case 6://秭
                    format = '垓';
                    break;
                case 7://穰
                    format = '秭';
                    break;
                case 8://沟
                    format = '穰';
                    break;
                case 9://涧
                    format = '沟';
                    break;
                case 10://正
                    format = '涧';
                    break;
                case 11://载
                    format = '正';
                    break;
            }
        }
        const formatIndex = units.indexOf( format );
        if ( formatIndex !== -1 )
        {
            const truncateIndex = result.lastIndexOf( units[ formatIndex ] ) + units[ formatIndex ].length;
            if ( truncateIndex > 0 )
            {
                result = result.slice( 0, truncateIndex );
            }
        }
        return result;
    }

    //#endregion

    //#region 数值处理
    
    /**
     * 格式化钱数，超过10000 转换位 10K   10000K 转换为 10M
     * @param money 钱数
     * @returns 
     */
    public static formatMoney ( money: number )
    {
        const arrUnit = [ '', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'B', 'N', 'D' ];

        let strValue = '';
        for ( let idx = 0; idx < arrUnit.length; idx++ )
        {
            if ( money >= 10000 )
            {
                money /= 1000;
            } else
            {
                strValue = Math.floor( money ) + arrUnit[ idx ];
                break;
            }
        }

        if ( strValue === '' )
        {
            strValue = Math.floor( money ) + 'U'; //超过最大值就加个U
        }

        return strValue;
    }

    //将输入的数值转化为对应的单位字符串
    public static formatValue ( value: number )
    {
        let arrUnit = []
        let strValue = '';
        for ( let i = 0; i < 26; i++ )
        {
            arrUnit.push( String.fromCharCode( 97 + i ) );
        }

        for ( let idx = 0; idx < arrUnit.length; idx++ )
        {
            if ( value >= 10000 )
            {
                value /= 1000;
            } else
            {
                strValue = Math.floor( value ) + arrUnit[ idx ];
                break;
            }
        }
        return strValue;
    }

    //将输入的数字格式化为两位数 5-->05
    public static formatTwoDigits ( time: number )
    {
        return ( Array( 2 ).join( '0' ) + time ).slice( -2 );
    }

    //是否是数字
    public static isNumber ( value )
    {
        return typeof value === 'number';
    }

    /**
       * 返回指定小数位的数值
       * @param num 
       * @param idx 
       */
    public static formatNumToFixed ( num: number, idx: number = 0 )
    {
        return Number( num.toFixed( idx ) );
    }

    public static lerp ( targetValue: number, curValue: number, ratio: number = 0.25 )
    {
        let v = curValue;
        if ( targetValue > curValue )
        {
            v = curValue + ( targetValue - curValue ) * ratio;
        } else if ( targetValue < curValue )
        {
            v = curValue - ( curValue - targetValue ) * ratio;
        }

        return v;
    }

    public static getMin ( array: any )//取得最小值
    {
        let result = 0;
        if ( array.constructor === Array )
        {
            const length = array.length;
            for ( let i = 0; i < length; i++ )
            {
                if ( i === 0 )
                {
                    result = Number( array[ 0 ] );
                } else
                {
                    result = result > Number( array[ i ] ) ? Number( array[ i ] ) : result;
                }
            }
        }
        return result;
    }

    public static getMax ( array: any )//取得最大值
    {
        let result = 0;
        if ( array.constructor === Array )
        {
            const length = array.length;
            for ( let i = 0; i < length; i++ )
            {
                if ( i === 0 )
                {
                    result = Number( array[ 0 ] );
                } else
                {
                    result = result < Number( array[ i ] ) ? Number( array[ i ] ) : result;
                }
            }
        }
        return result;
    }

    /**
     * 随机打乱数组
     * @param arr 
     * @returns 
     */
    static disOriginArr ( arr: number[] )
    {
        let len = arr.length;
        while ( len )
        {
            let index = Math.floor( Math.random() * ( len-- ) );
            let temp = arr[ index ];
            arr[ len ] = arr[ index ];
            arr[ index ] = temp;
        }
        return arr;
    }
    /**
         * 返回一个差异化数组（将array中diff里的值去掉）
         * @param array
         * @param diff
         */
    public static difference ( array: any, diff: any )
    {
        const result: number[] = [];
        if ( array.constructor !== Array || diff.constructor !== Array )
        {
            return result;
        }

        const length = array.length;
        for ( let i = 0; i < length; i++ )
        {
            if ( diff.indexOf( array[ i ] ) === -1 )
            {
                result.push( array[ i ] );
            }
        }

        return result;
    }

    //从输入数组中移除满足特定条件的元素，并将它们存入一个新的数组
    public static remove ( array: any[], predicate: {
        ( obj: any ): boolean; ( arg0: any ): any;
    } )
    {
        var result: any[] = [];
        var indexes: any[] = [];
        array.forEach( function ( item: any, index: any )
        {
            if ( predicate( item ) )
            {
                result.push( item );
                indexes.push( index );
            }
        } );

        this.basePullAt( array, indexes );
        return result;
    }
    //从数组中删除指定的索引，并返回删除元素后的数组
    public static basePullAt ( array: any, indexes: string | any[] )
    {
        var length = array ? indexes.length : 0;
        var lastIndex = length - 1;
        var previous;

        while ( length-- )
        {
            var index = indexes[ length ];
            if ( length === lastIndex || index !== previous )
            {
                previous = index;
                Array.prototype.splice.call( array, index, 1 );
            }
        }

        return array;
    }

    //#endregion

    //#region 通用数学库
    /**
         * Rodrigues’ Rotation Formula
         * 使 v 绕 u 轴旋转 maxAngleDelta （弧度）
         * @param out 
         * @param v 
         * @param u 
         * @param maxAngleDelta 
         */
    static rotateAround ( out: Vec3, v: Vec3, u: Vec3, maxAngleDelta: number )
    {
        //out = v*cos + uxv*sin  + (u*v)*u*(1- cos);
        const cos = Math.cos( maxAngleDelta );
        const sin = Math.sin( maxAngleDelta );

        // v * cos 
        Vec3.multiplyScalar( tempVec, v, cos );

        // u x v 
        Vec3.cross( tempVec2, u, v );

        // v*cos + uxv*sin
        Vec3.scaleAndAdd( tempVec3, tempVec, tempVec2, sin );

        const dot = Vec3.dot( u, v );

        // + (u*v)*u*(1-cos)
        Vec3.scaleAndAdd( out, tempVec3, u, dot * ( 1.0 - cos ) );
    }

    /**
     * 将 from 向 to 旋转 maxAngleDelta 弧度
     * @param out 
     * @param from 
     * @param to 
     * @param maxAngleDelta 
     */
    static rotateToward ( out: Vec3, from: Vec3, to: Vec3, maxAngleDelta: number )
    {
        Vec3.cross( up, from, to );
        this.rotateAround( out, from, up, maxAngleDelta );
    }

    /**
     * 求两个向量间的夹角（带符号）
     * @param from 
     * @param to 
     * @param axis 
     * @returns 
     */
    static signAngle ( from: Vec3, to: Vec3, axis: Vec3 ): number
    {
        const angle = Vec3.angle( from, to );
        Vec3.cross( tempVec, from, to );
        const sign = Math.sign( axis.x * tempVec.x + axis.y * tempVec.y + axis.z * tempVec.z );
        return angle * sign;
    }


    //#endregion

    //#region 计数器
    //延时调用
    public static DelayCallBack ( time: number, func: Function )
    {
        setTimeout( () =>
        {
            func && func();//回调
        }, time * 1000 );
    }

    public static ChangColor ( isToGray = false, Opa: UIOpacity, time: number, cb?: Function )
    {
        if ( isToGray )
            tween( Opa ).to( time, { opacity: 0 } ).call( () => { cb && cb() } ).start();//变暗
        else
            tween( Opa ).to( time, { opacity: 255 } ).call( () => { cb && cb() } ).start();//变明 
    }

    //#endregion

    //#region 其他函数库
    //求中点
    public static getMidPos ( pos1: Vec3, pos2: Vec3 )
    {
        return new Vec3( ( pos1.x + pos2.x ) / 2, ( pos1.y + pos2.y ) / 2, ( pos1.z + pos2.z ) / 2 )
    }

    //检测一个节点是否在另一个节点内
    public static cheakCollierPoint ( currentNode: Node, targetNode: Node ): boolean
    {
        let curNodePosition = currentNode.parent.getComponent( UITransform ).convertToWorldSpaceAR( currentNode.position );
        let tarBoundingBox = targetNode.getComponent( UITransform ).getBoundingBoxToWorld();
        if ( tarBoundingBox.contains( v2( curNodePosition.x, curNodePosition.y ) ) )
            return true
        else
            return false
    };

    /**
    * 包围盒与包围盒碰撞检测
    * @param {*} currentNode   当前节点
    * @param {*} targetNode    目标节点
    */
    public static cheakCollierBox ( currentNode: Node, targetNode: Node ): boolean
    {
        let curBoundingBox = currentNode.getComponent( UITransform ).getBoundingBoxToWorld();
        let tarBoundingBox = targetNode.getComponent( UITransform ).getBoundingBoxToWorld();
        if ( curBoundingBox.intersects( tarBoundingBox ) )
            return true
        else
            return false
    };

    /** 提取出第一个下划线之前的子字符串 （下划线前边）*/
    public static getTouchName ( _str: string ): string
    {
        let outStr: string = "";
        for ( let i = 0; i < _str.length; i++ )
        {
            if ( _str[ i ] == '_' )
            {
                // 分隔符
                outStr = _str.substring( 0, i );
                break;
            } else
            {
                outStr = _str;
            }
        }
        return outStr;
    }

    /** 查找第一个下划线后面的数字部分，然后将数字部分转换为数字类型并返回 */
    public static getTouchNum ( _str: string ): number
    {
        let outStr: string = "";
        for ( let i = 0; i < _str.length; i++ )
        {
            if ( _str[ i ] == '_' )
            {
                // 分隔符
                outStr = _str.substring( i + 1, _str.length );
                break;
            }
        }
        return parseInt( outStr );
    }
    //#endregion

    //#region   浏览器数据加载与保存
    public static save ()
    {
        if ( sys.platform === sys.Platform.MOBILE_BROWSER ||
            sys.platform === sys.Platform.DESKTOP_BROWSER )
        {
            const data = {};
            Object
                .keys( localStorage )
                .filter( v => v.substr( 0, 4 ) != 'goog' )
                .forEach( key => data[ key ] = localStorage[ key ] );

            let blob = new Blob( [ JSON.stringify( data ) ], { type: 'application/json' } );
            // @ts-ignore
            const slice = blob.slice || blob.webkitSlice || blob.mozSlice;
            blob = slice.call( blob, 0, blob.size, 'application/octet-stream' );
            const a = document.createElementNS( 'http://www.w3.org/1999/xhtml', 'a' ) as HTMLAnchorElement;

            a.href = URL.createObjectURL( blob );
            a.download = `Remake_save_${ new Date().toISOString().replace( ':', '.' ) }.json`;

            document.body.appendChild( a );
            a.click();
            document.body.removeChild( a );
            URL.revokeObjectURL( a.href );
        }
    }

    public static load ()
    {
        if ( sys.platform === sys.Platform.MOBILE_BROWSER ||
            sys.platform === sys.Platform.DESKTOP_BROWSER )
        {
            const file = document.createElement( 'input' );
            file.type = 'file';
            file.name = 'file';
            file.accept = "application/json";
            // @ts-ignore
            file.style = "display: none;";
            file.append( 'body' );
            file.click();
            file.addEventListener( 'change', ( e ) =>
            {
                // @ts-ignore
                const file = e.target.files[ 0 ];
                if ( !file ) return;
                const reader = new FileReader();
                reader.onload = () =>
                {
                    const data = JSON.parse( reader.result as string );
                    for ( const key in data )
                    {
                        localStorage[ key ] = data[ key ];
                    }
                    console.log( '加载存档成功' );
                }
                reader.readAsText( file );
            } );
        }
    }

    //通过data创建texture
    public static createTexture ( imgData: any, width: number, height: number ): Texture2D
    {

        //默认一张白色纹理

        let tex = new Texture2D();

        // /包含 RGBA 四通道的 32 位整形像素格式：RGBA8888。 一字节8位

        tex.reset( { width: width, height: height, format: Texture2D.PixelFormat.RGBA8888, mipmapLevel: 0 } );

        tex.uploadData( imgData, 0, 0 );

        // 更新 0 级 Mipmap。

        tex.updateImage();

        return tex;
    }

    //扩展图片
    public static expandImage ( imgData: Uint8Array, width: number, height: number, expand: number = 0 ): Uint8Array
    {
        let buffer = new Uint8Array( imgData.length + 4 * ( expand * width * 2 + expand * height * 2 + height * width * 4 ) );
        let row = 0;
        let col = 0;
        let img_index = 0;
        let new_width = width + expand * 2;
        let new_height = height + expand * 2;
        let color_value = 0;

        for ( let index = 0; index < buffer.length; index = index + 4 )
        {
            if ( row < expand )
            {
                buffer[ index ] = color_value;
                buffer[ index + 1 ] = color_value;
                buffer[ index + 2 ] = color_value;
                buffer[ index + 3 ] = color_value;
            }
            else if ( row >= height + expand )
            {
                buffer[ index ] = color_value;
                buffer[ index + 1 ] = color_value;
                buffer[ index + 2 ] = color_value;
                buffer[ index + 3 ] = color_value;
            }
            else
            {
                if ( col < expand )
                {
                    buffer[ index ] = color_value;
                    buffer[ index + 1 ] = color_value;
                    buffer[ index + 2 ] = color_value;
                    buffer[ index + 3 ] = color_value;
                }
                else if ( col >= width + expand )
                {
                    buffer[ index ] = color_value;
                    buffer[ index + 1 ] = color_value;
                    buffer[ index + 2 ] = color_value;
                    buffer[ index + 3 ] = color_value;
                }
                else
                {
                    buffer[ index ] = imgData[ img_index ];
                    buffer[ index + 1 ] = imgData[ img_index + 1 ];
                    buffer[ index + 2 ] = imgData[ img_index + 2 ];
                    buffer[ index + 3 ] = imgData[ img_index + 3 ];
                    img_index = img_index + 4;
                }
            }
            col++;
            if ( col >= new_width )
            {
                col = 0;
                row++;
            }
        }
        return buffer;

    }

    //读取数组
    public static readPixels ( tex: any ): Uint8Array
    {
        const gfxTexture = tex.getGFXTexture();
        if ( !gfxTexture )
        {
            return null;
        }

        //数组长度
        const needSize = 4 * tex.width * tex.height;
        let buffer = new Uint8Array( needSize );
        const gfxDevice = tex._getGFXDevice();
        const bufferViews: ArrayBufferView[] = [];
        const regions: gfx.BufferTextureCopy[] = [];
        const region0 = new gfx.BufferTextureCopy();

        //数组设置起始和宽高
        region0.texOffset.x = 0;
        region0.texOffset.y = 0;
        region0.texExtent.width = tex.width;
        region0.texExtent.height = tex.height;

        //copy数据
        regions.push( region0 );
        bufferViews.push( buffer );
        gfxDevice?.copyTextureToBuffers( gfxTexture, bufferViews, regions );
        return buffer;
    }
    //#endregion

    /** 获得 '_' 后面的字符串 */
    public static getTouchName_1(_str: string): string {
        let outStr: string = "";
        for (let i = 0; i < _str.length; i++) {
            if (_str[i] == '_') {
                // 分隔符
                outStr = _str.substring(i + 1, _str.length);
                break;
            } else {
                outStr = _str;
            }
        }
        return outStr;
    }

    //#region 数值排序

    /**
     * 快速排序
     * @param arr 需要排序的数组
     * @param left 数组的开始
     * @param right
     */
    public static QuickSort(arr: number[], left: number, right: number): void {
        let index;
        if (arr.length > 1) {
            index = Utils._partition(arr, left, right);
            if (left < index - 1) {
                this.QuickSort(arr, left, index - 1);
            }
            if (index < right) {
                this.QuickSort(arr, index, right);
            }
        }
    }
    private static _partition(arr: number[], left: number, right: number): number {
        const pivot = arr[Math.floor((right + left) / 2)];
        let i = left, j = right;
        while (i <= j) {
            while (arr[i] < pivot) {
                i++;
            }
            while (arr[j] > pivot) {
                j--;
            }
            if (i <= j) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
                i++;
                j--;
            }
        }
        return i;
    }

    //#endregion

    //#region 数组对比
    /**通用版本，支持任何可比较类型
     * @param subset 子集
     * @param superset 父集
    */
    static 数组包含对比<T>(subset: T[], superset: T[]): boolean {
        // 快速边界检查
        if (subset.length === 0) return false;
        if (subset.length > superset.length) return false;

        const supersetSet = new Set(superset);
        return subset.every(item => supersetSet.has(item));
    }
    //#endregion


    //#region 位置转换功能
    /**
     * 将世界位置转换为节点本地位置
     * @param local 转换的节点
     * @param worldPosition 世界位置
     * @returns 
     */
    static 节点本地位置(local: Node, worldPosition: Vec3){
        let parent = local.parent;
        if(parent){
            let uiTransform = parent.getComponent(UITransform);
            if(uiTransform){
                return uiTransform.convertToNodeSpaceAR(worldPosition);
            }
        }
        return worldPosition;
    }
    //#endregion

}