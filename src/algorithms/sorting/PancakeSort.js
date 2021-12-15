import { swap } from "./Utility";

function flip(arr, i, animations){
    let start = 0;
    while(start < i){
        animations.push([[i, arr[start]], true]);
        animations.push([[start, arr[i]], true]);
        swap(arr, i, start);
        start++;
        i--;
    }
}

function findMax(arr, n){
    let mi, i;
    for(mi = 0, i=0; i < n; ++i)
        if(arr[i] > arr[mi])
            mi = i;
    
    return mi;
}

export function getPancakeSortAnimations(arr){
    const copy = [...arr];
    const animations = [];
    const n = copy.length;

    for(let size = n; size > 1; --size){
        let mi = findMax(copy, size);

        if(mi != size - 1){
            flip(copy, mi, animations);

            flip(copy, size - 1, animations);
        }
    }
    return animations;
}