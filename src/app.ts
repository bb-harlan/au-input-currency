export class App {

  aCurrencyAmt: number = 12345.67; // the data source for the custom component
     /*
      * User interaction with the custom element can change the element's value.
      * When the custom element loses focus (by tabbing or clicking away
      * from it or by pressing the Enter key), the change to its value is pushed
      * to the data source by the following callback function.
      * Try it to see that happen.
      */

  userChangedCurrencyAmt(newCurrencyAmt): void {
     /*
      * The component calls this function when the custom component loses focus
      * if and only if user interaction with the custom component has changed
      * the currency amount. Otherwise, this function is not called.
      */

    this.aCurrencyAmt = newCurrencyAmt; // update data source with the user-changed currency amt

     /*
      * Follow the above with any additional code needed for
      * reacting to the change in the value of the data source--
      * e.g., updating a total to which the data source contributes.
      */
  }
}
