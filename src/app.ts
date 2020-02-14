export class App {
  currencyAmt: number = 12345.67;

  onInputDone(newCurrencyAmt): void {
    this.currencyAmt = newCurrencyAmt;
    // alert(this.currencyAmt);
  }
}
