export class App {
  aCurrencyAmt: number = 12345.67;

  onInputDone(newCurrencyAmt): void {
    this.aCurrencyAmt = newCurrencyAmt;
  }
}
