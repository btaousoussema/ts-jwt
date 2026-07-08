const whitelist: string[] = [
    'http://localhost:3000', 
    'http://localhost:5173', 
    'http://localhost:5174'
];

type StaticOrigin = boolean | string | RegExp | Array<boolean | string | RegExp>;

const corsOptions = {
    origin: function (origin : string | undefined = "", callback: (err: Error | null, origin?: StaticOrigin) => void) : void {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

export default corsOptions;