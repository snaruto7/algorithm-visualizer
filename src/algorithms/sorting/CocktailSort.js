import { swap } from "./Utility";

export function getCocktailSortAnimations(arr){
    const copy = [...arr]
    const animations = []
    let swapped = true;
    let start = 0;
    let end = copy.length;

    while(swapped == true){
        swapped = false;
        for(let i = start; i < end - 1; ++i){
            animations.push([[i, i+1], false]);
            if(copy[i] > copy[i + 1]){
                animations.push([[i, copy[i + 1]], true]);
                animations.push([[i + 1, copy[i]], true]);
                swap(copy, i, i + 1);
                swapped = true;
            }
        }
        if (swapped == false)
            break;
        
        swapped = false;
        animations.push([[start, start+1], false]);

        end = end - 1;

        for(let i = end - 1; i >= start; i--){
            animations.push([[i, i+1], false]);
            if(copy[i] > copy[i + 1]){
                animations.push([[i, copy[i + 1]], true]);
                animations.push([[i + 1, copy[i]], true]);
                swap(copy, i, i + 1);
                swapped = true;
            }
        }

        start = start + 1;
    }
    return animations;
}