import { TagInstance } from "machine-mind";

export type AccDiffFlag = "ACCURATE" | "INACCURATE" | "SOFT_COVER" | "HARD_COVER" | "SEEKING";
export const AccDiffRegistry: Record<AccDiffFlag, number> = {
  ACCURATE: 1,
  INACCURATE: -1,
  SOFT_COVER: -1,
  HARD_COVER: -2,
  SEEKING: 0,
};

export function calcAccDiff() {
  let acc = 0;
  let diff = 0;
  let flags: AccDiffFlag[] = [];
  document
    .querySelectorAll("[data-acc]:checked:not([disabled])")
    .forEach(ele => flags.push(ele.getAttribute("data-acc") as AccDiffFlag));
  document
    .querySelectorAll("[data-diff]:checked:not([disabled])")
    .forEach(ele => flags.push(ele.getAttribute("data-diff") as AccDiffFlag));

  const isSeeking = flags.includes("SEEKING");
  for (let flag of flags) {
    switch (flag) {
      case "SOFT_COVER":
      case "HARD_COVER":
        diff += isSeeking ? 0 : AccDiffRegistry[flag];
        break;
      case "ACCURATE":
        acc += 1;
        break;
      case "INACCURATE":
        diff -= 1;
        break;
      case "SEEKING":
        break;
    }
  }
  return [acc, -diff];
}

function calcManualAccDiff() {
  const acc = parseInt((document.querySelector(`#accdiff-other-acc`) as HTMLInputElement)?.value);
  const diff = parseInt((document.querySelector(`#accdiff-other-diff`) as HTMLInputElement)?.value);
  return [acc, diff];
}

export function tagsToFlags(tags: TagInstance[]): AccDiffFlag[] {
  const ret: AccDiffFlag[] = [];
  tags.forEach(tag => {
    switch (tag.Tag.LID) {
      case "tg_accurate":
        ret.push("ACCURATE");
        break;
      case "tg_inaccurate":
        ret.push("INACCURATE");
        break;
      case "tg_seeking":
        ret.push("SEEKING");
        break;
    }
  });
  return ret;
}

// DOM Manipulation
export function toggleCover(toggle: boolean) {
  const ret = document.querySelectorAll('[data-accdiff="SOFT_COVER"],[data-accdiff="HARD_COVER"]');
  ret.forEach(ele => (toggle ? ele.removeAttribute("disabled") : ele.setAttribute("disabled", "true")));
}

export function updateTotals() {
  const accEle = document.querySelector("#accdiff-total-acc");
  const diffEle = document.querySelector("#accdiff-total-diff");
  const flags = calcAccDiff();
  const other = calcManualAccDiff();

  const totalAcc = flags[0] + other[0];
  const totalDiff = flags[1] + other[1];

  accEle!.innerHTML = String(totalAcc);
  diffEle!.innerHTML = String(totalDiff);
  1;

  return totalAcc - totalDiff;
}
