export class App {
  aCurrencyAmt: number = 12345.67;

  onInputDone(newCurrencyAmt): void {
    this.aCurrencyAmt = newCurrencyAmt;
    // Follow the above with any other code needed to act on the updated currency amount.
  }
}
