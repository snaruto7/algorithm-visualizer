import { swap } from "./Utility";

function getGap(gap){
    var shrink = 1.3
    gap = Math.floor(gap / shrink)
    if (gap < 1)
        return 1;
    return gap;
}

export function getCombSortAnimations(arr){
    const copy = [...arr];
    const animations = [];
    let n = copy.length;
    let gap = n;
    let swapped = true;

    while(gap != 1 || swapped == true){
        gap = getGap(gap);
        swapped = false;

        for(let i = 0; i< n - gap; i++){
            animations.push([[i, i + gap], false]);
            if(copy[i] > copy[i + gap]){
                animations.push([[i, copy[i + gap]], true]);
                animations.push([[i + gap, copy[i]], true]);
                swap(copy, i, i+gap);
                swapped = true;
            }
        }
    }
    return animations;
}