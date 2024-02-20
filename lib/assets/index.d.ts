// Global definition
import * as _ from "lodash";

declare global {
  // 他の設定は省略
  const _: _.LoDashStatic;
  // const $: JQueryStatic // jqueryはすでにGlobalに定義済み
  interface Window {
    // W <= 大文字, Window Classの方を拡張する
    $: JQueryStatic;
    _: _.LoDashStatic;
  }
  const fp: fp.lodashFp;
  interface Window {
    fp: fp.lodashFp;
  }
}
