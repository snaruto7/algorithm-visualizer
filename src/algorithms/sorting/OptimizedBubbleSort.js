import { swap } from "./Utility";

export function getOptimizedBubbleSortAnimations(arr) {
    const copy = [...arr];
    const animations = [];
    var swapped;
    for (let i = 0; i < copy.length - 1; i++) {
        swapped = false;
        for (let j = 0; j < (copy.length - i - 1); j++) {
            animations.push([[j, j + 1], false]);
            if (copy[j] > copy[j + 1]) {
                animations.push([[j, copy[j + 1]], true]);
                animations.push([[j + 1, copy[j]], true]);
                swap(copy, j, j + 1);
                swapped = true;
            }
        }
        if (swapped == false)
            break;
    }
    return animations;
}