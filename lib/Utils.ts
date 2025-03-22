export class Debouncer {
  timer: null | NodeJS.Timeout;
  timeout: number;
  func: () => void;

  constructor(timeout: number) {
    this.timer = null;
    this.func = () => {};
    this.timeout = timeout;
  }
  start(func: () => void) {
    this.func = func;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.func.apply(null, []);
    }, this.timeout);
  }
}

export function isBlank(str: string = "") {
  return !str || /^\s*$/.test(str);
}
