import { createLogger, format, transports } from 'winston'

import DailyRotateFile  from 'winston-daily-rotate-file';

const customFormat = format.combine(
    format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
    format.align(),
    format.printf((i) => `${i.level}: ${[i.timestamp]}: ${i.message}`)
);

const defaultOptions = {
    format: customFormat,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
};

export const logger = createLogger({
    format: customFormat,
    transports: [
        new transports.DailyRotateFile({
            filename: "./server/logs/info-%DATE%.log",
            level: "info",
            ...defaultOptions,
        }),
        new transports.DailyRotateFile({
            filename: "./server/logs/error-%DATE%.log",
            level: "error",
            ...defaultOptions,
        }),
    ],
});


