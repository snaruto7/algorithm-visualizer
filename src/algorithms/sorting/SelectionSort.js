import { swap } from "./Utility";

export function getSelectionSortAnimations(arr) {
    const copy = [...arr];
    const animations = [];
    for (let i = 0; i < copy.length - 1; i++) {
        let min = i;
        
        for (let j = i + 1; j < copy.length; j++) {
            animations.push([[min, j], false]);
            if (copy[j] < copy[min]) {
                min = j;
            }
        }
        animations.push([[i, copy[min]], true]);
        animations.push([[min, copy[i]], true]);
        swap(copy, min, i); 
    }
    return animations;
}