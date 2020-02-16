import {customElement, bindable} from 'aurelia-framework';

@customElement('au-input-currency')
export class AuInputCurrency {

  @bindable classesString: string;
  @bindable isReadonly: boolean = false;
  @bindable isDisabled: boolean = false;
  @bindable currencyAmt: number = 0.00;
  @bindable onUpdatedCallback: Function; // callback function
  @bindable maxLength: number;

  /* element.ref properties */
  inputCurrencyElement: HTMLInputElement;

  /*misc properties*/
  originalInputValue: string; // set in onFocus()
  originalCurrencyAmt: number; // set in onFocus()

  constructor() {
  }
  onFocus(): void {
    console.log(`\n*** in onFocus() ***************`);
    this.originalInputValue = this.inputCurrencyElement.value;
    this.inputCurrencyElement.value = this.wellformedFloatString(this.originalInputValue);
    this.inputCurrencyElement.setSelectionRange(0, 0);
    this.originalCurrencyAmt = parseFloat(this.inputCurrencyElement.value);
    // this.originalInsertionPoint = this.inputCurrencyElement.selectionStart;
  }
  onBlur(): void {
    console.log(`\n*** in onBlur() ***************`);
    let newCurrencyAmt = parseFloat(this.inputCurrencyElement.value);
    if (newCurrencyAmt == this.originalCurrencyAmt) {
      // user did not change the input
      this.inputCurrencyElement.value = this.originalInputValue; // formatted string
    }
    else {
      // call the callback function passing the user-updated currency amount
      this.onUpdatedCallback({newCurrencyAmt: newCurrencyAmt});
    }
  }
  onKeydown(keyboardEvent) {
    console.log(`\n*** keyboardEvent.type: "${keyboardEvent.type}"; ***************`);
    let indexOfDecimalPoint = this.inputCurrencyElement.value.indexOf(".");
    if (keyboardEvent.key >= "0" && keyboardEvent.key <= "9") {
      if (this.inputCurrencyElement.selectionStart <= indexOfDecimalPoint) {
        // in interger part
        if (this.inputCurrencyElement.selectionStart == 0 && this.inputCurrencyElement.value.charAt(0) == "-") {
          // no digits can precede minus sign
          return false;
        }
        else if (keyboardEvent.key == "0") {
          // do not allow a leading zero with or without a leading minus sign
          if (this.inputCurrencyElement.selectionStart == 0 && this.inputCurrencyElement.value.charAt(0) != "-") {
            // no leading zero permitted
            return false;
          }
          else if (this.inputCurrencyElement.selectionStart == 1 && this.inputCurrencyElement.value.charAt(0) == "-") {
            return false;
          }
        }
      }
      else {
        // in fraction part
        if (this.inputCurrencyElement.selectionStart == this.inputCurrencyElement.value.length) {
          return false;
        }
        else {
          let targetSubstr = this.inputCurrencyElement.value.substring(indexOfDecimalPoint);
          if (this.inputCurrencyElement.selectionStart == indexOfDecimalPoint + 1) {
            let replacementSubstr = "." + keyboardEvent.key + this.inputCurrencyElement.value.charAt(indexOfDecimalPoint + 1);
            this.inputCurrencyElement.value = this.inputCurrencyElement.value.replace(targetSubstr, replacementSubstr);
          }
          else {
            // this.inputCurrencyElement.selectionStart == indexOfDecimalPoint + 2
            let replacementSubstr = "." + this.inputCurrencyElement.value.charAt(indexOfDecimalPoint + 1) + keyboardEvent.key;
            this.inputCurrencyElement.value = this.inputCurrencyElement.value.replace(targetSubstr, replacementSubstr);
          }
          this.inputCurrencyElement.setSelectionRange(indexOfDecimalPoint + 2, indexOfDecimalPoint + 2);
          return false;
        }
      }
      return true; // let it pass through
    }
    else if (keyboardEvent.key == ".") {
      // move text cursor to first digit past decimal point,
      // but don't let period pass through
      let newInsertionPoint = this.inputCurrencyElement.value.indexOf(".") + 1;
      this.inputCurrencyElement.setSelectionRange(newInsertionPoint, newInsertionPoint);
      return false;
    }
    else if (keyboardEvent.key == "-") {
      // one and only one minus sign allowed, and it must be the leading char
      let selectionStart = this.inputCurrencyElement.selectionStart;
      if (selectionStart == 0) {
        if (this.inputCurrencyElement.value.charAt(0) != "-") {
          // let the minus sign through
          return true;
        }
        else {
          // move insertion point past minus sign and disallow minus sign
          this.inputCurrencyElement.setSelectionRange(selectionStart + 1, selectionStart + 1);
          return false;
        }
      }
      else {
        //no non-leading minus sign allowed
        return false;
      }
    }
    else if (keyboardEvent.key == "Delete") {
      if (this.inputCurrencyElement.selectionStart < indexOfDecimalPoint) {
        // in interger part
        return true; // let "Delete" pass through
      }
      else if (this.inputCurrencyElement.selectionStart == indexOfDecimalPoint) {
        // on decimal point, treat Delete as ArrowRight,
        // but don't let "Delete" pass through
        this.inputCurrencyElement.setSelectionRange(indexOfDecimalPoint + 1, indexOfDecimalPoint + 1);
        return false;
      }
      else {
        // in fraction part
        let targetSubstr = this.inputCurrencyElement.value.substring(indexOfDecimalPoint);
        if (this.inputCurrencyElement.selectionStart == indexOfDecimalPoint + 1) {
          let replacementSubstr = "." + this.inputCurrencyElement.value.charAt(indexOfDecimalPoint + 2) + "0";
          this.inputCurrencyElement.value = this.inputCurrencyElement.value.replace(targetSubstr, replacementSubstr);
          this.inputCurrencyElement.setSelectionRange(indexOfDecimalPoint + 1, indexOfDecimalPoint + 1);
        }
        else if (this.inputCurrencyElement.selectionStart == indexOfDecimalPoint + 2) {
          // this.inputCurrencyElement.selectionStart == indexOfDecimalPoint + 2
          let replacementSubstr = "." + this.inputCurrencyElement.value.charAt(indexOfDecimalPoint + 1) + "0";
          this.inputCurrencyElement.value = this.inputCurrencyElement.value.replace(targetSubstr, replacementSubstr);
          this.inputCurrencyElement.setSelectionRange(indexOfDecimalPoint + 2, indexOfDecimalPoint + 2);
        }
        return false;
      }
    }
    else if (keyboardEvent.key == "Backspace") {
      if (this.inputCurrencyElement.selectionStart <= indexOfDecimalPoint) {
        // in interger part
        return true; // else let "Backspace" pass through
      }
      else {
        // in fraction part
        let targetSubstr = this.inputCurrencyElement.value.substring(indexOfDecimalPoint);
        if (this.inputCurrencyElement.selectionStart == indexOfDecimalPoint + 1) {
          // treat "Backspace" as ArrowLeft
          this.inputCurrencyElement.setSelectionRange(indexOfDecimalPoint, indexOfDecimalPoint);
        }
        else if (this.inputCurrencyElement.selectionStart == indexOfDecimalPoint + 2) {
          let replacementSubstr = "." + this.inputCurrencyElement.value.charAt(indexOfDecimalPoint + 2) + "0";
          this.inputCurrencyElement.value = this.inputCurrencyElement.value.replace(targetSubstr, replacementSubstr);
          this.inputCurrencyElement.setSelectionRange(indexOfDecimalPoint + 1, indexOfDecimalPoint + 1);
        }
        else {
          // (this.inputCurrencyElement.selectionStart == indexOfDecimalPoint + 3)
          let replacementSubstr = "." + this.inputCurrencyElement.value.charAt(indexOfDecimalPoint + 1) + "0";
          this.inputCurrencyElement.value = this.inputCurrencyElement.value.replace(targetSubstr, replacementSubstr);
          this.inputCurrencyElement.setSelectionRange(indexOfDecimalPoint + 2, indexOfDecimalPoint + 2);
        }
        return false; // don't let "Backspace" pass through
      }
    }
    else if (keyboardEvent.key == "Enter" ||
      keyboardEvent.key == "Tab" ||
      keyboardEvent.key == "Escape" ||
      keyboardEvent.key == "ArrowLeft" ||
      keyboardEvent.key == "ArrowRight") {
      return true; // let these pass through
    }
    else {
      // any other key is unacceptable; filter it out.
      return false; // don't let them pass through
    }
    /*
    keyboardEvent.preventDefault();
    keyboardEvent.stopPropagation()
    */
  }
  onKeyup(keyboardEvent) {
    console.log(`\n*** keyboardEvent.type: "${keyboardEvent.type}"; ***************`);
    let indexOfDecimalPoint: number;
    if (this.inputCurrencyElement.value.length == 0) {
      this.inputCurrencyElement.value = ".00";
      this.inputCurrencyElement.setSelectionRange(0, 0);
      return;
    }
    if (this.inputCurrencyElement.value.indexOf(".") < 0) {
      this.inputCurrencyElement.value = this.inputCurrencyElement.value + ".00";
      indexOfDecimalPoint = this.inputCurrencyElement.value.indexOf(".");
      this.inputCurrencyElement.setSelectionRange(indexOfDecimalPoint, indexOfDecimalPoint);
      return;
    }
    if (keyboardEvent.key == "Enter") {
      this.inputCurrencyElement.blur();
      return false;
    }
    if (keyboardEvent.key == "Escape") {
      this.inputCurrencyElement.value = this.wellformedFloatString(this.originalInputValue);
      this.inputCurrencyElement.setSelectionRange(0, 0);
      return;
    }
  }
  wellformedFloatString(formattedAmtString): string {
    let floatString = formattedAmtString;
    // remove any commas
    let indexOfComma: number;
    while (true) {
      indexOfComma = floatString.indexOf(",");
      if (indexOfComma < 0) {
        break;
      }
      floatString = floatString.substring(0, indexOfComma) + floatString.substring(indexOfComma + 1);
    }
    //trim any leading zeros
    if (floatString.substring(0, 1) == "0") {
      floatString = floatString.substring(1);
    }
    else if (floatString.substring(0, 2) == "-0") {
      floatString = "-" + floatString.substring(2);
    }
    return floatString;
  }
}


