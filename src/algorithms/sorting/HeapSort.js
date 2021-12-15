import { swap } from "./Utility";

var array_length;

export function getHeapSortAnimations(arr) {
    const copy = [...arr];
    const animations = [];
    array_length = copy.length;

    for (var i = Math.floor(array_length / 2); i >= 0; i -= 1)      {
        heap_root(copy, i, animations);
      }
    for (i = copy.length - 1; i > 0; i--) {
        animations.push([[0, copy[i]], true]);
        animations.push([[i, copy[0]], true]);
        swap(copy, 0, i);
        array_length--;
        heap_root(copy, 0, animations);
    }
    return animations;
}

function heap_root(arr, i, animations) {
    var left = 2 * i + 1;
    var right = 2 * i + 2;
    var max = i;
    if (left < array_length && arr[left] > arr[max]) {
        animations.push([[left, max], false]);
        max = left;
    }
    if (right < array_length && arr[right] > arr[max]){
        animations.push([[right, max], false]);
        max = right;
    }
    if (max != i) {
        animations.push([[i, arr[max]], true]);
        animations.push([[max, arr[i]], true]);
        swap(arr, i, max);
        heap_root(arr, max, animations);
    }
}