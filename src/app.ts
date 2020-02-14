export class App {
  currencyAmt: number = -0.67;

  onInputDone(newCurrencyAmt): void {
    this.currencyAmt = newCurrencyAmt;
    // alert(this.currencyAmt);
  }
}
