export interface IMemCache {
    __tages: {
        [tag: string]: string[] // array of tagHashes
    };

    [tagHash: string]: {
        [symbol: string]: { // symbol for memorized function
            [argumentHash: string]: any // data
        }
    };
}