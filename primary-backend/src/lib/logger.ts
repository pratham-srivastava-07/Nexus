import fs from 'fs';
import path from 'path';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

const LEVELS: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 100,
};

function getEnvLogLevel(): LogLevel {
  const v = process.env.LOG_LEVEL?.toLowerCase() as LogLevel | undefined;
  if (v && Object.prototype.hasOwnProperty.call(LEVELS, v)) return v;
  return 'info';
}

export interface LoggerOptions {
  level?: LogLevel;
  prefix?: string;
  file?: string; // optional file path to append logs to
}

export class Logger {
  private level: LogLevel;
  private prefix?: string;
  private file?: string;

  constructor(opts: LoggerOptions = {}) {
    this.level = opts.level ?? getEnvLogLevel();
    this.prefix = opts.prefix;
    this.file = opts.file;
    if (this.file) {
      const dir = path.dirname(this.file);
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch {}
    }
  }

  private shouldLog(level: LogLevel) {
    return LEVELS[level] >= LEVELS[this.level];
  }

  private format(level: LogLevel, msg: string, meta?: unknown) {
    const time = new Date().toISOString();
    const pr = this.prefix ? `[${this.prefix}] ` : '';
    const base = `${time} ${level.toUpperCase()} ${pr}${msg}`;
    if (meta !== undefined) {
      try {
        return `${base} ${typeof meta === 'string' ? meta : JSON.stringify(meta)}`;
      } catch {
        return `${base} [unserializable-meta]`;
      }
    }
    return base;
  }

  private write(level: LogLevel, msg: string, meta?: unknown) {
    if (!this.shouldLog(level)) return;
    const formatted = this.format(level, msg, meta);
    if (level === 'error') console.error(formatted);
    else if (level === 'warn') console.warn(formatted);
    else console.log(formatted);

    if (this.file) {
      try {
        fs.appendFileSync(this.file, formatted + '\n');
      } catch (e) {
        // swallow file errors; logging should not crash app
      }
    }
  }

  debug(msg: string, meta?: unknown) {
    this.write('debug', msg, meta);
  }
  info(msg: string, meta?: unknown) {
    this.write('info', msg, meta);
  }
  warn(msg: string, meta?: unknown) {
    this.write('warn', msg, meta);
  }
  error(msg: string, meta?: unknown) {
    this.write('error', msg, meta);
  }

  child(prefix: string) {
    return new Logger({ level: this.level, prefix: this.prefix ? `${this.prefix}:${prefix}` : prefix, file: this.file });
  }
}

const rootLogger = new Logger();
export default rootLogger;
