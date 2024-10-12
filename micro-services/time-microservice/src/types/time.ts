class Time {
  private _value: number;

  constructor(value: number) {
    if (!value) {
      throw new Error('Time must have a value');
    } else if (value < 0) {
      throw new Error('number must be positive');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }
}

export default Time;
