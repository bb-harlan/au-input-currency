import {valueConverter, inject} from "aurelia-framework";

@valueConverter("auCurrencyConverter")
export class AuCurrencyConverter {
  toView(currencyAmt: number): string {
    return Intl.NumberFormat("en-US",
                             {
                               style: "decimal",
                               useGrouping: true,
                               minimumIntegerDigits: 1,
                               minimumFractionDigits: 2,
                               maximumFractionDigits: 2
                             }).format(currencyAmt);
  }
}
