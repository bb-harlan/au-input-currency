export class App {

  aCurrencyAmt: number = 12345.67; // the data source for the custom component
  /*
  * watch the value of the above property change
  * if the user uses the custom component to
  * enter or edit the currency amt.
  */

  userChangedCurrencyAmt(newCurrencyAmt): void {
    /*
    * If user interaction with the custom component changes the currency amt,
    * the component calls this function when the custom component loses focus.
    * If the custom component loses focus without any change to the currency amt,
    * the custom component does not call this function.
    */
    this.aCurrencyAmt = newCurrencyAmt; // update data source with the user-changed currency amt
    /*
    * Follow the above with any additional code needed for
    * reacting to the change in the value of the data source--
    * e.g., updating a total to which the data source contributes.
    */
  }
}
